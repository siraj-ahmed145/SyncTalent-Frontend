const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Delete Job API URL
export const getDeleteJobUrl = (jobId) =>
  `${BASE_URL}/employer/deletejob/${jobId}`;