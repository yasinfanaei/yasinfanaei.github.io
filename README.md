# Yasin Fanaei Shahroudi — Bilingual Academic Website

A free bilingual academic website for **GitHub Pages** with a structured editing dashboard through **Pages CMS**.

## Public URLs

- English (default): `https://yasinfanaei.github.io/`
- فارسی: `https://yasinfanaei.github.io/fa/`

Every public page includes an **EN / فارسی** switch. English is left-to-right; Persian uses native RTL layout. Reciprocal `hreflang` metadata is included for search engines.

## Editable content

Pages CMS edits two parallel content trees:

- `content/en/` — English content
- `content/fa/` — محتوای فارسی

Each language has:

- `profile.json` — name, affiliation, public email, image, CV and academic profile links
- `education.json` — education
- `research.json` — research interests, themes and thesis
- `publications.json` — journal/conference outputs
- `projects.json` — research projects
- `experience.json` — research/professional/service experience
- `awards.json` — honors
- `skills.json` — documented training and tools
- `site.json` — navigation, SEO text, footer and announcements

The dashboard schema is `.pages.yml`. Shared uploads are stored in `assets/uploads/`.

## Verified academic profile links

The profile currently includes the user-supplied links for ORCID, ResearchGate, Google Scholar, LinkedIn and GitHub. These remain editable through the Profile editor in both language sections of Pages CMS.

## Connect Pages CMS

1. Open `https://app.pagescms.org/`.
2. Sign in with GitHub.
3. Authorize/install the Pages CMS GitHub App for `yasinfanaei/yasinfanaei.github.io`.
4. Open the repository. Pages CMS reads `.pages.yml` automatically.
5. Use entries prefixed **English —** for the English site and **فارسی —** for the Persian site.
6. Save a change. Pages CMS commits the JSON edit to GitHub; GitHub Pages republishes the site from `main`.

## GitHub Pages

Repository: `yasinfanaei/yasinfanaei.github.io`

GitHub **Settings → Pages**:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

## Local preview

Because pages load JSON with `fetch`, use an HTTP server rather than opening the HTML with `file://`:

```bash
python -m http.server 8765
```

Then open:

- `http://127.0.0.1:8765/`
- `http://127.0.0.1:8765/fa/`

## Validation

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
python scripts/check_site.py
node --check assets/site.js
```

The checks cover both locales, Pages CMS paths, internal files, profile/CV assets, privacy scanning, and bilingual page structure.

## Publication-data rule

Do not invent missing DOI, URL, volume, issue, page range, or an official English title. The public renderer suppresses empty bibliographic fields until verified values are supplied.

## Privacy rule

Do not store government identification numbers, birth date, marital status, or private telephone numbers in the public repository or CMS. Only information intentionally selected for public academic use belongs here.
