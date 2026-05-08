export default {
  'src/**/*.{ts,tsx}': ['eslint --max-warnings=0', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
