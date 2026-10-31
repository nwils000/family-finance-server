// Per-device conveniences (sound on/off, last family code). Never credentials:
// those live in secure-storage.ts. Every access is guarded because storage can
// be blocked or empty.
const read = (key: string) => {
  try {
    return localStorage.getItem(`kk_${key}`);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(`kk_${key}`);
    else localStorage.setItem(`kk_${key}`, value);
  } catch {
    // Storage unavailable; the preference just will not persist.
  }
};

export const prefs = {
  soundOn: () => read('sound') !== 'off',
  setSoundOn: (on: boolean) => write('sound', on ? 'on' : 'off'),
  familyCode: () => read('family_code') ?? '',
  setFamilyCode: (code: string | null) => write('family_code', code),
};
