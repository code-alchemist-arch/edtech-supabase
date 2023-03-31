export const PASSWORD_STRENGTH_INITIAL = {
  beAMinimumOf16Characters: false,
  haveAtLeastOneLowercaseLetter: false,
  haveAtLeastOneUppercaseLetter: false,
  haveAtLeastOneNumber: false,
  haveAtLeastOneSpecialCharacter: false,
};

export const PASSWORD_STRENGTH_TITLES = {
  beAMinimumOf16Characters: 'Be a minimum of 16 characters',
  haveAtLeastOneLowercaseLetter: 'Have at least one lowercase letter',
  haveAtLeastOneUppercaseLetter: 'Have at least one uppercase letter',
  haveAtLeastOneNumber: 'Have at least one number',
  haveAtLeastOneSpecialCharacter: 'Have at least one special character',
};

const testPasswordStrength = (password: string) => ({
  beAMinimumOf16Characters: /[a-zA-Z0-9!@#$%^&*]{16,}/.test(password),
  haveAtLeastOneLowercaseLetter: /(?=.*[a-z])/.test(password),
  haveAtLeastOneUppercaseLetter: /(?=.*[A-Z])/.test(password),
  haveAtLeastOneNumber: /(?=.*\d)/.test(password),
  haveAtLeastOneSpecialCharacter: /(?=.*[!@#$%^&*])/.test(password),
});

export default testPasswordStrength;
