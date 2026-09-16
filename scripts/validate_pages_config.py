#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from typing import Any
import yaml

EXPECTED_PATHS = {
    "profile": "content/profile.json",
    "education": "content/education.json",
    "research": "content/research.json",
    "publications": "content/publications.json",
    "projects": "content/projects.json",
    "experience": "content/experience.json",
    "awards": "content/awards.json",
    "skills": "content/skills.json",
    "site": "content/site.json",
}
BANNED_FIELD_NAMES = {
    "national_id", "nationalId", "marital_status", "maritalStatus",
    "date_of_birth", "dateOfBirth", "phone", "private_phone",
}


def _walk_fields(fields: Any, location: str, errors: list[str]) -> None:
    if not isinstance(fields, list):
        errors.append(f"{location}: fields must be a list")
        return
    for index, field in enumerate(fields):
        where = f"{location}[{index}]"
        if not isinstance(field, dict):
            errors.append(f"{where}: field must be an object")
            continue
        name = field.get("name")
        if name in BANNED_FIELD_NAMES:
            errors.append(f"{where}: prohibited field name {name!r}")
        if not name:
            errors.append(f"{where}: field name is required")
        if not field.get("type") and not field.get("component"):
            errors.append(f"{where}: type or component is required")
        if "fields" in field:
            _walk_fields(field["fields"], f"{where}.fields", errors)


def validate_pages_config(root: Path) -> list[str]:
    errors: list[str] = []
    path = root / ".pages.yml"
    if not path.exists():
        return [".pages.yml is missing"]
    try:
        config = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        return [f".pages.yml: invalid YAML: {exc}"]
    if not isinstance(config, dict):
        return [".pages.yml: root must be an object"]

    media = config.get("media")
    if not isinstance(media, dict):
        errors.append("media must be an object")
    else:
        if media.get("input") != "assets/uploads":
            errors.append("media.input must be assets/uploads")
        if media.get("output") != "assets/uploads":
            errors.append("media.output must be assets/uploads for project-page-safe relative URLs")

    content = config.get("content")
    if not isinstance(content, list):
        errors.append("content must be a list")
        return errors
    by_name = {entry.get("name"): entry for entry in content if isinstance(entry, dict)}
    for name, expected_path in EXPECTED_PATHS.items():
        entry = by_name.get(name)
        if not entry:
            errors.append(f"missing content entry {name!r}")
            continue
        if entry.get("type") != "file":
            errors.append(f"{name}: type must be file")
        if entry.get("path") != expected_path:
            errors.append(f"{name}: path must be {expected_path}")
        if entry.get("format") != "json":
            errors.append(f"{name}: format must be json")
        _walk_fields(entry.get("fields"), f"content.{name}.fields", errors)

    extra = sorted(set(by_name) - set(EXPECTED_PATHS))
    if extra:
        errors.append(f"unexpected content entries: {', '.join(extra)}")
    return errors


if __name__ == "__main__":
    import sys
    problems = validate_pages_config(Path(__file__).resolve().parents[1])
    if problems:
        for problem in problems:
            print(f"ERROR: {problem}")
        sys.exit(1)
    print("Pages CMS configuration validation passed.")
