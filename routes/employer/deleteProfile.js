const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// DELETE employer account/profile
export const DELETE_EMPLOYER_PROFILE_API = `${BASE}/employer/profile/delete`;
