const toString = Object.prototype.toString;

export function isDate(val: any): val is Date { // 是否为日期对象
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object { // 是否为纯对象
  return toString.call(val) === '[object Object]'
}

export function isFormData(val:any):val is FormData { // 是否为FormData类型
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val:any):val is URLSearchParams { // 是否为URLSearchParams
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs:any[]):any { // 深拷贝具体方法
  const result = Object.create(null);
  objs.forEach(obj => {
    if(obj){
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if(isPlainObject(val)){
          if(isPlainObject(result[key])){
            result[key] = deepMerge(result[key],val)
          }
          result[key] = deepMerge(val)
        }else{
          result[key] = val
        }
      })
    }
  });

  return result
}
