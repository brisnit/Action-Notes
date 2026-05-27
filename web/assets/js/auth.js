import { createClient } from 'https://esm.sh/@workos-inc/authkit-js';

const CLIENT_ID = 'client_01KSN963R31ANVT9FZCPY0G9N6';

const PRODUCTION_ORIGIN = 'https://action-notes.vercel.app';

function getRedirectUri() {
  const origin = window.location.hostname === 'localhost'
    ? window.location.origin
    : PRODUCTION_ORIGIN;
  return `${origin}/callback.html`;
}

let _client = null;

export async function initAuth(options = {}) {
  if (_client && !options.onRedirectCallback) return _client;
  _client = await createClient(CLIENT_ID, {
    redirectUri: getRedirectUri(),
    ...options,
  });
  return _client;
}

export async function signIn(role) {
  if (role) sessionStorage.setItem('an_auth_role', role);
  const client = await initAuth();
  return client.signIn();
}

export async function signUp(role) {
  if (role) sessionStorage.setItem('an_auth_role', role);
  const client = await initAuth();
  return client.signUp();
}

export async function signOut() {
  const client = await initAuth();
  sessionStorage.removeItem('an_auth_role');
  return client.signOut();
}

export async function getUser() {
  const client = await initAuth();
  return client.getUser();
}

export async function getAccessToken() {
  const client = await initAuth();
  return client.getAccessToken();
}
