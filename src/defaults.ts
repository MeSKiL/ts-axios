import {AxiosRequestConfig} from "./types";
import {processHeaders} from "./helpers/headers";
import {transformRequest,transformResponse} from "./helpers/data";


const defaults:AxiosRequestConfig = {
  method:'get',
  timeout:0,
  headers:{
    common:{
      Accept:'application/json,text/plain,*/*'
    }
  },

  xsrfCookieName:'XSRF-TOKEN',
  xsrfHeaderName:'X-XSRF-TOKEN',

  transformRequest:[
    function (data:any,headers:any):any {
      processHeaders(headers,data);
      return transformRequest(data)
    }
  ], // 默认处理header和request的data
  transformResponse:[
    function (data:any):any {
      return transformResponse(data) // 默认处理response的data
    }
  ],

  validateStatus(status:number):boolean{
    return status>=200&&status<300
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
