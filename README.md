# Yasin Fanaei Shahroudi — Academic Website

A free, static academic website designed for **GitHub Pages** with a non-technical editing dashboard provided by **Pages CMS**. The public site is plain HTML/CSS/JavaScript; academic content is stored in JSON and can be edited from the CMS without changing page code.

## Public pages

- Home — `index.html`
- Research — `research.html`
- Publications — `publications.html`
- Experience — `experience.html`
- CV — `cv.html`
- Contact — `contact.html`
- Teaching / instruction — `teaching.html`

## Editable content

The dashboard edits these files:

- `content/profile.json` — profile, affiliation, public email, image, CV files, academic links
- `content/education.json` — degrees
- `content/research.json` — interests, themes, thesis
- `content/publications.json` — journal and conference outputs
- `content/projects.json` — research projects
- `content/experience.json` — research, professional experience, service
- `content/awards.json` — honors
- `content/skills.json` — documented skills/training
- `content/site.json` — navigation, SEO defaults, footer, announcement

The Pages CMS schema is `.pages.yml`. Media managed from the dashboard is stored in `assets/uploads/`.

## Publish as a free GitHub Pages personal site

For the cleanest personal URL, create a **public** repository named exactly:

```text
<github-username>.github.io
```

Then push this repository to it and make sure the production branch is named `main`:

```bash
git remote add origin https://github.com/<github-username>/<github-username>.github.io.git
git switch main
git push -u origin main
```

On GitHub open **Settings → Pages** and set:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

The site will then be served at `https://<github-username>.github.io/`. The repository contains `.nojekyll`, so the static files are served directly rather than processed as a Jekyll site.

You can also use an ordinary repository name. In that case the default project-site URL is `https://<github-username>.github.io/<repository-name>/`.

## Connect the editing dashboard (Pages CMS)

After the repository is on GitHub:

1. Open `https://app.pagescms.org/`.
2. Sign in with GitHub.
3. Install/authorize the Pages CMS GitHub App for the account that owns the repository.
4. Grant it access to the academic-site repository.
5. Open the repository in Pages CMS. It will read `.pages.yml` automatically.
6. Edit a section such as **Publications**, **Research**, or **Profile & Contact**, then save.
7. Pages CMS commits the change back to GitHub. A change saved to `main` is then republished by GitHub Pages.

The dashboard supports adding, deleting, and reordering list items such as publications, research themes, education entries, projects, experience, awards, and skills. It also supports replacing the public profile image and CV files.

## Local preview

Because the pages fetch JSON files, do not rely on opening `index.html` with `file://`. Start a local web server from the repository root:

```bash
python -m http.server 8765
```

Then open `http://127.0.0.1:8765/`.

## Validation

Run all automated checks:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
python scripts/check_site.py
node --check assets/site.js
```

The checker validates the JSON content, Pages CMS configuration, internal file links, profile/CV assets, `.nojekyll`, and the absence of long identity-number-like values in public text files.

## Publication-data rule

Do not fill missing DOI, URL, volume, issue, page range, or an "official English title" unless the information has been verified. The site deliberately suppresses empty bibliographic fields rather than inferring them.

## Privacy rule

Do not store government identification numbers, birth date, marital status, or private telephone numbers in the public repository or CMS fields. Public academic/contact information should be limited to information intentionally selected for publication.
