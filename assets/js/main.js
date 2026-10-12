/* ==========================================================================
   Islamia Government College | Department of Bengali
   Digital Memory Archive — site behaviour
   --------------------------------------------------------------------------
   Vanilla JavaScript, no dependencies. Everything here is progressive
   enhancement: navigation, filtering and the gallery all work without it.

   1. Mobile navigation (accessible disclosure pattern with focus handling)
   2. Sticky header shadow
   3. Archive filters (Memories, Events, Batch Members)
   4. Accessible gallery lightbox (keyboard, focus, Escape)
   ========================================================================== */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     1. Mobile navigation
     ---------------------------------------------------------------------- */
  function initNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) {
      return;
    }

    var label = toggle.querySelector("[data-nav-toggle-label]");
    var lastFocused = null;

    function isOpen() {
      return nav.classList.contains("is-open");
    }

    function openNav() {
      lastFocused = document.activeElement;
      nav.classList.add("is-open");
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      if (label) {
        label.textContent = "Close";
      }
      var firstLink = nav.querySelector("a, button");
      if (firstLink) {
        firstLink.focus();
      }
    }

    function closeNav(returnFocus) {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      if (label) {
        label.textContent = "Menu";
      }
      if (returnFocus) {
        if (lastFocused && typeof lastFocused.focus === "function") {
          lastFocused.focus();
        } else {
          toggle.focus();
        }
      }
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        closeNav(true);
      } else {
        openNav();
      }
    });

    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        closeNav(true);
        return;
      }
      if (event.key !== "Tab" || !isOpen()) {
        return;
      }
      var focusables = nav.querySelectorAll("a[href], button:not([disabled])");
      if (!focusables.length) {
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!isOpen()) {
        return;
      }
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        closeNav(false);
      }
    });

    var desktop = window.matchMedia("(min-width: 64rem)");
    var onBreakpoint = function (event) {
      if (event.matches && isOpen()) {
        closeNav(false);
      }
    };
    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", onBreakpoint);
    } else if (typeof desktop.addListener === "function") {
      desktop.addListener(onBreakpoint);
    }
  }

  /* ----------------------------------------------------------------------
     2. Sticky header shadow
     ---------------------------------------------------------------------- */
  function initHeaderShadow() {
    var header = document.querySelector("[data-site-header]");
    if (!header) {
      return;
    }
    var update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ----------------------------------------------------------------------
     3. Archive filters
     ---------------------------------------------------------------------- */
  function initFilters() {
    var filterBlocks = document.querySelectorAll("[data-filters]");
    if (!filterBlocks.length) {
      return;
    }

    Array.prototype.forEach.call(filterBlocks, function (block) {
      var scope = block.closest("section") || document;
      var items = scope.querySelectorAll("[data-filter-item]");
      var status = block.querySelector("[data-filter-status]");
      var empty = scope.querySelector("[data-filter-empty]");
      var state = { category: "all", status: "all", language: "all" };

      function matches(item) {
        if (state.category !== "all" && item.getAttribute("data-cat") !== state.category) {
          return false;
        }
        if (state.status !== "all" && item.getAttribute("data-status") !== state.status) {
          return false;
        }
        if (state.language !== "all" && item.getAttribute("data-lang") !== state.language) {
          return false;
        }
        return true;
      }

      function apply() {
        var shown = 0;
        Array.prototype.forEach.call(items, function (item) {
          var visible = matches(item);
          item.hidden = !visible;
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
        if (status) {
          status.textContent = shown === 0
            ? "No entries match the selected filters."
            : shown + (shown === 1 ? " entry shown." : " entries shown.");
        }
      }

      block.addEventListener("click", function (event) {
        var button = event.target.closest("[data-filter-group]");
        if (!button || !block.contains(button)) {
          return;
        }
        var group = button.getAttribute("data-filter-group");
        var value = button.getAttribute("data-filter-value");
        var peers = block.querySelectorAll('[data-filter-group="' + group + '"]');
        Array.prototype.forEach.call(peers, function (peer) {
          var active = peer === button;
          peer.classList.toggle("is-active", active);
          peer.setAttribute("aria-pressed", active ? "true" : "false");
        });
        var key = group === "language" ? "language" : group;
        state[key] = value;
        apply();
      });

      apply();
    });
  }

  /* ----------------------------------------------------------------------
     4. Gallery lightbox
     ---------------------------------------------------------------------- */
  function initLightbox() {
    var root = document.querySelector("[data-lightbox-root]");
    var triggers = document.querySelectorAll("[data-lightbox]");
    if (!root || !triggers.length) {
      return;
    }

    var image = root.querySelector("[data-lightbox-image]");
    var caption = root.querySelector("[data-lightbox-caption]");
    var counter = root.querySelector("[data-lightbox-counter]");
    var closeButtons = root.querySelectorAll("[data-lightbox-close]");
    var prevButton = root.querySelector("[data-lightbox-prev]");
    var nextButton = root.querySelector("[data-lightbox-next]");
    var lastFocused = null;
    var group = [];
    var index = 0;

    function render() {
      var trigger = group[index];
      if (!trigger) {
        return;
      }
      var src = trigger.getAttribute("data-lightbox-src") || trigger.getAttribute("href");
      image.setAttribute("src", src);
      image.setAttribute("alt", trigger.getAttribute("data-lightbox-alt") || "");
      var text = trigger.getAttribute("data-lightbox-caption") || "";
      caption.textContent = text;
      caption.hidden = text === "";
      counter.textContent = "Image " + (index + 1) + " of " + group.length +
        (text ? " — " + text : "");
    }

    function open(trigger) {
      var gallery = trigger.closest("[data-gallery]") || document;
      group = Array.prototype.slice.call(gallery.querySelectorAll("[data-lightbox]"));
      index = Math.max(0, group.indexOf(trigger));
      lastFocused = document.activeElement;
      render();
      root.hidden = false;
      document.body.style.overflow = "hidden";
      var close = root.querySelector("[data-lightbox-close]");
      if (close) {
        close.focus();
      }
    }

    function close() {
      root.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    function step(direction) {
      if (!group.length) {
        return;
      }
      index = (index + direction + group.length) % group.length;
      render();
      if (!reducedMotion) {
        image.animate(
          [{ opacity: 0.35 }, { opacity: 1 }],
          { duration: 180, easing: "ease-out" }
        );
      }
    }

    Array.prototype.forEach.call(triggers, function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        open(trigger);
      });
    });

    Array.prototype.forEach.call(closeButtons, function (button) {
      button.addEventListener("click", close);
    });

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        step(-1);
      });
    }
    if (nextButton) {
      nextButton.addEventListener("click", function () {
        step(1);
      });
    }

    root.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      } else if (event.key === "Tab") {
        var focusables = root.querySelectorAll("button:not([disabled])");
        if (!focusables.length) {
          return;
        }
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  function init() {
    initNavigation();
    initHeaderShadow();
    initFilters();
    initLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
