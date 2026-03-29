// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// @@ // ADSBASH VERSION 1.2.0 \\

// @@  BSD 3-Clause License
// @@  Copyright (c) 2026, Qatual Easton

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:

//1. Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
// 
// 2. Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
// 
// 3. Neither the name of the copyright holder nor the names of its
//    contributors may be used to endorse or promote products derived from
//    this software without specific prior written permission.
// 
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
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
      type:     'dropdown',
      linkUrl:  'https://solocentral.org',
      images: [
        'https://cdn.jsdelivr.net/gh/adsbash/-/lib/m389r2-adoiqj-qwhe9.png'
      ],
      delay:    0,
      duration: 8000,
      position: 'top'
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
    } else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      setTimeout(fn, 0);
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

  function fireDropdown(zone, opts) {
    whenReady(function () {
      var img     = randomItem(zone.images);
      var linkUrl = zone.linkUrl;
      var pos     = zone.position || 'top';
      var dur     = zone.duration !== undefined ? zone.duration : 8000;
      var isTop   = pos !== 'bottom';

      var wrap = document.createElement('div');
      wrap.setAttribute('style', [
        'position:fixed',
        isTop ? 'top:0' : 'bottom:0',
        'left:0',
        'right:0',
        'margin:0 auto',
        'max-width:728px',
        'width:100%',
        'z-index:2147483647',
        'overflow:hidden',
        'border-radius:' + (isTop ? '0 0 8px 8px' : '8px 8px 0 0'),
        'box-shadow:0 4px 32px rgba(0,0,0,0.5)',
        'transform:' + (isTop ? 'translateY(-110%)' : 'translateY(110%)'),
        'transition:transform 0.45s cubic-bezier(0.22,1,0.36,1)'
      ].join(';'));

      var a = document.createElement('a');
      a.href   = linkUrl;
      a.target = '_blank';
      a.rel    = 'noopener noreferrer';
      a.setAttribute('style', 'display:block;line-height:0;text-decoration:none');

      var image = document.createElement('img');
      image.src = img;
      image.setAttribute('style', 'width:100%;height:auto;display:block;border:none;max-height:120px;object-fit:cover');
      image.alt = '';

      var closeBtn = document.createElement('button');
      closeBtn.setAttribute('style', [
        'position:absolute',
        isTop ? 'top:6px' : 'bottom:6px',
        'right:8px',
        'width:24px',
        'height:24px',
        'background:rgba(0,0,0,0.6)',
        'border:none',
        'border-radius:50%',
        'color:#fff',
        'font-size:14px',
        'line-height:24px',
        'text-align:center',
        'cursor:pointer',
        'z-index:1',
        'font-family:Arial,sans-serif',
        'padding:0',
        'display:flex',
        'align-items:center',
        'justify-content:center'
      ].join(';'));
      closeBtn.innerHTML = '&#x2715;';
      closeBtn.title = 'Close';

      a.appendChild(image);
      wrap.appendChild(a);
      wrap.appendChild(closeBtn);
      document.body.appendChild(wrap);

      var slideIn = setTimeout(function () {
        wrap.style.transform = 'translateY(0)';
      }, 50);

      function dismiss() {
        wrap.style.transform = isTop ? 'translateY(-110%)' : 'translateY(110%)';
        setTimeout(function () {
          if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
        }, 500);
      }

      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dismiss();
      });

      if (dur > 0) setTimeout(dismiss, dur);

      log('dropdown fired, image:', img);
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
      } else if (zone.type === 'dropdown') {
        fireDropdown(zone, opts);
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
