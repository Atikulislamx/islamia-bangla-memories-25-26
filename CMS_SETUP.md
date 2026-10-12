# CMS Setup — Decap CMS with the Decap Turbo backend

**Status: configuration complete, authentication NOT verified.**
The public website is complete and does not depend on the CMS. Everything below
distinguishes clearly between what is implemented, what is verified, and what
still has to be done by the repository owner.

- **Admin panel:** <https://atikulislamx.github.io/islamia-bangla-memories-25-26/admin/>
- **Configuration:** [`admin/config.yml`](admin/config.yml)
- **Backend:** `turbo-github` (Decap Turbo) — **not** the plain GitHub backend,
  **not** Netlify, **not** git-gateway
- **Intended editors:** the repository owner only, unless they explicitly
  authorise someone else

---

## 1. What was broken, and what was fixed

The project previously failed to load with:

```
The GitHub backend needs a "repo" in the backend configuration.
```

### The actual cause (investigated, not assumed)

`turbo-github` extends Decap's GitHub backend. Instead of reading the repository
from `config.yml`, it fetches its Supabase project and repository from the Decap
Turbo control plane, keyed on `turbo_site_id`. The response for this project's
site id was captured while investigating:

```console
$ curl -s "https://sb.decapcms.org/functions/v1/config?site_id=50710218-f620-46cd-8ee7-f56ff252e14d"
{"supabase_app_id":"pujtvbcombndovjjlsmz",
 "supabase_anon_key":"sb_publishable_…",
 "base_url":"https://pujtvbcombndovjjlsmz.supabase.co",
 "api_root":"https://pujtvbcombndovjjlsmz.supabase.co/functions/v1/gh",
 "repo":null,          <-- the repository is not connected on the site row
 "branch":"main",
 "config_path":"admin/config.yml"}
```

`repo: null` is the whole failure. The GitHub backend was constructed with no
repository, so it threw its own error message — which is why the message looked
like a `config.yml` problem when the real problem was on the Turbo side.

The relevant part of Decap's Turbo backend (from `decap-cms@3.17.0-beta.3`,
minified) confirms both the fetch and the precedence:

```js
preloadConfig: async ({ backend }) => {
  const payload = await (await fetch(`${turbo_config_url}?site_id=…`)).json();
  const { repo, branch, ...rest } = payload;
  return { backend: { ...rest, ...config.backend,
                      ...(repo ? { repo } : {}),                 // control plane wins…
                      ...(branch && !config.backend.branch ? { branch } : {}) } };
                      //                                       // …but config.yml still fills the gap
}
```

### The fix applied

1. **`admin/config.yml` now declares the repository as well as the site id:**

   ```yaml
   backend:
     name: turbo-github
     turbo_site_id: "50710218-f620-46cd-8ee7-f56ff252e14d"
     repo: "Atikulislamx/islamia-bangla-memories-25-26"   # local fallback
     branch: main
   ```

   Because the control plane's `repo` is null, the spread above keeps the local
   value, so the backend no longer constructs with an empty repo. Once the site
   row is fixed in the dashboard, the two agree and this line remains harmless.

2. **`admin/turbo-preflight.js` replaces the cryptic error with instructions.**
   It performs one unauthenticated GET against the same public endpoint the CMS
   uses, and — only while the repository is missing — shows a notice on
   `/admin/` with the exact dashboard steps. It reads no tokens, stores nothing
   and never blocks the CMS from starting.

3. **The CMS version is pinned** (`decap-cms@3.17.0-beta.3`). The Turbo backends
   are beta-only: they are *not* in the stable `decap-cms` release, so the
   pinned beta build is required. Pinning avoids a beta update changing
   behaviour underneath a published site; upgrade deliberately and re-test.

### Why the backend was not replaced

Switching to Netlify Identity, `git-gateway` or an OAuth proxy would mean
replacing a hosting platform the owner did not choose, or standing up an extra
authentication service. The existing Turbo site id is present and structurally
correct — it is missing one connection, not misconceived. The original
configuration is therefore preserved, with the fallback that makes it build.

---

## 2. What is implemented vs. what is verified

| # | Item | State |
| --- | --- | --- |
| 1 | CMS configuration present, schema valid | **Implemented** (`admin/config.yml`) |
| 2 | Admin page exists and loads the CMS application | **Implemented** — loads `decap-cms@3.17.0-beta.3` from jsDelivr |
| 3 | Pre-flight notice explaining a missing repo connection | **Implemented**, logic unit-tested |
| 4 | Authentication provider configured in Turbo | **Not done** — requires the dashboard |
| 5 | A real authorised user signing in | **Not verified** — cannot be tested without dashboard access |
| 6 | A CMS edit committed to the repository | **Not verified** — depends on 4 and 5 |
| 7 | The website rendering that change | **Not verified** — depends on 6 |

**Nothing in this document should be read as claiming that sign-in, editing or
publishing through `/admin/` works today.** Steps 4–7 are the remaining work.

---

## 3. Collections configured

The CMS edits exactly the folders Jekyll reads, and the fields match the front
matter the templates consume. Anything not listed cannot be edited through the
panel.

| CMS collection | Folder | Maps to | Publishes |
| --- | --- | --- | --- |
| Memories | `_memories/` | `_memories` collection | `/memories/<slug>/` |
| Events | `_events/` | `_events` collection | `/events/<slug>/` |
| Quotes | `_quotes/` | `_quotes` collection | `/quotes/` |
| Our Journey | `_timeline/` | `_timeline` collection | `/journey/` |
| Batch Members | `_people/` | `_people` collection | `/people/<slug>/` |

