import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { InvestorStory } from './investorStory'

export async function loadInvestorStory(): Promise<InvestorStory | null> {
  try {
    const localFile = process.env.INVESTOR_STORY_FILE
    const raw = process.env.INVESTOR_STORY_JSON ||
      (!process.env.VERCEL && localFile ? await readFile(join(process.cwd(), localFile), 'utf8') : '')
    const story = JSON.parse(raw) as InvestorStory
    return Array.isArray(story.hero?.lines) && Array.isArray(story.hero.stats) &&
      Array.isArray(story.sections) && story.sections.length > 0 ? story : null
  } catch {
    return null
  }
}
