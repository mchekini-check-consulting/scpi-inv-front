// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  // Required
  framework: '@storybook/angular',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Optional
  addons: ['@storybook/addon-docs'],
  docs: {
    defaultName: 'Documentation',
  },
  staticDirs: ['../public'],
};

export default config;