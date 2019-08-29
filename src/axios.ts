import {AxiosInstance, AxiosRequestConfig} from "./types";
import Axios from "./core/Axios";
import {extend} from './helpers/util'
import defaults from './defaults'

function createInstance(config:AxiosRequestConfig):AxiosInstance { // 工厂方法
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context); // Axios的实例axios等价为axios.request
  extend(instance,context); // 把context的方法挂到instance上
  return instance as AxiosInstance
}

const axios = createInstance(defaults); // 调用工厂函数

export default axios
