# Deployment Guide

How to publish this website to GitHub Pages, verify it, and fix the problems
that actually come up.

- **Repository:** `Atikulislamx/islamia-bangla-memories-25-26`
- **Production branch:** `main`
- **Published site:** <https://atikulislamx.github.io/islamia-bangla-memories-25-26/>
- **Pages source:** `main` branch, `/` (root) — *legacy* build, i.e. GitHub's own
  Jekyll build. No custom Actions deployment is used or required.

> GitHub Pages currently publishes from a **legacy** source. GitHub's own Jekyll
> environment builds the site, so **no Gemfile, no Node.js and no workflow is
> required to deploy**. The workflow in `.github/workflows/pages-build.yml` only
> checks that the build succeeds; it does not deploy.

---

## 1. Upload or update the project

### Option A — normal Git workflow (recommended)

```bash
git clone https://github.com/Atikulislamx/islamia-bangla-memories-25-26.git
cd islamia-bangla-memories-25-26

# copy the project files into this folder, then:

git status
git add -A
git commit -m "Add the Bengali Department digital memory archive"
git push origin main
```

### Option B — GitHub web interface

1. Open the repository and switch to the `main` branch.
2. Use **Add file → Upload files**, drag the project contents in, and commit.
   *Upload folders rather than an unopened ZIP: GitHub does not extract
   archives, so a committed `*.zip` would be published as a download instead of
   a website.*
3. Confirm that `_config.yml`, `index.html`, `_layouts/`, `_includes/`,
   `_memories/`, `assets/` and `admin/` are in the **repository root**. They must
   not sit inside an extra folder such as `islamia-bangla-memories-25-26/`.

### Option C — pull request

Work on a branch, open a pull request against `main`, review the build check,
then merge. The deployment follows the merge automatically.

---

## 2. Confirm the GitHub Pages settings

1. Repository → **Settings** → **Pages**.
2. **Source:** *Deploy from a branch*.
3. **Branch:** `main`, folder `/ (root)`.
4. Save. GitHub rebuilds within a minute or two.

> **Note for this repository (verified through the GitHub API):** Pages for this
> account is served under the custom domain `atikulislam.me`, and this project
> repository has **no `CNAME` file of its own** — the domain comes from the user
> site (`Atikulislamx.github.io`). The Pages API therefore reports the project's
> HTML address as `http://atikulislam.me/islamia-bangla-memories-25-26/`, while
> the project brief specifies the `github.io` address as the canonical one.
>
> `_config.yml` accordingly keeps `url: "https://atikulislamx.github.io"`, so
> canonical URLs, the sitemap and social previews use the address from the
> brief. Two things could not be verified from the development environment
> because it has no network access to either host: whether
> `atikulislamx.github.io` redirects to the custom domain, and whether HTTPS is
> enforced. Check both after deploying — open the site, then view the source and
> confirm the `<link rel="canonical">` value. If the account's custom domain
> should be canonical instead, change `url` in `_config.yml` to
> `https://atikulislam.me` and redeploy; nothing else needs editing. If the
> `github.io` address redirects to the custom domain, that is the cleaner option
> for search engines.

---

## 3. Verify the deployment

Work through this list after every publish. It takes about two minutes.

| # | Check | Where | Expected |
| --- | --- | --- | --- |
| 1 | Home page loads | site root | Hero, taglines, featured memories, stats |
| 2 | **Developer credit** | footer of any page | “Designed & Developed by Atikul Islam Rabbi” / “Student, Department of Bengali” |
| 3 | Navigation | header + mobile menu | Home, Our Journey, Memories, Events, Quotes, Photo Gallery, About Us |
| 4 | Archive pages | `/memories/`, `/events/`, `/quotes/`, `/gallery/`, `/journey/`, `/people/` | Content or an honest empty state — never a blank page |
| 5 | Detail pages | click any memory or event card | Full page with breadcrumbs and a return link |
| 6 | Search | `/search/` | Typing “classroom” returns results; a nonsense word returns the no-results state |
| 7 | Photo gallery | `/gallery/` | Grid renders; clicking an image opens the lightbox; Escape closes it |
| 8 | 404 page | any wrong URL, e.g. `/islamia-bangla-memories-25-26/nope/` | Custom page with links home |
| 9 | Assets | browser network tab | CSS, JS and fonts return 200, none 404 |
| 10 | Baseurl | view source | Every internal link starts with `/islamia-bangla-memories-25-26/` |
| 11 | robots + sitemap | `/robots.txt`, `/sitemap.xml` | `Disallow: /admin/`, absolute sitemap URL; sitemap lists real pages |
| 12 | Admin panel | `/admin/` | Loads the CMS or a clear notice — see [CMS_SETUP.md](CMS_SETUP.md) |

