/** Letters (A–Z, a–z) and spaces only — no digits or symbols. */
export const LETTERS_AND_SPACES_REGEX = /^[A-Za-z\s]+$/;

export const sanitizeLettersAndSpacesInput = (value) =>
  String(value ?? '').replace(/[^A-Za-z\s]/g, '');

export const isValidFullName = (value) => {
  const t = String(value ?? '').trim();
  return t.length >= 2 && LETTERS_AND_SPACES_REGEX.test(t);
};

export const isValidCompanyName = (value) => {
  const t = String(value ?? '').trim();
  return t.length >= 2 && LETTERS_AND_SPACES_REGEX.test(t);
};
