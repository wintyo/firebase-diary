import demoConfig from './sdkConfig.demo.json';
import prodConfig from './sdkConfig.prod.json';

const config = (() => {
  switch (process.env.APP_ENV) {
    case 'prod':
      return prodConfig;
    default:
      return demoConfig;
  }
})();

export default config;
