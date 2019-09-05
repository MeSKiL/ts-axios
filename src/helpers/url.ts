import {isDate,isPlainObject,isURLSearchParams} from './util'

interface URLOrigin {
  protocol:string
  host:string
}

function encode(val:string):string {
  return encodeURIComponent(val)
    .replace(/%40/g,'@')
    .replace(/%3A/ig,':')
    .replace(/%24/g,'$')
    .replace(/%2C/ig,',')
    .replace(/%20/g,'+')
    .replace(/%5B/ig,'[')
    .replace(/%5D/ig,']')
}

export function buildURL(url:string,params?:any,paramsSerializer?:(params:any)=>string):string {
  if(!params){
    return url
  }

  let serializedParams;

  if(paramsSerializer){ // 如果有自定义序列号规则，就使用否则默认
    serializedParams = paramsSerializer(params);
  }else if(isURLSearchParams(params)){ // 如果参数是URLSearchParams
    serializedParams = params.toString()
  }else{
    const parts:string[] = [];
    Object.keys(params).forEach((key)=>{
      const val = params[key];
      if(val===null||typeof val==='undefined'){
        return
      }
      let values = [];
      if(Array.isArray(val)){ // 如果val为数组，在key后增加[]，如 a[]=1&a[]=2
        values = val;
        key += '[]'
      }else{
        values = [val]
      }
      values.forEach((val)=>{ // val为日期，特殊处理
        if(isDate(val)){
          val = val.toISOString()
        }else if(isPlainObject(val)){
          val = JSON.stringify(val);
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    });

    serializedParams = parts.join('&'); // 参数间加入&
  }



  if(serializedParams){
    const markIndex = url.indexOf('#');
    if(markIndex!==-1){
      url = url.slice(0,markIndex)
    } // 截取#之前
    url += (url.indexOf('?')===-1?"?":'&')+serializedParams // url没有?就加?，有就加&
  }
  return url
}

export function isAbsoluteURL(url:string):boolean{ // 是否为绝对地址
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL:string,relativeURL?:string):string { // 拼接两个URL，防止写的不规范
  return relativeURL?baseURL.replace(/\/+$/,'')+'/'+relativeURL.replace(/^\/+/,''):baseURL
}

export function isURLSameOrigin(requestURL:string):boolean { // 判断是否同源同策略
  const parsedOrigin = resolveURL(requestURL); // 得到传入参数的域名和策略
  return (parsedOrigin.protocol===currentOrigin.protocol&&parsedOrigin.host===currentOrigin.host)
}

const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);

function resolveURL(url:string):URLOrigin { // 用创建一个a节点可以获取url信息的方法得到传入参数的域名和策略
  urlParsingNode.setAttribute('href',url);
  const {protocol,host} = urlParsingNode;
  return {
    protocol,host
  }
}
