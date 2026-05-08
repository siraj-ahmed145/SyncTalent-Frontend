/**
 * Get the color classes for match score text based on the score value
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind color classes for text
 */
export const getMatchScoreColor = (score) => {
  if (score === null || score === undefined) return "text-gray-400";
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-blue-600";
  return "text-red-600";
};

/**
 * Get the background color classes for match score display
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind background color classes
 */
export const getMatchScoreBgColor = (score) => {
  if (score === null || score === undefined) return "bg-gray-50";
  if (score >= 80) return "bg-green-50";
  if (score >= 50) return "bg-blue-50";
  return "bg-red-50";
};

/**
 * Get the border color classes for match score display
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind border color classes
 */
export const getMatchScoreBorder = (score) => {
  if (score === null || score === undefined) return "border-gray-200";
  if (score >= 80) return "border-green-200";
  if (score >= 50) return "border-blue-200";
  return "border-red-200";
};

/**
 * Get combined background and border color classes for match score display
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind background and border color classes combined
 */
export const getMatchScoreBg = (score) => {
  if (score === null || score === undefined) return "bg-gray-50 border-gray-200";
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 50) return "bg-blue-50 border-blue-200";
  return "bg-red-50 border-red-200";
};

/**
 * Get a label describing the match quality
 * @param {number} score - The match score (0-100)
 * @returns {string} - Label for the score
 */
export const getMatchScoreLabel = (score) => {
  if (score === null || score === undefined) return "No Match";
  if (score >= 80) return "Excellent Match";
  if (score >= 50) return "Good Match";
  return "Poor Match";
};
