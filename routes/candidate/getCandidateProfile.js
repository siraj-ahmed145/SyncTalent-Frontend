const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET details for the currently logged in candidate
export const GET_CANDIDATE_PROFILE_API = `${BASE}/candidiate/profile`;

// CREATE candidate profile (first time)
export const CREATE_CANDIDATE_PROFILE_API = `${BASE}/candidiate/profile`;

// UPDATE candidate profile
export const UPDATE_CANDIDATE_PROFILE_API = `${BASE}/candidiate/profile`;