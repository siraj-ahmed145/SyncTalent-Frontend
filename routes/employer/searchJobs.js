const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Constructs a URL for searching employer jobs with optional filters.
 *
 * @param {string} [skills] - comma separated list of skill keywords
 * @param {string} [title] - job title or partial title
 * @param {string} [company] - company name or partial name
 * @returns {string} fully qualified search URL with query params
 */
export const getSearchJobsUrl = (skills = '', title = '', company = '', jobId = null) => {
  const url = `${BASE}/employer/search_jobs`;
  const params = new URLSearchParams();

  if (skills && skills.trim()) {
    params.append('skills', skills.trim());
  }
  if (title && title.trim()) {
    params.append('title', title.trim());
  }
  if (company && company.trim()) {
    params.append('company', company.trim());
  }
  if (jobId != null && jobId !== '') {
    params.append('jobId', jobId);
  }

  const query = params.toString();
  return query ? `${url}?${query}` : url;
};
