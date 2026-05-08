const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Save Job API
export const SAVE_JOB_API = `${BASE}/candidiate/save_job`;

// Unsave Job API
export const UNSAVE_JOB_API = `${BASE}/candidiate/unsave_job`;

// Get Saved Jobs API
export const GET_SAVED_JOBS_API = `${BASE}/candidiate/savedjobs`;