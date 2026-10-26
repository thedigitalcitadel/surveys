/* Survey page, same model as the live score page: the page does nothing without
   the unguessable code in its link (?s=...), which is printed only on the QR code.
   The repo never holds the code: the config file is named by the first 20 hex
   characters of SHA-256(code), and the code itself is the submission token.
   No cookies, no analytics, no third-party requests except the answer POST. */
(function () {
  'use strict';
  var E = window.SURVEY_ENDPOINT || {};
  var root = document.getElementById('survey');
  if (!root) return;
  var QS = new URLSearchParams(location.search);
  var CODE = QS.get('s') || '';
  var PREVIEW = /REPLACE_/.test(E.url || 'REPLACE_') || QS.get('preview') === '1';

  function el(tag, attrs, nodes) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (attrs[k] === false || attrs[k] == null) continue;
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'cls') n.className = attrs[k];
      else n.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    }
    (nodes || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function notice(title, body) {
    root.textContent = '';
    root.appendChild(el('div', { cls: 'crumb', text: 'Survey' }));
    root.appendChild(el('h1', { text: title }));
    root.appendChild(el('p', { cls: 'lede', text: body }));
  }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }

  if (!/^[a-z0-9]{16,40}$/.test(CODE)) { notice('Survey link needed', 'This link is missing its survey code. Scan the QR code from your session again.'); return; }
  if (!(window.crypto && crypto.subtle)) { notice('Can\u2019t open this survey', 'Please open the link in an up-to-date browser.'); return; }
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(CODE)).then(function (h) {
    var s = document.createElement('script');
    s.src = '/s/' + hex(h).slice(0, 20) + '.js';
    s.onload = function () { if (window.SURVEY) { root.textContent = ''; render(window.SURVEY); } else bad(); };
    s.onerror = bad;
    document.head.appendChild(s);
  }, bad);
  function bad() { notice('Survey link not found', 'This survey link isn\u2019t valid. Check the link or scan the QR code from your session again.'); }

