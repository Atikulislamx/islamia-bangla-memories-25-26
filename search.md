---
layout: page
title: "Search the Archive"
eyebrow: "Search"
lede: >-
  Search every published memory, event, quotation, timeline entry and member
  profile. Bengali and English text can both be searched.
permalink: /search/
description: >-
  Search the digital memory archive of the Department of Bengali, Honours Batch
  2025–26: memories, events, quotations, timeline entries and member profiles.
---
<div class="search-panel"
     data-search-app
     data-search-index="{{ '/search.json' | relative_url }}">

  <form class="search-form" data-search-form role="search" action="{{ '/search/' | relative_url }}" method="get">
    <label class="search-form__label" for="search-input">Search terms</label>
    <div class="search-form__row">
      <input class="search-form__input"
             type="search"
             id="search-input"
             name="q"
             data-search-input
             autocomplete="off"
             placeholder="For example: classroom, রবীন্দ্রনাথ, সেমিনার"
             aria-describedby="search-hint">
      <button class="search-form__submit" type="submit">Search</button>
    </div>
    <p class="search-form__hint" id="search-hint">
      Press Enter to search. Searching happens entirely in your browser; the
      results page can be bookmarked or shared.
    </p>
  </form>

  <p class="search-results__status" data-search-status aria-live="polite"></p>

  <ol class="search-results" data-search-results></ol>

  <div class="empty-state" data-search-empty hidden>
    <p class="empty-state__title">No results found</p>
    <p class="empty-state__body">
      Try a shorter word, a different spelling, or browse the archive directly.
      Quotations and Bengali text can be searched in Bengali script.
    </p>
    <p class="empty-state__action">
      <a class="button button--ghost" href="{{ '/memories/' | relative_url }}">Browse Memories</a>
      <a class="button button--ghost" href="{{ '/events/' | relative_url }}">Browse Events</a>
    </p>
  </div>
</div>

## What the search covers

- Memory titles and full text
- Event titles and descriptions
- Quotations and their attributions
- Timeline entries on Our Journey
- Member profiles that have recorded consent
- The main archive and policy pages

## Known limitations

- **No stemming or inflection handling.** A search for “seminar” will not match
  “seminars”, and Bengali inflected forms must be typed the way they appear in
  the text.
- **No spelling correction.** Bengali and English spelling variants are treated
  as different strings.
- **Word order matters for phrases.** Multi-word queries match when every word
  appears somewhere in the entry, not necessarily as a phrase.
- **Unpublished content is excluded.** Entries with `published: false` are never
  written into the search index, and profiles without recorded consent are
  excluded as well.

<script src="{{ '/assets/js/search.js' | relative_url }}" defer></script>
