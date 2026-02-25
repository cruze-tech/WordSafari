import './data.js';
import './audio.js';
import './achievements.js';
import './progression.js';
import './svgTemplates.js';
import './svgFactory.js';
import './game.js';
import './ui.js';

const APP_VERSION = '3.0.0';
const SW_UPDATE_EVENT = 'sw-update-available';

function getUpdateBannerElements() {
    const banner = document.getElementById('sw-update-banner');
    const refreshBtn = document.getElementById('btn-sw-refresh');
    const dismissBtn = document.getElementById('btn-sw-dismiss');
    return { banner, refreshBtn, dismissBtn };
}

function showUpdateBanner(registration) {
    const { banner, refreshBtn, dismissBtn } = getUpdateBannerElements();
    if (!banner || !refreshBtn || !dismissBtn) return;

    banner.classList.remove('hidden');
    banner.dataset.visible = 'true';
    window.dispatchEvent(new CustomEvent(SW_UPDATE_EVENT, { detail: { version: APP_VERSION } }));

    refreshBtn.onclick = () => {
        if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    };

    dismissBtn.onclick = () => {
        banner.classList.add('hidden');
        banner.dataset.visible = 'false';
    };
}

function watchServiceWorker(registration) {
    if (registration.waiting) {
        showUpdateBanner(registration);
    }

    registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateBanner(registration);
            }
        });
    });
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            watchServiceWorker(registration);

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });
}

registerServiceWorker();
