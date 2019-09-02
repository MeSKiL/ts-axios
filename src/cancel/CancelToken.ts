import {Canceler, CancelExecutor, CancelTokenSource} from "../types";
import Cancel from "./Cancel";

interface ResolvePromise {
  (reason?:Cancel):void
}

export default class CancelToken{
  promise:Promise<Cancel>;
  reason?:Cancel;

  constructor(executor:CancelExecutor){

    let resolvePromise:ResolvePromise;

    this.promise = new Promise<Cancel>(resolve=>{
      resolvePromise = resolve
    }); // 将resolve赋值给resolvePromise,执行resolvePromise时,改变promise的状态,从pending改成resolve

    executor(message => {
      if(this.reason){ // 如果this.reason有值,就说明执行过了，直接return
        return
      }
      this.reason = new Cancel(message);
      resolvePromise(this.reason)
    })  // cancel是executor的参数
  }

  throwIfRequested(){ // 如果该CancelToken的实例有reason，说明取消过了，直接抛出
    if(this.reason){
      throw this.reason
    }
  }

  static source():CancelTokenSource{
    let cancel!:Canceler;
    const token = new CancelToken(c => {
      cancel = c; // 将executor的参数(一个函数)赋值给cancel，如果调用cancel时就调用方法，改变promise状态
    });
    return {
      cancel,
      token
    }
  }
}
