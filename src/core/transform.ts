import {AxiosTransformer} from "../types";

export default function transform(data:any,headers:any,fns?:AxiosTransformer|AxiosTransformer[]):any {
  if(!fns){
    return data
  } // fns是一个AxiosTransformer函数或函数数组
  if(!Array.isArray(fns)){
    fns = [fns] // 不是数组就弄成数组
  }
  fns.forEach(fn => {
    data = fn(data,headers);
  }); // 依次执行
  return data // 返回data
}
