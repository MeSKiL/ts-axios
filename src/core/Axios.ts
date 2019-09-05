import {AxiosPromise, AxiosRequestConfig, AxiosResponse, Method, RejectedFn, ResolvedFn} from "../types";
import dispatchRequest,{transformURL} from "./dispatchRequest";
import InterceptorManager from './interceptorManager'
import mergeConfig from "./mergeConfig";

interface Interceptors { // 拦截器接口
  request:InterceptorManager<AxiosRequestConfig> // 拦截器类(仅暴露出use eject)
  response:InterceptorManager<AxiosResponse>
}

interface PromiseChain<T>{ // 拦截器链
  resolved:ResolvedFn<T>|((config:AxiosRequestConfig)=>AxiosPromise)
  rejected?:RejectedFn
}

export default class Axios{ // 暴露出去的类

  defaults:AxiosRequestConfig; // config默认值

  interceptors:Interceptors; // 拦截器

  constructor(initConfig:AxiosRequestConfig){
    this.defaults = initConfig;
    this.interceptors = {
      request:new InterceptorManager<AxiosRequestConfig>(),
      response:new InterceptorManager<AxiosResponse>()
      // 值为InterceptorManager对象实例
    }
  }

  request(url:any,config?:any):AxiosPromise{ // request方法
    if(typeof url ==='string'){ // 重载,兼容axios('xxx/xxx',{})，但是不暴露
      if(!config){
        config = {}
      }
      config.url = url
    }else{
      config = url
    }
    config = mergeConfig(this.defaults,config); // 合并默认与传入配置

    const chain:PromiseChain<any>[] = [{
      resolved:dispatchRequest, // 具体实现请求的方法
      rejected:undefined
    }];
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor) // request拦截器倒序放在despatchRequest前面
    });

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor) // response拦截器顺序放在despatchRequest后面
    });

    let promise = Promise.resolve(config);

    while(chain.length){
      // chain 为request倒序在前，参数为AxiosRequestConfig类型，dispatchRequest在中间，然后参数变为AxiosResponse，response的拦截器顺序在后面
      const{resolved,rejected} = chain.shift()!;
      promise = promise.then(resolved,rejected)
    }

    return promise
  }

  get(url:string,config?:AxiosRequestConfig):AxiosPromise{
    return this._requestMethodWithoutData('get',url,config)
  }
  delete(url:string,config?:AxiosRequestConfig):AxiosPromise{
    return this._requestMethodWithoutData('delete',url,config)
  }
  head(url:string,config?:AxiosRequestConfig):AxiosPromise{
    return this._requestMethodWithoutData('head',url,config)
  }
  options(url:string,config?:AxiosRequestConfig):AxiosPromise{
    return this._requestMethodWithoutData('options',url,config)
  } // 不需要data，代码重复封装成一个方法


  post(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise{
    return this._requestMethodWithData('post',url,data,config)
  }

  put(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise{
    return this._requestMethodWithData('put',url,data,config)
  }

  patch(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise{
    return this._requestMethodWithData('patch',url,data,config)
  } // 需要data，代码重复封装成一个方法

  getUri(config?:AxiosRequestConfig):string{
    config = mergeConfig(this.defaults,config);
    return transformURL(config)
  }

  _requestMethodWithoutData(method:Method,url:string,config?:AxiosRequestConfig){
    return this.request(Object.assign(config||{},{
      method,
      url
    }))
  }
  _requestMethodWithData(method:Method,url:string,data?:any,config?:AxiosRequestConfig){
    return this.request(Object.assign(config||{},{
      method,
      url,
      data
    }))
  }
}
