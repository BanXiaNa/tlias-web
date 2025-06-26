import request from "@/utils/request";

// 员工列表查询
export const queryPageApi = (name, gender, begin, end, page, pageSize) =>
  request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);
// 根据id查询员工
// 新增员工
export const addApi = (emp) => request.post('/emps',emp)
// 修改员工
// 删除员工
// 删除头像
export const deleteAvatarApi = (path) => request.delete(`/delete?path=${encodeURIComponent(path)}`)