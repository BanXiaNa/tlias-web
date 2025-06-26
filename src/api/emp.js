import request from "@/utils/request";

// 员工列表查询
export const queryPageApi = (name, gender, begin, end, page, pageSize) =>
  request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);
// 根据id查询员工
export const queryByIdApi = (id) => request.get(`/emps/${id}`)
// 新增员工
export const addApi = (emp) => request.post('/emps',emp)
// 修改员工
export const updateApi = (emp) => request.put(`/emps`, emp)
// 删除员工
export const deleteApi = (ids) => request.delete(`/emps?ids=${ids}`)
// 删除头像
export const deleteAvatarApi = (path) => request.delete(`/delete?path=${encodeURIComponent(path)}`)
// 根据职位查找 员工
export const queryEmpByJobIdApi = (jobId) => request.get(`/emps/job?jobId=${jobId}`)