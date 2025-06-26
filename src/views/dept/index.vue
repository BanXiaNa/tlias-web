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
import { ElMessage, ElMessageBox } from "element-plus";

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
const dialogRules = {
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
// 表单校验
const checkForm = () => {
  return new Promise((resolve, reject) => {
    deptForm.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        ElMessage.error("请填写正确的数据")
        reject(false)
      }
    })
  })
}

/**
 * 新增操作
 * @author BanXia
 */
// 按钮函数
const addBut = () => {
// 新增部门
  setDialogTitle('新增部门')
  setSubmit(add)
  showDialog()
}
// 新增操作
const add = async () => {
  if (await checkForm()){
    const res = await addDept(deptData.value)
    if(res.code){// 成功
      ElMessage.success("添加成功")
      closeDialog()
      await getDeptList()
    }else {// 失败
      ElMessage.error(res.msg)
    }
  }
}

/**
 * 更新操作
 * @author BanXia
 */
// 回显函数
const echo = async (deptId) => {
    const res = await queryDeptById(deptId)
    if(res.code){
      // 成功
      deptData.value.name = res.data.name
      deptData.value.id = res.data.id
      return true
    }else{
      ElMessage.error(res.msg)
      return false
    }
}
// 按钮函数
const updateBut = async (deptId) => {
  if(await echo(deptId)){
    setDialogTitle('修改部门')
    setSubmit(update)
    showDialog()
  }
}
// 更新操作
const update = async () => {
  if(await checkForm()){
    const res = await updateDept(deptData.value)
    if(res.code){// 成功
      ElMessage.success("更新成功")
      closeDialog()
      await getDeptList()
    }else {// 失败
      ElMessage.error(res.msg)
    }
  }
}

/**
 * 删除操作
 * @author BanXia
 */
// 删除部门确认框
const delByIdBox = async (deptId) => {
  // 弹出确认框
  ElMessageBox.confirm(
    '是否删除所选部门？',
    "是否删除",
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delById(deptId)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
// 删除部门
const delById = async (deptId) => {
  const res = await deleteDept(deptId)
  if(res.code){// 成功}
    ElMessage.success("删除成功")
    await getDeptList()
  }else {// 失败
    ElMessage.error(res.msg)
  }
}



</script>

<template>
<!--  Title-->
  <PageTitle>部门管理</PageTitle>

<!--  添加部门按钮-->
<!--  触发Dialog对话框-->
  <div class="container">
    <el-button type="primary" @click = "addBut()">
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
          <el-button type="primary" size="small" @click = updateBut(scope.row.id) >
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <el-button type="danger" size="small" @click = "delByIdBox(scope.row.id)">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

<!--新增&修改对话框-->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500" :before-close="closeDialog" >
    <el-form :model="deptData" :rules="dialogRules" ref = "deptForm">
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
