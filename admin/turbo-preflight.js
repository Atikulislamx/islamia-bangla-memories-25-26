/* ==========================================================================
   Decap CMS pre-flight for the Decap Turbo backend.
   --------------------------------------------------------------------------
   Why this file exists
   The `turbo-github` backend reads its repository, branch and Supabase project
   from the Decap Turbo control plane, keyed on `turbo_site_id` in
   admin/config.yml. When the control plane has no repository connected for that
   site id, the GitHub code path raises:

       The GitHub backend needs a "repo" in the backend configuration.

   That message does not tell the maintainer which of the six links in the chain
   is broken, so this script checks the control-plane response for the live site
   id and, when the repository is missing, replaces the cryptic failure with the
   exact dashboard steps required.

   It never sends credentials, never reads tokens and never stores anything: it
   performs one unauthenticated GET against the same public endpoint the CMS
   itself calls, then reports what it found.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TurboPreflight = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var ENDPOINT = "https://sb.decapcms.org/functions/v1/config";

  /**
   * Inspect a Turbo control-plane configuration object.
   * @param {object|null} payload parsed JSON from the control-plane endpoint
   * @param {string} fallbackRepo repository declared in admin/config.yml
   */
  function inspect(payload, fallbackRepo) {
    if (!payload || typeof payload !== "object") {
      return {
        ok: false,
        status: "unreachable",
        repo: null,
        message:
          "The Decap Turbo control plane could not be read, so the CMS setup " +
          "cannot be verified from this browser. Check the network connection " +
          "and see CMS_SETUP.md."
      };
    }
    var repo = payload.repo || null;
    if (repo) {
      return {
        ok: true,
        status: "repo-configured",
        repo: repo,
        branch: payload.branch || null,
        message:
          "Turbo reports the repository " + repo + " for this site id. " +
          "Authentication still has to succeed before anything can be published."
      };
    }
    return {
      ok: false,
      status: "repo-missing",
      repo: fallbackRepo || null,
      branch: payload.branch || null,
      message:
        "Decap Turbo has no GitHub repository connected for this site id, so " +
        "the CMS backend cannot start (that is the source of the “The GitHub " +
        "backend needs a \"repo\" error”). Connect the GitHub account in the " +
        "Turbo dashboard and set the repository on the site row."
    };
  }

  function fetchTurboConfig(siteId, fetchImpl) {
    var doFetch = fetchImpl || (typeof fetch === "function" ? fetch : null);
    if (!doFetch) {
      return Promise.resolve(null);
    }
    return doFetch(ENDPOINT + "?site_id=" + encodeURIComponent(siteId), {
      method: "GET",
      credentials: "omit",
      mode: "cors"
    })
      .then(function (response) {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .catch(function () {
        return null;
      });
  }

  function renderNotice(element, result) {
    if (!element || result.ok) {
      return;
    }
    var repo = result.repo ? "“" + result.repo + "”" : "the repository in admin/config.yml";
    var steps = [
      "Open the Decap Turbo dashboard and sign in as the owner of this site.",
      "In the GitHub connection settings, authorise the Atikulislamx account.",
      "On this site’s row, set the repository to Atikulislamx/islamia-bangla-memories-25-26 (branch main) so the control plane returns it.",
      "Reload /admin/ and sign in with “Login with Turbo”. Only an account with access to this Turbo site can publish.",
      "See CMS_SETUP.md in the repository for the full walkthrough and for what is still unverified."
    ];
    element.innerHTML = "";
    var box = document.createElement("div");
    box.className = "turbo-preflight__box";
    var heading = document.createElement("h2");
    heading.textContent = "CMS setup incomplete — repository not connected in Decap Turbo";
    var paragraph = document.createElement("p");
    paragraph.textContent = result.message +
      " Until it is completed with " + repo + ", the admin panel cannot load content or save changes.";
    var list = document.createElement("ol");
    steps.forEach(function (step) {
      var item = document.createElement("li");
      item.textContent = step;
      list.appendChild(item);
    });
    var note = document.createElement("p");
    note.className = "turbo-preflight__note";
    note.textContent =
      "This notice is generated from the public Turbo configuration endpoint " +
      "(site id " + (result.siteId || "from admin/config.yml") + ") and is only " +
      "shown while the repository is missing. No credentials are used or stored.";
    box.appendChild(heading);
    box.appendChild(paragraph);
    box.appendChild(list);
    box.appendChild(note);
    element.appendChild(box);
    element.hidden = false;
  }

  function init(options) {
    var config = options || {};
    var notice = document.getElementById("cms-preflight-notice");
    var siteId = config.siteId;
    if (!siteId) {
      return Promise.resolve(null);
    }
    return fetchTurboConfig(siteId, config.fetch)
      .then(function (payload) {
        var result = inspect(payload, config.fallbackRepo);
        result.siteId = siteId;
        if (notice) {
          renderNotice(notice, result);
        }
        return result;
      });
  }

  return {
    ENDPOINT: ENDPOINT,
    inspect: inspect,
    fetchTurboConfig: fetchTurboConfig,
    renderNotice: renderNotice,
    init: init
  };
});
