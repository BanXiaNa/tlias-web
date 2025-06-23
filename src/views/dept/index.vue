<script setup>
import PageTitle from "@/views/style/pageTitle.vue";
import { ref, onMounted } from "vue";
import { CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import { queryDeptList,
  queryDeptById,
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
// Dialog表单是否显示
const dialogFormVisible = ref(false);
// 表单标题
const dialogTitle = ref("")
// 表单校验规则
const rules = {
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符之间", trigger: "blur" }
  ]
};
// 表单响应对象
const deptForm = ref();
// 表单数据模型
const deptData = ref({
  id : '',
  name: ''
});
// 确定按钮执行的操作
const submit = ref();
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
  // 重置表单数据
  dialogFormVisible.value = false
  deptData.value = {}
  if(deptForm.value){
    deptForm.value.resetFields()
  }
};
// 更新按钮操作
const setSubmit = (operation) => {
  submit.value = operation
}

/**
 * 新增操作
 * @author BanXia
 */
// 新增按钮
const addEmp = () => {

// 新增部门
  setDialogTitle('新增部门')
  setSubmit(save)
  showDialog()
}
// 新增操作
const save = async () => {
  // 校验表单项
  // 如果表单项没有值，则不进行提交
  if(!deptForm.value)return;
  deptForm.value.validate(async (validator) => {
    // validator 是否校验通过
    if(validator){
      const res = await addDept(deptData.value)
      if(res.code){// 成功
        ElMessage.success("添加成功")
        closeDialog()
        await getDeptList()
      }else {// 失败
        ElMessage.error(res.msg)
      }
    }else{
      ElMessage.error("表单校验不通过")
    }
  })

}

/**
 * 更新操作
 */
// 更新按钮
const deit = async (deptId) => {
  // 回显部门信息
  const res = await queryDeptById(deptId)
  if(res.code){
    // 成功
    deptData.value.name = res.data.name
    deptData.value.id = res.data.id
    setDialogTitle('修改部门')
    setSubmit(update)
    showDialog()
  }else{
    ElMessage.error(res.msg)
  }
}
// 更新操作
const update = async (id) => {
  // 校验表单项
  // 如果表单项没有值，则不进行提交
  if(!deptForm.value)return;
  deptForm.value.validate(async (validator) => {
    // validator 是否校验通过
    if(validator){
      const res = await updateDept(deptData.value)
      if(res.code){// 成功
        ElMessage.success("更新成功")
        closeDialog()
        await getDeptList()
      }else {// 失败
        ElMessage.error(res.msg)
      }
    }else{
      ElMessage.error("表单校验不通过")
    }
  })

}



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
          <el-button type="primary" size="small" @click = deit(scope.row.id) >
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <el-button type="danger" size="small">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

<!--新增&修改对话框-->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500">
    <el-form :model="deptData" :rules="rules" ref = "deptForm">
      <el-form-item label="部门名称" :label-width="80" prop="name">
        <el-input v-model="deptData.name"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
