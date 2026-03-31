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

  var DROPDOWN_UP = false;
  var CLICK_KEY   = '__aclib_clicks';

  var zone = {
    linkUrl: 'https://solocentral.org',
    images: [
      { src: 'https://cdn.jsdelivr.net/gh/adsbash/-/lib/m389r2-adoiqj-qwhe9.png', url: 'https://solocentral.org' },
      { src: 'https://cdn.jsdelivr.net/gh/adsbash/-/lib/mjw09e-saindv-aoid8z.png', url: 'https://endis.rest' }
    ]
  };

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
      '#__aclib_dropdown a{text-decoration:none;}';
    document.head.appendChild(s);
  }

  function icon(faClass, style) {
    var i = document.createElement('i');
    i.className = faClass;
    if (style) i.setAttribute('style', style);
    return i;
  }

  function el(tag, style) {
    var e = document.createElement(tag);
    if (style) e.setAttribute('style', style);
    return e;
  }

  function buildDropdown() {
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

    var atomIcon = icon('fa-solid fa-atom', 'color:#4285F4;font-size:13px;');

    var brandText = el('span', 'font-size:11px;color:#70757a;');
    brandText.textContent = 'Ads by adsBash';

    leftGroup.appendChild(adBadge);
    leftGroup.appendChild(atomIcon);
    leftGroup.appendChild(brandText);

    var closeBtn = el('button',
      'background:none;border:none;cursor:pointer;padding:4px 0;display:flex;align-items:center;color:#5f6368;'
    );
    closeBtn.setAttribute('aria-label', 'Close ad');
    closeBtn.appendChild(icon('fa-solid fa-xmark', 'font-size:18px;'));

    topBar.appendChild(leftGroup);
    topBar.appendChild(closeBtn);

    var adContent = el('div', 'background:#fff;line-height:0;');

    var adLink = el('a', 'display:block;');
    adLink.href   = linkUrl;
    adLink.target = '_blank';
    adLink.rel    = 'noopener noreferrer';

    var adImg = el('img', 'width:100%;max-height:150px;object-fit:cover;display:block;border:none;');
    adImg.src = imgSrc;
    adImg.alt = '';

    adLink.appendChild(adImg);
    adContent.appendChild(adLink);

    var bottomBar = el('div',
      'padding:3px 14px;background:#f8f9fa;border-top:1px solid #e0e0e0;' +
      'display:flex;align-items:center;justify-content:flex-end;'
    );

    var poweredBy = el('span', 'font-size:9px;color:#b0b0b0;letter-spacing:0.2px;');
    poweredBy.textContent = 'adsBash Ads';
    bottomBar.appendChild(poweredBy);

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

    closeBtn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); dismiss(); });
  }

  function init() {
    buildDropdown();

    document.addEventListener('click', function (e) {
      var dropdown = document.getElementById('__aclib_dropdown');
      if (dropdown && dropdown.contains(e.target)) return;
      var count = getClickCount() + 1;
      setClickCount(count);
      if (count % 99 === 0 && !DROPDOWN_UP) buildDropdown();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);
