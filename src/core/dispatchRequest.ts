import {AxiosRequestConfig, AxiosPromise, AxiosResponse} from '../types';
import xhr from './xhr'
import {buildURL} from "../helpers/url";
import {flattenHeaders} from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancelLationRequested(config); // 如果请求的config有cancelToken就看他有没有抛出过取消,抛出过取消就不请求了
  processConfig(config); // 处理config
  return xhr(config).then((res)=>{
    return transformResponseData(res) // 处理response的data
  })
}

function processConfig(config:AxiosRequestConfig):void {
  config.url = transformURL(config); // 处理URL
  config.data = transform(config.data,config.headers,config.transformRequest); // 处理config.data
  config.headers = flattenHeaders(config.headers,config.method!); // 降级合并后的headers，并删除method字段
}

function transformURL(config:AxiosRequestConfig):string {
  const {url,params} = config;
  return buildURL(url!,params) // 将params参数放入url中
}

function transformResponseData(res:AxiosResponse):AxiosResponse {
  res.data = transform(res.data,res.headers,res.config.transformResponse); // 处理 response.data
  return res
}

function throwIfCancelLationRequested(config:AxiosRequestConfig):void {
  if(config.cancelToken){ // 如果请求的config有cancelToken就看他有没有抛出过取消,抛出过取消就不请求了
    config.cancelToken.throwIfRequested()
  }
}
