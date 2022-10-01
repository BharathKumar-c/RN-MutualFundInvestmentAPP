const axios = require('axios');
import api from '../config';
import { storeAccessToken } from '../service/AuthService';
import store from '../state';
import { setAccessToken, setRefreshToken } from '../state/auth';

axios.defaults.baseURL = api ? api : 'https://marshmallow-dev-api.itero.link/';
// axios.defaults.baseURL = 'https://marshmallow-dev-api.itero.link/';

const getToken = () => {
  const { auth } = store.getState();
  if (auth?.accessToken && auth?.refreshToken) {
    return {
      access_token: auth?.accessToken,
      token_type: 'bearer',
      refresh_token: auth?.refreshToken,
    };
  }
  return {
    access_token: null,
    token_type: 'bearer',
    refresh_token: null,
  };
};

export default {
  getWithoutToken: uri => {
    return new Promise((resolve, reject) => {
      axios
        .get(`api/${uri}`, {
          headers: {
            zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  postWithoutToken: (uri, body) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`api/${uri}`, body, {
          headers: {
            zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getWithToken: uri => {
    return new Promise((resolve, reject) => {
      const credentials = getToken();
      if (credentials?.access_token && credentials?.token_type) {
        axios
          .get(`api/${uri}`, {
            headers: {
              'x-access-token': credentials.access_token,
              'x-access-token-type': credentials.token_type,
              zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject({ msg: 'token is not valid' });
      }
    });
  },
  postWithToken: (uri, body) => {
    return new Promise((resolve, reject) => {
      const credentials = getToken();

      if (credentials?.access_token && credentials?.token_type) {
        axios
          .post(`api/${uri}`, body, {
            headers: {
              'x-access-token': credentials.access_token,
              'x-access-token-type': credentials.token_type,
              zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          })
          .then(response => {
            console.log('responsetoken', response);
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject({ msg: 'token is not valid' });
      }
    });
  },
  putWithToken: (uri, body) => {
    return new Promise((resolve, reject) => {
      const credentials = getToken();

      if (credentials?.access_token && credentials?.token_type) {
        axios
          .put(`api/${uri}`, body, {
            headers: {
              'x-access-token': credentials.access_token,
              'x-access-token-type': credentials.token_type,
              zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject({ msg: 'token is not valid' });
      }
    });
  },
  deleteWithToken: (uri, body) => {
    return new Promise((resolve, reject) => {
      const credentials = getToken();

      if (credentials?.access_token && credentials?.token_type) {
        axios
          .delete(`api/${uri}`, {
            headers: {
              'x-access-token': credentials.access_token,
              'x-access-token-type': credentials.token_type,
              zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject({ msg: 'token is not valid' });
      }
    });
  },
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    const originalRequest = err.config;

    console.log(err.response);
    console.log(err.response.status);

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(e => {
            return Promise.reject(e);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        const credentials = getToken();
        axios
          .get('api/user/auth/refreshToken', {
            headers: {
              'x-access-token': credentials.refresh_token,
              zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          })
          .then(({ data }) => {
            originalRequest.headers['x-access-token'] = data.access_token;
            originalRequest.headers['x-access-token-type'] =
              credentials.token_type;
            storeAccessToken(data);
            processQueue(null, data.fooToken);
            resolve(axios(originalRequest));
          })
          .catch(error => {
            processQueue(error, null);
            store.dispatch(setAccessToken(null));
            store.dispatch(setRefreshToken(null));
            reject(error);
          })
          .then(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  },
);
