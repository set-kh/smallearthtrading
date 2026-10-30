/*
 * SMALL EARTH TRADING - 共通スクリプト
 *
 * 全ページ共通で読み込みます。ページ固有の設定は HTML 側の属性で指定してください。
 *
 *   <html lang="ja" data-title-ja="..." data-title-en="...">
 *   <input data-placeholder-ja="..." data-placeholder-en="...">
 *
 * 言語の表示・非表示は CSS（style.css の html[lang] ルール）が担当します。
 * このスクリプトは <html> の lang 属性を切り替えるだけです。
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'preferredLanguage';
    var DEFAULT_LANG = 'ja';
    var SUPPORTED = ['ja', 'en'];

    /* localStorage はプライベートブラウジング等で例外を投げることがあるため必ず包む */
    function readStoredLang() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            return SUPPORTED.indexOf(v) !== -1 ? v : null;
        } catch (e) {
            return null;
        }
    }

    function storeLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            /* 保存できなくても表示自体は動くので握りつぶす */
        }
    }

    function setLanguage(lang) {
        if (SUPPORTED.indexOf(lang) === -1) {
            lang = DEFAULT_LANG;
        }

        var html = document.documentElement;
        html.setAttribute('lang', lang);

        /* ページタイトル（<html> の data-title-* から取得） */
        var title = html.getAttribute('data-title-' + lang);
        if (title) {
            document.title = title;
        }

        /* placeholder など、テキストノードでない箇所 */
        var placeholderTargets = document.querySelectorAll('[data-placeholder-' + lang + ']');
        Array.prototype.forEach.call(placeholderTargets, function (el) {
            el.setAttribute('placeholder', el.getAttribute('data-placeholder-' + lang));
        });

        /* 切り替えボタンの状態 */
        var buttons = document.querySelectorAll('.lang-switch-btn');
        Array.prototype.forEach.call(buttons, function (btn) {
            var isActive = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        storeLang(lang);

        /* ページ固有の処理（FAQ 検索の再実行など）から購読できるようにする */
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));
    }

    /* 外部から呼べるように公開 */
    window.SET = window.SET || {};
    window.SET.setLanguage = setLanguage;
    window.SET.getLanguage = function () {
        return document.documentElement.getAttribute('lang') || DEFAULT_LANG;
    };

    document.addEventListener('DOMContentLoaded', function () {

        /* ---- 言語切り替え ---- */
        var langButtons = document.querySelectorAll('.lang-switch-btn');
        Array.prototype.forEach.call(langButtons, function (button) {
            button.addEventListener('click', function () {
                setLanguage(button.getAttribute('data-lang'));
            });
        });

        /* <head> の先読みスクリプトで lang は設定済みだが、
           タイトル・placeholder・ボタン状態をここで確定させる */
        setLanguage(readStoredLang() || DEFAULT_LANG);

        /* ---- AIアシスタントのリンク（data-bot-url が設定されていれば Bot へ、空なら #contact のまま） ---- */
        var botLink = document.getElementById('ai-bot-link');
        if (botLink) {
            var botUrl = (botLink.getAttribute('data-bot-url') || '').trim();
            if (/^https:\/\/t\.me\//.test(botUrl)) {
                botLink.setAttribute('href', botUrl);
                botLink.setAttribute('target', '_blank');
            }
        }

        /* ---- お知らせの折り畳み（一番上の1件は全文、2件目以降は日付＋タイトルだけ表示） ----
           HTML 側は従来どおり <article class="news-item"> を上に追加するだけでよい。
           JS が無効な環境では何もしない（全文が表示される）。 */
        var newsItems = document.querySelectorAll('#news .news-item');
        Array.prototype.forEach.call(newsItems, function (item, index) {
            if (index === 0) {
                return;
            }
            var heading = item.querySelector('h3');
            if (!heading) {
                return;
            }

            /* h3 より後ろの要素（本文）をまとめて隠す */
            var body = document.createElement('div');
            body.className = 'news-body';
            body.id = 'news-body-' + index;
            var node = heading.nextSibling;
            while (node) {
                var next = node.nextSibling;
                body.appendChild(node);
                node = next;
            }
            if (!body.childNodes.length) {
                return;
            }
            body.hidden = true;
            item.appendChild(body);
            item.classList.add('news-item-collapsed');

            /* 開閉ボタン（日英のラベルは CSS の lang ルールで切り替わる） */
            var toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'news-toggle';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', body.id);
            toggle.innerHTML =
                '<span class="news-toggle-open"><span class="lang-ja">続きを読む</span><span class="lang-en">Read more</span></span>' +
                '<span class="news-toggle-close"><span class="lang-ja">閉じる</span><span class="lang-en">Close</span></span>';
            heading.insertAdjacentElement('afterend', toggle);

            var setOpen = function (open) {
                body.hidden = !open;
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                item.classList.toggle('news-item-open', open);
            };
            toggle.addEventListener('click', function () {
                setOpen(body.hidden);
            });
            /* タイトルのクリックでも開閉できるようにする */
            heading.classList.add('news-title-clickable');
            heading.addEventListener('click', function () {
                setOpen(body.hidden);
            });
        });

        /* ---- モバイルナビゲーションのトグル ---- */
        var menuToggle = document.querySelector('.menu-toggle');
        var mainNav = document.querySelector('#mainNav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function () {
                var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', String(!isExpanded));
                mainNav.classList.toggle('active');
            });

            Array.prototype.forEach.call(mainNav.querySelectorAll('a'), function (link) {
                var href = link.getAttribute('href') || '';
                if (href.charAt(0) === '#') {
                    link.addEventListener('click', function () {
                        if (mainNav.classList.contains('active')) {
                            menuToggle.click();
                        }
                    });
                }
            });
        }

        /* ---- スクロールに応じたナビのアクティブ表示 ---- */
        var sections = document.querySelectorAll('main section[id]');
        var navLinks = document.querySelectorAll('.global-nav ul a[href^="#"]');

        if (sections.length && navLinks.length) {
            /* --header-height が未定義のページでも壊れないようフォールバックを置く */
            var raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
            var headerHeight = parseInt(raw, 10);
            if (isNaN(headerHeight)) {
                headerHeight = 70;
            }

            var ticking = false;

            var updateActiveNav = function () {
                var currentId = '';
                Array.prototype.forEach.call(sections, function (section) {
                    if (window.pageYOffset >= section.offsetTop - headerHeight - 20) {
                        currentId = section.getAttribute('id');
                    }
                });

                Array.prototype.forEach.call(navLinks, function (link) {
                    link.classList.toggle('active', link.hash === '#' + currentId);
                });

                ticking = false;
            };

            /* scroll イベントは毎フレーム走るので rAF で間引く */
            window.addEventListener('scroll', function () {
                if (!ticking) {
                    ticking = true;
                    window.requestAnimationFrame(updateActiveNav);
                }
            }, { passive: true });

            updateActiveNav();
        }
    });
})();
