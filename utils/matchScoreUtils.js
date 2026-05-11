/**
 * Get the color classes for match score text based on the score value
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind color classes for text
 */
export const getMatchScoreColor = (score) => {
  if (score === null || score === undefined) return "text-gray-400 dark:text-gray-500";
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-blue-600 dark:text-blue-400";
  return "text-red-600 dark:text-red-400";
};

/**
 * Get the background color classes for match score display
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind background color classes
 */
export const getMatchScoreBgColor = (score) => {
  if (score === null || score === undefined) return "bg-gray-50 dark:bg-gray-800/80";
  if (score >= 80) return "bg-green-50 dark:bg-green-950/40";
  if (score >= 50) return "bg-blue-50 dark:bg-blue-950/40";
  return "bg-red-50 dark:bg-red-950/40";
};

/**
 * Get the border color classes for match score display
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind border color classes
 */
export const getMatchScoreBorder = (score) => {
  if (score === null || score === undefined) return "border-gray-200 dark:border-gray-600";
  if (score >= 80) return "border-green-200 dark:border-green-700";
  if (score >= 50) return "border-blue-200 dark:border-blue-700";
  return "border-red-200 dark:border-red-800";
};

/**
 * Get combined background and border color classes for match score display
 * @param {number} score - The match score (0-100)
 * @returns {string} - Tailwind background and border color classes combined
 */
export const getMatchScoreBg = (score) => {
  if (score === null || score === undefined)
    return "bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600";
  if (score >= 80) return "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-700";
  if (score >= 50) return "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-700";
  return "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800";
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
