/* EDM Holdings — autosave and recovery for the site tools.
 *
 * Why this exists: every one of these tools held the whole day's work in memory
 * and wrote nothing anywhere until someone pressed Save. On a phone in a site
 * cabin — which is exactly how the Daybook is meant to be used — a background
 * tab can be discarded at any moment to reclaim memory. A phone call was enough
 * to lose a day of logged instructions, with no prompt and nothing to recover.
 *
 * What it does:
 *   - writes the tool's state to this browser after every change, debounced
 *   - offers to restore it when the tool is reopened
 *   - warns before closing if work has not been exported to a file
 *   - says plainly when the browser is too full to autosave, rather than
 *     failing silently
 *
 * What it is not: a backup. The file a tool exports is still the record that
 * leaves the phone. This only stops the walk-away losses.
 *
 * Usage — one line, after the tool's state object exists:
 *     EDMAutosave.attach({ key: 'daybook', state: S, onRestore: render });
 */
(function (global) {
  'use strict';

  var PREFIX = 'edm.autosave.';
  var DEBOUNCE_MS = 800;

  function ts() { return new Date().toISOString(); }
  function pretty(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
             ' at ' + d.toTimeString().slice(0, 5);
    } catch (e) { return iso; }
  }

  function chip() {
    var el = document.getElementById('edm-autosave-chip');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'edm-autosave-chip';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.style.cssText = [
      'position:fixed', 'left:14px', 'bottom:14px', 'z-index:9999',
      'font-family:Montserrat,system-ui,sans-serif', 'font-size:11px',
      'font-weight:600', 'letter-spacing:.06em', 'text-transform:uppercase',
      'padding:7px 12px', 'border-radius:3px', 'border:1px solid #E4E6E0',
      'background:#FFFFFF', 'color:#5C6F66', 'pointer-events:none',
      'opacity:0', 'transition:opacity .25s', 'max-width:60vw'
    ].join(';');
    document.body.appendChild(el);
    return el;
  }

  function say(msg, tone) {
    var el = chip();
    el.textContent = msg;
    el.style.color = tone === 'warn' ? '#083819' : '#5C6F66';
    el.style.borderColor = tone === 'warn' ? '#083819' : '#E4E6E0';
    el.style.opacity = '1';
    clearTimeout(el._h);
    if (tone !== 'warn') el._h = setTimeout(function () { el.style.opacity = '0'; }, 2200);
  }

  var Autosave = {
    attach: function (opts) {
      var key = PREFIX + opts.key;
      var state = opts.state;
      var onRestore = opts.onRestore || function () {};
      var dirty = false;      // changed since the last export to file
      var timer = null;
      var quotaWarned = false;

      function snapshot() {
        try {
          return JSON.stringify({ savedAt: ts(), state: state });
        } catch (e) { return null; }
      }

      function write() {
        var body = snapshot();
        if (body === null) return;
        try {
          localStorage.setItem(key, body);
          say('Saved ' + new Date().toTimeString().slice(0, 5));
          quotaWarned = false;
        } catch (e) {
          // Almost always the 5MB quota, which photographs reach quickly.
          if (!quotaWarned) {
            quotaWarned = true;
            say('Too large to autosave — use Save to keep this', 'warn');
          }
        }
      }

      function schedule() {
        dirty = true;
        clearTimeout(timer);
        timer = setTimeout(write, DEBOUNCE_MS);
      }

      // Offer whatever was left behind last time.
      try {
        var raw = localStorage.getItem(key);
        if (raw) {
          var saved = JSON.parse(raw);
          var when = pretty(saved.savedAt);
          if (global.confirm(
                'Unsaved work from ' + when + ' was found on this device.\n\n' +
                'OK to restore it. Cancel to start fresh and discard it.')) {
            Object.keys(state).forEach(function (k) { delete state[k]; });
            Object.keys(saved.state).forEach(function (k) { state[k] = saved.state[k]; });
            onRestore();
            say('Restored from ' + when);
          } else {
            localStorage.removeItem(key);
          }
        }
      } catch (e) { /* corrupt or unavailable storage: carry on with a clean start */ }

      ['input', 'change', 'click'].forEach(function (evt) {
        document.addEventListener(evt, schedule, true);
      });

      // Leaving with work that has never been exported.
      global.addEventListener('beforeunload', function (e) {
        if (!dirty) return;
        e.preventDefault();
        e.returnValue = '';   // browsers show their own wording
        return '';
      });

      // Write immediately when the tab is backgrounded — on mobile this is
      // often the last moment before the page is discarded.
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') { clearTimeout(timer); write(); }
      });

      return {
        // Call after a successful export: the file is now the record.
        exported: function () { dirty = false; try { localStorage.removeItem(key); } catch (e) {} say('Saved to file'); },
        save: write,
        clear: function () { try { localStorage.removeItem(key); } catch (e) {} dirty = false; }
      };
    }
  };

  global.EDMAutosave = Autosave;
})(window);
