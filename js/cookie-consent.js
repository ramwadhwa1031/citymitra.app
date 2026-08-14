/**
 * ════════════════════════════════════════════════════════════════════════════
 * CITY MITRA — Cookie Consent & AdSense Compliance Banner
 * ════════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    const COOKIE_STORAGE_KEY = 'cm_cookie_consent';

    function initCookieBanner() {
        if (localStorage.getItem(COOKIE_STORAGE_KEY)) {
            return; // Already consented or dismissed
        }

        const banner = document.createElement('div');
        banner.id = 'cmCookieBanner';
        banner.className = 'cm-cookie-banner';
        banner.innerHTML = `
            <div class="cm-cookie-text">
                🍪 <strong>We value your privacy:</strong> City Mitra uses cookies and non-intrusive analytics to deliver personalized civic answers and improve our service. Third-party advertising partners like Google AdSense may use cookies to serve relevant ads. By continuing to browse, you agree to our <a href="privacy" target="_blank">Privacy Policy</a> and <a href="terms" target="_blank">Terms of Service</a>.
            </div>
            <div class="cm-cookie-actions">
                <button class="cm-cookie-btn cm-cookie-btn-accept" id="cmAcceptCookies">Accept All</button>
                <button class="cm-cookie-btn cm-cookie-btn-decline" id="cmDeclineCookies">Essential Only</button>
            </div>
        `;

        document.body.appendChild(banner);

        // Show with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);

        document.getElementById('cmAcceptCookies').addEventListener('click', () => {
            localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 400);
        });

        document.getElementById('cmDeclineCookies').addEventListener('click', () => {
            localStorage.setItem(COOKIE_STORAGE_KEY, 'essential');
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 400);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }
})();
