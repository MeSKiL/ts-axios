import {AxiosRequestConfig, AxiosPromise, AxiosResponse} from '../types';
import xhr from './xhr'
import {buildURL} from "../helpers/url";
import {transformRequest,transformResponse} from "../helpers/data";
import {flattenHeaders, processHeaders} from '../helpers/headers'


export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config); // 处理config
  return xhr(config).then((res)=>{
    return transformResponseData(res) // 处理response的data
  })
}

function processConfig(config:AxiosRequestConfig):void {
  config.url = transformURL(config); // 处理URL
  config.headers = transformHeaders(config); // 处理Header
  config.data = transformRequestData(config); // 处理data
  config.headers = flattenHeaders(config.headers,config.method!); // 降级合并后的headers，并删除method字段
}

function transformURL(config:AxiosRequestConfig):string {
  const {url,params} = config;
  return buildURL(url!,params) // 将params参数放入url中
}

function transformRequestData(config:AxiosRequestConfig):any {
  return transformRequest(config.data) // 处理data
}

function transformHeaders(config:AxiosRequestConfig):any {
  const {headers = {},data} = config;
  return processHeaders(headers,data) // 处理Headers
}

function transformResponseData(res:AxiosResponse):AxiosResponse {
  res.data = transformResponse(res.data);
  return res
}
