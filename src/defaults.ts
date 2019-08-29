import {AxiosRequestConfig} from "./types";

const defaults:AxiosRequestConfig = {
  method:'get',
  timeout:0,
  headers:{
    common:{
      Accept:'application/json,text/plain,*/*'
    }
  }

};// 定义默认值



const methodsNoData = ['delete','get','head','options'];
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
});

// defaults.headers下的methodsNoData的默认值为{}

const methodWidthData = ['post','put','patch'];

methodWidthData.forEach(method=> {
  defaults.headers[method] = {
    'Content-Type':'application/x-www-form-urlencoded'
  }
});

// defaults.headers下的methodWidthData的默认值为{
//     'Content-Type':'application/x-www-form-urlencoded'
//   }


export default defaults
