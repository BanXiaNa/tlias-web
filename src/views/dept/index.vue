<script setup>
import PageTitle from "@/views/style/pageTitle.vue";
import { ref, onMounted } from "vue";
import { CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import { queryDeptList,
  addDept,
  updateDept,
  deleteDept
} from "@/api/dept";
import { ElMessage } from "element-plus";

/**
 * 钩子函数
 * @author BanXia
 */
onMounted(() => {
  getDeptList();
});

/**
 * 部门列表
 * @author BanXia
 */
// 部门列表数据模型
const DeptList = ref([]);
// 获取部门列表
const getDeptList = async () => {
  const res = await queryDeptList();
  if (res.code) {
    DeptList.value = res.data;
  }
};

/**
 * Dialog表单
 * @author BanXia
 */
// Dialog表单数据
const dialogFormVisible = ref(false);
// 表单标题
const dialogTitle = ref("")
// 表单数据模型
const dept = ref({
  name: ''
});
// 设置标题
const setDialogTitle = (title) => {
  dialogTitle.value = title
}
// 弹出表单
const showDialog = () => {
  dialogFormVisible.value = true
};
// 关闭表单
const closeDialog = () => {
  dialogFormVisible.value = false
  dept.value = {}
};
// 新增部门
const addEmp = () => {
  showDialog()
  setDialogTitle('新增部门')
}
// 保存
const save = async () => {
  const res = await addDept(dept.value)

  if(res.code){// 成功
    ElMessage.success("添加成功")
    closeDialog()
    await getDeptList()
  }else {// 失败
    ElMessage.error(res.msg)
  }
}
// 校验
const rules = {
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符之间", trigger: "blur" }
  ]
};

</script>

<template>
<!--  Title-->
  <PageTitle>部门管理</PageTitle>

<!--  添加部门按钮-->
<!--  触发Dialog对话框-->
  <div class="container">
    <el-button type="primary" @click = "addEmp()">
      <el-icon><CirclePlus /></el-icon>新增部门
    </el-button>
  </div>

<!--  数据表格-->
  <div class="container">
    <el-table :data="DeptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column
        prop="name"
        label="部门名称"
        width="260"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="最后操作时间"
        width="300"
        align="center"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small"
            ><el-icon><Edit /></el-icon>编辑</el-button
          >
          <el-button type="danger" size="small"
            ><el-icon><Delete /></el-icon>删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>

<!--新增&修改对话框-->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500">
    <el-form :model="dept" :rules="rules">
      <el-form-item label="部门名称" :label-width="80" prop="name">
        <el-input v-model="dept.name"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
