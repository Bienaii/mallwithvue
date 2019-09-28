// 封装所有关于首页的请求
import {request} from "network/request";

export function getHomeMultidata(){
  return request({
    url: '/home/multidata'
  })
}
