import { request } from "./request";

export function getFileList(filePath, queryWord) {
    return request({
        method: "post",
        url: "/file/list1",
      params: {         
        path:filePath,
        keyword:queryWord,
      }
    })}