// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// @@  BSD 3-Clause License
// @@  Copyright (c) 2026, Qatual Easton

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its
//    contributors may be used to endorse or promote products derived from
//    this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


(function (global) {
  'use strict';

  var ZONES = {
    'jdv98z1': {
      type:    'vignette',
      linkUrl: 'https://solocentral.org',
      images: [
        { src: 'https://cdn.jsdelivr.net/gh/adsbash/-/lib/m389r2-adoiqj-qwhe9.png', url: 'https://solocentral.org' }
        { src: 'https://cdn.jsdelivr.net/gh/adsbash/-/lib/mjw09e-saindv-aoid8z.png', url: 'https://endis.rest' }
      ]
    }
  };

  var COOKIE_NAME  = '__aclib_uid';
  var CLICK_KEY    = '__aclib_clicks';
  var FIRED        = {};
  var DROPDOWN_UP  = false;

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/; SameSite=Lax';
  }

  function getUID() {
    var uid = getCookie(COOKIE_NAME);
    if (!uid) { uid = uuid(); setCookie(COOKIE_NAME, uid, 365); }
    return uid;
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function log() {
    if (aclib._debug) {
      var args = Array.prototype.slice.call(arguments);
      console.log.apply(console, ['[aclib]'].concat(args));
    }
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function getClickCount() {
    try { return parseInt(localStorage.getItem(CLICK_KEY) || '0', 10); } catch (e) { return 0; }
  }

  function setClickCount(n) {
    try { localStorage.setItem(CLICK_KEY, String(n)); } catch (e) {}
  }

  function loadFontAwesome() {
    if (document.getElementById('__aclib_fa')) return;
    var link = document.createElement('link');
    link.id   = '__aclib_fa';
    link.rel  = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(link);
  }

  function injectStyles() {
    if (document.getElementById('__aclib_css')) return;
    var s = document.createElement('style');
    s.id = '__aclib_css';
    s.textContent =
      '#__aclib_dropdown{' +
        'position:fixed;top:0;left:0;width:100%;z-index:2147483647;' +
        'transform:translateY(-100%);' +
        'transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);' +
        'box-shadow:0 2px 12px rgba(0,0,0,0.18);' +
        'font-family:Arial,sans-serif;' +
      '}' +
      '#__aclib_dropdown.aclib-show{transform:translateY(0);}' +
      '#__aclib_dropdown a{text-decoration:none;}' +
      '#__aclib_dropdown button:hover #__aclib_close_icon{color:#333;}' +
      '#__aclib_why:hover,#__aclib_report:hover{text-decoration:underline;}';
    document.head.appendChild(s);
  }

  function el(tag, style, extra) {
    var e = document.createElement(tag);
    if (style) e.setAttribute('style', style);
    if (extra) Object.keys(extra).forEach(function (k) { e[k] = extra[k]; });
    return e;
  }

  function icon(faClass, style) {
    var i = document.createElement('i');
    i.className = faClass;
    if (style) i.setAttribute('style', style);
    return i;
  }

  function buildDropdown(zone) {
    if (DROPDOWN_UP) return;
    DROPDOWN_UP = true;

    loadFontAwesome();
    injectStyles();

    var rawItem = randomItem(zone.images);
    var imgSrc  = (typeof rawItem === 'object') ? rawItem.src  : rawItem;
    var linkUrl = (typeof rawItem === 'object' && rawItem.url) ? rawItem.url : zone.linkUrl;

    var wrap = document.createElement('div');
    wrap.id  = '__aclib_dropdown';

    var topBar = el('div',
      'display:flex;align-items:center;justify-content:space-between;' +
      'padding:6px 14px;background:#fff;border-bottom:1px solid #e0e0e0;'
    );

    var leftGroup = el('div', 'display:flex;align-items:center;gap:7px;');

    var adBadge = el('span',
      'font-size:10px;color:#006621;border:1px solid #006621;border-radius:2px;' +
      'padding:1px 4px;line-height:15px;letter-spacing:0.3px;font-weight:700;'
    );
    adBadge.textContent = 'Ad';

    var gIcon = icon('fa-brands fa-google', 'color:#4285F4;font-size:13px;');

    var gText = el('span', 'font-size:11px;color:#70757a;');
    gText.textContent = 'Ads by Google';

    leftGroup.appendChild(adBadge);
    leftGroup.appendChild(gIcon);
    leftGroup.appendChild(gText);

    var rightGroup = el('div', 'display:flex;align-items:center;gap:14px;');

    var whyBtn = el('a',
      'font-size:11px;color:#1a73e8;display:flex;align-items:center;gap:4px;cursor:pointer;'
    );
    whyBtn.id   = '__aclib_why';
    whyBtn.href = '#';
    whyBtn.appendChild(icon('fa-solid fa-circle-info', 'font-size:12px;'));
    var whyTxt = document.createElement('span');
    whyTxt.textContent = 'Why this ad?';
    whyBtn.appendChild(whyTxt);

    var closeBtn = el('button',
      'background:none;border:none;cursor:pointer;padding:4px 0;display:flex;align-items:center;color:#5f6368;'
    );
    closeBtn.setAttribute('aria-label', 'Close ad');
    closeBtn.appendChild(icon('fa-solid fa-xmark', 'font-size:18px;'));

    rightGroup.appendChild(whyBtn);
    rightGroup.appendChild(closeBtn);
    topBar.appendChild(leftGroup);
    topBar.appendChild(rightGroup);

    var adContent = el('div', 'background:#fff;line-height:0;');

    var adLink = el('a', 'display:block;');
    adLink.href   = linkUrl;
    adLink.target = '_blank';
    adLink.rel    = 'noopener noreferrer';

    var adImg = el('img',
      'width:100%;max-height:150px;object-fit:cover;display:block;border:none;'
    );
    adImg.src = imgSrc;
    adImg.alt = '';

    adLink.appendChild(adImg);
    adContent.appendChild(adLink);

    var bottomBar = el('div',
      'display:flex;align-items:center;justify-content:space-between;' +
      'padding:5px 14px;background:#f8f9fa;border-top:1px solid #e0e0e0;'
    );

    var adChoices = el('div', 'display:flex;align-items:center;gap:5px;cursor:pointer;');
    adChoices.appendChild(icon('fa-solid fa-circle-info', 'font-size:11px;color:#1a73e8;'));
    var adcTxt = el('span', 'font-size:11px;color:#1a73e8;');
    adcTxt.textContent = 'AdChoices';
    adChoices.appendChild(adcTxt);

    var reportLink = el('a',
      'font-size:11px;color:#1a73e8;display:flex;align-items:center;gap:4px;cursor:pointer;'
    );
    reportLink.id   = '__aclib_report';
    reportLink.href = '#';
    reportLink.appendChild(icon('fa-solid fa-flag', 'font-size:11px;'));
    var rTxt = document.createElement('span');
    rTxt.textContent = 'Report this ad';
    reportLink.appendChild(rTxt);

    bottomBar.appendChild(adChoices);
    bottomBar.appendChild(reportLink);

    wrap.appendChild(topBar);
    wrap.appendChild(adContent);
    wrap.appendChild(bottomBar);
    document.body.appendChild(wrap);

    setTimeout(function () { wrap.classList.add('aclib-show'); }, 20);

    function dismiss() {
      if (!wrap.parentNode) return;
      wrap.classList.remove('aclib-show');
      setTimeout(function () {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        DROPDOWN_UP = false;
      }, 370);
    }

    closeBtn.addEventListener('click',  function (e) { e.preventDefault(); e.stopPropagation(); dismiss(); });
    whyBtn.addEventListener('click',    function (e) { e.preventDefault(); });
    reportLink.addEventListener('click', function (e) { e.preventDefault(); });

    log('dropdown rendered ->', linkUrl);
  }

  function firePopunder(zone, opts) {
    var uid  = getUID();
    var dest = zone.adUrl +
      (zone.adUrl.indexOf('?') > -1 ? '&' : '?') +
      'uid=' + uid + '&ref=' + encodeURIComponent(global.location.href);

    log('popunder firing ->', dest);

    var opened = false;
    try {
      var w = global.screen.width  || 1024;
      var h = global.screen.height || 768;
      var p = global.open(dest, '_blank',
        'width=' + w + ',height=' + h + ',toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1');
      if (p) {
        try { p.blur(); global.focus(); } catch (e) {}
        opened = true;
      }
    } catch (e) {}

    if (!opened) {
      var triggered = false;
      var evts = ['click', 'mousedown', 'touchstart', 'keydown'];
      function handler() {
        if (triggered) return;
        triggered = true;
        evts.forEach(function (ev) { document.removeEventListener(ev, handler, true); });
        try {
          var p2 = global.open(dest, '_blank');
          if (p2) { try { p2.blur(); global.focus(); } catch (e) {} }
          if (opts && opts.onFire) opts.onFire();
        } catch (ex) {}
      }
      evts.forEach(function (ev) { document.addEventListener(ev, handler, true); });
      log('popunder queued on next interaction');
      return;
    }

    if (opts && opts.onFire) opts.onFire();
  }

  function fireVignette(zone, opts) {
    ready(function () {
      buildDropdown(zone);
      if (opts && opts.onFire) opts.onFire();
    });

    document.addEventListener('click', function (e) {
      var dropdown = document.getElementById('__aclib_dropdown');
      if (dropdown && dropdown.contains(e.target)) return;

      var count = getClickCount() + 1;
      setClickCount(count);

      if (count % 99 === 0 && !DROPDOWN_UP) {
        buildDropdown(zone);
      }
    }, true);
  }

  var aclib = {
    _debug: false,

    runAutoTag: function (opts) {
      opts = opts || {};
      var zoneId = opts.zoneId;

      if (!zoneId) {
        log('runAutoTag: zoneId required');
        if (opts.onError) opts.onError('zoneId required');
        return;
      }

      var zone = ZONES[zoneId];
      if (!zone) {
        log('unknown zoneId:', zoneId);
        if (opts.onError) opts.onError('Unknown zoneId: ' + zoneId);
        return;
      }

      if (FIRED[zoneId] && zone.type !== 'vignette') {
        log('already fired:', zoneId);
        if (opts.onBlock) opts.onBlock('already_fired');
        return;
      }

      FIRED[zoneId] = true;

      var delay = opts.delay !== undefined ? opts.delay : (zone.delay || 0);

      if (delay > 0) {
        setTimeout(function () { aclib._fire(zone, opts); }, delay);
      } else {
        aclib._fire(zone, opts);
      }
    },

    _fire: function (zone, opts) {
      if (zone.type === 'popunder') {
        firePopunder(zone, opts);
      } else if (zone.type === 'vignette') {
        fireVignette(zone, opts);
      } else {
        log('unknown zone type:', zone.type);
      }
    },

    addZone: function (zoneId, config) {
      if (!zoneId || !config || !config.type) {
        log('addZone: zoneId and config.type required');
        return;
      }
      ZONES[zoneId] = config;
      log('zone added:', zoneId);
    },

    enableDebug:  function () { this._debug = true; },
    disableDebug: function () { this._debug = false; }
  };

  global.aclib = aclib;

})(typeof window !== 'undefined' ? window : this);
