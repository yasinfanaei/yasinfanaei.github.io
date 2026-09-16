#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from validate_content import validate_site
from validate_pages_config import validate_pages_config

BASE_HTML_FILES = ["index.html", "research.html", "publications.html", "experience.html", "cv.html", "contact.html", "teaching.html", "news.html", "search.html"]
HTML_FILES = BASE_HTML_FILES + [f"fa/{name}" for name in BASE_HTML_FILES] + ["404.html"]
TEXT_SUFFIXES = {".html", ".js", ".json", ".yml", ".yaml", ".md", ".css", ".xml", ".txt"}
LONG_NUMBER = re.compile(r"(?<!\d)\d{10,12}(?!\d)")
IRAN_MOBILE = re.compile(r"(?<!\d)0?9\d{2}[- ]?\d{3}[- ]?\d{4}(?!\d)")


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_map = dict(attrs)
        if tag in {"a", "link"} and attrs_map.get("href"):
            self.refs.append(attrs_map["href"] or "")
        if tag in {"script", "img"} and attrs_map.get("src"):
            self.refs.append(attrs_map["src"] or "")


def _is_external(ref: str) -> bool:
    scheme = urlsplit(ref).scheme.lower()
    return scheme in {"http", "https", "mailto", "tel", "data", "javascript"} or ref.startswith("#")


def _resolve_local_ref(root: Path, html_path: Path, ref: str) -> Path | None:
    if not ref or _is_external(ref):
        return None
    clean = urlsplit(ref).path
    if not clean:
        return None
    if clean.startswith("/"):
        return root / clean.lstrip("/")
    return html_path.parent / clean


def _check_html_links(root: Path, errors: list[str]) -> None:
    for filename in HTML_FILES:
        path = root / filename
        if not path.exists():
            errors.append(f"missing public page: {filename}")
            continue
        parser = LinkParser()
        parser.feed(path.read_text(encoding="utf-8"))
        for ref in parser.refs:
            target = _resolve_local_ref(root, path, ref)
            if target is not None and not target.exists():
                errors.append(f"{filename}: broken local reference {ref!r}")


def _check_profile_assets(root: Path, errors: list[str]) -> None:
    for locale in ('en', 'fa'):
        profile_path = root / 'content' / locale / 'profile.json'
        if not profile_path.exists():
            continue
        try:
            profile = json.loads(profile_path.read_text(encoding='utf-8'))
        except json.JSONDecodeError:
            continue
        for key in ('profile_image', 'cv_pdf', 'cv_docx'):
            value = str(profile.get(key, '')).strip()
            if value and not (root / value.lstrip('/')).exists():
                errors.append(f'content/{locale}/profile.json: {key} points to missing file {value!r}')



def _check_design_assets(root: Path, errors: list[str]) -> None:
    design_path = root / "content" / "settings" / "design.json"
    if not design_path.exists():
        errors.append("content/settings/design.json is missing")
        return
    try:
        design = json.loads(design_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        errors.append(f"content/settings/design.json: invalid JSON: {exc}")
        return
    branding = design.get("branding") if isinstance(design, dict) else None
    if not isinstance(branding, dict):
        errors.append("content/settings/design.json: branding must be an object")
        return
    for key in ("logo", "favicon", "profile_image", "cv_pdf", "cv_docx", "open_graph_image"):
        value = str(branding.get(key, "")).strip()
        if value and not _is_external(value) and not (root / value.lstrip("/")).exists():
            errors.append(f"content/settings/design.json: branding.{key} points to missing file {value!r}")

def _check_seo_files(root: Path, errors: list[str]) -> None:
    robots = root / "robots.txt"
    sitemap = root / "sitemap.xml"
    not_found = root / "404.html"
    for path in (robots, sitemap, not_found):
        if not path.exists():
            errors.append(f"missing SEO/public file: {path.name}")
    if robots.exists() and "Sitemap: https://yasinfanaei.github.io/sitemap.xml" not in robots.read_text(encoding="utf-8"):
        errors.append("robots.txt: sitemap URL is missing or incorrect")
    if sitemap.exists():
        try:
            tree = ET.fromstring(sitemap.read_text(encoding="utf-8"))
            locs = [node.text or "" for node in tree.iter() if node.tag.endswith("}loc") or node.tag == "loc"]
            for required in ("https://yasinfanaei.github.io/", "https://yasinfanaei.github.io/fa/", "https://yasinfanaei.github.io/news.html", "https://yasinfanaei.github.io/fa/search.html"):
                if required not in locs:
                    errors.append(f"sitemap.xml: missing {required}")
        except ET.ParseError as exc:
            errors.append(f"sitemap.xml: invalid XML: {exc}")


def scan_docx_for_sensitive_numbers(path: Path) -> list[str]:
    problems: list[str] = []
    try:
        with ZipFile(path) as archive:
            chunks: list[str] = []
            for name in archive.namelist():
                if not name.endswith('.xml'):
                    continue
                try:
                    root = ET.fromstring(archive.read(name))
                except ET.ParseError:
                    continue
                chunks.extend(node.text or '' for node in root.iter() if node.tag.endswith('}t'))
    except (OSError, ValueError) as exc:
        return [f"{path.name}: unable to inspect DOCX: {exc}"]
    text = ' '.join(chunks)
    if LONG_NUMBER.search(text):
        problems.append(f"{path.name}: contains a 10–12 digit numeric string")
    if IRAN_MOBILE.search(text):
        problems.append(f"{path.name}: contains a phone-number-like string")
    return problems


def _privacy_scan(root: Path, errors: list[str]) -> None:
    excluded_roots = {root / ".git"}
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        if any(parent == excluded for parent in path.parents for excluded in excluded_roots):
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if LONG_NUMBER.search(text):
            errors.append(f"{path.relative_to(root)}: contains a 10–12 digit number; review for sensitive identity data")


def check_site(root: Path) -> list[str]:
    errors: list[str] = []
    errors.extend(validate_site(root))
    errors.extend(validate_pages_config(root))
    if not (root / ".nojekyll").exists():
        errors.append(".nojekyll is missing")
    _check_html_links(root, errors)
    _check_profile_assets(root, errors)
    _check_design_assets(root, errors)
    _check_seo_files(root, errors)
    for public_docx in (root / "assets" / "uploads").rglob("*.docx"):
        errors.extend(scan_docx_for_sensitive_numbers(public_docx))
    _privacy_scan(root, errors)
    return errors


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    problems = check_site(root)
    if problems:
        print("Site validation failed:")
        for problem in problems:
            print(f"- {problem}")
        raise SystemExit(1)
    print("Site validation passed: content, CMS config, internal links, public assets, and privacy checks are clean.")
