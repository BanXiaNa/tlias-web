import request from "@/utils/request";

// 学生列表查询
export const queryStuListApi = (name, degree, clazzId, page, pageSize) =>
  request.get(`/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`);

// 新增学员
export const addStuApi = (stu) => request.post("/students", stu);

// 根据ID查询学员
export const queryStuByIdApi = (id) => request.get(`/students/${id}`);

// 修改学员
export const updateStuApi = (stu) => request.put("/students", stu);

// 删除学员
export const deleteStuApi = (ids) => request.delete(`/students/${ids}`);

//违纪处理
export const violationApi = (id, score) => request.put(`/students/violation/${id}/${score}`);