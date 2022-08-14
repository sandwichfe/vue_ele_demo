import axios from 'axios'

export function request(config) {
    const instance = axios.create({                       //创建移 动axios的实例
        //baseURL: "http://120.26.91.154:8000",      //一定要写成ip 不要localhost 不然别的机器访问不到
        baseURL: "http://192.168.31.215:8000",      //一定要写成ip 不要localhost 不然别的机器访问不到
        timeout: 5000,
    });


    // 响应拦截
    instance.interceptors.response.use(res => {
        return res.data;
    }, err => {
        console.log(err);
    });

    return instance(config);
}
