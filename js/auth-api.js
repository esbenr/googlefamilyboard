let CLIENT_ID = '468104940896-pcp515lfq7rbo734t6ebai84ca1pnan9.apps.googleusercontent.com';
let SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_EXPIRY_SKEW_MS = 60 * 1000;

let tokenClient;
let gapiInited = false;
let gisInited = false;
let tokenExpiresAt = 0;
let lastAuthInteractive = false;

function isLocalDevOrigin() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

function isSupportedAuthOrigin() {
    if (window.location.protocol === 'file:') {
        return false;
    }

    if (window.location.protocol !== 'https:' && !isLocalDevOrigin()) {
        return false;
    }

    return true;
}

function getOriginHint() {
    return 'Current origin: ' + window.location.origin;
}

function publishAuthStatus(state, message) {
    window.dispatchEvent(new CustomEvent('gfb-auth-status', {
        detail: {
            state,
            message,
            timestamp: new Date().toISOString()
        }
    }));
}

function gapiLoaded() {
    publishAuthStatus('loading', 'Google API client script loaded.');
    gapi.load('client', async () => {
        try {
            await gapi.client.init({});
            gapiInited = true;
            publishAuthStatus('loading', 'Google API client initialized.');
            maybeInitializeAuth();
        } catch (error) {
            publishAuthStatus('error', 'Google API initialization failed.');
            console.log('Google API initialization failed.', error);
        }
    });
}

function gisLoaded() {
    publishAuthStatus('loading', 'Google Identity Services script loaded.');
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: '',
        error_callback: (error) => {
            const errorType = error && error.type ? error.type : 'unknown_error';

            if (errorType === 'popup_failed_to_open') {
                publishAuthStatus('error', 'Browser blocked Google popup. Click Retry sign in and allow popups for this site.');
                return;
            }

            if (!lastAuthInteractive) {
                publishAuthStatus('error', 'Silent sign-in did not work (' + errorType + '). Click Retry sign in.');
                return;
            }

            publishAuthStatus('error', 'Authentication UI error: ' + errorType + '.');
        }
    });
    gisInited = true;
    publishAuthStatus('loading', 'Token client initialized.');
    maybeInitializeAuth();
}

function maybeInitializeAuth() {
    if (gapiInited && gisInited) {
        if (!isSupportedAuthOrigin()) {
            publishAuthStatus('error', 'OAuth needs HTTPS or localhost. ' + getOriginHint());
            return;
        }
        checkAuth();
    }
}

function hasValidToken() {
    return !!gapi.client.getToken() && (Date.now() + TOKEN_EXPIRY_SKEW_MS) < tokenExpiresAt;
}

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    console.log("checking auth");
    publishAuthStatus('loading', 'Checking sign-in status.');
    if (!isSupportedAuthOrigin()) {
        publishAuthStatus('error', 'Cannot sign in from this page origin. Use your GitHub Pages URL. ' + getOriginHint());
        return;
    }

    if (!gapiInited || !gisInited) {
        return;
    }

    if (hasValidToken()) {
        publishAuthStatus('success', 'Already signed in with a valid token.');
        loadCalendarApi();
        return;
    }

    requestAccessToken(false);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        console.log("auth ok");
        loadCalendarApi();
    } else {
        console.log("auth not ok");
        requestAccessToken(true);
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    console.log("authenticating");
    publishAuthStatus('loading', 'Starting interactive sign-in.');
    requestAccessToken(true);
    return false;
}

function requestAccessToken(interactive) {
    lastAuthInteractive = interactive;
    publishAuthStatus('loading', interactive ? 'Asking Google for permission.' : 'Trying silent sign-in.');
    tokenClient.callback = (tokenResponse) => {
        if (tokenResponse && tokenResponse.error) {
            if (!interactive) {
                publishAuthStatus('error', 'Silent sign-in failed (' + tokenResponse.error + '). Click Retry sign in. ' + getOriginHint());
                return;
            }

            publishAuthStatus('error', 'Authentication failed: ' + tokenResponse.error + '. ' + getOriginHint());
            console.log('Authentication failed. ' + tokenResponse.error);
            return;
        }

        tokenExpiresAt = Date.now() + (tokenResponse.expires_in * 1000);
        publishAuthStatus('success', 'Authentication succeeded. Token received.');
        loadCalendarApi();
    };

    try {
        tokenClient.requestAccessToken({ prompt: interactive ? 'consent' : 'none' });
    } catch (error) {
        publishAuthStatus('error', 'Could not start Google sign-in. ' + getOriginHint());
        console.log('Could not start Google sign-in.', error);
    }
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    console.log("loading calendar library");
    publishAuthStatus('loading', 'Loading Calendar API.');
    gapi.client.load('calendar', 'v3').then(() => {
        publishAuthStatus('success', 'Calendar API ready.');
        init();
    }).catch((error) => {
        publishAuthStatus('error', 'Could not load Calendar API.');
        console.log('Calendar API load failed.', error);
    });
}
