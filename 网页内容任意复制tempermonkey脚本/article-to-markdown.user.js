// ==UserScript==
// @name         网页文章一键复制 Markdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将主流网站文章一键转换并复制为 Markdown 格式
// @author       Your name
// @match        *://*.csdn.net/*
// @match        *://*.juejin.cn/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 移除复制保护
    function removeProtection() {
        // 移除所有复制相关的事件监听器
        const events = ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'keydown', 'keyup'];
        events.forEach(event => {
            document.addEventListener(event, function(e) {
                e.stopPropagation();
                return true;
            }, true);
        });

        // 移除复制保护样式
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                user-select: auto !important;
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
            }
            .hljs {
                user-select: auto !important;
                -webkit-user-select: auto !important;
            }
            code {
                user-select: auto !important;
                -webkit-user-select: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 处理掘金的复制事件
    function handleJuejinCopy(e) {
        if (window.location.hostname.includes('juejin.cn')) {
            e.stopPropagation();
            const selection = window.getSelection();
            const selectedText = selection.toString();
            
            // 如果有选中的文本，则阻止默认复制行为并使用清洁的文本
            if (selectedText) {
                e.preventDefault();
                GM_setClipboard(selectedText, 'text');
            }
        }
    }

    // 初始化
    function init() {
        removeProtection();
        
        // 添加掘金特定的复制处理
        document.addEventListener('copy', handleJuejinCopy, true);
    }

    // 在页面加载前就开始执行
    init();

    // DOM加载完成后再次执行
    document.addEventListener('DOMContentLoaded', init);

    // 页面完全加载后再次执行
    window.addEventListener('load', init);
})(); 