const SESSION_PREFIX = 'employer_session_';
const EXPIRY_PREFIX = 'employer_session_expiry_';
const CURRENT_USER_KEY = 'current_employer_id';
const USER_TYPE_KEY = 'user_type';

const getExpiryTimeFromToken = (token, fallbackMinutes = 1440) => {
  try {
    const tokenParts = String(token || '').split('.');
    if (tokenParts.length < 2) {
      return new Date().getTime() + fallbackMinutes * 60 * 1000;
    }

    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const payloadJson = atob(padded);
    const payload = JSON.parse(payloadJson);

    if (payload?.exp) {
      return Number(payload.exp) * 1000;
    }
  } catch (e) {
    console.warn('Could not parse token exp, using fallback expiry.', e);
  }
  return new Date().getTime() + fallbackMinutes * 60 * 1000;
};

export const setEmployerSession = (data, token, expiryMinutes) => {
  const employerId = data?.employer_id ?? data?.id;
  const companyName = data?.companyName ?? data?.company_name;

  if (!employerId && !token) {
    console.error('Cannot set session: Missing employer data or token');
    return;
  }

  const sessionKey = SESSION_PREFIX + employerId;
  const expiryKey = EXPIRY_PREFIX + employerId;
  const fallbackMinutes = Number.isFinite(Number(expiryMinutes)) ? Number(expiryMinutes) : 1440;
  const expiryTime = getExpiryTimeFromToken(token, fallbackMinutes);

  const employerData = {
    employer_id: employerId,
    companyName: companyName,
  };

  localStorage.setItem(sessionKey, JSON.stringify(employerData));
  localStorage.setItem(expiryKey, expiryTime.toString());
  localStorage.setItem(CURRENT_USER_KEY, String(employerId));
  localStorage.setItem(USER_TYPE_KEY, 'employer');

  const cookieExpiry = new Date(expiryTime);
  document.cookie = `token=${token}; expires=${cookieExpiry.toUTCString()}; path=/`;

  localStorage.setItem('auth_token', token);
  sessionStorage.setItem('auth_token', token);
};

export const getEmployerSession = () => {
  const employerId = localStorage.getItem(CURRENT_USER_KEY);
  if (!employerId) return null;

  const sessionKey = SESSION_PREFIX + employerId;
  const expiryKey = EXPIRY_PREFIX + employerId;

  const session = localStorage.getItem(sessionKey);
  const expiry = localStorage.getItem(expiryKey);

  if (!session || !expiry) return null;

  const now = new Date().getTime();
  if (now > parseInt(expiry)) {
    clearEmployerSession();
    return null;
  }

  return JSON.parse(session);
};

export const clearEmployerSession = () => {
  const employerId = localStorage.getItem(CURRENT_USER_KEY);

  if (employerId) {
    localStorage.removeItem(SESSION_PREFIX + employerId);
    localStorage.removeItem(EXPIRY_PREFIX + employerId);
  }
  localStorage.removeItem(CURRENT_USER_KEY);
  const userType = localStorage.getItem(USER_TYPE_KEY);
  if (userType === 'employer') {
    localStorage.removeItem(USER_TYPE_KEY);
  }
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const isEmployerLoggedIn = () => {
  const employerId = localStorage.getItem(CURRENT_USER_KEY);
  const token = localStorage.getItem('auth_token');
  const userType = localStorage.getItem(USER_TYPE_KEY);
  return employerId && token && userType === 'employer';
};
