const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';
const prodDomain = 'https://dot.texastribune.org/';
const testDomain = 'https://dot-test.texastribune.org/';

module.exports = {
  isDev,
  isTest,
  isProd,
  prodDomain,
  testDomain,
};
