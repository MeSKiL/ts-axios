import {isPlainObject} from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data) // 如果是data是对象就转json
  }
  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') { // 如果是string就尝试转对象，转不了就直接返回
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
