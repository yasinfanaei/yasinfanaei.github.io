#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
from typing import Any
import yaml
FILES=('profile','education','research','publications','projects','experience','awards','skills','site')
EXPECTED={f'{loc}_{name}':f'content/{loc}/{name}.json' for loc in ('en','fa') for name in FILES}
BANNED={'national_id','nationalId','marital_status','maritalStatus','date_of_birth','dateOfBirth','phone','private_phone'}
def _walk(fields:Any,location:str,errors:list[str])->None:
    if not isinstance(fields,list):errors.append(f'{location}: fields must be a list');return
    for i,f in enumerate(fields):
        w=f'{location}[{i}]'
        if not isinstance(f,dict):errors.append(f'{w}: field must be an object');continue
        if f.get('name') in BANNED:errors.append(f'{w}: prohibited field name {f.get("name")!r}')
        if not f.get('name'):errors.append(f'{w}: field name is required')
        if not f.get('type') and not f.get('component'):errors.append(f'{w}: type or component is required')
        if 'fields' in f:_walk(f['fields'],f'{w}.fields',errors)
def validate_pages_config(root:Path)->list[str]:
    errors=[];p=root/'.pages.yml'
    if not p.exists():return ['.pages.yml is missing']
    try:cfg=yaml.safe_load(p.read_text(encoding='utf-8'))
    except yaml.YAMLError as exc:return [f'.pages.yml: invalid YAML: {exc}']
    media=cfg.get('media') if isinstance(cfg,dict) else None
    if not isinstance(media,dict):errors.append('media must be an object')
    else:
        if media.get('input')!='assets/uploads':errors.append('media.input must be assets/uploads')
        if media.get('output')!='assets/uploads':errors.append('media.output must be assets/uploads')
    content=cfg.get('content') if isinstance(cfg,dict) else None
    if not isinstance(content,list):return errors+['content must be a list']
    by={e.get('name'):e for e in content if isinstance(e,dict)}
    for name,path in EXPECTED.items():
        e=by.get(name)
        if not e:errors.append(f'missing content entry {name!r}');continue
        if e.get('type')!='file':errors.append(f'{name}: type must be file')
        if e.get('path')!=path:errors.append(f'{name}: path must be {path}')
        if e.get('format')!='json':errors.append(f'{name}: format must be json')
        _walk(e.get('fields'),f'content.{name}.fields',errors)
    extra=sorted(set(by)-set(EXPECTED))
    if extra:errors.append(f'unexpected content entries: {", ".join(extra)}')
    return errors
if __name__=='__main__':
    import sys
    p=validate_pages_config(Path(__file__).resolve().parents[1])
    if p:[print(f'ERROR: {x}') for x in p];sys.exit(1)
    print('Pages CMS configuration validation passed.')
