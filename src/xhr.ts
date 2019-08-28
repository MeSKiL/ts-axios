import {AxiosRequestConfig,AxiosPromise} from './types';

export default function xhr(config: AxiosRequestConfig):AxiosPromise {
  return new Promise((resolve)=>{
    const {data = null, url, method = 'get',headers,responseType} = config;
    const request = new XMLHttpRequest();

    if(responseType){
      request.responseType = responseType
    }

    request.open(method.toUpperCase(),url,true);


    Object.keys(headers).forEach((name)=>{
      if(data===null&&name.toLowerCase()==='content-type'){
        delete headers[name]
      }else{
        request.setRequestHeader(name,headers[name])
      }
    });
    request.send(data)
  });

}
