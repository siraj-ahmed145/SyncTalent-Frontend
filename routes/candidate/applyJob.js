const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Apply for a specific job
export const APPLY_JOB_API = (jobId) => `${BASE}/candidiate/apply_job/${jobId}`;

// Get all job applications for logged-in candidate
export const GET_APPLICATIONS_API = `${BASE}/candidiate/applications`;
