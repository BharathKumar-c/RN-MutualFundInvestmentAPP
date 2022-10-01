import Config from 'react-native-config';

/* ----------------------------------------------------------------
  production environment || but we use dev currently
  because production not created yet, its create for future purpose.
-------------------------------------------------------------------- */
const production = Config?.APP_PRODUCTION_URI
  ? Config?.APP_PRODUCTION_URI
  : 'http://marshmallow-dev-api.itero.link/';

/* ------------------------------------------
      Dev environment
------------------------------------------- */
const dev = Config?.APP_DEV_URI
  ? Config.APP_DEV_URI
  : 'https://marshmallow-dev-api.itero.link/';

/* ------------------------------------------
      local environment
------------------------------------------- */
const local = Config?.APP_LOCAL_URI
  ? Config.APP_LOCAL_URI
  : 'http://192.168.29.33:80/';

var api: any = null;

switch (Config.REACT_APP_ENV) {
  case 'production':
    api = production;
    break;

  case 'dev':
    api = dev;
    break;

  case 'local':
    api = local;
    break;

  default:
    api = dev;
    break;
}

export default api;
