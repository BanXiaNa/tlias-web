import request from "@/utils/request";

// 部门列表查询
export const queryDeptList = () => request.get('/depts')

// 根据id查询部门
export const queryDeptById = (deptId) => request.get(`/depts/${deptId}`)

// 新增部门
export const addDept = (deptName) => request.post('/depts',deptName)

// 修改部门
export const updateDept = (dept) => request.put('/depts',dept)

// 删除部门
export const deleteDept = (deptId) => request.delete(`/depts?id=${deptId}`)