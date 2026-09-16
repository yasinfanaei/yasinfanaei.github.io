# Yasin Fanaei Shahroudi — Academic Pro Website

A bilingual academic website for **GitHub Pages** with a no-code management dashboard through **Pages CMS**.

## Public URLs

- English (default): `https://yasinfanaei.github.io/`
- فارسی: `https://yasinfanaei.github.io/fa/`

English is left-to-right and Persian is native RTL. Every fixed public page includes reciprocal `hreflang` metadata and the site provides an EN / فارسی switch.

## Academic Pro features

- bilingual English/Persian structured content
- global client-side search across profile, research, publications, projects, experience, awards, and news
- News & Updates page plus a dashboard-managed homepage news section
- publication filtering by text/type/status/year
- publication abstract/keywords and verified DOI/PDF/Data/Code/Replication resource links
- citation, BibTeX, RIS, and copy helpers generated only from populated bibliographic fields
- Light / Dark / System theme with visitor preference persistence
- canonical URLs, reciprocal `hreflang`, sitemap, robots file, Open Graph/Twitter metadata, and `ProfilePage`/`Person` JSON-LD
- bilingual custom 404 page
- keyboard focus styling, skip links, reduced-motion support, and responsive layout
- optional Google Analytics integration, disabled by default
- automatic repository validation with GitHub Actions
- Pages CMS action for manually dispatching site validation

## No-code management model

Routine website management is done in Pages CMS. You do not need to edit HTML, CSS, or JavaScript for the controls already exposed by the dashboard.

### English / فارسی content

Each locale has editable files for:

- Profile & Contact
- Education
- Research
- Publications
- Projects
- Experience & Service
- Awards
- Skills & Certificates
- News & Updates
- Site Settings

The content files live in `content/en/` and `content/fa/`.

### Design & Branding — ظاهر و تنظیمات اصلی

The shared `content/settings/design.json` editor controls both languages:

- profile photo, CV PDF/DOCX, logo, favicon, social-preview image
- light and dark color palettes
- English and Persian fonts, base text size, line heights, hero-title scale
- content width, section spacing, hero spacing/gap, portrait size/side/radius, card/button radii, navigation spacing
- sticky header, shadows, language switch, theme switch, global search link, footer, homepage academic links, brand-name visibility
- Light / Dark / System default theme
- homepage section visibility and ordering, including News
- structured-data/indexing controls
- optional analytics provider/measurement ID

## Media management

Pages CMS has named media sources:

- `images` → `assets/uploads/images/`
- `documents` → `assets/uploads/documents/`
- `publication_files` → `assets/uploads/publications/`

Use **Design & Branding** for the shared profile image and CV files so both languages update together. Publication PDFs can be selected from the publication file source.

## Publication-data rule

Do **not** invent or infer missing DOI, URL, volume, issue, page range, official English title, dataset URL, code URL, or replication URL. Empty values are intentionally suppressed by the renderer until verified information is supplied.

## News workflow

Add entries from **English → News & Updates** and **فارسی → تازه‌ها**. Each entry supports title, date, summary, optional link, featured flag, and published flag. Only published entries are rendered. Featured/recent entries can appear on the homepage when the News homepage section is enabled.

## Theme and search

Visitors can choose System, Light, or Dark mode from the header when the theme switch is enabled. The selected preference is stored locally in the browser. Search is dependency-free and runs entirely in the browser against the public locale JSON files.

## SEO controls

Per-language **Site Settings** control page titles/descriptions, keywords, navigation labels, footer text, announcements, and interface labels. Shared **Design & Branding** controls the public site URL, structured-data toggle, and indexing toggle.

When indexing is disabled, the renderer sets the page `robots` meta tag to `noindex,nofollow`. `robots.txt` and `sitemap.xml` remain static repository files.

## Analytics

Analytics is **off by default**. If enabled in Design & Branding with provider `google_analytics` and a valid `G-...` measurement ID, GA4 is loaded. Leave it disabled if you do not want tracking.

## Automated validation

The repository contains `.github/workflows/validate.yml` and a Pages CMS action named **Validate site**. Validation checks:

- all Python unit tests
- JSON/content/CMS schema integrity
- internal file/link and shared-asset consistency
- privacy scanning for long identity-number-like values
- bilingual page structure and Academic Pro pages
- robots/sitemap/404 requirements
- JavaScript syntax

Local validation:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
python scripts/check_site.py
node --check assets/site.js
```

## GitHub Pages

Repository: `yasinfanaei/yasinfanaei.github.io`

GitHub **Settings → Pages**:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

Pages CMS saves content/design edits as Git commits; GitHub Pages then republishes from `main`.

## Connect Pages CMS

1. Open `https://app.pagescms.org/`.
2. Sign in with GitHub.
3. Authorize the Pages CMS GitHub App for `yasinfanaei/yasinfanaei.github.io`.
4. Open the repository. Pages CMS reads `.pages.yml` automatically.
5. Edit content/design and press Save.
6. Optionally run **Actions → Validate site** after a substantial change.

## Local preview

Because pages load JSON via `fetch`, preview with an HTTP server rather than `file://`:

```bash
python -m http.server 8765
```

Representative URLs:

- `http://127.0.0.1:8765/`
- `http://127.0.0.1:8765/fa/`
- `http://127.0.0.1:8765/search.html`
- `http://127.0.0.1:8765/fa/news.html`

## Privacy rule

Never store government identification numbers, birth date, marital status, private telephone numbers, passwords, or other sensitive/private identifiers in this public repository or Pages CMS. Only information intentionally selected for public academic use belongs here.
