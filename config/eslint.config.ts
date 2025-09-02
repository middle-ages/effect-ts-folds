import eslint from '@eslint/js'
import allRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import {defineConfig} from 'eslint/config'
import tseslint from 'typescript-eslint'

const {languageOptions: _, ...recommended} = allRecommended
const config = defineConfig(
  {
    ignores: ['../node_modules/*', '../.dev'],
  },

  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  eslintPluginUnicorn.configs.recommended,
  recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-array-method-this-argument': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },
)

export default config
