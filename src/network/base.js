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

    export function deleteFile(filePath) {
      return request({
          method: "delete",
          url: "/file/deleteFile",
        params: {         
          path:filePath
        }
      })}