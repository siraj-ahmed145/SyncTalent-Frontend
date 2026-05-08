export const normalizeExperienceText = (value) => {
  if (value == null) return '';
  const raw = String(value).trim();
  if (raw === '') return '';

  const normalized = raw.toLowerCase();
  const levelMap = {
    junior: '0-1 years',
    'mid-level': '2-4 years',
    senior: '5+ years',
  };

  if (levelMap[normalized]) {
    return `${levelMap[normalized]} of experience`;
  }

  if (normalized.includes('experience')) {
    return raw;
  }

  if (normalized.includes('year') || normalized.includes('yr')) {
    return `${raw} of experience`;
  }

  if (/^\d+(?:\s*-\s*\d+)?\+?$/.test(raw)) {
    return `${raw} years of experience`;
  }

  return `${raw} of experience`;
};
