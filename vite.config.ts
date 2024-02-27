import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sentrySvelteKit({
    sourceMapsUploadOptions: {
      org: 'wraith',
      project: 'yumyum'
    }
  }), sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
