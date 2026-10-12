# Islamia Government College | Department of Bengali

**Digital Memory Archive — Honours Batch 2025–26**
Sirajganj, Bangladesh · *Our Stories. Our Memories. Our Bengali Department.*

A student-built digital yearbook and long-term archive for the Department of
Bengali, Honours Batch 2025–26. The website collects memories, events,
quotations, photographs and milestones, keeps the Bengali language in the
foreground where it belongs, and publishes everything as plain, portable files.

- **Published site:** <https://atikulislamx.github.io/islamia-bangla-memories-25-26/>
- **Repository:** <https://github.com/Atikulislamx/islamia-bangla-memories-25-26>
- **Content manager (maintenance only):** `/admin/` — see [CMS_SETUP.md](CMS_SETUP.md)

> **This is a student project.** It is not the official website of Islamia
> Government College and it claims no institutional endorsement.

---

## Contents

1. [What the website contains](#what-the-website-contains)
2. [Technology stack](#technology-stack)
3. [Repository structure](#repository-structure)
4. [Editing content](#editing-content)
5. [Configuration overview](#configuration-overview)
6. [Local development](#local-development)
7. [Documentation index](#documentation-index)
8. [Developer](#developer)

---

## What the website contains

| Page | Path | Purpose |
| --- | --- | --- |
| Home | `/` | Hero, featured memories, journey preview, selected events, quotations, gallery preview, member profiles |
| Our Journey | `/journey/` | Chronological timeline of verified batch milestones |
| Memories | `/memories/` | Complete memory archive with category and language filters |
| Memory detail | `/memories/<slug>/` | Full memory text, image, related memories and event |
| Events | `/events/` | Event archive with Upcoming / Past filters and categories |
| Event detail | `/events/<slug>/` | Date, time, venue, description, gallery, related memories |
| Quotes | `/quotes/` | Quote wall: public-domain texts and contributor reflections |
| Photo Gallery | `/gallery/` | Responsive gallery with captions and an accessible lightbox |
| Batch Members | `/people/` | Optional consent-based member profiles |
| About Us | `/about/` | Purpose, review process, consent handling, credits |
| Privacy Policy | `/privacy/` | Publication, photo consent, removal requests, public-repo risks |
| Search | `/search/` | Client-side search across the whole archive |
| Contribute a Memory | `/contribute/` | How to submit, and what happens afterwards |
| Not found | `/404.html` | Custom error page with links back into the site |

The interface is **English-first** by design: navigation, headings, buttons,
labels, categories and site messages are all English, because the archive is
intended to be readable by anyone. **Content** is not forced into English —
memories, reflections, quotations, captions and timeline entries may be written
in Bengali, in English, or in both. Bengali text is marked with `lang="bn"` and
rendered with a Bengali-capable font.

---

## Technology stack

| Layer | Choice | Why |
| --- | --- | --- |
| Site generator | **Jekyll** (GitHub Pages, legacy build) | Builds on GitHub's servers with no pipeline to maintain |
| Hosting | **GitHub Pages** | Free, reliable, no database, no server to patch |
| Templating | **Liquid** with `relative_url` / `absolute_url` | Correct URLs under the project `baseurl` |
| Content | **Markdown + YAML front matter** in Jekyll collections | Portable, diffable, editable without a CMS |
| Styles | **One hand-written CSS file** with custom properties | No framework, no build step, full design control |
| Behaviour | **Vanilla JavaScript** (~11 KB, no dependencies) | Progressive enhancement only |
| Fonts | **Inter, Manrope, Noto Sans Bengali**, self-hosted `.woff2` | No third-party requests; Bengali renders correctly |
| CMS | **Decap CMS** with the `turbo-github` backend | Git-based editing; authentication still to be completed — see [CMS_SETUP.md](CMS_SETUP.md) |
| CI | **GitHub Actions** build check | Runs the real Jekyll build and fails on broken output |

There is **no Node.js build step, no bundler and no npm dependency** for the
website itself. `plugins: []` in `_config.yml` keeps the build inside the
standard GitHub Pages environment: the sitemap, `robots.txt` and the search
index are generated from Liquid templates instead of plugins.

---

## Repository structure

```text
.
├── _config.yml                  Site configuration, collections, developer credit
├── _data/
│   ├── navigation.yml           Header and footer navigation labels
│   ├── categories.yml           Memory, event and quote categories
│   ├── gallery.yml              Photo gallery entries + placeholder notice
│   └── contribute.yml           Contribution workflow + contact placeholder
├── _includes/                   Shared partials (see below)
├── _layouts/
│   ├── default.html             HTML document, header, footer, scripts
│   ├── page.html                Standard content page
│   ├── archive.html             Archive page header
│   ├── home.html                Home page composition
│   ├── memory.html              Memory detail page
│   ├── event.html               Event detail page
│   └── person.html              Member profile page
├── _memories/                   Memory entries (output: true → detail pages)
├── _events/                     Event entries (output: true → detail pages)
├── _quotes/                     Quotations (rendered on /quotes/)
├── _timeline/                   Timeline entries (rendered on /journey/)
├── _people/                     Member profiles (consent-gated)
├── _templates/                  Copy-and-fill templates, never published
├── admin/                       Decap CMS admin panel (noindex, robots-disallowed)
│   ├── index.html               Loads Decap CMS + the pre-flight notice
│   ├── config.yml               Backend, collections, fields, media paths
│   └── turbo-preflight.js       Explains a missing Turbo repo connection
├── assets/
│   ├── css/main.css             The only stylesheet
│   ├── js/main.js               Navigation, filters, lightbox
│   ├── js/search.js             Client-side search
│   ├── fonts/                   Self-hosted woff2 subsets
│   ├── img/                     Placeholder artwork, favicon, share image
│   └── uploads/                 CMS media target (empty until content is added)
├── .github/workflows/           Build check on push and pull request
├── index.html                   Home page
├── memories/index.html          Memories archive
├── events/index.html            Events archive
├── quotes/index.html            Quote wall
├── gallery/index.html           Photo gallery
├── journey/index.html           Our Journey timeline
├── people/index.html            Batch members
├── search.md                    Search page (carries the search UI markup)
├── about.md                     About Us
├── privacy.md                   Privacy Policy
├── contribute.md                Contribute a Memory
├── 404.html                     Custom not-found page
├── search.json                  Generated search index (noindex)
├── sitemap.xml                  Generated sitemap
├── robots.txt                   Generated robots file
└── docs: README, DEPLOYMENT, CMS_SETUP, CONTENT_GUIDE,
          PRIVACY_AND_CONSENT, CHANGELOG, QA_REPORT
```

### Shared includes

| Include | Responsibility |
| --- | --- |
| `head.html` | Titles, meta description, canonical, Open Graph, icons, font preloads, JSON-LD |
| `header.html` | Brand and primary navigation (English labels from `_data/navigation.yml`) |
| **`footer.html`** | **The one and only footer, including the developer credit** |
| `breadcrumbs.html` | Breadcrumb trail + `BreadcrumbList` structured data |
| `memory-card.html` | Memory card used by the home page and the archive |
| `event-card.html` | Event card with build-time Upcoming / Past status |
| `quote-card.html` | Quotation card |
| `person-card.html` | Member profile card (consent-aware) |
| `timeline-entry.html` | One timeline entry on Our Journey |
| `gallery-grid.html` | Responsive gallery grid |
| `lightbox.html` | Accessible image viewer markup |
| `archive-filters.html` | Progressive-enhancement filter controls |
| `empty-state.html` | Honest empty state for archives with no content |
| `notice.html` | Editorial notice block (sample / info / warning) |
| `sample-badge.html` | Visible “Sample content” badge |
| `figure.html` | Figure + caption with lazy loading |
| `image-url.html` | Baseurl-safe image URL resolver |
| `related-memories.html` | Related memories list for entry pages |
| `event-list.html` | Upcoming / past event list for the home page |
| `scripts.html` | Site script tag |

The footer is included by `_layouts/default.html`, which every other layout
extends, so the developer credit appears on every page the website generates —
including collection detail pages, the search page, the privacy page and the
custom 404 page.

---

## Editing content

**Adding a memory** — create a file in `_memories/`. The filename becomes the
URL (`_memories/our-first-lecture.md` → `/memories/our-first-lecture/`).

```markdown
---
layout: memory
title: "Our first lecture"
date: 2025-08-12
category: "classroom"
author: "Member name (only with their agreement)"
lang: "en"
excerpt: "One or two sentences for the archive grid."
image: "/assets/uploads/first-lecture.jpg"
image_alt: "Describe the photograph for screen readers"
caption: "Caption shown under the photograph"
featured: true
---

Write the memory here. Markdown is supported, and Bengali sentences can be
marked inline: <span lang="bn">বাংলায় লেখা একটি বাক্য।</span>
```

**Adding an event, quotation, timeline entry or profile** — copy the matching
file from `_templates/` into `_events/`, `_quotes/`, `_timeline/` or `_people/`.
Full schemas, every field and worked examples are in
[CONTENT_GUIDE.md](CONTENT_GUIDE.md).

Two fields deserve emphasis:

- `published: false` keeps an entry **out of the generated website** — but the
  file is still visible to anyone who looks at the public repository. It is not
  a privacy control.
- `sample: true` adds a visible “Sample content” badge. Use it for every
  placeholder so a reader can never mistake one for a real record.

### Removing the placeholder content

The archive currently ships with clearly-labelled sample entries so that every
layout can be reviewed. When real content is ready, delete the files whose names
start with `example-` and the entries in `_data/gallery.yml`, then set
`sample_content: false` in `_config.yml` to remove the sample notices from the
home page and archives. Details: [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

---

## Configuration overview

`_config.yml` is the single source of truth for identity, URLs and credits.

| Key | Value | Notes |
| --- | --- | --- |
| `title` | `Islamia Government College \| Department of Bengali` | Used in titles and structured data |
| `tagline` | `Our Stories. Our Memories. Our Bengali Department.` | Hero and footer |
| `supporting_tagline` | `One Batch. Countless Stories. Memories That Stay.` | Footer secondary line |
| `url` | `https://atikulislamx.github.io` | Published root |
| `baseurl` | `/islamia-bangla-memories-25-26` | Project path on GitHub Pages |
| `repository` / `github_repo_url` | repository links in the footer | |
| `developer.name` | `Atikul Islam Rabbi` | **Credit, rendered by `_includes/footer.html`** |
| `developer.role` | `Student, Department of Bengali` | **Credit role** |
| `developer.github_url` | `https://github.com/Atikulislamx` | Footer link only — no invented profiles |
| `institution.*` | college, department, batch, location | Brand, hero and footer |
| `sample_content` / `sample_notice` | placeholder notices | Set to `false` once real content lands |
| `disclaimer` | student-project notice | Home page and footer |
| `future: true` | upcoming events are published | |

Changing `url` or `baseurl` requires no other edits: every link, asset path,
canonical URL, sitemap entry and search-index URL is derived from them with
`relative_url` / `absolute_url`.

---

## Local development

Any of these will show the site (Jekyll is only required for the first two):

```bash
# 1. The real thing — needs Ruby + the github-pages gem
gem install github-pages --no-document
jekyll serve --baseurl ""

# 2. With the project baseurl, exactly as GitHub Pages serves it
jekyll build && python3 -m http.server 8000 --directory _site
#    then open http://localhost:8000/islamia-bangla-memories-25-26/

# 3. No Ruby available? Any static server over a preview build works for
#    reviewing markup and CSS; templates still need Jekyll to build for real.
```

CI runs the authoritative build on every push and pull request — see
`.github/workflows/pages-build.yml`. It installs the same `github-pages` gem set
GitHub Pages uses, builds the site, and then checks the real output: required
pages exist, the developer credit is present in **every** generated HTML file, no
page has an empty `og:image` or a canonical URL outside the project path, every
page has exactly one `h1` and a unique title, no baseurl-less internal paths or
raw Liquid remain, the search index and sitemap are valid, the front matter
conforms to the schema, and `admin/config.yml` matches the Jekyll collections.
The built site is uploaded as a short-lived artifact so the real output can be
inspected without deploying. The current run passes all 14 steps:

<https://github.com/Atikulislamx/islamia-bangla-memories-25-26/actions/runs/38221686806>

---

## Documentation index

| Document | Audience |
| --- | --- |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Publishing to GitHub Pages, verification, troubleshooting |
| [CMS_SETUP.md](CMS_SETUP.md) | Decap CMS backend, authentication, remaining setup steps |
| [CONTENT_GUIDE.md](CONTENT_GUIDE.md) | Front matter schemas and content workflow |
| [PRIVACY_AND_CONSENT.md](PRIVACY_AND_CONSENT.md) | Photo consent, profiles, removals, public-repo risks |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [QA_REPORT.md](QA_REPORT.md) | Verification performed, results, and what is untested |

---

## Developer

**Designed & Developed by Atikul Islam Rabbi**
**Student, Department of Bengali**

- GitHub: <https://github.com/Atikulislamx>

The credit is defined once in `_config.yml` (`developer:`) and rendered by
`_includes/footer.html`. It appears on every public page, including the custom
404 page and every collection-generated detail page.

---

© Department of Bengali, Honours Batch 2025–26. Memory contributions remain the
property of their authors. This is a student project and is not the official
website of Islamia Government College.
