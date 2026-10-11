"""Create non-destructive web derivatives and a traceable visual collection."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib, json, re
root=Path(__file__).resolve().parents[1]
public=root/'public'
output=public/'images'/'web'
output.mkdir(exist_ok=True)
manifest={}; inventory=[]; gallery=[]; seen={}
def export(source, key=None):
    digest=hashlib.sha256(source.read_bytes()).hexdigest()
    key=key or '/'+source.relative_to(public).as_posix()
    if digest in seen:
        manifest[key]=seen[digest]
        return seen[digest]
    try:
        with Image.open(source) as opened:
            im=ImageOps.exif_transpose(opened)
            if getattr(opened,'is_animated',False): return None
            w,h=im.size
            alpha=im.mode in ('RGBA','LA') and im.getextrema()[-1][0]<255
            im=im.convert('RGBA' if alpha else 'RGB')
            ext='png' if alpha else 'jpg'
            variants=[]
            for width in sorted(set(min(w,n) for n in [480,960,1600])):
                target=output/f'{digest[:16]}-{width}.{ext}'
                if not target.exists():
                    frame=im.copy(); frame.thumbnail((width,round(h*width/w)),Image.Resampling.LANCZOS)
                    frame.save(target,optimize=True,**({} if alpha else {'quality':83,'progressive':True}))
                variants.append({'src':'/images/web/'+target.name,'width':width})
            entry={'src':variants[-1]['src'],'srcSet':', '.join(f"{v['src']} {v['width']}w" for v in variants),'width':w,'height':h}
            manifest[key]=entry; seen[digest]=entry
            inventory.append({'source':str(source),'key':key,'sha256':digest,'originalBytes':source.stat().st_size,'webBytes':(public/entry['src'].lstrip('/')).stat().st_size,'width':w,'height':h})
            return entry
    except Exception as error:
        print('SKIPPED',source.name,str(error))
        return None
for folder in [public/'images',public/'branding']:
    for source in sorted(folder.rglob('*')):
        if source.suffix.lower() not in ['.png','.jpg','.jpeg','.webp'] or output in source.parents: continue
        if any(t in source.name.lower() for t in ['normal_map','baked_normal']): continue
        export(source)
gallery_hash=set()
def add(source,category,title,caption,key=None):
    digest=hashlib.sha256(source.read_bytes()).hexdigest()
    if digest in gallery_hash:return
    entry=export(source,key)
    if not entry:return
    gallery_hash.add(digest)
    gallery.append({'src':key or '/'+source.relative_to(public).as_posix(),'category':category,'title':title,'caption':caption,'width':entry['width'],'height':entry['height']})
def title(source):
    return re.sub(r'[_-]+',' ',source.stem).strip()
# Newest commission concept leads the collection.
# Source folders moved under '01 NUMU & Materials' in 2026; fail loudly rather than
# silently dropping collection entries when a folder is missing.
SOURCE_ROOT=Path('/Users/Andy/Desktop/01 NUMU & Materials')
for required in ['NUMU Event Collateral Renders','Mushroomiya Lamp Renders']:
    if not (SOURCE_ROOT/required).is_dir(): raise SystemExit(f'Missing source folder: {SOURCE_ROOT/required}')
objects=SOURCE_ROOT/'NUMU Event Collateral Renders'
for source in sorted(objects.glob('*.png'),key=lambda p:(not p.name.startswith('13'),p.name)):
    label=re.sub(r'^\d+ - ','',source.stem)
    add(source,'Objects',label,'Palmyco desk objects and event collateral. Visualisation. Indicative only.','/collections/objects/'+source.name)
lamps=SOURCE_ROOT/'Mushroomiya Lamp Renders'
for source in sorted(lamps.rglob('*')):
    if source.suffix.lower() not in ['.png','.jpg','.jpeg','.webp']:continue
    is_study=any(x in str(source) for x in ['Design studies','Other lamps'])
    if 'Website and alternate exports' in str(source):continue
    category='Studies' if is_study else 'Lighting'
    caption='Lighting design study from the NUMU archive. Indicative only.' if is_study else 'Mushroomiya lighting and material study. Visualisation. Indicative only.'
    add(source,category,title(source),caption,'/collections/lighting/'+source.relative_to(lamps).as_posix())
for source in sorted((public/'images/moodboards').rglob('*')):
    if source.suffix.lower() in ['.png','.jpg','.jpeg','.webp']:
        add(source,'Spaces',title(source),'Spatial application concept. Visualisation. Indicative only.')
# Grown veneer furniture & cladding collection (NUMU_Furniture_Cladding.pdf, October 2026).
for source in sorted((public/'images/catalogue/veneer').glob('*.jpg')):
    if 'material' in source.stem:
        add(source,'Material','Grown veneer surface','Grown veneer, developed in house at NUMU. Material photograph.')
    else:
        add(source,'Spaces',title(source).replace('veneer ','Grown veneer, '),'Grown veneer furniture and cladding. Visualisation study. Indicative only.')
for folder in ['products','projects','applications','materials']:
    for source in sorted((public/'images'/folder).glob('*')):
        if source.suffix.lower() in ['.png','.jpg','.jpeg','.webp']:
            add(source,'Material',title(source),'From the NUMU material and process archive. Includes research, prototypes and application studies.')
for source in sorted((public/'images/textures').glob('texture_closeup_*.jpg')):
    add(source,'Material','Palmyco surface detail','Mycelium surface reference from the NUMU material archive.')
(root/'src/generated/responsive-images.json').write_text(json.dumps(manifest,separators=(',',':')))
(root/'src/generated/visual-collection.json').write_text(json.dumps(gallery,indent=2))
audit=root/'output/website-review-2026-09-10'; audit.mkdir(parents=True,exist_ok=True)
(audit/'asset-inventory.json').write_text(json.dumps(inventory,indent=2))
print(json.dumps({'uniqueSources':len(inventory),'galleryImages':len(gallery),'sourceMB':round(sum(x['originalBytes'] for x in inventory)/1e6,1),'largestWebExportsMB':round(sum(x['webBytes'] for x in inventory)/1e6,1),'categories':{c:sum(x['category']==c for x in gallery) for c in set(x['category'] for x in gallery)}}))
