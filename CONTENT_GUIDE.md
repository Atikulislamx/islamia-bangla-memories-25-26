# Content Guide

Everything a contributor or maintainer needs to add content: where files live,
which fields exist, what they do, and worked examples. Written for people who
have never used Jekyll.

**Two rules that override everything else in this document**

1. **Do not invent batch history.** Dates, venues, names, attributions and
   photograph details must come from a real source. If something is uncertain,
   mark it approximate or leave it out.
2. **Do not publish a person without their consent.** Names, photographs and
   profiles need explicit agreement — see
   [PRIVACY_AND_CONSENT.md](PRIVACY_AND_CONSENT.md).

---

## 1. Where content lives

| Content | Folder | One file = one | Appears at |
| --- | --- | --- | --- |
| Memories | `_memories/` | memory | `/memories/<filename>/` |
| Events | `_events/` | event | `/events/<filename>/` |
| Quotations | `_quotes/` | quotation | `/quotes/` (all on one wall) |
| Timeline entries | `_timeline/` | milestone | `/journey/` |
| Member profiles | `_people/` | person | `/people/<filename>/` |
| Gallery photographs | `_data/gallery.yml` | image | `/gallery/` |
| Navigation / categories | `_data/*.yml` | — | header, footer, filters |

Copy-ready templates are in `_templates/` (`memory.md`, `event.md`, `quote.md`,
`timeline.md`, `person.md`). Files in `_templates/` are never published.

The **filename becomes the URL**: `_memories/first-lecture.md` →
`/memories/first-lecture/`. Use lowercase words separated by hyphens.

---

## 2. File anatomy

Every content file is **front matter** (between two `---` lines, in YAML) plus a
**body** (Markdown):

```markdown
---
title: "The first week"
date: 2025-08-05
category: "classroom"
---

The body starts here. Markdown is supported.
```

Rules that prevent 90% of build failures:

- The file must start with `---` on the first line.
- Close the front matter with `---` on its own line.
- Quote any value containing `:` — `title: "Reading session: first notes"`.
- Use spaces for indentation, never tabs.
- Dates are written `YYYY-MM-DD`.

---

## 3. Field reference

### Shared fields

| Field | Type | Notes |
| --- | --- | --- |
| `title` | text | **Required.** Page/card heading. |
| `date` | `YYYY-MM-DD` | Required for memories, events and timeline entries (ordering, Upcoming/Past). Optional for quotations. |
| `lang` | `en` \| `bn` | Language the entry is written in. `bn` renders Bengali typography on the whole entry. Default `en`. |
| `published` | true \| false | `false` removes the entry from the built website. **Not a privacy control** — the file stays readable in the public repository. |
| `sample` | true \| false | `true` shows a visible “Sample content” badge. Use it for every placeholder. |
| `featured` | true \| false | `true` also shows the entry on the home page. |
| `category` | one of the ids in `_data/categories.yml` | Drives archive filters. |

### Memories (`_memories/`)

| Field | Type | Notes |
| --- | --- | --- |
| `layout` | `memory` | Required — keep it exactly. |
| `author` | text | Only with the contributor's agreement; omit for anonymous. |
| `excerpt` | text | 1–2 sentences for the archive grid. Omit to auto-generate. |
| `image` | path | Optional cover, e.g. `/assets/uploads/first-day.jpg`. |
| `image_alt` | text | **Required whenever `image` is set** — describes the image for screen readers. |
| `caption` | text | Visible caption under the image. |
| `pullquote` | text | Optional highlighted line; may be Bengali even in an English entry. |
| `related_event` | filename | e.g. `annual-programme` links to `/events/annual-programme/`. |
| `tags` | list | Free-form, for editors. |

### Events (`_events/`)

| Field | Type | Notes |
| --- | --- | --- |
| `layout` | `event` | Required. |
| `time` | text | e.g. `"10:00 AM"`. |
| `end_date` | date | Optional, for multi-day programmes. |
| `location` | text | **Only a confirmed venue.** |
| `organiser` | text | Optional. |
| `description` | text | Card summary + meta description. |
| `image`, `image_alt`, `caption` | | Cover image, as for memories. |
| `gallery` | list of `{image, alt, caption}` | Photographs from the event. `alt` is required for each. |

Upcoming / Past is calculated from `date` at build time — never write it by hand.

### Quotations (`_quotes/`)

| Field | Type | Notes |
| --- | --- | --- |
| `quote` | text | **Required.** Exact wording. |
| `author` | text | Real, verified attribution only. |
| `source` | text | Title, year, where in the work. |
| `category` | `public-domain` \| `matched-pair` \| `contributor` | |
| `translation` | text | For Bengali quotations: an English rendering, clearly described as prepared for this archive. |
| `rights_note` | text | Why it may be published (e.g. author died 1941). |
| `lang` | `bn` \| `en` | Language of the quotation itself. |

**Never attribute an invented quotation to a real person.** If the wording or
the source cannot be verified, do not publish it.

### Timeline entries (`_timeline/`)

| Field | Type | Notes |
| --- | --- | --- |
| `title` | text | Milestone name. |
| `date` | date | Used for ordering. |
| `period` | text | Human-readable label, e.g. `"July 2025 (approximate)"`. Use it whenever the exact date is uncertain. |
| `location` | text | Optional, verified only. |
| `description` | text | Two or three sentences. |
| `image`, `image_alt`, `caption` | | Optional. |

### Member profiles (`_people/`)

| Field | Type | Notes |
| --- | --- | --- |
| `layout` | `person` | Required. |
| `title` / `name` | text | The form of the name the member agreed to. |
| `role` | text | Default `Student, Department of Bengali`. |
| `batch` | text | Default `Honours Batch 2025–26`. |
| `bio` | text | Written or reviewed by the member. |
| `photo`, `photo_alt` | | Only with consent. |
| `permission_confirmed` | true \| false | **A real profile is displayed only when this is `true`.** Record when and how consent was given in the body. |

