const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// endpoint to toggle a saved job (save or unsave)
// NOTE: backend currently uses the misspelled 'candidiate' path
export const SAVE_JOB_API = `${BASE}/candidiate/save_job`;

// endpoint to fetch all saved jobs for the candidate
// backend actually exposes the un‑underscored path (404 was returned for _ version)
export const GET_SAVED_JOBS_API = `${BASE}/candidiate/savedjobs`;

