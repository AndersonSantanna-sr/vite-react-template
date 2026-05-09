export default {
  'src/**/*.{ts,tsx}': ['eslint --max-warnings=0 --no-warn-ignored', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
