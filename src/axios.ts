import {AxiosStatic, AxiosRequestConfig} from "./types";
import Axios from "./core/Axios";
import {extend} from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel,{isCancel} from './cancel/Cancel'


function createInstance(config:AxiosRequestConfig):AxiosStatic { // 工厂方法
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context); // Axios的实例axios等价为axios.request
  extend(instance,context); // 把context的方法挂到instance上
  return instance as AxiosStatic
}

const axios = createInstance(defaults); // 调用工厂函数

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults,config)) // 合并defaults和config (合并后的结果为新的defaults)
};

axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

axios.all = function all(promises) {
  return Promise.all(promises)
}; // 封装Promise.all

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null,arr)
  }
};

axios.Axios = Axios;

export default axios
