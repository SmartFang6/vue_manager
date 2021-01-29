import axios from 'axios';
const http = {};
http.install = (Vue) => {
  axios.defaults.baseURL=""
  axios.interceptors.request(config => {
    return config
  })
  axios.interceptors.response(config => {
    return config.data
  })
  Vue.prototype.$axios = axios;
}
module.exports = http;