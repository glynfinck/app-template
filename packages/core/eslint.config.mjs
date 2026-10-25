import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['jest.config.js'] },
  ...tseslint.configs.recommended,
);
