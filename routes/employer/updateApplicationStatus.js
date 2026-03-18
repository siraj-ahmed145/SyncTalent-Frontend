const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getUpdateApplicationStatusUrl = (applicationId) =>
  `${BASE}/employer/update_application_status/${applicationId}`;