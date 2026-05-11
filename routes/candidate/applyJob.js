// routes/candidate/applyJob.js
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const APPLY_JOB_API = (jobId) => `${BASE}/candidiate/apply_job/${jobId}`;
export const GET_APPLICATIONS_API = `${BASE}/candidiate/applications`;