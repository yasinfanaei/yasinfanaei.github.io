#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
from typing import Any
import yaml

FILES=('profile','education','research','publications','projects','experience','awards','skills','news','site')
EXPECTED={f'{loc}_{name}':f'content/{loc}/{name}.json' for loc in ('en','fa') for name in FILES}
EXPECTED['design_branding']='content/settings/design.json'
BANNED={'national_id','nationalId','marital_status','maritalStatus','date_of_birth','dateOfBirth','phone','private_phone'}


def _walk(fields:Any,location:str,errors:list[str])->None:
    if not isinstance(fields,list):
        errors.append(f'{location}: fields must be a list')
        return
    for i,f in enumerate(fields):
        w=f'{location}[{i}]'
        if not isinstance(f,dict):
            errors.append(f'{w}: field must be an object')
            continue
        if f.get('name') in BANNED:
            errors.append(f'{w}: prohibited field name {f.get("name")!r}')
        if not f.get('name'):
            errors.append(f'{w}: field name is required')
        if not f.get('type') and not f.get('component'):
            errors.append(f'{w}: type or component is required')
        if 'fields' in f:
            _walk(f['fields'],f'{w}.fields',errors)


def _flatten(entries:Any,errors:list[str],location='content') -> list[dict[str,Any]]:
    flat=[]
    if not isinstance(entries,list):
        errors.append(f'{location} must be a list')
        return flat
    for i,e in enumerate(entries):
        where=f'{location}[{i}]'
        if not isinstance(e,dict):
            errors.append(f'{where}: entry must be an object')
            continue
        if e.get('type')=='group':
            flat.extend(_flatten(e.get('items'),errors,f'{where}.items'))
        else:
            flat.append(e)
    return flat


def validate_pages_config(root:Path)->list[str]:
    errors=[];p=root/'.pages.yml'
    if not p.exists():return ['.pages.yml is missing']
    try:cfg=yaml.safe_load(p.read_text(encoding='utf-8'))
    except yaml.YAMLError as exc:return [f'.pages.yml: invalid YAML: {exc}']
    media=cfg.get('media') if isinstance(cfg,dict) else None
    if not isinstance(media,list):errors.append('media must be a list of named sources')
    else:
        expected_media={'images':('assets/uploads/images','assets/uploads/images'),'documents':('assets/uploads/documents','assets/uploads/documents'),'publication_files':('assets/uploads/publications','assets/uploads/publications')}
        by_media={m.get('name'):m for m in media if isinstance(m,dict)}
        for name,(inp,out) in expected_media.items():
            item=by_media.get(name)
            if not item:errors.append(f'missing media source {name!r}');continue
            if item.get('input')!=inp:errors.append(f'media {name}: input must be {inp}')
            if item.get('output')!=out:errors.append(f'media {name}: output must be {out}')
    content=cfg.get('content') if isinstance(cfg,dict) else None
    flat=_flatten(content,errors)
    by={e.get('name'):e for e in flat if isinstance(e,dict)}
    for name,path in EXPECTED.items():
        e=by.get(name)
        if not e:errors.append(f'missing content entry {name!r}');continue
        if e.get('type')!='file':errors.append(f'{name}: type must be file')
        if e.get('path')!=path:errors.append(f'{name}: path must be {path}')
        if e.get('format')!='json':errors.append(f'{name}: format must be json')
        _walk(e.get('fields'),f'content.{name}.fields',errors)
        operations=e.get('operations',{})
        if name in EXPECTED and any(operations.get(k) is not False for k in ('create','rename','delete')):
            errors.append(f'{name}: create/rename/delete operations must be disabled')
    extra=sorted(set(by)-set(EXPECTED))
    if extra:errors.append(f'unexpected content entries: {", ".join(extra)}')
    return errors

if __name__=='__main__':
    import sys
    problems=validate_pages_config(Path(__file__).resolve().parents[1])
    if problems:
        [print(f'ERROR: {x}') for x in problems]
        sys.exit(1)
    print('Pages CMS configuration validation passed.')