### Gallery photographs (`_data/gallery.yml`)

```yaml
items:
  - image: "/assets/uploads/reading-room.jpg"
    alt: "Students seated at a long table in the department reading room."
    caption: "Reading room, afternoon study session"
    lang: "en"                      # optional
    date: 2025-09-14                # optional
    event: "Poetry reading evening" # optional reference
    credit: "Photograph by …"       # optional
```

`alt` is required. If an image conveys no information (pure decoration), still
provide `alt` — a short factual description is always safe.

---

## 4. Worked examples

### A memory in English with a Bengali pull quote

```markdown
---
layout: memory
title: "Library afternoons"
date: 2025-10-02
category: "campus"
author: "Placeholder contributor"
lang: "en"
excerpt: "Ceiling fans, long tables and the last quiet hour before class."
image: "/assets/uploads/library.jpg"
image_alt: "A long reading table by a window, with books left open on it."
caption: "The reading room in the afternoon."
pullquote: "দুপুরের রোদ, পুরনো বই আর ছাদের ফ্যানের শব্দ।"
featured: true
---

The library does not announce itself. Its best hours are the ones nobody
competes for.

A Bengali sentence can sit inside an English entry:

<p lang="bn">প্রথম দিনে কেউ কাউকে চিনত না, তবু ক্লাসের শেষে সবাই একসঙ্গে চা খেতে গিয়েছিল।</p>
```

### A memory written entirely in Bengali

```markdown
---
layout: memory
title: "ভাষার ক্লাস, প্রথম দিন"
date: 2025-09-10
category: "reflection"
lang: "bn"
excerpt: "প্রথম ক্লাসের অনুভূতি।"
---

বাংলা বিভাগে ঢুকে প্রথম যে জিনিসটা বোঝা যায়, সেটা ভাষা নয় — সময়।
```

Set `lang: "bn"` and the whole page uses Bengali typography, including the
heading, the caption and the excerpt.

### An event with a photo gallery

```markdown
---
layout: event
title: "Poetry reading evening"
date: 2025-11-14
time: "4:30 PM"
location: "College auditorium"
category: "cultural"
description: "An evening of recitation and original poetry."
image: "/assets/uploads/reading-evening.jpg"
image_alt: "A lectern on a small stage under warm stage lighting."
gallery:
  - image: "/assets/uploads/reading-01.jpg"
    alt: "A student reading from a notebook at the lectern."
    caption: "Opening recitation"
  - image: "/assets/uploads/reading-02.jpg"
    alt: "The audience seated in rows, listening."
    caption: "Audience"
---

The programme usually ends with open-floor readings.
```

### A public-domain quotation

```markdown
---
quote: "আকাশ ভরা সূর্য তারা, বিশ্বভরা প্রাণ।"
author: "রবীন্দ্রনাথ ঠাকুর (Rabindranath Tagore)"
source: "Song lyric"
lang: "bn"
category: "public-domain"
translation: "“The sky is full of sun and stars, the world is full of life.” English rendering prepared for this archive."
rights_note: "Public domain: the author died in 1941."
---
```

---

## 5. Entries that are not real content

Placeholders must be **visibly** labelled:

```yaml
sample: true
```

This renders a “Sample content” badge on the card or entry and marks it in the
archive counts and in search results. Use it for every file whose name starts
with `example-` and for the placeholder artwork in `_data/gallery.yml`.

### Removing the samples when real content arrives

1. Delete the `example-` files from `_memories/`, `_events/`, `_timeline/` and
   `_people/`.
2. Replace the entries in `_data/gallery.yml` with real photographs (or empty the
   `items:` list) and update its `notice:` text.
3. Set `sample_content: false` in `_config.yml` to remove the sample notices from
   the home page and archives.
4. Optionally update `disclaimer` in `_config.yml` if the wording needs to change.
5. Commit. The counts, filters, search index and sitemap update themselves.

---

## 6. Content rules that the review process enforces

| Rule | Why |
| --- | --- |
| No phone numbers, addresses, roll numbers, examination results, medical or financial details | Personal data with no editorial value in a public archive |
| No content about a named person who has not agreed | Publication is not neutral for the person concerned |
| No photographs without consent from everyone identifiable | Personal data; see the privacy guidance |
| No material copied from social media without permission | Copyright and privacy |
| No unsourced quotations | Misattribution damages the archive's credibility permanently |
| Approximate dates marked as approximate | Readers should be able to trust precision |
| No private conversations reproduced | Consent cannot be assumed from participation |

---

## 7. Links and formatting inside content

Use Liquid for internal links so they keep working under the GitHub Pages
project path:

```markdown
[Browse the memory archive]({{ '/memories/' | relative_url }})
```

Bengali text always carries a language attribute:

```html
<p lang="bn">এটি একটি অনুচ্ছেদ।</p>
```

Markdown allows: headings, **bold**, *italic*, lists, tables, block quotes
(`>`), horizontal rules (`---`), and inline HTML when a language attribute is
needed.

---

## 8. Before you commit: a five-point checklist

- [ ] The file starts and ends its front matter with `---`, and the YAML parses.
- [ ] `title`, `date` and `category` are correct; dates are `YYYY-MM-DD`.
- [ ] Every image has `image_alt` (and every gallery item has `alt`).
- [ ] Nothing personal, private or unverified has been included.
- [ ] Placeholders are marked `sample: true`; real content is not.

Then: `git add`, `git commit`, `git push origin main`. GitHub Pages rebuilds, and
the CI build check tells you within a minute if something is wrong.
