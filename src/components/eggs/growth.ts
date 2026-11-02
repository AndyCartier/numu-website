/**
 * A small, bounded model of a growing mycelial colony, drawn as a living specimen.
 * An ARTISTIC SIMULATION informed by how hyphae grow, not a validated biological model.
 *
 * Behaviours, each simplified:
 *  - Tip extension: growth happens only at the tips, which advance with persistence and a
 *    small random wander, so hyphae read as long, gently curving lines.
 *  - Sub-apical branching: a tip that has grown a minimum internode length may leave a lateral
 *    branch at 35–65°. Branch order lowers speed, width and branching probability.
 *  - Self-avoidance: tips steer away from crowded ground (other hyphae) and stop where it is full,
 *    which spreads the colony evenly toward its edge.
 *  - Anastomosis: a mature tip that meets another hypha may fuse with it, closing a loop
 *    in the network. Fusions are recorded and drawn.
 *  - Chemotropism (stylised): tips turn toward food sources within reach. Reaching food
 *    triggers a local burst of branching. The visitor's pointer acts as a faint source.
 *  - Environment: the plate edge is a hard boundary; tips that reach it stop.
 *
 * Deterministic for a seed, bounded (segment and tip caps), allocation-light (typed arrays).
 * Pure TypeScript with no DOM access, so it runs in tests and on the server.
 */

export interface ColonyOptions {
  width: number;          // logical units
  height: number;
  seed: number;
  maxSegments?: number;   // soft budget, raised a little by each feeding
  hardSegments?: number;  // absolute cap
  maxTips?: number;
}

export interface Tip { x: number; y: number; a: number; id: number; depth: number; internode: number; age: number; acc: number; line: number }
export interface Food { x: number; y: number; strength: number; reached: boolean }

const TAU = Math.PI * 2;
const STEP = 4;            // segment length, units
const SPEED = 30;          // units per second for a leading hypha
const CELL = 8;            // density grid
const CELL_CAPACITY = 3;
const MIN_INTERNODE = 18;
const FUSE_AGE = 10;       // segments a tip must grow before it may fuse
const FOOD_REACH = 220;
const SEG_STRIDE = 5;      // x0 y0 x1 y1 depth

const wrap = (a: number) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };

