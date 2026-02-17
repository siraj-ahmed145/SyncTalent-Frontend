const SESSION_PREFIX = 'candidate_session_';
const EXPIRY_PREFIX = 'candidate_session_expiry_';
const CURRENT_USER_KEY = 'current_candidate_id';
const USER_TYPE_KEY = 'user_type';

export const setSession = (data, token, expiryMinutes) => {
  const candidateId = data?.candidiate_id;
  const fullName = data?.fullName;

  if (!candidateId && !token) {
    console.error('Cannot set session: Missing candidate data or token');
    return;
  }

  const sessionKey = SESSION_PREFIX + candidateId;
  const expiryKey = EXPIRY_PREFIX + candidateId;
  const expiryTime = new Date().getTime() + expiryMinutes * 60 * 1000;

  const candidateData = {
    candidiate_id: candidateId,
    fullName: fullName,
  };

  // Store candidate data and expiry
  localStorage.setItem(sessionKey, JSON.stringify(candidateData));
  localStorage.setItem(expiryKey, expiryTime.toString());
  localStorage.setItem(CURRENT_USER_KEY, String(candidateId));
  localStorage.setItem(USER_TYPE_KEY, 'candidate');

  // Store token in cookie
  const cookieExpiry = new Date(expiryTime);
  document.cookie = `token=${token}; expires=${cookieExpiry.toUTCString()}; path=/`;

  // Store token in localStorage/sessionStorage
  localStorage.setItem('auth_token', token);
  sessionStorage.setItem('auth_token', token);
};

export const getSession = () => {
  const candidateId = localStorage.getItem(CURRENT_USER_KEY);
  if (!candidateId) return null;

  const sessionKey = SESSION_PREFIX + candidateId;
  const expiryKey = EXPIRY_PREFIX + candidateId;

  const session = localStorage.getItem(sessionKey);
  const expiry = localStorage.getItem(expiryKey);

  if (!session || !expiry) return null;

  const now = new Date().getTime();
  if (now > parseInt(expiry)) {
    clearSession();
    return null;
  }

  return JSON.parse(session);
};

export const clearSession = () => {
  const candidateId = localStorage.getItem(CURRENT_USER_KEY);

  if (candidateId) {
    localStorage.removeItem(SESSION_PREFIX + candidateId);
    localStorage.removeItem(EXPIRY_PREFIX + candidateId);
  }
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const isUserLoggedIn = () => {
  const candidateId = localStorage.getItem(CURRENT_USER_KEY);
  const token = localStorage.getItem('auth_token');
  return candidateId && token;
};
