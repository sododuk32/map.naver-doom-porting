// ==UserScript==
// @name         DOOM in naver.com with Dosbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inject DOOM into map.naver.com using Dosbox
// @author       You
// @include      https://map.naver.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://js-dos.com/cdn/js-dos-api.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForDosbox = setInterval(() => {
        if (typeof Dosbox !== 'undefined') {
            console.log('Dosbox API loaded');
            clearInterval(waitForDosbox);
            initializeDosbox();
        } else {
            console.log('Waiting for Dosbox...');
        }
    }, 100);

    function initializeDosbox() {
        console.log('Starting Dosbox initialization');

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                const canvasElement = document.querySelector('.mapboxgl-canvas');
                if (canvasElement) {
                    console.log('Canvas element found');

                    observer.disconnect();

                    const container = document.createElement('div');
                    container.style.position = 'relative';
                    container.style.width = '1920px';
                    container.style.height = '1200px';
                    container.style.border = '2px solid red';
                     container.style.paddingTop = '100px';
                    container.id = 'dosbox-container';

                    console.log(`Container size: ${container.style.width} x ${container.style.height}`);

                    canvasElement.parentNode.replaceChild(container, canvasElement);


                    try {
                        const dosbox = new Dosbox({
                            id: 'dosbox-container',
                            onload: (dosbox) => {
                                console.log('Dosbox initialized successfully');
                                try {
                                    console.log('Attempting to run DOOM...');
                                    dosbox.run('https://js-dos.com/cdn/upload/DOOM-@evilution.zip', './doom');

                                    console.log('DOOM run command executed');
                                } catch (error) {
                                    console.error('Error running DOOM:', error);
                                }
                            },
                            onrun: (dosbox, app) => {
                                console.log(`App '${app}' is running`);
                            },
                            onerror: (error) => {
                                console.error('Dosbox encountered an error:', error);
                            },
                        });
                        console.log('Dosbox object:', dosbox);

                    } catch (e) {
                        console.error('Error initializing Dosbox:', e);
                    }
                } else {
                    console.log('Canvas element not found yet');
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
