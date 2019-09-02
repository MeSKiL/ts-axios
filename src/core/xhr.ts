import {AxiosRequestConfig, AxiosPromise, AxiosResponse} from '../types';
import {parseHeaders} from '../helpers/headers'
import {createError} from "../helpers/error";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {data = null, url, method = 'get', headers, responseType, timeout,cancelToken} = config;
    const request = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url!, true);


    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders()); // 处理response的Headers
      const responseData = responseType !== 'text' ? request.response : request.responseText;
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      handleResponse(response); // 处理结果，抛出错误
    };

    request.onerror = function handleError() { // 请求错误。
      reject(createError('Network Error',config,null,request))
    };

    request.ontimeout = function handleTimeout() { // 超时
      reject(createError(`Timeout of ${timeout} ms exceeded`,config,'ECONNABORTED',request))
    };

    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    }); // 如果data为空，并且有content-type就去了，不然就键值对添加

    if(cancelToken){
      cancelToken.promise.then(reason => { // 如果cancelToken的promise状态变为resolve，就取消请求 promise实现异步分离
        request.abort();
        reject(reason);
      })
    }
    request.send(data);

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else{
        reject(createError(`Request failed with status code ${response.status}`,config,null,request,response))
      }
    }
  });
}
