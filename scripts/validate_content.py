#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

REQUIRED_FILES = {
    "profile.json",
    "education.json",
    "research.json",
    "publications.json",
    "projects.json",
    "experience.json",
    "awards.json",
    "skills.json",
    "site.json",
}
BANNED_KEYS = {
    "national_id", "nationalId", "marital_status", "maritalStatus",
    "date_of_birth", "dateOfBirth", "phone", "private_phone",
}
LONG_NUMBER = re.compile(r"(?<!\d)\d{10,12}(?!\d)")


def _load_json(path: Path, errors: list[str]) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{path.name}: {exc}")
        return None


def _check_ids(value: Any, path: str, errors: list[str]) -> None:
    if isinstance(value, dict):
        for key, nested in value.items():
            if key in BANNED_KEYS:
                errors.append(f"{path}: prohibited field name {key!r}")
            if isinstance(nested, list) and nested and all(isinstance(x, dict) for x in nested):
                ids = [x.get("id") for x in nested]
                present_ids = [x for x in ids if x not in (None, "")]
                if present_ids:
                    if len(present_ids) != len(nested):
                        errors.append(f"{path}.{key}: every record must have an id")
                    if len(set(present_ids)) != len(present_ids):
                        errors.append(f"{path}.{key}: ids must be unique")
            _check_ids(nested, f"{path}.{key}", errors)
    elif isinstance(value, list):
        for index, nested in enumerate(value):
            _check_ids(nested, f"{path}[{index}]", errors)


def validate_site(root: Path) -> list[str]:
    errors: list[str] = []
    content_dir = root / "content"
    if not content_dir.is_dir():
        return ["content directory is missing"]

    found = {p.name for p in content_dir.glob("*.json")}
    for missing in sorted(REQUIRED_FILES - found):
        errors.append(f"missing content file: {missing}")
    for extra in sorted(found - REQUIRED_FILES):
        errors.append(f"unexpected content file: {extra}")

    loaded: dict[str, Any] = {}
    for filename in sorted(REQUIRED_FILES & found):
        path = content_dir / filename
        data = _load_json(path, errors)
        if data is None:
            continue
        loaded[filename] = data
        text = json.dumps(data, ensure_ascii=False)
        if LONG_NUMBER.search(text):
            errors.append(f"{filename}: contains a 10–12 digit number; review for sensitive identity data")
        _check_ids(data, filename, errors)

    profile = loaded.get("profile.json")
    if isinstance(profile, dict):
        for key in ("name", "headline", "email"):
            if not str(profile.get(key, "")).strip():
                errors.append(f"profile.json: required field {key!r} is empty")

    return errors


if __name__ == "__main__":
    import sys
    problems = validate_site(Path(__file__).resolve().parents[1])
    if problems:
        for problem in problems:
            print(f"ERROR: {problem}")
        sys.exit(1)
    print("Content validation passed.")