function render(S) {
  var DONE_KEY = 'tdc-survey-done:' + S.id + ':v' + S.version;
  var started = Date.now();

  function store(get, val) {
    try { if (get) return localStorage.getItem(DONE_KEY); if (val) localStorage.setItem(DONE_KEY, '1'); else localStorage.removeItem(DONE_KEY); } catch (e) { return null; }
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16); crypto.getRandomValues(b);
    return Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }

  // ---- header copy ----
  document.title = S.title + ' · Survey · The Digital Citadel';
  var intro = el('div', {}, [
    el('div', { cls: 'crumb', text: S.eyebrow || 'Survey' }),
    el('h1', {}, [S.title, S.subtitle ? el('span', { cls: 'sub', text: S.subtitle }) : null]),
    S.lede ? el('p', { cls: 'lede', text: S.lede }) : null,
    S.meta ? el('p', { cls: 'meta', text: S.meta }) : null,
    PREVIEW ? el('p', { cls: 'preview', role: 'note', text: 'Preview only: answers are not sent anywhere.' }) : null
  ]);
  root.appendChild(intro);

  var now = Date.now();
  var early = S.opensAt && now < Date.parse(S.opensAt);
  var closed = S.open === false || (S.closesAt && now >= Date.parse(S.closesAt));
  if ((early || closed) && !PREVIEW) {
    root.appendChild(el('section', { cls: 'thanks' }, early
      ? [el('h2', { text: 'Not open yet' }), el('p', { text: S.notYetText || 'This survey isn\u2019t open yet.' })]
      : [el('h2', { text: 'This survey is closed' }), el('p', { text: S.closedText || 'Thanks for your interest.' })]));
    return;
  }

  // ---- form ----
  var form = el('form', { novalidate: true, 'aria-describedby': 'survey-meta' });
  var refs = {};
  S.fields.forEach(function (f, i) {
    var qid = 'q-' + f.key, errId = qid + '-err', hintId = qid + '-hint';
    var num = el('span', { cls: 'n', 'aria-hidden': 'true', text: (i + 1) + '.' });
    var req = f.required ? el('span', { cls: 'req', text: 'Required' }) : null;
    var hint = f.hint ? el('span', { cls: 'hint', id: hintId, text: f.hint }) : null;
    var err = el('p', { cls: 'err', id: errId, role: 'alert' });
    var describedBy = [f.hint ? hintId : null, errId].filter(Boolean).join(' ');
    var wrap;

    if (f.type === 'text' || f.type === 'textarea') {
      var input = f.type === 'text'
        ? el('input', { type: 'text', id: qid, name: f.key, maxlength: f.max, autocomplete: 'off', placeholder: f.placeholder || false, required: !!f.required, 'aria-required': f.required ? 'true' : false, 'aria-describedby': describedBy })
        : el('textarea', { id: qid, name: f.key, maxlength: f.max, rows: 5, placeholder: f.placeholder || false, required: !!f.required, 'aria-required': f.required ? 'true' : false, 'aria-describedby': describedBy });
      var count = f.type === 'textarea' && f.max ? el('span', { cls: 'count', 'aria-hidden': 'true', text: '0 / ' + f.max }) : null;
      if (count) input.addEventListener('input', function () { count.textContent = input.value.length + ' / ' + f.max; });
      wrap = el('div', { cls: 'q' }, [el('label', { for: qid }, [num, f.label, req]), hint, input, count, err]);
      refs[f.key] = { f: f, wrap: wrap, err: err, get: function () { return input.value.trim(); }, focus: function () { input.focus(); }, input: input };
    } else {
      var multi = f.type === 'checkbox', scale = f.type === 'scale';
      var options = scale ? range(f.min || 1, f.max || 5) : f.options;
      var group = el('div', { cls: scale ? 'scale' : 'opts' + (options.length > 4 ? ' two' : ''), role: scale ? 'radiogroup' : false });
      var boxes = [];
      var other = null;
      options.forEach(function (opt, j) {
        var oid = qid + '-' + j;
        var box = el('input', { type: multi ? 'checkbox' : 'radio', id: oid, name: f.key, value: String(opt) });
        boxes.push(box);
        var label = scale ? String(opt) + (j === 0 ? '' : '') : opt;
        var lab = el('label', { cls: 'opt' + (multi ? ' cb' : ''), for: oid }, [box, el('span', { cls: 'box', 'aria-hidden': 'true' }), el('span', { text: String(label) })]);
        if (scale) lab.setAttribute('aria-label', String(opt) + (j === 0 && f.minLabel ? ' (' + f.minLabel.replace(/^\d+\s*·\s*/, '') + ')' : j === options.length - 1 && f.maxLabel ? ' (' + f.maxLabel.replace(/^\d+\s*·\s*/, '') + ')' : ''));
        group.appendChild(lab);
      });
      var nodes = [el('legend', {}, [num, f.label, req]), hint, group];
      if (scale && (f.minLabel || f.maxLabel)) nodes.push(el('div', { cls: 'ends', 'aria-hidden': 'true' }, [el('span', { text: f.minLabel || '' }), el('span', { text: f.maxLabel || '' })]));
      if (f.otherKey) {
        other = el('input', { type: 'text', cls: 'other', id: qid + '-other', name: f.otherKey, maxlength: f.otherMax || 120, autocomplete: 'off', placeholder: f.otherPlaceholder || 'Other', 'aria-label': f.otherPlaceholder || 'Other', hidden: true });
        nodes.push(other);
      }
      nodes.push(err);
      wrap = el('fieldset', { cls: 'q', 'aria-describedby': describedBy }, nodes);
      group.addEventListener('change', function () {
        var picked = boxes.filter(function (b) { return b.checked; });
        if (multi && f.maxPick) boxes.forEach(function (b) { b.disabled = !b.checked && picked.length >= f.maxPick; });
        if (other) { var on = picked.some(function (b) { return b.value === 'Other'; }); other.hidden = !on; if (!on) other.value = ''; }
        wrap.classList.remove('bad');
      });
      refs[f.key] = {
        f: f, wrap: wrap, err: err, other: other,
        get: function () {
          var v = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
          return multi ? v : (v[0] || '');
        },
        focus: function () { boxes[0].focus(); }
      };
    }
    form.appendChild(wrap);
  });

  // honeypot: hidden from people and screen readers, bots tend to fill it
  form.appendChild(el('div', { cls: 'hp', 'aria-hidden': 'true' }, [
    el('label', { for: 'hp-website', text: 'Website' }),
    el('input', { type: 'text', id: 'hp-website', name: 'website', tabindex: '-1', autocomplete: 'off' })
  ]));

  var button = el('button', { type: 'submit', text: S.submitLabel || 'Submit' });
  var status = el('p', { cls: 'status', role: 'status', 'aria-live': 'polite' });
  form.appendChild(el('div', { cls: 'actions' }, [button, status]));
  root.appendChild(form);

  if (S.privacy && S.privacy.length) {
    root.appendChild(el('details', { cls: 'privacy' }, [el('summary', { text: 'How we handle your answers' })].concat(S.privacy.map(function (p) { return el('p', { text: p }); }))));
  }

  var thanks = el('section', { cls: 'thanks', hidden: true, tabindex: '-1' }, [
    el('h2', { text: S.thanksTitle || 'Thank you' }),
    el('p', { text: S.thanksBody || 'Your answers are in.' }),
    el('a', { href: '#', cls: 'again', text: 'Answer again' })
  ]);
  root.appendChild(thanks);
  thanks.querySelector('.again').addEventListener('click', function (ev) {
    ev.preventDefault(); store(false, false); form.reset(); form.dispatchEvent(new Event('change'));
    Object.keys(refs).forEach(function (k) { var r = refs[k]; if (r.other) r.other.hidden = true; if (r.input && r.input.dispatchEvent) r.input.dispatchEvent(new Event('input')); });
    form.querySelectorAll('input:disabled').forEach(function (b) { b.disabled = false; });
    showForm(true);
  });

  function showForm(on) {
    form.hidden = !on; thanks.hidden = on;
    if (!on) thanks.focus();
  }
  if (store(true)) showForm(false);

  function range(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }

  function validate() {
    var first = null, answers = {};
    Object.keys(refs).forEach(function (k) {
      var r = refs[k], f = r.f, v = r.get(), msg = '';
      if (f.required && (!v || (Array.isArray(v) && !v.length))) msg = 'Please answer this question.';
      if (!msg && f.maxPick && v.length > f.maxPick) msg = 'Pick up to ' + f.maxPick + '.';
      r.wrap.classList.toggle('bad', !!msg);
      r.err.textContent = msg;
      if (r.input) r.input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !first) first = r;
      answers[k] = f.type === 'scale' ? (v ? Number(v) : '') : v;
      if (r.other) answers[f.otherKey] = r.other.hidden ? '' : r.other.value.trim();
    });
    if (first) first.focus();
    return first ? null : answers;
  }

  var sid = uuid(), busy = false;
  function clearBad(ev) {
    var q = ev.target.closest && ev.target.closest('.q');
    if (q && q.classList.contains('bad')) { q.classList.remove('bad'); var e = q.querySelector('.err'); if (e) e.textContent = ''; }
    if (!form.querySelector('.q.bad') && /bad/.test(status.className)) { status.className = 'status'; status.textContent = ''; }
  }
  form.addEventListener('input', clearBad);
  form.addEventListener('change', clearBad);
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (busy) return;
    var answers = validate();
    if (!answers) { status.className = 'status bad'; status.textContent = 'Please check the highlighted question.'; return; }
    var body = JSON.stringify({
      token: CODE, surveyId: S.id, version: S.version, sid: sid,
      elapsedMs: Date.now() - started,
      website: form.querySelector('#hp-website').value,
      answers: answers
    });
    busy = true; button.disabled = true; status.className = 'status'; status.textContent = 'Sending\u2026';
    send(body, 0);
  });

  function send(body, attempt) {
    var done = function () { busy = false; button.disabled = false; status.textContent = ''; store(false, true); sid = uuid(); showForm(false); };
    if (PREVIEW) { window.__lastSurveyPayload = JSON.parse(body); setTimeout(done, 400); return; }
    fetch(E.url, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow', credentials: 'omit', referrerPolicy: 'no-referrer' })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) return done();
        if (res && res.retry && attempt < 2) return later();
        fail(res && res.message);
      })
      .catch(function () { attempt < 2 ? later() : fail(); });
    function later() { setTimeout(function () { send(body, attempt + 1); }, attempt ? 3000 : 1000); }
  }
  function fail(msg) {
    busy = false; button.disabled = false;
    status.className = 'status bad';
    status.textContent = msg || 'That didn\u2019t go through. Check your connection and try again.';
  }
}
})();
