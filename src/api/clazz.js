import request from "@/utils/request";

// 班级列表查询
export const queryClazzListApi =
  (name, begin, end, page, pageSize) =>
    request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);

// 删除班级
export const deleteClazzApi = (ids) => request.delete(`/clazzs/${ids}`);

// 添加班级
export const addClazzApi = (clazz) => request.post('/clazzs', clazz);

// 根据ID查询班级
export const queryClazzByIdApi = (id) => request.get(`/clazzs/${id}`);

// 修改班级
export const updateClazzApi = (clazz) => request.put('/clazzs', clazz);

// 查询所有班级
export const queryClazzListApi = () => request.get('/clazzs/list');
