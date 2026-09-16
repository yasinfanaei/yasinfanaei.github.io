#!/usr/bin/env python3
from __future__ import annotations
import json,re
from pathlib import Path
from typing import Any
REQUIRED_FILES={'profile.json','education.json','research.json','publications.json','projects.json','experience.json','awards.json','skills.json','site.json','news.json'}
LOCALES=('en','fa')
BANNED_KEYS={'national_id','nationalId','marital_status','maritalStatus','date_of_birth','dateOfBirth','phone','private_phone'}
LONG_NUMBER=re.compile(r'(?<!\d)\d{10,12}(?!\d)')
def _load(path:Path,errors:list[str])->Any:
    try:return json.loads(path.read_text(encoding='utf-8'))
    except (OSError,json.JSONDecodeError) as exc:errors.append(f'{path.relative_to(path.parents[2])}: {exc}');return None
def _check_ids(v:Any,path:str,errors:list[str])->None:
    if isinstance(v,dict):
        for k,n in v.items():
            if k in BANNED_KEYS:errors.append(f'{path}: prohibited field name {k!r}')
            if isinstance(n,list) and n and all(isinstance(x,dict) for x in n):
                ids=[x.get('id') for x in n]; present=[x for x in ids if x not in (None,'')]
                if present:
                    if len(present)!=len(n):errors.append(f'{path}.{k}: every record must have an id')
                    if len(set(present))!=len(present):errors.append(f'{path}.{k}: ids must be unique')
            _check_ids(n,f'{path}.{k}',errors)
    elif isinstance(v,list):
        for i,n in enumerate(v):_check_ids(n,f'{path}[{i}]',errors)
def validate_site(root:Path)->list[str]:
    errors=[]; content=root/'content'
    for locale in LOCALES:
        d=content/locale
        if not d.is_dir():errors.append(f'content/{locale} directory is missing');continue
        found={p.name for p in d.glob('*.json')}
        for m in sorted(REQUIRED_FILES-found):errors.append(f'content/{locale}: missing content file: {m}')
        for x in sorted(found-REQUIRED_FILES):errors.append(f'content/{locale}: unexpected content file: {x}')
        loaded={}
        for filename in sorted(REQUIRED_FILES&found):
            data=_load(d/filename,errors)
            if data is None:continue
            loaded[filename]=data;text=json.dumps(data,ensure_ascii=False)
            if LONG_NUMBER.search(text):errors.append(f'content/{locale}/{filename}: contains a 10–12 digit number; review for sensitive identity data')
            _check_ids(data,f'content/{locale}/{filename}',errors)
        profile=loaded.get('profile.json')
        if isinstance(profile,dict):
            for key in ('name','headline','email'):
                if not str(profile.get(key,'')).strip():errors.append(f'content/{locale}/profile.json: required field {key!r} is empty')
    return errors
if __name__=='__main__':
    import sys
    p=validate_site(Path(__file__).resolve().parents[1])
    if p:
        [print(f'ERROR: {x}') for x in p];sys.exit(1)
    print('Content validation passed.')
