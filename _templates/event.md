---
# ---------------------------------------------------------------------------
# TEMPLATE — copy this file into _events/, rename it, and fill it in.
# Filename becomes the URL:  _events/annual-programme.md -> /events/annual-programme/
# Add the event only once its date and venue are confirmed.
# ---------------------------------------------------------------------------
layout: event
title: "Event title"
date: 2026-01-01              # required: used for the Upcoming / Past label
time: "10:00 AM"              # optional
end_date: 2026-01-01          # optional, for multi-day programmes
location: "Confirmed venue"
category: "academic"          # academic | cultural | departmental | community
organiser: "Department of Bengali"     # optional
lang: "en"                    # "en" or "bn"
description: >-
  One or two sentences describing the programme. Shown on the card and used as
  the page's meta description.
image: "/assets/uploads/event-cover.jpg"       # optional cover image
image_alt: "What the cover image shows"
caption: "Caption shown under the cover image"
featured: false               # true puts the event on the home page
sample: false                 # true marks it as an illustrative placeholder
published: true               # false keeps the event out of the built website
gallery:                      # optional photographs from the event
  - image: "/assets/uploads/event-01.jpg"
    alt: "What this photograph shows"
    caption: "Caption for this photograph"
---

Describe the programme here: what it was for, what happened, who took part.

Link to a related memory like this:

[Read a memory from this event]({{ '/memories/' | relative_url }})

<p class="notice"><strong>Consent:</strong> publish a photograph only when
everyone identifiable in it has agreed. See PRIVACY_AND_CONSENT.md.</p>