Media uploads are committed to `assets/uploads/`, with
`public_folder: "/islamia-bangla-memories-25-26/assets/uploads"` so CMS previews
resolve under the GitHub Pages project path. The `image-url.html` include
tolerates both the prefixed and unprefixed forms, so a template never breaks if
the public folder is changed.

### Publication behaviour

`publish_mode: simple` is deliberate. Decap's editorial workflow
(draft → review → publish) needs draft branches through the backend, which is
unverified for `turbo-github`; enabling an unverified workflow would produce a
panel that appears to queue drafts and silently does something else. Until the
workflow is tested, publication is controlled by two front matter fields:

- `published: false` → Jekyll excludes the document from the website build.
- `sample: true` → renders a visible “Sample content” badge (used for the
  current placeholder entries).

⚠️ **Neither field is a privacy control.** A file committed to this public
repository is readable by anyone, whatever its flags say. To keep something
private, do not commit it. See
[PRIVACY_AND_CONSENT.md](PRIVACY_AND_CONSENT.md).

---

## 4. Required manual steps (repository owner)

These cannot be done from the code: they need an authenticated browser session
in the Decap Turbo dashboard.

1. **Sign in to Decap Turbo** at <https://decapcms.org/> → Turbo dashboard, with
   the account that owns the site id
   `50710218-f620-46cd-8ee7-f56ff252e14d`.
   *If that site id belongs to a different Turbo account, either complete the
   setup under the owning account or create a new Turbo site for this repository
   and replace `turbo_site_id` in `admin/config.yml`.*
2. **Connect GitHub.** In the dashboard, authorise the `Atikulislamx` GitHub
   account so Turbo can read and commit to the repository.
3. **Set the repository on the site row:**
   `Atikulislamx/islamia-bangla-memories-25-26`, branch `main`.
   This is what makes the control plane stop returning `repo: null` — the root
   cause of the original error. (`admin/config.yml` now works around it, but the
   dashboard value is what the proxy authorises against; leaving it unset risks
   `requested repo does not match` errors later.)
4. **Confirm the config path** on the site row is `admin/config.yml`.
5. **Confirm access is owner-only.** Turbo site roles decide who may edit; keep
   the site private to the owner unless another editor is deliberately invited.
6. **Test the full chain** in this order, and stop at the first failure:
   1. `/admin/` loads and shows “Login with Turbo”.
   2. Sign-in succeeds.
   3. The five collections list existing entries (the `example-` files should be
      visible).
   4. Edit one sample entry, save, and confirm a commit appears in the
      repository.
   5. Wait for the Pages rebuild and confirm the change is live on the website.
   6. Delete the sample entry again, or keep it while testing with the
      `sample: true` flag set.
7. **Then, and only then,** update this document's status line to say
   authentication is verified, and record the date of the test.

### What to do if Turbo cannot be used

The website does not depend on the CMS. If the Turbo connection turns out to be
unavailable (for example, the site id belongs to an account you cannot access),
the alternatives are, in order of least disruption:

1. **Edit the Markdown files on GitHub** — the content is plain front matter, and
   GitHub's web editor is a perfectly serviceable CMS for a folder of files.
2. **Create a new Turbo site** for this repository and replace `turbo_site_id`.
3. **Switch to a different backend** (for example `github` with an OAuth proxy
   you host). This adds a service to maintain; do it only if 1 and 2 are not
   viable, and update `admin/index.html` (the pre-flight script is Turbo
   specific), `admin/config.yml` and this document together.

---

## 5. Security notes

- **No credentials are stored in this repository.** No tokens, no OAuth client
  secrets, no service-role keys, no passwords. The only Turbo values in the
  repository are the site id and the publishable Supabase anon key that the
  control plane hands to every browser that opens the admin panel — by design
  (Decap's own documentation calls it a *publishable* key).
- **Never commit a token to make the CMS work.** If a step asks for a GitHub
  access token, the setup is wrong: `turbo-github` authenticates in a popup and
  keeps its session in the browser.
- **`/admin/` is a maintenance tool.** It is `noindex, nofollow`, it is
  disallowed in `robots.txt`, and it is not linked from any public page. It is
  still a public URL — anyone can load it, and only an account with access to
  the Turbo site can sign in and publish.
- **Editorial review is not a security boundary.** If unpublished drafts are
  committed to this public repository, they are readable before publication.
  Keep sensitive material out of the repository entirely.
- **Revoke access by removing the member from the Turbo site,** not by editing
  files: access lives in the dashboard, not in `admin/config.yml`.

---

## 6. Testing the configuration without a browser

`admin/turbo-preflight.js` is written to be testable. Its unit tests (run during
development) cover the control-plane responses:

```
ok  live Turbo response (repo: null) is reported as repo-missing
ok  a response with a repo is accepted
ok  an unreachable control plane is reported honestly
ok  notice renders the dashboard steps for the maintainer
ok  notice stays hidden when the repository is configured
ok  no credentials are embedded in the pre-flight script or config
```

To check the live connection yourself, in a terminal or in a browser console:

```bash
curl -s "https://sb.decapcms.org/functions/v1/config?site_id=50710218-f620-46cd-8ee7-f56ff252e14d"
# "repo":"Atikulislamx/islamia-bangla-memories-25-26"  →  step 3 is done
# "repo":null                                          →  step 3 is still outstanding
```

The CI workflow additionally cross-checks `admin/config.yml` against the Jekyll
collections in `_config.yml` on every push: a collection pointing at a
non-existent folder, a missing `media_folder`, or a collection name that does
not exist in Jekyll fails the build check.

---

## 7. Deploy previews

Not configured, and not required. Every CMS save commits to `main`, GitHub Pages
rebuilds, and the change appears on the live site within a minute or two. If
previews are wanted later, they need a separate deployment service — Decap's
`deploy_preview` feature only works with providers that support it.
