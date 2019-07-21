const PROXY_CONFIG = {};
[
  {
    context: [
      '/graphql/*',
      '/oauth/*',
      '/images/*',
    ],
    target: 'https://ovnigames.selfbuild.fr',
    pathRewrite: {
      '^/graphql': 'https://ovnigames.selfbuild.fr/graphql',
      '^/oauth': 'https://ovnigames.selfbuild.fr/oauth',
      '^/images': 'https://ovnigames.selfbuild.fr/images',
    },
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
  {
    context: [
      '/socket.io/*',
    ],
    target: 'https://ovnigames.selfbuild.fr',
    pathRewrite: {'^/socket.io' : 'https://ovnigames.selfbuild.fr/socket.io'},
    ws: true,
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
].forEach(group => {
  group.context.forEach(proxy => {
    const copy = Object.assign({}, group);
    delete copy.context;
    PROXY_CONFIG[proxy] = copy;
  });
});

module.exports = PROXY_CONFIG;
