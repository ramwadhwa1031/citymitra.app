/**
 * ════════════════════════════════════════════════════════════════════════════
 * CITY MITRA — Google Sheets Integration Client
 * ════════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ── Configuration ──
    const GOOGLE_SHEET_CONFIG = {
        SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwOjtWd16Bxg_znTqrRcUcIwkyhMrNznBQbFEFUAKDcT3kkqqkinyZGmlj0IjTPqbwt/exec',
        OFFLINE_STORAGE_KEY: 'cm_pending_submissions'
    };

    // Global Toast Notification Helper
    function showToast(message, type = 'success') {
        let toast = document.getElementById('cmGlobalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cmGlobalToast';
            toast.className = 'cm-global-toast';
            document.body.appendChild(toast);
        }

        const icon = type === 'success' ? '✅' : '⚠️';
        toast.className = `cm-global-toast ${type} show`;
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Save to local offline queue
    function saveOfflineSubmission(payload) {
        try {
            const queue = JSON.parse(localStorage.getItem(GOOGLE_SHEET_CONFIG.OFFLINE_STORAGE_KEY) || '[]');
            queue.push({ ...payload, queuedAt: new Date().toISOString() });
            localStorage.setItem(GOOGLE_SHEET_CONFIG.OFFLINE_STORAGE_KEY, JSON.stringify(queue));
        } catch (e) {
            console.error('Failed to save offline queue', e);
        }
    }

    // Send payload to Google Sheet
    async function sendToGoogleSheet(payload) {
        saveOfflineSubmission(payload); // Always backup locally first

        const url = localStorage.getItem('cm_custom_sheets_url') || GOOGLE_SHEET_CONFIG.SCRIPT_URL;

        // If placeholder URL is still in place, mock success gracefully
        if (!url || url.includes('REPLACE_WITH_YOUR_WEBAPP_ID')) {
            console.info('City Mitra Sheet Sync: Saved locally to queue. (Set your Google Apps Script URL in js/google-sheets.js to sync live to Google Sheets)');
            return { success: true, localOnly: true };
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script Web App redirects
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            return { success: true };
        } catch (err) {
            console.warn('Network issue syncing to Google Sheet, persisted in local backup:', err);
            return { success: true, offline: true };
        }
    }

    // ── Public APIs ──
    window.CityMitraSheets = {
        async submitCityRequest(formData) {
            const payload = {
                type: 'city_request',
                cityName: formData.cityName,
                state: formData.state,
                name: formData.name || 'Anonymous Citizen',
                contact: formData.contact || '',
                notes: formData.notes || '',
                context: window.location.pathname
            };
            const res = await sendToGoogleSheet(payload);
            showToast(`City request for "${formData.cityName}" recorded successfully!`, 'success');
            return res;
        },

        async submitContactForm(formData) {
            const payload = {
                type: 'contact',
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                city: formData.city || 'All'
            };
            const res = await sendToGoogleSheet(payload);
            showToast('Thank you! Your message has been received.', 'success');
            return res;
        },

        async submitNewsletter(email) {
            const payload = {
                type: 'newsletter',
                email: email,
                source: window.location.pathname
            };
            const res = await sendToGoogleSheet(payload);
            showToast('Subscribed to City Mitra updates!', 'success');
            return res;
        },

        showToast: showToast
    };

    // Auto-bind footer newsletter forms across pages
    document.addEventListener('DOMContentLoaded', () => {
        const newsletterBtn = document.getElementById('footerSendBtn');
        const newsletterInput = document.getElementById('footerEmailInput');

        if (newsletterBtn && newsletterInput) {
            newsletterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = (newsletterInput.value || '').trim();
                if (!email || !email.includes('@')) {
                    showToast('Please enter a valid email address.', 'error');
                    return;
                }
                newsletterBtn.disabled = true;
                window.CityMitraSheets.submitNewsletter(email);
                newsletterInput.value = '';
                newsletterBtn.disabled = false;
            });
        }
    });

})();
