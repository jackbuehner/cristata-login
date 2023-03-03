import { browser } from '$app/environment';

export function modifySessionCookie() {
	if (browser) {
		// Get all cookies accessible via javascipt.
		// The server should only disable `httpOnly` on the session cookie
		// when the return URL is to `https://tauri.local`.
		const cookies = document.cookie.split('; ').map((cookie) => cookie.split(/=(.*)/s, 2));

		// Get the session cookies.
		const session = cookies.find(
			([name]) => name === 'cristata-session' || name === '__Secure-cristata-session'
		);
		const sig = cookies.find(
			([name]) => name === 'cristata-session.sig' || name === '__Secure-cristata-session.sig'
		);

		// If the session cookies are available, update them to allow cross-site access
		// so they can be sent from `https://tauti.local`.
		if (session && sig) {
			document.cookie = `${session[0]}=${session[1]}; SameSite=None; Secure; Expires=Tue, 19 Jan 2038 04:14:07 GMT`;
			document.cookie = `${sig[0]}=${sig[1]}; SameSite=None; Secure; Expires=Tue, 19 Jan 2038 04:14:07 GMT`;
		}
	}
}
