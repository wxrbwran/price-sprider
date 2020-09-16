import axios from 'axios';

const title = function(title) {
  title = title ? title + ' - Home' : 'xr';
  window.document.title = title;
};
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const ajaxUrl =
  // process.env.NODE_ENV === 'development'?
  'http://127.0.0.1:3000';
// : process.env.NODE_ENV === 'production'
// ? 'https://www.url.com'
// : 'https://debug.url.com';
const nameSpace = '/api/v0/';

const ajax = axios.create({
  baseURL: ajaxUrl + nameSpace,
  timeout: 20000,
});
ajax.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      return Promise.reject(res.msg);
    }
    return res.data.data;
  },
  (error) => Promise.reject(error.response.status),
);
export default {
  title,
  ajax,
};