### Monitoring the build

- Repository → **Actions** tab → the *Build check (GitHub Pages)* workflow.
  A green run means the Jekyll build succeeded and the checks passed. A red run
  names the page and the missing piece.
- Repository → **Settings → Pages** shows the last deployment and its commit.

---

## 4. Troubleshooting

**The site shows “404 File not found”**
GitHub Pages needs a moment after the first publish. Confirm the branch, folder
(`/ (root)`) and that `index.html` is at the repository root — not inside a
subfolder and not only inside a ZIP.

**Pages are unstyled, and links 404**
An internal path lost its baseurl. Every internal link and asset must go through
Liquid:

```liquid
{{ '/assets/css/main.css' | relative_url }}   <!-- correct -->
/assets/css/main.css                          <!-- broken: resolves to the domain root -->
```

The build check catches this class of bug (it greps the output for baseurl-less
internal paths) and fails the workflow.

**The build fails with “Invalid YAML front matter”**
Almost always an unquoted colon or a stray tab in a content file. Quote any
value that contains `:` — for example
`title: "Reading session: first impressions"` — and use spaces, never tabs.
Validate a single file with:

```bash
python3 -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read();yaml.safe_load(t.split('---')[1])" _memories/your-file.md
```

**A new memory or event does not appear**
Check, in order: the file is inside the right collection folder (`_memories/`,
`_events/`); it starts with `---` and ends the front matter with `---`;
`published` is not `false`; the file is committed and pushed to `main`; and the
build finished.

**Bengali text looks broken**
Bengali must render through `Noto Sans Bengali`, which is applied automatically
to any element carrying `lang="bn"`. Wrap Bengali content in a language
attribute:

```html
<p lang="bn">বাংলায় লেখা একটি অনুচ্ছেদ।</p>
```

If Bengali appears in an image instead of as text, it will not render correctly —
keep Bengali as text, not baked into graphics.

**The custom 404 page is not used**
`404.html` must be in the repository root (it is), the Pages source must be the
branch root, and — if a custom domain is in use — the domain must be verified.
GitHub Pages serves `/404.html` for unknown paths under the project path.

**Content appears that should not be public**
Removing an entry means deleting its file and committing. `published: false`
hides a document from the website, but the file remains readable in the public
repository and in the Git history. See
[PRIVACY_AND_CONSENT.md](PRIVACY_AND_CONSENT.md).

**The workflow fails at the CMS cross-check**
`admin/config.yml` points at a folder that does not exist, or defines a
collection that is not declared in `_config.yml`. Both are easy to fix by
comparing the two files — the check prints exactly which name is wrong.

---

## 5. Rolling back

```bash
git log --oneline -10                  # find the last good commit
git revert <commit>                    # revert one change
git push origin main                   # Pages redeploys the reverted state
```

For a full rollback, `git revert` the range (`git revert --no-commit A..B &&
git commit`) rather than force-pushing: history stays intact, and the reason for
the rollback stays visible.

---

## 6. What this guide does not cover

- **CMS authentication.** Publishing through `admin/` needs a completed Decap
  Turbo connection; that is a separate, partly manual step documented in
  [CMS_SETUP.md](CMS_SETUP.md).
- **Custom domain changes.** Manage those in repository Settings → Pages; if the
  canonical URL should change, update `url` in `_config.yml` afterwards.
- **Image optimisation.** Upload photographs resized to about 1600 px on the
  long edge and compressed to roughly 200–400 KB before committing; the
  repository has no automated image pipeline by design.
