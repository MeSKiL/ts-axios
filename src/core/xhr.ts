import {AxiosRequestConfig, AxiosPromise, AxiosResponse} from '../types';
import {parseHeaders} from '../helpers/headers'
import {createError} from "../helpers/error";
import {isURLSameOrigin} from "../helpers/url";
import {isFormData} from "../helpers/util";
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config;
    const request = new XMLHttpRequest();

    request.open(method!.toUpperCase(), url!, true);

    configureRequest();

    addEvents();

    processHeaders();

    processCancel();

    function configureRequest():void {
      if (responseType) { // 设置相应类型
        request.responseType = responseType
      }

      if (timeout) { // 设置超时时间
        request.timeout = timeout
      }

      if(withCredentials){ // 如果config里的widthCredentials为true，request的withCredentials为true，跨域请求可以带上请求域的cookie
        request.withCredentials = withCredentials
      }
    }

    function addEvents():void {

      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 0) {
          return
        }

        const responseHeaders = parseHeaders(request.getAllResponseHeaders()); // 处理response的Headers
        const responseData = responseType && responseType !== 'text' ? request.response : request.responseText;
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

      if(onDownloadProgress){
        request.onprogress = onDownloadProgress
      }

      if(onUploadProgress){
        request.upload.onprogress = onUploadProgress
      }
      // 监听下载上传进度
    }

    function processHeaders():void {
      if(isFormData(data)){ // 如果类型是FormData类型，就删除headers里的Content-Type，让浏览器自动给header
        delete headers['Content-Type']
      }

      if((withCredentials||isURLSameOrigin(url!))&&xsrfCookieName){ // 如果withCredentials(允许跨域携带cookie),或者同源同策略
        const xsrfValue = cookie.read(xsrfCookieName); // 从cookie中读取xsrfCookieName
        if(xsrfValue && xsrfHeaderName){
          headers[xsrfHeaderName] = xsrfValue // xsrfValue && xsrfHeaderName存在的话就赋值给 headers[xsrfHeaderName]
        }
      }

      if(auth){ // 有auth时 headers自动加上Authorization
        headers['Authorization'] = 'Basic '+btoa(auth.username+':'+auth.password)
      }

      Object.keys(headers).forEach((name) => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      }); // 如果data为空，并且有content-type就去了，不然就键值对添加
    }

    function processCancel():void {
      if(cancelToken){
        cancelToken.promise.then(reason => { // 如果cancelToken的promise状态变为resolve，就取消请求 promise实现异步分离
          request.abort();
          reject(reason);
        }).catch(
          /* istanbul ignore next */
          ()=>{
          // do nothing
        })
      }
      request.send(data);
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus||validateStatus(response.status)) {
        resolve(response)
      } else{
        reject(createError(`Request failed with status code ${response.status}`,config,null,request,response))
      }
    }
  });
}
