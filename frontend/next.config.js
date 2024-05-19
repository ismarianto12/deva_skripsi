const path = require('path')
module.exports = {
  webpack5: true,
  output: 'standalone',
  // output: 'export,
  trailingSlash: true,
  reactStrictMode: false,
  env: {
    // APP_API: 'http://localhost/siakad/backend_siakad/public/api/v1/',  // 'https://api.darulmaza.sch.id/api/v1/',  //https://api.darulmaza.sch.id
    // ASSETS_API: 'http://localhost/siakad/backend_siakad/public',
    // DEV_USER_WEB: 'http://localhost:3001',

    // APP_API: 'http://localhost/siakad/backend_siakad/public/api/v1/',  // 'https://api.darulmaza.sch.id/api/v1/',  //https://api.darulmaza.sch.id
    // ASSETS_API: 'http://localhost/siakad/backend_siakad/public',

    // DEV_USER_WEB: 'http://localhost:3001',
    // if use developmment as server wen as add data
    APP_API: 'http://localhost:8080/',  //https://api.darulmaza.sch.id
    ASSETS_API: 'https://api.darulmaza.sch.id',
    DEV_USER_WEB: 'https://api.darulmaza.sch.id',

    // APP_API: 'http://localhost/siakad_sdit/public/api/v1/',  // 'https://api.darulmaza.sch.id/api/v1/',  //https://api.darulmaza.sch.id
    // // ASSETS_API: 'http://localhost/siakad_sdit/public',
    // // DEV_USER_WEB: 'https://api.darulmaza.sch.id',
    // DEV_USER_PROD: '',
    DEV_USER_PROD: '',
  },
  crossOrigin: 'anonymous',
  headers: () => {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: '*' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ];
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
