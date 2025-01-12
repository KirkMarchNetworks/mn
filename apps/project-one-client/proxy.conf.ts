const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:3002',
    secure: false,
  },
  '/companion': {
    target: 'http://localhost:3020',
    secure: false,
    pathRewrite: {
      '^/companion': '',
    },
    ws: true,
  },
};

module.exports = PROXY_CONFIG;
