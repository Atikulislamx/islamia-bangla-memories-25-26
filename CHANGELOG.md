# Changelog

All notable changes to the Bengali Department digital memory archive.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Dates are in `YYYY-MM-DD`.

---

## [Unreleased]

### Planned
- Replace the labelled placeholder entries with verified batch content and set
  `sample_content: false` in `_config.yml`.
- Complete the Decap Turbo connection so that publishing through `/admin/` can be
  verified end to end (see [CMS_SETUP.md](CMS_SETUP.md)).
- Publish consent-cleared photographs in place of the placeholder artwork.
- Decide whether the account's custom domain (`atikulislam.me`) or the
  `github.io` address should be canonical, and set `url` in `_config.yml`
  accordingly.

---

## [1.0.0] — 2026-10-12

Initial release: the complete public website, the content architecture, the CMS
configuration and the documentation.

### Added — public website

- **Home** (`/`): hero with the English tagline, Bengali department line,
  archive counts, featured memories, Our Journey preview, selected events with
  build-time Upcoming/Past labels, featured quotations, photo gallery preview,
  optional member profiles and a closing about panel.
- **Our Journey** (`/journey/`): chronological timeline with approximate-period
  support, plus an honest empty state.
- **Memories** (`/memories/`): archive grid with category and language filters,
  and an empty state when nothing is published.
- **Memory detail** (`/memories/<slug>/`): reading-width typography, cover image
  with caption, pull quote, related event, related memories, breadcrumbs and a
  return link.
- **Events** (`/events/`): archive with Upcoming / Past and category filters.
- **Event detail** (`/events/<slug>/`): date, time, venue, organiser, description,
  cover image, photograph gallery, related memories.
- **Quotes** (`/quotes/`): quote wall mixing public-domain Bengali and English
  texts with contributor reflections, each carrying its attribution and rights
  note.
- **Photo Gallery** (`/gallery/`): responsive grid, captions, accessible
  descriptions, lazy loading and an accessible lightbox (keyboard navigation,
  focus handling, Escape to close).
- **Batch Members** (`/people/`) and profile pages: consent-gated, showing
  placeholder profiles only when marked as structural samples.
- **About Us** (`/about/`): purpose, storytelling principles, review process,
  consent handling, developer credit and the student-project notice.
- **Privacy Policy** (`/privacy/`): publication, photo consent, optional
  profiles, corrections and removals, public-repository risks, external services,
  plus a Bengali summary.
- **Search the Archive** (`/search/`): client-side search over a generated JSON
  index, Unicode-aware, with a no-results state and documented limitations.
- **Contribute a Memory** (`/contribute/`): the five-step review process and an
  explicit statement that submissions are not automated, with a documented
  contact placeholder instead of an invented address.
- **Custom 404** (`/404.html`) with links into every section.

### Added — design system

- Editorial design built on CSS custom properties: warm ivory paper, ink
  typography, forest green, restrained terracotta and amber accents.
- Typography pairing Manrope (display) and Inter (body) with **Noto Sans Bengali**
  for Bengali content, applied automatically through `lang="bn"`, with Bengali
  line height adjusted so conjuncts and matras are never clipped.
- **Self-hosted fonts** (11 `.woff2` subsets, ~300 KB total): no third-party
  font requests.
- Responsive layouts verified from 320 px to 1440 px, fluid type scale, editorial
  grids, refined borders and shadows, subtle transitions and full
  `prefers-reduced-motion` support.

### Added — architecture

- Jekyll collections: `_memories`, `_events` (both with generated detail pages),
  `_quotes`, `_timeline`, `_people`, with deliberate `output` and `permalink`
  settings and validated front matter schemas.
- Twenty shared includes, including the single `_includes/footer.html` that
  renders the developer credit on **every** generated page.
- No plugins: `sitemap.xml`, `robots.txt` and `search.json` are generated from
  Liquid templates, so the build runs in the standard GitHub Pages environment.
- Baseurl-safe URLs throughout via `relative_url` / `absolute_url` and the
  `image-url.html` resolver, which also tolerates CMS-prefixed media paths.

### Added — CMS scaffold

- `admin/config.yml` configured for the **`turbo-github`** backend with all five
  collections, field-level widgets matching the actual front matter, media
  committed to `assets/uploads/` and publication controlled by `published` and
  `sample` fields.
- **Root cause of the previous admin failure identified and fixed:** the Decap
  Turbo control plane returns `"repo": null` for the project's site id, so the
  GitHub backend never received a repository. The backend now declares the
  repository locally as well, and `admin/turbo-preflight.js` replaces the cryptic
  error with the exact dashboard steps required. See [CMS_SETUP.md](CMS_SETUP.md).
- CMS version pinned to `decap-cms@3.17.0-beta.3`, because the Turbo backends
  exist only on the beta release.
- **Authentication is explicitly not verified.** No sign-in, commit or publish
  flow has been tested; no credentials are stored anywhere in the repository.

### Added — documentation and quality

- `README.md`, `DEPLOYMENT.md`, `CMS_SETUP.md`, `CONTENT_GUIDE.md`,
  `PRIVACY_AND_CONSENT.md`, `CHANGELOG.md`, `QA_REPORT.md`, plus copy-ready
  content templates in `_templates/`.
- GitHub Actions workflow (`.github/workflows/pages-build.yml`) that runs the
  real Jekyll build on every push and pull request and fails on: missing pages,
  a missing developer credit in any generated page, unrendered Liquid,
  baseurl-less internal paths, an invalid search index or sitemap, and a CMS
  configuration that does not match the Jekyll collections.
- Sandbox QA: 20 pages, 622 internal links, 35 images checked with zero errors
  and zero warnings; CMS pre-flight logic unit-tested (6 cases).

### Added — content safety

- Every placeholder entry is marked `sample: true` and displays a visible
  “Sample content” badge; archive pages carry a notice explaining what that means.
- Placeholder photography is abstract generated artwork, clearly captioned as
  such; no real student, college or batch photograph is presented as authentic.
- No invented student identities, events, quotations, institutional endorsements
  or contact details anywhere in the project.
- Developer credit appears site-wide as **Atikul Islam Rabbi, Student,
  Department of Bengali**, sourced from `_config.yml` and rendered by the shared
  footer.

### Notes

- The website is a **student project** and is not the official website of Islamia
  Government College.
- Bengali search matching is substring-based: documented as a limitation in the
  search page and QA report rather than presented as full Bengali-aware search.

---

## Version numbering

- **Major** — structural change to the content model or the website's information
  architecture.
- **Minor** — new pages, collections or features.
- **Patch** — content updates, fixes and documentation changes.
