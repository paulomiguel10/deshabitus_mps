// Padrão de código da equipe: rode `npx expo lint` antes de cada commit.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', 'node_modules/*'] },
]);
