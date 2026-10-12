/* ==========================================================================
   Site search — static JSON index, no server, no dependencies.
   --------------------------------------------------------------------------
   The index is generated at build time by /search.json, which contains only
   published entries (Jekyll never writes `published: false` documents, and the
   generator itself skips them explicitly).

   Implementation notes:
   * Unicode-safe: text is normalised with NFC and lower-cased; Latin
     diacritics are additionally folded so that "Rabindranath" also matches
     "Rabīndranāth".
   * Bengali queries match on Bengali substrings. There is no Bengali
     stemming, inflection handling or spelling variation support — see
     QA_REPORT.md for this documented limitation.
   * All terms in a multi-word query must match somewhere in the entry.
   ========================================================================== */
(function () {
  "use strict";

  var TYPE_LABELS = {
    memory: "Memory",
    event: "Event",
    quote: "Quotation",
    timeline: "Our Journey",
    person: "Batch member",
    page: "Page"
  };

  var app = document.querySelector("[data-search-app]");
  if (!app) {
    return;
  }

  var form = app.querySelector("[data-search-form]");
  var input = app.querySelector("[data-search-input]");
  var resultsList = app.querySelector("[data-search-results]");
  var statusEl = app.querySelector("[data-search-status]");
  var indexUrl = app.getAttribute("data-search-index");
  var emptyEl = app.querySelector("[data-search-empty]");
  var index = null;
  var indexPromise = null;

  function normalise(value) {
    if (!value) {
      return "";
    }
    var text = String(value).normalize ? String(value).normalize("NFC") : String(value);
    text = text.toLowerCase();
    // Fold Latin diacritics without touching Bengali code points.
    try {
      text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC");
    } catch (error) {
      /* older engines: keep the un-folded string */
    }
    return text;
  }

  /* Folded text is only used for matching when folding did not change the
     string length, so that match offsets always line up with the rendered
     text. Otherwise a plain lower-cased copy is used. */
  function matchable(value) {
    var folded = normalise(value);
    return folded.length === String(value).length ? folded : String(value).toLowerCase();
  }

  function loadIndex() {
    if (indexPromise) {
      return indexPromise;
    }
    indexPromise = fetch(indexUrl, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Search index could not be loaded (" + response.status + ").");
        }
        return response.json();
      })
      .then(function (data) {
        index = Array.isArray(data) ? data : [];
        return index;
      });
    return indexPromise;
  }

  function scoreEntry(entry, terms) {
    var title = normalise(entry.title);
    var body = normalise(entry.text);
    var category = normalise(entry.category);
    var type = normalise(TYPE_LABELS[entry.type] || entry.type);
    var score = 0;

    for (var i = 0; i < terms.length; i += 1) {
      var term = terms[i];
      var termScore = 0;
      if (title.indexOf(term) !== -1) {
        termScore += 6;
      }
      if (category.indexOf(term) !== -1) {
        termScore += 3;
      }
      if (type.indexOf(term) !== -1) {
        termScore += 2;
      }
      if (body.indexOf(term) !== -1) {
        termScore += 1;
      }
      if (termScore === 0) {
        return 0;
      }
      score += termScore;
    }
    return score;
  }

  function buildSnippet(text, terms) {
    var plain = String(text || "").replace(/\s+/g, " ").trim();
    if (!plain) {
      return "";
    }
    var normalised = matchable(plain);
    var position = -1;
    for (var i = 0; i < terms.length && position === -1; i += 1) {
      position = normalised.indexOf(terms[i]);
    }
    if (position === -1) {
      position = 0;
    }
    var start = Math.max(0, position - 90);
    var snippet = plain.slice(start, start + 220);
    if (start > 0) {
      snippet = "…" + snippet;
    }
    if (start + 220 < plain.length) {
      snippet += "…";
    }
    return snippet;
  }

  function highlight(text, terms) {
    var fragment = document.createDocumentFragment();
    var remaining = String(text || "");
    var lowered = matchable(remaining);

    while (remaining.length) {
      var bestIndex = -1;
      var bestTerm = "";
      for (var i = 0; i < terms.length; i += 1) {
        var found = lowered.indexOf(terms[i]);
        if (found !== -1 && (bestIndex === -1 || found < bestIndex)) {
          bestIndex = found;
          bestTerm = terms[i];
        }
      }
      if (bestIndex === -1) {
        fragment.appendChild(document.createTextNode(remaining));
        break;
      }
      if (bestIndex > 0) {
        fragment.appendChild(document.createTextNode(remaining.slice(0, bestIndex)));
      }
      var mark = document.createElement("mark");
      mark.textContent = remaining.slice(bestIndex, bestIndex + bestTerm.length);
      fragment.appendChild(mark);
      remaining = remaining.slice(bestIndex + bestTerm.length);
      lowered = matchable(remaining);
    }
    return fragment;
  }

  function renderResults(entries, terms, query) {
    resultsList.textContent = "";
    var count = entries.length;

    statusEl.textContent = count === 0
      ? "No results for “" + query + "”."
      : count + (count === 1 ? " result" : " results") + " for “" + query + "”.";

    if (emptyEl) {
      emptyEl.hidden = count !== 0;
    }

    entries.slice(0, 40).forEach(function (entry) {
      var item = document.createElement("li");
      item.className = "search-result";

      var type = document.createElement("span");
      type.className = "search-result__type";
      type.textContent = TYPE_LABELS[entry.type] || entry.type;
      item.appendChild(type);

      var heading = document.createElement("h3");
      heading.className = "search-result__title";
      var link = document.createElement("a");
      link.href = entry.url;
      link.appendChild(highlight(entry.title, terms));
      if (entry.lang === "bn") {
        link.setAttribute("lang", "bn");
      }
      heading.appendChild(link);
      item.appendChild(heading);

      var snippet = document.createElement("p");
      snippet.className = "search-result__snippet";
      snippet.appendChild(highlight(buildSnippet(entry.text, terms), terms));
      item.appendChild(snippet);

      var meta = document.createElement("p");
      meta.className = "search-result__meta";
      if (entry.date) {
        var time = document.createElement("time");
        time.dateTime = entry.date;
        time.textContent = entry.date;
        meta.appendChild(time);
      }
      if (entry.sample) {
        var sample = document.createElement("span");
        sample.className = "badge badge--sample";
        sample.textContent = "Sample content";
        meta.appendChild(sample);
      }
      if (entry.url) {
        var url = document.createElement("span");
        url.className = "search-result__path";
        url.textContent = entry.url;
        meta.appendChild(url);
      }
      item.appendChild(meta);

      resultsList.appendChild(item);
    });
  }

  function runSearch(query, updateUrl) {
    var trimmed = String(query || "").trim();
    if (!trimmed) {
      statusEl.textContent = "Enter a word or phrase to search the archive.";
      resultsList.textContent = "";
      if (emptyEl) {
        emptyEl.hidden = true;
      }
      return;
    }

    var terms = normalise(trimmed).split(/\s+/).filter(Boolean);
    statusEl.textContent = "Searching…";

    loadIndex()
      .then(function (entries) {
        var scored = entries
          .map(function (entry) {
            return { entry: entry, score: scoreEntry(entry, terms) };
          })
          .filter(function (row) {
            return row.score > 0;
          })
          .sort(function (a, b) {
            if (b.score !== a.score) {
              return b.score - a.score;
            }
            return String(b.entry.date || "").localeCompare(String(a.entry.date || ""));
          })
          .map(function (row) {
            return row.entry;
          });

        renderResults(scored, terms, trimmed);

        if (updateUrl && window.history && window.history.pushState) {
          var url = new URL(window.location.href);
          url.searchParams.set("q", trimmed);
          window.history.pushState({ q: trimmed }, "", url);
        }
      })
      .catch(function (error) {
        statusEl.textContent = "Search is unavailable: " + error.message +
          " If you opened this page from a local file, open the published site instead.";
      });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    runSearch(input.value, true);
  });

  window.addEventListener("popstate", function () {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    input.value = query;
    runSearch(query, false);
  });

  var initial = new URLSearchParams(window.location.search).get("q");
  if (initial) {
    input.value = initial;
    runSearch(initial, false);
  } else {
    statusEl.textContent = "Enter a word or phrase to search the archive.";
  }
})();
