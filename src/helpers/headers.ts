import {deepMerge, isPlainObject} from "./util";
import {Method} from "../types";

function normalizeHeaderName(headers:any,normalizedName:string):void {
  if(!headers){
    return
  }
  Object.keys(headers).forEach((name)=>{
    if(name!==normalizedName&&name.toUpperCase()===normalizedName.toUpperCase()){
      headers[normalizedName] = headers[name];
      delete headers[name]
    }
  })
}

export function processHeaders(headers:any,data:any):any {
  normalizeHeaderName(headers,'Content-Type');
  if(isPlainObject(data)){ // 如果data是对象，并且没有headers中没有Content-Type，
    if(headers&&!headers['Content-Type']){
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers:string):any { // 处理headers，将规则的字符串转为对象
  let parsed = Object.create(null);
  if(!headers){
    return parsed
  }

  headers.split('\r\n').forEach((line)=>{
    let [key,val] = line.split(':');
    key = key.trim().toLowerCase();
    if(!key){
      return
    }
    if(val){
      val = val.trim()
    }
    parsed[key] = val
  });
  return parsed
}

export function flattenHeaders(headers:any,method:Method):any {
  if(!headers){
    return headers
  }

  headers = deepMerge(headers.common,headers[method],headers); // 深拷贝headers.common,headers[Method](请求方法)的方法,和传入headers里的方法

  const methodsToDelete = ['delete','get','head','options','post','put','patch','common']; // 删除不必要的属性

  methodsToDelete.forEach(method => {
    delete headers[method]
  });
  return headers
}
