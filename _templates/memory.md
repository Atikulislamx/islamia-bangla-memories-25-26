---
# ---------------------------------------------------------------------------
# TEMPLATE — copy this file into _memories/, rename it, and fill it in.
# Files inside _templates/ are never published by the website.
# Filename becomes the URL:  _memories/my-memory.md -> /memories/my-memory/
# ---------------------------------------------------------------------------
layout: memory
title: "Your memory title"
date: 2026-01-01              # optional but recommended (YYYY-MM-DD)
category: "classroom"         # classroom | campus | literary | friendship | department | reflection
author: "Your name, or leave this line out to stay anonymous"
lang: "en"                    # "en" or "bn" — the language the entry is written in
excerpt: >-
  One or two sentences for the archive grid. Leave the line out to let the site
  generate an excerpt from the first sentences of the body.
image: "/assets/uploads/your-photograph.jpg"   # optional
image_alt: "What the photograph shows, for screen readers"
caption: "Caption shown under the photograph"
featured: false               # true puts the entry on the home page
sample: false                 # true marks it as an illustrative placeholder
published: true               # false keeps the entry out of the built website
related_event: "event-slug"   # optional: filename of an _events/ file
tags:
  - "classroom"
---

Write the memory here. Markdown is supported: **bold**, *italic*, lists,
headings, tables and block quotes.

Links between pages must use Liquid so that they keep working on GitHub Pages:

[Browse the memory archive]({{ '/memories/' | relative_url }})

Bengali sentences inside an English entry can be wrapped so that they get
Bengali typography:

<p lang="bn">বাংলায় লেখা একটি বাক্য।</p>

<p class="notice"><strong>Note:</strong> never include phone numbers, addresses,
roll numbers, examination results or private conversations. See
PRIVACY_AND_CONSENT.md.</p>
