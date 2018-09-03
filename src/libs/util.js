import axios from 'axios';
import env from '../config/env';

const title = function(title) {
  title = title ? title + ' - Home' : 'iView project';
  window.document.title = title;
};

const ajaxUrl = env === 'development' ?
  'http://127.0.0.1:3000' :
  env === 'production' ?
  'https://www.url.com' :
  'https://debug.url.com';
const nameSpace = '/api/v0/';

const ajax = axios.create({
  baseURL: ajaxUrl + nameSpace,
  timeout: 20000
});
ajax.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      return Promise.reject(res.msg);
    }
    return res.data.data;
  },
  error => Promise.reject(error.response.status),
);
export default {
  title,
  ajax
};