const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// DELETE candidate account/profile
export const DELETE_CANDIDATE_PROFILE_API = `${BASE}/candidiate/profile`;
