const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// GET details for the currently logged in employer
export const GET_EMPLOYER_PROFILE_API = `${BASE}/employer/profile`;

// CREATE employer profile (first time)
export const CREATE_EMPLOYER_PROFILE_API = `${BASE}/employer/profile/create`;

// UPDATE employer profile
export const UPDATE_EMPLOYER_PROFILE_API = `${BASE}/employer/profile/update`;

// DELETE employer profile
export const DELETE_EMPLOYER_PROFILE_API = `${BASE}/employer/profile/delete`;

