import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    typecheck: {
      enabled: true,
    },
    include: ['./tests/**/*.spec.ts'],
    setupFiles: ['./tests/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './.dev/coverage',
      exclude: [
        '.dev',
        'dev',
        'config',
        'docs',
        'tests',
        'src/fix.ts',
        'src/fold.ts',
        'src/index.ts',
        'src/laws.ts',
        'src/refold.ts',
        'src/unfold.ts',
        'src/util.ts',
      ],
    },
  },
})
