// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// // @@  ADBASH VERSION 1.1.1  @@ \\ \\

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
      linkUrl:     'https://solocentral.org',
      images: [
        'https://cdn.jsdelivr.net/gh/adsbash/-/lib/m389r2-adoiqj-qwhe9.png'
      ],
      countdown:   5,
      hashTrigger: 'adsbash-vigenette'
    }
  };

  var COOKIE_NAME = '__aclib_uid';
  var FIRED       = {};

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

  function whenReady(fn) {
    if (document.body) {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function currentHash() {
    return (global.location.hash || '').replace('#', '');
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
      var evts      = ['click', 'mousedown', 'touchstart', 'keydown'];
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

  function fireVignette(zone, opts) {
    var hashTrigger = zone.hashTrigger || 'adsbash-vigenette';

    if (currentHash() !== hashTrigger) {
      log('vignette: hash not matched, skipping');
      return;
    }

    whenReady(function () {
      var img      = randomItem(zone.images);
      var linkUrl  = zone.linkUrl;
      var seconds  = zone.countdown !== undefined ? zone.countdown : 5;
      var remaining = seconds;

      var overlay = document.createElement('div');
      overlay.setAttribute('style', [
        'position:fixed',
        'top:0', 'left:0', 'right:0', 'bottom:0',
        'z-index:2147483647',
        'background:rgba(0,0,0,0.82)',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'opacity:0',
        'transition:opacity 0.3s ease'
      ].join(';'));

      var box = document.createElement('div');
      box.setAttribute('style', [
        'position:relative',
        'max-width:600px',
        'width:90%',
        'background:#111',
        'border-radius:10px',
        'overflow:hidden',
        'box-shadow:0 8px 48px rgba(0,0,0,0.7)',
        'transform:scale(0.92)',
        'transition:transform 0.3s ease'
      ].join(';'));

      var topBar = document.createElement('div');
      topBar.setAttribute('style', [
        'display:flex',
        'align-items:center',
        'justify-content:space-between',
        'padding:8px 12px',
        'background:#1a1a1a',
        'border-bottom:1px solid #2a2a2a'
      ].join(';'));

      var adLabel = document.createElement('span');
      adLabel.textContent = 'Advertisement';
      adLabel.setAttribute('style', 'font-family:Arial,sans-serif;font-size:11px;color:#666;letter-spacing:0.5px');

      var closeArea = document.createElement('div');
      closeArea.setAttribute('style', 'display:flex;align-items:center;gap:10px');

      var countdownEl = document.createElement('span');
      countdownEl.setAttribute('style', 'font-family:Arial,sans-serif;font-size:12px;color:#888');
      countdownEl.textContent = remaining > 0 ? 'Close in ' + remaining + 's' : '';

      var closeBtn = document.createElement('button');
      closeBtn.setAttribute('style', [
        'background:transparent',
        'border:1px solid #444',
        'border-radius:4px',
        'color:#aaa',
        'font-size:12px',
        'font-family:Arial,sans-serif',
        'padding:3px 10px',
        'cursor:pointer',
        'opacity:' + (remaining > 0 ? '0.4' : '1'),
        'pointer-events:' + (remaining > 0 ? 'none' : 'auto'),
        'transition:opacity 0.2s'
      ].join(';'));
      closeBtn.textContent = '✕ Close';

      var adLink = document.createElement('a');
      adLink.href   = linkUrl;
      adLink.target = '_blank';
      adLink.rel    = 'noopener noreferrer';
      adLink.setAttribute('style', 'display:block;line-height:0');

      var adImg = document.createElement('img');
      adImg.src = img;
      adImg.setAttribute('style', 'width:100%;height:auto;display:block;border:none');
      adImg.alt = '';

      var visitBtn = document.createElement('a');
      visitBtn.href   = linkUrl;
      visitBtn.target = '_blank';
      visitBtn.rel    = 'noopener noreferrer';
      visitBtn.textContent = 'Visit Site →';
      visitBtn.setAttribute('style', [
        'display:block',
        'text-align:center',
        'padding:12px',
        'background:#222',
        'color:#fff',
        'font-family:Arial,sans-serif',
        'font-size:13px',
        'font-weight:600',
        'text-decoration:none',
        'border-top:1px solid #2a2a2a',
        'letter-spacing:0.3px'
      ].join(';'));

      closeArea.appendChild(countdownEl);
      closeArea.appendChild(closeBtn);
      topBar.appendChild(adLabel);
      topBar.appendChild(closeArea);
      adLink.appendChild(adImg);
      box.appendChild(topBar);
      box.appendChild(adLink);
      box.appendChild(visitBtn);
      overlay.appendChild(box);
      document.body.appendChild(overlay);

      setTimeout(function () {
        overlay.style.opacity = '1';
        box.style.transform   = 'scale(1)';
      }, 30);

      function dismiss() {
        overlay.style.opacity = '0';
        box.style.transform   = 'scale(0.92)';
        setTimeout(function () {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          if (global.location.hash === '#' + hashTrigger) {
            global.history.replaceState(null, '', global.location.pathname + global.location.search);
          }
        }, 320);
      }

      closeBtn.addEventListener('click', dismiss);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) dismiss();
      });

      if (remaining > 0) {
        var timer = setInterval(function () {
          remaining--;
          if (remaining > 0) {
            countdownEl.textContent = 'Close in ' + remaining + 's';
          } else {
            clearInterval(timer);
            countdownEl.textContent = '';
            closeBtn.style.opacity        = '1';
            closeBtn.style.pointerEvents  = 'auto';
          }
        }, 1000);
      }

      log('vignette fired, image:', img);
      if (opts && opts.onFire) opts.onFire();
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

      if (FIRED[zoneId]) {
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
