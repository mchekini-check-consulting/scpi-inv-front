import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  framework: '@storybook/angular',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  docs: {
    defaultName: 'Documentation',
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
  },
};

export default config;
