
import posthog from 'posthog-js';

// Helper to check if we are in production
const isProduction = import.meta.env.PROD;

export const analytics = {
    init: () => {
        if (isProduction) {
            posthog.init(import.meta.env.VITE_POSTHOG_KEY || '', {
                api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
                autocapture: true, // Automatically track clicks, pageviews, etc.
                capture_pageview: false // We will handle pageviews manually for SPA
            });
        } else {
            console.log("Analytics initialized in DEV mode (events logged to console).");
        }
    },

    identify: (userId: string, traits?: Record<string, any>) => {
        if (isProduction) {
            posthog.identify(userId, traits);
        } else {
            console.log(`[Analytics] Identify: ${userId}`, traits);
        }
    },

    reset: () => {
        if (isProduction) posthog.reset();
    },

    track: (eventName: string, properties?: Record<string, any>) => {
        if (isProduction) {
            posthog.capture(eventName, properties);
        } else {
            console.log(`[Analytics] Track: ${eventName}`, properties);
        }
    },

    pageView: () => {
        if (isProduction) {
            posthog.capture('$pageview');
        }
    }
};
