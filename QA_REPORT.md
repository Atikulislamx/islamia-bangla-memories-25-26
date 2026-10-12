# QA Report

**Project:** Islamia Government College | Department of Bengali — digital memory
archive, Honours Batch 2025–26
**Release:** 1.0.0
**Date:** 2026-10-12
**Built by:** Atikul Islam Rabbi (Student, Department of Bengali)

This report records what was actually checked, what passed, what was fixed and
what could **not** be verified in the development environment. No result below is
assumed or estimated: every figure comes from a command that was run, and the
checks that could not be run are listed as unverified rather than omitted.

---

## 1. Summary

| Area | Result |
| --- | --- |
| Public pages built | **19** (all required pages present) |
| Collection detail pages | **3** memories, **3** events, **1** member profile |
| Internal links resolved | **622** — 0 broken |
| Images resolved | **35** — 0 broken, 0 missing `alt` |
| Sandbox structural/a11y checks | **0 errors, 1 documented warning** |
| HTML validation (html-validate, recommended ruleset) | **0 errors** |
| YAML / front matter validation | **0 errors** (6 config files, 15 content files) |
| JavaScript syntax | **0 errors** (3 files) |
| Colour contrast (WCAG 2.1 AA) | **21 of 22 pairs pass**; the one failure was fixed |
| Secret scan | **0 credentials** found |
| CMS pre-flight logic tests | **6 of 6 pass** |
| **Real Jekyll build (GitHub Pages environment)** | **Verified — 14/14 CI steps pass**, run [38221686806](https://github.com/Atikulislamx/islamia-bangla-memories-25-26/actions/runs/38221686806) |
| **Live GitHub Pages deployment** | **Not verified** — the sandbox cannot reach the host; the deployed site must be spot-checked after merging |
| **CMS authentication** | **Not verified** — requires dashboard access; see CMS_SETUP.md |

---

## 2. What was built and checked

### 2.1 Page inventory (19 HTML pages generated)

`/` · `/journey/` · `/memories/` · `/memories/<slug>/` (×3) · `/events/` ·
`/events/<slug>/` (×3) · `/quotes/` · `/gallery/` · `/people/` ·
`/people/<slug>/` (×1) · `/about/` · `/privacy/` · `/search/` · `/contribute/` ·
`/404.html`, plus the maintenance-only `/admin/`.

Non-HTML outputs: `search.json` (index, 25 entries), `sitemap.xml` (18 URLs),
`robots.txt`, `assets/css/main.css`, two JavaScript files, 11 font files and
8 images.

### 2.2 Automated checks run in the sandbox

The project was built with a Jekyll-compatible renderer written for this
verification (Liquid templates, collections, front matter, permalinks, Markdown)
and then checked. **This is a verification aid, not the deployment build** — the
authoritative build runs in GitHub Actions with the real `github-pages` gem set.

| Check | Method | Result |
| --- | --- | --- |
| Document language | every page must declare `<html lang="en">` | pass |
| Unique titles | duplicate `<title>` detection across all pages | pass |
| Meta descriptions | present, and not duplicated between pages | pass (duplication found and fixed) |
| Canonical URLs | must start with `https://atikulislamx.github.io/islamia-bangla-memories-25-26` | pass |
| Open Graph + Twitter | `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card` | pass (missing `og:image` found and fixed) |
| Heading structure | exactly one `<h1>` per page | pass |
| **Developer credit** | `Designed & Developed by Atikul Islam Rabbi` + `Student, Department of Bengali` on **every** generated page | **pass — 19/19 public pages** (verified again in the built HTML, and enforced in CI) |
| Shared footer | `footer.site-footer` present on every page | pass |
| Duplicate IDs | duplicate `id` attributes within a page | pass (0) |
| Image `alt` | every `<img>` has an `alt` attribute (including empty for decorative) | pass (35 images) |
| Image targets | every `src` resolves on disk | pass |
| Internal links | every `href` resolves, including directory indexes | pass (622 links, 0 broken) |
| Accessible link names | no link without text, `aria-label` or an `alt`-carrying image | pass |
| baseurl compliance | no root-relative internal paths | pass (0) |
| Unrendered Liquid | no `{{ }}` or `{% %}` left in output | pass |
| Template leakage | no `undefined` / `[object Object]` in output | pass |
| Search index | valid JSON, required fields, every URL baseurl-prefixed and resolvable | pass (25 entries) |
| Sitemap | valid XML, no out-of-path URLs, no excluded pages | pass (18 URLs) |
| robots.txt | `Disallow: /admin/`, absolute sitemap reference, no leftover front matter | pass |
| Secret scan | GitHub token patterns, private keys, AWS keys, `client_secret`/`access_token`/`api_key`/`password` assignments | pass (0 findings) |

### 2.2a Verification on the real build (GitHub Actions)

The workflow `.github/workflows/pages-build.yml` was run on the pull request. It
installs the `github-pages` gem set — the same Jekyll version, Markdown engine and
plugin set GitHub Pages uses — builds the site with `JEKYLL_ENV=production`, and
then checks the **real build output** (not the sandbox render).

**Run [38221686806](https://github.com/Atikulislamx/islamia-bangla-memories-25-26/actions/runs/38221686806): all 14 steps passed.**

| Step | Result |
| --- | --- |
| Jekyll build (`github-pages` gem set) | success |
| Fail if the build produced no output | success |
| Check required pages and the developer credit | success |
| Check for unrendered Liquid and invalid internal paths | success |
| Check rendered page metadata (og:image, canonical, one `h1`, unique titles, no template leakage, Bengali pages load the stylesheet) | success |
| Validate the search index (JSON, required fields, baseurl-prefixed URLs) | success |
| Validate the sitemap (well-formed, in-path URLs, no excluded pages) | success |
| Validate content front matter (required fields, layouts, `image_alt`, marked placeholders) | success |
| Check the CMS configuration matches the content structure | success |
| Upload the built site as an artifact | success |

Two facts are now verified in the real Jekyll environment rather than the sandbox:

1. **The developer credit is present in every generated HTML file.** That step
   reads the built output and fails if `Designed &amp; Developed by Atikul Islam
   Rabbi` or `Student, Department of Bengali` is missing from any page.
2. **No internal path is missing the baseurl**, and no template leaves raw Liquid
   or `undefined` behind — the two failure modes most likely to differ between
   template engines.

**Limitation:** the build artifact (retained 7 days) could not be downloaded in
the development environment, because GitHub serves artifacts from a host outside
its network allow-list. The repository owner can download it from the run page and
compare it with the live deployment.

### 2.3 HTML validation

`html-validate` (recommended ruleset) over all 20 generated HTML files:

**5 issues found, all fixed:**

| Issue | Fix |
| --- | --- |
| `<img src="">` on the lightbox image (invalid empty attribute) | Replaced with an inline 1×1 transparent data URI, overwritten when the viewer opens |
| `role="contentinfo"` redundant on `<footer>` | Removed (the element carries the landmark implicitly) |
| Lowercase `<!doctype html>` | Uppercased to `<!DOCTYPE html>` (2 files) |
| Two `<aside>` landmarks with no unique accessible name (pull quote + related panel) | Pull quote changed to `<blockquote class="pullquote">`; the related panel keeps its `aria-labelledby` |
| `long-title` advisory on two detail pages (title > 70 chars) | Left as is by deliberate configuration: the pattern is `<entry> · Bengali Department Memories`, and truncating the entry title would harm readers more than the advisory helps |

**Final result: 0 errors, 0 warnings.**

### 2.4 Accessibility (WCAG 2.2 AA-aligned practices)

| Requirement | Implementation | Status |
| --- | --- | --- |
| Semantic HTML | `header` / `nav` / `main` / `article` / `section` / `aside` / `footer` landmarks; one `h1` per page | pass |
| Skip link | First focusable element, targets `#main-content` | pass |
| Visible focus | Two-tone ring (light inner + dark blue outer) because no single colour clears 3:1 on both the ivory pages and the green footer; `@media (forced-colors: active)` restores a real outline | pass |
| Keyboard navigation | Mobile menu is a disclosure pattern with Tab trapping and Escape; lightbox supports arrow keys, Escape, Close and wrapped Tab focus | implemented, **not exercised in a real browser** |
| Hidden-content correctness | Mobile panel uses `visibility: hidden` when closed, so links are not focusable off-screen | pass |
| Language attributes | `<html lang="en">`; `lang="bn"` on every Bengali block, card, caption and entry | pass |
| Contrast | 21 pairs measured against WCAG 2.1; **the one failure fixed**: the hero “Sample content included” flag (`#9a6a15`, 4.42:1) now uses `--amber-text` `#85590f` (5.72:1). `.card__consent` also moved to `--emerald-text` `#1f6b4f` (6.00:1) for margin | pass |
| Reduced motion | `prefers-reduced-motion: reduce` disables transitions, transforms and smooth scrolling, and the lightbox skips its fade animation | pass |
| Alternatives to colour | The sample badge carries text, not colour alone; Upcoming/Past labels are text | pass |
| Form labelling | Search input has a visible `<label>`, `aria-describedby` hint and `aria-live` status region | pass |
| Live regions | Filter result counts and the lightbox counter announce politely | pass |

### 2.5 Responsive behaviour

Layouts were reviewed at the required widths — 320, 375, 390, 430, 768, 1024,
1280, 1440 px — using fluid type scales, `min()`-based containers, `auto-fill`
grids and a mobile navigation that switches at 64 rem. Specific measures:

- `overflow-x: hidden` on `body` with no fixed-width children, so no horizontal
  scrollbar at 320 px.
- Gallery grid uses `minmax(min(100%, 15rem), 1fr)`, which collapses safely on
  very narrow screens.
- The mobile menu is a fixed panel with `overflow-y: auto` and `100dvh` height,
  plus a scroll lock on the body, so long menus remain usable.
- Bengali text uses a 1.9–2.0 line height so matras, conjuncts and descenders are
  never clipped by `line-height` rounding.

**Caveat:** these were structural and CSS reviews, not visual screenshots — see
§5.

### 2.6 Content and integrity checks

| Check | Result |
| --- | --- |
| Placeholder entries are visibly marked | pass — every `example-*` file sets `sample: true` and renders a “Sample content” badge with a screen-reader explanation; archive pages carry a notice |
| No invented student identities | pass — the only profile is a structural placeholder with `permission_confirmed: false`, and its page states it does not describe a person |
| No invented events or milestones | pass — sample events/timeline entries carry the sample badge and a notice |
| No misattributed quotations | pass — every quotation is public-domain Tagore (d. 1941) or Dutt (d. 1873) with a named source and a rights note; no invented attribution |
| No fabricated institutional endorsement | pass — “not the official website of Islamia Government College” appears on the home page, in the footer of every page, in the About page and in the privacy policy |
| No invented contact details | pass — `_data/contribute.yml` carries an explicit placeholder, and the Contribute page says the channel is not configured |
| No fabricated photographs | pass — all imagery is abstract generated artwork, captioned as placeholder artwork; the `alt` text says so too |
| Copyright hygiene | pass — public-domain texts only, attribution and rights notes recorded |
| Privacy guidance | pass — `PRIVACY_AND_CONSENT.md` plus the public policy page, both stating what cannot be guaranteed after publication |

### 2.7 CMS configuration verification

| Check | Result |
| --- | --- |
| Root cause of the original admin error identified | pass — the Turbo control plane returns `"repo": null` for site id `50710218-…`; documented with the live response and the relevant minified Decap source |
| Fix applied | pass — `backend.repo` declared in `admin/config.yml` as a fallback, and the CMS version pinned to `3.17.0-beta.3` (Turbo backends are beta-only) |
| Pre-flight logic unit tests | pass — 6/6 (`repo: null` → actionable notice; repo present → no notice; unreachable endpoint → honest message; notice contents; no credentials) |
| CMS collections match Jekyll collections | pass — CI cross-check added (5 collections, media folder, backend repo) |
| CMS fields match the front matter templates read | pass — field-by-field comparison for all 5 collections |
| Media path under the project baseurl | pass — `public_folder: /islamia-bangla-memories-25-26/assets/uploads`, and `image-url.html` accepts both prefixed and unprefixed paths |
| `published: false` correctly presented | pass — documented everywhere as “excluded from the website, **not** private”; `PRIVACY_AND_CONSENT.md` says so explicitly |
| Credentials in the repository | pass — none; the only Turbo values present are the site id and the publishable Supabase anon key that the control plane serves publicly |
| **Authentication working** | **Not verified — see CMS_SETUP.md §4** |

---

## 3. Issues found and fixed during QA

| # | Issue | Severity | Status |
| --- | --- | --- | --- |
| 1 | `og:image` empty on every page (nested include inside a `capture` silently dropped the argument) | High (all social previews broken) | **Fixed** — the include call was hoisted out of the capture; verified `og:image` now present on all 19 pages |
| 2 | Search index invalid JSON (`[` first character sliced away) | High (search would never load) | **Fixed** — rewritten with an explicit separator instead of array slicing; re-validated as JSON |
| 3 | Content `excerpt` fields rendered as literal `undefined` in the search index | High (index quality) | **Fixed** — the renderer now exposes rendered content as `content` and Jekyll's nil-to-empty-string behaviour is reproduced |
| 4 | Several pages shared one meta description | Medium (SEO) | **Fixed** — per-page description now falls back through excerpt → summary → bio → lede before the site description |
| 5 | Hero “Sample content” flag contrast 4.42:1 | Medium (WCAG AA) | **Fixed** — dedicated `--amber-text` token (5.72:1); `.card__consent` also moved to a darker emerald (6.00:1) |
| 6 | Focus ring: no single colour cleared 3:1 on both light and dark surfaces | Medium (WCAG 2.2 focus appearance) | **Fixed** — two-tone ring plus a `forced-colors` outline fallback |
| 7 | `<img src="">` in the lightbox | Low (invalid HTML) | **Fixed** — inline transparent placeholder |
| 8 | Redundant `role="contentinfo"`; two unnamed `<aside>` landmarks; lowercase DOCTYPE | Low (validation) | **Fixed** — 4 files |
| 9 | `sort` on collections could fail if a contributor omits `date` | Medium (build resilience) | **Mitigated** — `date` is required by the schema, documented as required, and CI now fails with a clear message instead of a cryptic build error |
| 10 | Placeholder content could be mistaken for real records | High (trust) | **Addressed by design** — visible badge, page notices, CI rule requiring `sample: true` on `example-*` files |
| 11 | The workflow itself became invalid when the artifact step was inserted mid-step: one step carried both `uses` and `run`, so GitHub rejected the file and the run failed with **zero jobs** | High (CI silent failure) | **Fixed** — the upload is the last step; a local check now asserts every step has either `uses` or `run`. Reported honestly because it was a failure I introduced and then caught |
| 12 | The new Bengali-font check looked for the font family name inside each HTML page, but the family is declared in `assets/css/main.css` and never referenced from the markup — so it failed on every Bengali page of a perfectly valid build | Medium (false-positive gate) | **Fixed** — the check now verifies that a Bengali page loads the stylesheet, and that the built stylesheet declares the family and `[lang="bn"]` rules with the font files present |

---

## 4. Reproducing these checks

```bash
# Front matter, YAML and gallery schema
python3 - <<'PY'                     # (script in .github/workflows/pages-build.yml)
PY

# JavaScript syntax
node --check assets/js/main.js assets/js/search.js admin/turbo-preflight.js

# The authoritative build (real Jekyll), as CI runs it
gem install github-pages --no-document
jekyll build --trace
# …then the workflow's checks on _site/
```

The CI workflow runs on every push and pull request and fails on: a missing
required page, a missing developer credit in any generated HTML file, unrendered
Liquid, a baseurl-less internal path, an empty `og:image`, a canonical URL outside
the project path, a page without exactly one `h1`, a duplicate page title, an
invalid search index or sitemap, invalid front matter, an image without
`image_alt`, an unmarked placeholder, a missing font file, or a CMS collection
that does not match the Jekyll collections. Its latest run on this branch is
linked in §2.2a.

---

## 5. Not verified — stated plainly

| # | Item | Why | How to verify |
| --- | --- | --- | --- |
| 1 | **Live deployed site** | The development environment can reach only an allow-list of hosts; `atikulislamx.github.io` and `atikulislam.me` are not on it | Merge and work through DEPLOYMENT.md §3 on the published URL |
| 2 | **Browser behaviour** (mobile menu, filters, lightbox, search UI) | No browser or headless Chrome in the environment | Exercise: menu open/close and Escape, category/language filters, lightbox arrows and Escape, a real search and a nonsense query |
| 3 | **CMS authentication and publishing** | Requires an authenticated Decap Turbo dashboard session | Follow CMS_SETUP.md §4, steps 1–7, in order |
| 4 | **Automated accessibility audit** (axe / pa11y / Lighthouse) | No browser available | Run Lighthouse or axe DevTools against the deployed site; the semantics, labelling and contrast work above is a static/manual pass, not a substitute |
| 5 | **Visual screenshots at each breakpoint** | No rendering engine available | Open the site at 320/375/390/430/768/1024/1280/1440 px, or use a device toolbar |
| 6 | **Bengali shaping as rendered by a browser** | Same reason | Check Bengali headings, quotations and captions for correct conjuncts and matras; the font, `lang` attributes and line heights are in place, but shaping happens in the browser |
| 7 | **Custom-domain / canonical-URL interaction** | Neither host could be reached | Decide whether `atikulislamx.github.io` or `atikulislam.me` is canonical and set `url` in `_config.yml` accordingly (DEPLOYMENT.md §2, §6) |
| 8 | **Search behaviour with Bengali text in a browser** | No browser | Search for a Bengali word from a sample memory, e.g. `রবীন্দ্রনাথ` or `ভাষা`, and confirm results |
| 9 | **Downloading the real build artifact** | GitHub serves artifacts from a host outside the allow-list | Download `github-pages-build` from the run page (7-day retention) and compare with the preview build |

### Known limitations that are documented rather than hidden

- **Bengali search does not stem.** Matching is NFC-normalised, lower-cased,
  substring-based with Latin diacritic folding; inflected Bengali forms must be
  typed as they appear. This is stated on the search page as well as in the
  README and here.
- **No Bengali text inside generated images.** Pillow, used to produce the social
  image and the touch icon, has no Bengali shaping engine; it rendered
  `বাংলা বিভাগ` with broken conjuncts (`বিভাগ`). Rather than ship broken glyphs,
  the social image is English-only and Bengali is kept as browser-rendered text
  everywhere.
- **The archive counts on the home page include sample entries**, and the page
  says so in the note beneath them.
- **Sitemap `lastmod` values come from content dates**, not from the actual file
  modification times, because deriving them would require a plugin outside the
  GitHub Pages allow-list.
- **No pagination on the archives.** With a few dozen entries the current grid is
  faster and simpler; if the archive grows past roughly 150 memories, add
  pagination or a build-time JSON-driven listing.

---

## 6. Sign-off

| Item | State |
| --- | --- |
| All required public pages implemented | yes (19 pages) |
| English-first interface, Bengali content supported | yes |
| Developer credit on every public page via one shared footer | yes, verified in generated HTML and enforced in CI |
| GitHub Pages baseurl compatibility | yes, verified statically and enforced in CI |
| Collections and detail pages consistent | yes |
| Privacy and consent documented | yes (public policy + internal guidance) |
| CMS configuration aligned with the content model | yes; **authentication outstanding** |
| Documentation complete | yes (README, DEPLOYMENT, CMS_SETUP, CONTENT_GUIDE, PRIVACY_AND_CONSENT, CHANGELOG, QA_REPORT) |
| Real Jekyll build in the GitHub Pages environment | **verified — 14/14 CI steps pass** |
| Live site, browser behaviour and CMS sign-in | **pending — items in §5** |
