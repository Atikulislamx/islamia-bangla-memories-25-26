# Privacy and Consent Guidance

Internal guidance for everyone who adds content to this archive. The public-facing
version of the policy is the [Privacy Policy page](/privacy/); this document is
for contributors and maintainers, and is more direct about the risks.

> **The one-line summary:** this archive lives in a public GitHub repository.
> Anything committed can be read by anyone, including deleted content in the Git
> history. Decisions about what to publish must be made on that basis.

---

## 1. The public repository is the real boundary

| Where | Public? |
| --- | --- |
| Content files in `_memories/`, `_events/`, `_quotes/`, `_timeline/`, `_people/` | **Yes** — readable by anyone with the repository URL |
| Images in `assets/uploads/` | **Yes** |
| The Git history | **Yes** — including files later “deleted” |
| The built website | **Yes** |
| Documents with `published: false` | **Yes** in the repository; excluded from the website build only |
| Anything not committed | No — and that is the only reliable privacy control |

Practical consequences:

- **`published: false` is not privacy.** It stops Jekyll from generating a page;
  it does not hide the file. Never use it to park sensitive material.
- **Deleting a file is not deletion.** The commit that removed it remains, and
  forks, clones and caches may already hold a copy.
- **Search engines may have already indexed it.** Removal from this website and
  a removal request to Google/Bing are the two levers available, and neither is
  instantaneous or guaranteed.
- **Fork risk.** A public repository can be forked; the maintainer has no control
  over forks.

If a contributor wants to share something private — a personal difficulty, a
family matter, a dispute — the answer is not a private branch. It is “this is not
the right place for it”.

---

## 2. Photographs: consent rules

A photograph of an identifiable person is personal data about that person.

**Before publishing a photograph, all of these must be true:**

1. **Everyone identifiable has agreed** to appear on a public website. Not “they
   probably won't mind” — agreed.
2. **The contributor has the right to share the image.** A photograph that was
   sent in a group chat is not automatically shareable, and a photograph taken
   from someone else's social media account almost never is.
3. **The caption is accurate.** Venue, occasion and date must be right. A
   mislabelled photograph is a small lie that spreads.
4. **Minors are covered.** A student under 18 needs a parent or guardian's
   agreement.
5. **Nothing sensitive is visible** — identity documents, noticeboards with
   results, medical or disciplinary paperwork, registration plates tied to a
   person, whiteboards with private notes.

**Options that solve most cases:**

- Crop or blur the person who has not agreed, rather than discarding the image.
- Publish the group photograph only after asking everyone in it.
- Replace the image with a text-only entry — the memory survives without a
  photograph.
- Publish the photograph inside an event page without naming individuals, which
  still requires consent, because consent is about appearing, not about being
  named.

**Special care:**

- **Accidents, illness, grief, protests, disciplinary events** — do not publish
  even with consent if the image could expose or humiliate someone later, in a
  different job or a different country. Ask whether the person would agree in
  five years, not today.
- **Cultural and religious sensitivities** — ask before publishing photographs
  of prayer, ritual or family gatherings.
- **Group photographs of the whole batch** — consent is still required from
  identifiable people, but a distant shot where faces are not distinguishable is
  less risky. When in doubt, scale down or blur.

---

## 3. Member profiles

Profiles are **entirely optional**, and the archive is designed so that a batch
member who prefers not to appear simply is not listed — with no comment, no
“declined” label and no gap that reads as an absence.

**Publication requires `permission_confirmed: true` in the profile file.** Without
it the profile is not rendered anywhere on the website, is not included in search
results and is not listed in the sitemap. (This is a display rule, not a privacy
guarantee: if the file has been committed, it is still public.)

**Recording consent.** Note in the body text:

- who agreed (full name),
- what exactly they agreed to — name only, name plus biography, or name plus
  photograph,
- when and how they agreed (date, and whether in person, by message or in
  writing),
- anything they asked to exclude.

**Consent is revocable and can be partial.** “Name yes, photograph no”, “bio yes
but edit this sentence”, “remove it next year” are all valid. Record the limits
and honour them.

**Never** create a profile for someone who has not been asked, even as a
placeholder, and never use `sample: true` for a real person's profile — the
sample badge is for structural placeholders only.

---

## 4. Children and dependants

Do not publish photographs or personal details of children who are not batch
members (relatives, neighbours, pupils at a school) without a parent or
guardian's agreement. This includes photographs where a child is incidental to
the composition.

---

## 5. Text content: consent and care

- **Mentioning others.** Writing about a named classmate, teacher or official
  requires their agreement when the content is personal or evaluative. A neutral
  factual mention (a programme ran, a class happened) does not.
- **Teachers and staff.** The archive does not publish criticism of named
  individuals, even accurate criticism. A student archive is not a review site.
- **Personal information.** Never publish phone numbers, home addresses, email
  addresses, student or national identification numbers, dates of birth,
  examination results, attendance, medical information or financial details.
- **Private conversations.** Messages, personal notes and screenshots are not
  publishable, even with the sender's consent, if they reveal a third person
  who has not agreed.
- **Quotations.** Only public-domain texts with a named source, or short
  reflections whose author has given permission. Never attribute an unverified
  quotation to a real writer, teacher or student.

---

## 6. Corrections and removal requests

Anyone may ask for content about themselves to be corrected or removed.

**How a request arrives:** through the batch's agreed channel, through an issue
in the repository, or directly to the maintainer. **A request about your own
information needs no justification**, and no discussion of the request will be
published.

**How to handle a request (maintainer):**

1. **Acknowledge** as soon as possible — a day or two, not weeks.
2. **Act first, discuss later** for anything involving personal safety,
   harassment, exposure of private information, or a photograph of a minor.
   Remove or unpublish the content, then consider the details.
3. **Remove, don't hide.** Delete the file and commit (so the current version of
   the site cannot serve it), *and* state plainly that the Git history still
   contains it. If the material is sensitive, GitHub Support can be asked to
   purge history for the repository, and a request can be filed with Google and
   Bing for removal from search results.
4. **Correct factual errors** by editing the entry — and, where the error was
   substantive, add a note in the commit message so the reason is recorded.
5. **Never argue in public.** Do not publish the request, the requester's name or
   the reasoning.
6. **Follow up** once done, and confirm what was removed and what cannot be
   fully removed.

**What cannot be promised:** that content has vanished from the internet. Copies
may exist in search caches, archives, screenshots and forks. Say this plainly at
the time of removal; over-promising is worse than the original mistake.

---

## 7. Contributor checklist

Before sending material:

- [ ] The memory or photograph is mine, or I have permission to share it.
- [ ] Everyone identifiable in the photograph has agreed to appear publicly.
- [ ] No phone numbers, addresses, identity numbers, results or private messages.
- [ ] Nothing about a named person that they would not be comfortable reading in
      five years.
- [ ] I understand that this will be published in a **public repository** and on
      a public website, and that complete removal cannot be guaranteed afterwards.
- [ ] If unsure about anything, I will ask before sending, not after.

Before publishing material (maintainer):

- [ ] Consent recorded, in the form the contributor or member agreed to.
- [ ] Captions and dates checked against what was supplied.
- [ ] Quotations traceable to a real source.
- [ ] Photographs reviewed for sensitive background detail.
- [ ] Placeholders marked `sample: true`; nothing real marked as a sample.
- [ ] No credentials, tokens or private data anywhere in the commit.
