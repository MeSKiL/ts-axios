import {AxiosRequestConfig} from "../types";
import {isPlainObject,deepMerge} from "../helpers/util";

const strats = Object.create(null);


function defaultStrat(val1: any, val2: any): any { // val2不为空，采用val2,否则采用val1
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any { // 只采用val2
  if (typeof val2 !== "undefined") {
    return val2
  }
}

function deepMergeStrat(val1: any, val2: any): any { // 判断是否为对象，是否进行深拷贝
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}


const stratkeysFromVal2 = ['url', 'params', 'data'];

stratkeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat // url,params,data只采用val2
});

const stratKeysDeepMerge = ['headers'];
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat // headers进行深拷贝
});

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null);
  for (let key in config2) {
    mergeField(key) // config2里的key都走mergeField方法
  }

  for (let key in config1) {
    if (!config2[key]) { // config1里的并且config2里没有的key，走mergeField
      mergeField(key)
    }
  }

  function mergeField(key: string): void { // 策略模式,如果strats[key]有值(方法)，就采用strats[key]，不然就采用默认的方法
    const strat = strats[key] || defaultStrat;
    config[key] = strat(config1[key], config2![key]) // 合并,为空情况下复制config2为{}，所以类型断言
  }

  return config
}
