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
    'l5h346wxpn': {
      type:  'popunder',
      adUrl: 'https://throbbingimmensely.com/a6/32/39/a6323906d2c341d50c9279ba63ce3ae2.js'
    },
    'k9m217zqrt': {
      type:  'popunder',
      adUrl: 'https://throbbingimmensely.com/a6/32/39/a6323906d2c341d50c9279ba63ce3ae2.js'
    },
    'qo3nruc9m': {
      type:        'vignette',
      linkUrl:     'https://217-216-66-197.plesk.page',
      images: [
        'https://cdn.jsdelivr.net/gh/adsbash/-@80c07f/lib/m389r2-adoiqj-qwhe9.png'
      ],
      countdown:   5,
      hashTrigger: 'adsbash-vigenette'
    },
    '9e8rufm93': {
      type:        'vignette',
      linkUrl:     'https://144-217-77-9.plesk.page',
      images: [
        'https://cdn.jsdelivr.net/gh/adsbash/-@80c07f9/lib/mjw09e-saindv-aoid8z.png'
      ],
      countdown:   5,
      hashTrigger: 'adsbash-vigenette'
    }
  };

  var COOKIE_NAME  = '__aclib_uid';
  var FIRED        = {};
  var VIGNETTE_UP  = false;

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

  function getHash() {
    return global.location.hash.replace(/^#/, '');
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
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
      log('popunder queued — fires on next user interaction');
      return;
    }

    if (opts && opts.onFire) opts.onFire();
  }

  function buildVignette(zone) {
    if (VIGNETTE_UP) return;
    VIGNETTE_UP = true;

    var img      = randomItem(zone.images);
    var linkUrl  = zone.linkUrl;
    var seconds  = zone.countdown !== undefined ? parseInt(zone.countdown, 10) : 5;
    var remaining = seconds;
    var hashTrigger = zone.hashTrigger || 'adsbash-vigenette';

    var overlay = document.createElement('div');
    overlay.id  = '__aclib_vignette';
    overlay.setAttribute('style', [
      'position:fixed',
      'top:0', 'left:0', 'width:100%', 'height:100%',
      'z-index:2147483647',
      'background:rgba(0,0,0,0.85)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'opacity:0',
      'transition:opacity 0.25s ease',
      'box-sizing:border-box'
    ].join(';'));

    var box = document.createElement('div');
    box.setAttribute('style', [
      'position:relative',
      'width:90%',
      'max-width:580px',
      'background:#0f0f0f',
      'border-radius:10px',
      'overflow:hidden',
      'box-shadow:0 12px 60px rgba(0,0,0,0.8)',
      'transform:scale(0.9)',
      'transition:transform 0.25s ease',
      'box-sizing:border-box'
    ].join(';'));

    var topBar = document.createElement('div');
    topBar.setAttribute('style', [
      'display:flex',
      'align-items:center',
      'justify-content:space-between',
      'padding:8px 14px',
      'background:#181818',
      'border-bottom:1px solid #272727'
    ].join(';'));

    var adLabel = document.createElement('span');
    adLabel.textContent = 'Sponsored';
    adLabel.setAttribute('style', 'font-family:Arial,sans-serif;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px');

    var rightSide = document.createElement('div');
    rightSide.setAttribute('style', 'display:flex;align-items:center;gap:10px');

    var countdownEl = document.createElement('span');
    countdownEl.setAttribute('style', 'font-family:Arial,sans-serif;font-size:12px;color:#666');
    countdownEl.textContent = remaining > 0 ? 'Close in ' + remaining + 's' : '';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.disabled = remaining > 0;
    closeBtn.setAttribute('style', [
      'background:transparent',
      'border:1px solid #333',
      'border-radius:5px',
      'color:' + (remaining > 0 ? '#444' : '#ccc'),
      'font-size:12px',
      'font-family:Arial,sans-serif',
      'padding:4px 12px',
      'cursor:' + (remaining > 0 ? 'default' : 'pointer'),
      'transition:color 0.2s, border-color 0.2s'
    ].join(';'));

    var adLink = document.createElement('a');
    adLink.href   = linkUrl;
    adLink.target = '_blank';
    adLink.rel    = 'noopener noreferrer';
    adLink.setAttribute('style', 'display:block;line-height:0;text-decoration:none');

    var adImg = document.createElement('img');
    adImg.setAttribute('style', 'width:100%;height:auto;display:block;border:none');
    adImg.alt = '';
    adImg.src = img;

    var footer = document.createElement('a');
    footer.href   = linkUrl;
    footer.target = '_blank';
    footer.rel    = 'noopener noreferrer';
    footer.textContent = 'Visit Site →';
    footer.setAttribute('style', [
      'display:block',
      'text-align:center',
      'padding:13px',
      'background:#181818',
      'color:#fff',
      'font-family:Arial,sans-serif',
      'font-size:13px',
      'font-weight:700',
      'text-decoration:none',
      'border-top:1px solid #272727',
      'letter-spacing:0.5px'
    ].join(';'));

    rightSide.appendChild(countdownEl);
    rightSide.appendChild(closeBtn);
    topBar.appendChild(adLabel);
    topBar.appendChild(rightSide);
    adLink.appendChild(adImg);
    box.appendChild(topBar);
    box.appendChild(adLink);
    box.appendChild(footer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(function () {
      overlay.style.opacity   = '1';
      box.style.transform     = 'scale(1)';
    }, 20);

    function dismiss() {
      if (!overlay.parentNode) return;
      overlay.style.opacity = '0';
      box.style.transform   = 'scale(0.9)';
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        VIGNETTE_UP = false;
        if (getHash() === hashTrigger) {
          global.history.replaceState(null, '', global.location.pathname + global.location.search);
        }
      }, 280);
    }

    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!closeBtn.disabled) dismiss();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay && !closeBtn.disabled) dismiss();
    });

    if (remaining > 0) {
      var timer = setInterval(function () {
        remaining--;
        if (remaining > 0) {
          countdownEl.textContent = 'Close in ' + remaining + 's';
        } else {
          clearInterval(timer);
          countdownEl.textContent    = '';
          closeBtn.disabled          = false;
          closeBtn.style.color       = '#ccc';
          closeBtn.style.borderColor = '#555';
          closeBtn.style.cursor      = 'pointer';
        }
      }, 1000);
    }

    log('vignette rendered');
  }

  function fireVignette(zone, opts) {
    var hashTrigger = zone.hashTrigger || 'adsbash-vigenette';

    function tryShow() {
      if (getHash() === hashTrigger) {
        log('vignette: hash matched, showing');
        buildVignette(zone);
        if (opts && opts.onFire) opts.onFire();
      } else {
        log('vignette: waiting for hash #' + hashTrigger + ', current: "' + getHash() + '"');
      }
    }

    ready(tryShow);

    global.addEventListener('hashchange', function () {
      if (getHash() === hashTrigger && !VIGNETTE_UP) {
        buildVignette(zone);
        if (opts && opts.onFire) opts.onFire();
      }
    });
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