export function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export class Colony {
  readonly W: number;
  readonly H: number;
  readonly hardSegments: number;
  maxSegments: number;
  readonly maxTips: number;
  readonly segs: Float32Array;
  /** Lineage per segment: 0 = the colony, 1 = grown from a caught spore (Easter egg). */
  readonly segLine: Uint8Array;
  spores = 0;
  segCount = 0;
  /** Fusion points, x y pairs. */
  readonly fusions: Float32Array;
  fusionCount = 0;
  tips: Tip[] = [];
  foods: Food[] = [];
  pointer: { x: number; y: number } | null = null;
  elapsed = 0;
  private rng: () => number;
  private nextId = 0;
  private cols: number;
  private rows: number;
  private count: Uint8Array;
  private owner: Int32Array;
  private px: Float32Array;
  private py: Float32Array;

  constructor(o: ColonyOptions) {
    this.W = o.width; this.H = o.height;
    this.hardSegments = Math.min(12000, o.hardSegments ?? 9000);
    this.maxSegments = Math.min(this.hardSegments, o.maxSegments ?? 6000);
    this.maxTips = Math.min(200, o.maxTips ?? 140);
    this.segs = new Float32Array(this.hardSegments * SEG_STRIDE);
    this.segLine = new Uint8Array(this.hardSegments);
    this.fusions = new Float32Array(2000 * 2);
    this.rng = mulberry32(o.seed);
    this.cols = Math.ceil(this.W / CELL) + 1;
    this.rows = Math.ceil(this.H / CELL) + 1;
    const n = this.cols * this.rows;
    this.count = new Uint8Array(n);
    this.owner = new Int32Array(n).fill(-1);
    this.px = new Float32Array(n);
    this.py = new Float32Array(n);
  }

  get active() { return this.tips.length > 0 && this.segCount < this.maxSegments; }
  get stride() { return SEG_STRIDE; }

  /** Place an inoculum: n hyphae radiating from a point. */
  inoculate(x: number, y: number, n = 5) {
    for (let i = 0; i < n; i++) this.spawn(x, y, (i / n) * TAU + (this.rng() - 0.5) * 0.6, 0);
  }

  /** Add a food source. At most three are kept; the oldest goes first. Returns false when the colony is at its hard cap. */
  feed(x: number, y: number) {
    this.foods.push({ x, y, strength: 1, reached: false });
    if (this.foods.length > 3) this.foods.shift();
    if (this.segCount >= this.hardSegments - 50) return false;
    this.maxSegments = Math.min(this.hardSegments, Math.max(this.maxSegments, this.segCount) + 700);
    // If few tips are left, grow new branches from the hypha nearest the food, toward it.
    if (this.tips.length < 8 && this.segCount > 0) {
      const near = this.nearestPoint(x, y);
      if (near) for (let k = 0; k < 2; k++) this.spawn(near.x, near.y, Math.atan2(y - near.y, x - near.x) + (k ? 0.5 : -0.5), Math.min(3, near.depth + 1));
    }
    return true;
  }

  /** A caught spore germinates: three new hyphae of their own lineage. Returns false at the hard cap. */
  germinate(x: number, y: number) {
    if (this.segCount >= this.hardSegments - 50) return false;
    this.spores++;
    this.maxSegments = Math.min(this.hardSegments, Math.max(this.maxSegments, this.segCount) + 600);
    const cx = Math.min(this.W - 10, Math.max(10, x)), cy = Math.min(this.H - 10, Math.max(10, y));
    for (let i = 0; i < 3; i++) this.spawnInto(this.tips, cx, cy, (i / 3) * TAU + this.rng() * 0.8, 1, 1);
    return true;
  }

  update(dtSeconds: number) {
    const dt = Math.min(0.05, Math.max(0, dtSeconds));
    if (!this.tips.length) return;
    this.elapsed += dt;
    const next: Tip[] = [];
    for (const tip of this.tips) {
      if (this.segCount >= this.maxSegments) break;
      tip.acc += SPEED * Math.max(0.55, 1 - tip.depth * 0.09) * dt;
      let alive = true;
      while (tip.acc >= STEP && alive) {
        tip.acc -= STEP;
        alive = this.grow(tip, next);
      }
      if (alive) next.push(tip);
    }
    this.tips = this.segCount >= this.maxSegments ? [] : next;
  }

  /** Advance one tip by one segment. Returns false when the tip stops. */
  private grow(tip: Tip, born: Tip[]): boolean {
    const r = this.rng;
    // Persistence with a small wander.
    let a = tip.a + (r() + r() + r() - 1.5) * 0.24;
    // Chemotropism toward food, and faintly toward the pointer.
    const pull = (fx: number, fy: number, strength: number, reach: number) => {
      const dx = fx - tip.x, dy = fy - tip.y, d = Math.hypot(dx, dy);
      if (d > reach || d < 1) return;
      a += wrap(Math.atan2(dy, dx) - a) * 0.13 * strength * (1 - d / reach);
    };
    for (const f of this.foods) if (!f.reached) pull(f.x, f.y, f.strength, FOOD_REACH);
    if (this.pointer) pull(this.pointer.x, this.pointer.y, 0.45, 150);
    // Self-avoidance: look ahead left, centre and right; turn toward the least crowded.
    const look = 12;
    const dl = this.density(tip.x + Math.cos(a - 0.5) * look, tip.y + Math.sin(a - 0.5) * look, tip.id);
    const dc = this.density(tip.x + Math.cos(a) * look, tip.y + Math.sin(a) * look, tip.id);
    const dr = this.density(tip.x + Math.cos(a + 0.5) * look, tip.y + Math.sin(a + 0.5) * look, tip.id);
    if (dc > Math.min(dl, dr)) a += dl < dr ? -0.16 : 0.16;
    tip.a = wrap(a);

    const nx = tip.x + Math.cos(tip.a) * STEP, ny = tip.y + Math.sin(tip.a) * STEP;
    if (nx < 2 || ny < 2 || nx > this.W - 2 || ny > this.H - 2) return false; // the plate's edge

    const c = this.cell(nx, ny);
    // Anastomosis: a mature tip meeting another hypha fuses with it.
    const other = this.owner[c]!;
    if (other !== -1 && other !== tip.id && tip.age >= FUSE_AGE && r() < 0.4) {
      this.addSeg(tip.x, tip.y, this.px[c]!, this.py[c]!, tip.depth, tip.line);
      if (this.fusionCount < this.fusions.length / 2) { this.fusions[this.fusionCount * 2] = this.px[c]!; this.fusions[this.fusionCount * 2 + 1] = this.py[c]!; this.fusionCount++; }
      return false;
    }
    if (this.count[c]! >= CELL_CAPACITY && tip.age > 2) return false; // too crowded to continue

    this.addSeg(tip.x, tip.y, nx, ny, tip.depth, tip.line);
    this.count[c] = this.count[c]! + 1;
    if (other === -1) { this.owner[c] = tip.id; this.px[c] = nx; this.py[c] = ny; }
    tip.x = nx; tip.y = ny; tip.age++; tip.internode += STEP;

    // Food reached: local proliferation.
    for (const f of this.foods) {
      if (!f.reached && Math.hypot(f.x - nx, f.y - ny) < 10) {
        f.reached = true;
        for (let k = 0; k < 3; k++) this.spawnInto(born, nx, ny, tip.a + (k - 1) * 0.9 + (r() - 0.5) * 0.3, Math.min(4, tip.depth + 1), tip.line);
      }
    }
    // Branching: lateral (sub-apical) and, rarely, apical splitting.
    const room = this.tips.length + born.length < this.maxTips;
    if (room && tip.internode >= MIN_INTERNODE) {
      const p = 0.12 * Math.max(0.3, 1 - tip.depth * 0.12);
      if (r() < p) {
        const side = r() < 0.5 ? -1 : 1;
        this.spawnInto(born, nx, ny, tip.a + side * (0.6 + r() * 0.5), tip.depth + 1, tip.line);
        tip.internode = 0;
      } else if (r() < 0.006) {
        const d = 0.25 + r() * 0.25;
        this.spawnInto(born, nx, ny, tip.a + d, tip.depth + 1, tip.line);
        tip.a = wrap(tip.a - d);
        tip.internode = 0;
      }
    }
    return true;
  }

  private spawn(x: number, y: number, a: number, depth: number) { this.spawnInto(this.tips, x, y, a, depth); }
  private spawnInto(list: Tip[], x: number, y: number, a: number, depth: number, line = 0) {
    if (this.tips.length + list.length >= this.maxTips && list !== this.tips) return;
    list.push({ x, y, a: wrap(a), id: this.nextId++, depth, internode: 0, age: 0, acc: 0, line });
  }
  private addSeg(x0: number, y0: number, x1: number, y1: number, depth: number, line = 0) {
    if (this.segCount >= this.hardSegments) return;
    this.segLine[this.segCount] = line;
    const o = this.segCount * SEG_STRIDE;
    this.segs[o] = x0; this.segs[o + 1] = y0; this.segs[o + 2] = x1; this.segs[o + 3] = y1; this.segs[o + 4] = depth;
    this.segCount++;
  }
  private cell(x: number, y: number) {
    const cx = Math.min(this.cols - 1, Math.max(0, Math.floor(x / CELL)));
    const cy = Math.min(this.rows - 1, Math.max(0, Math.floor(y / CELL)));
    return cx + cy * this.cols;
  }
  private density(x: number, y: number, id: number) {
    if (x < 0 || y < 0 || x > this.W || y > this.H) return 9;
    const c = this.cell(x, y);
    return this.owner[c] === id ? 0 : this.count[c]!;
  }
  private nearestPoint(x: number, y: number) {
    let best = Infinity, bx = 0, by = 0, bd = 0;
    for (let i = 0; i < this.segCount; i++) {
      const o = i * SEG_STRIDE, sx = this.segs[o + 2]!, sy = this.segs[o + 3]!, d = (sx - x) ** 2 + (sy - y) ** 2;
      if (d < best) { best = d; bx = sx; by = sy; bd = this.segs[o + 4]!; }
    }
    return best < Infinity ? { x: bx, y: by, depth: bd } : null;
  }
}
