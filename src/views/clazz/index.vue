<script setup>
import PageTitle from '@/views/style/pageTitle.vue'
import { onMounted, ref, watch } from "vue";
import { Delete, EditPen, Plus } from "@element-plus/icons-vue";
import { addClazzApi, deleteClazzApi, queryClazzByIdApi, queryClazzListApi, updateClazzApi } from "@/api/clazz";
import { ElMessage, ElMessageBox } from "element-plus";
import { queryEmpByJobIdApi } from "@/api/emp";

/**
 * 钩子函数
 * @author BanXia
 */
onMounted(() => {
  // 获取班级列表
  handleSearch();
  // 查询班主任
  queryEmpByJobId(1);
})

/**
 * 搜索栏
 * @author BanXia
 */
// 数据模型
const searchClazz = ref({
  name: "",
  date: [],
  begin: "",
  end: ""
})
// 监听函数
watch(() => searchClazz.value.date,(newValue) => {
  if(newValue.length === 2){
    searchClazz.value.begin = newValue[0]
    searchClazz.value.end = newValue[1]
  }else {
    searchClazz.value.begin = ''
    searchClazz.value.end = ''
  }
})
// 查询函数
const handleSearch = async () => {
  const result = await queryClazzListApi(
    searchClazz.value.name,
    searchClazz.value.begin,
    searchClazz.value.end,
    currentPage.value,
    pageSize.value)
  if (result.code) {
    clazzList.value = result.data.rows
    total.value = result.data.total
  } else {
    ElMessage.error(res.message)
  }
};
// 清空函数
const handleReset = () => {
  searchClazz.value = {
    name: "",
    date: [],
    begin: "",
    end: ""
  }
  handleSearch()
};

/**
 * 数据表格
 * @author BanXia
 */
// 数据模型
const clazzList = ref([])

/**
 * 分页条
 */
// 每页显示的记录数
const currentPage = ref(1);
// 每页显示的记录数
const pageSize = ref(10);
// 总记录
const total = ref(0);
// 改变页码
const handleSizeChange = () => {
  handleSearch();
}
// 改变页码
const handleCurrentChange = () => {
  handleSearch();
}

/**
 * 添加&修改表单
 * @author BanXia
 */
// 数据模型
const clazz = ref({
  name: "",
  room: "",
  beginDate: "",
  endDate: "",
  masterId: "",
  subject: "",
});
// 班主任列表
const masterList = ref([]);
// 学科数据模型
const subjects = ref([
  { name: 'Java', value: 1 },
  { name: '前端', value: 2 },
  { name: '大数据', value: 3 },
  { name: 'Python', value: 4 },
  { name: 'Go', value: 5 },
  { name: '嵌入式', value: 6 }])
// 表单对象
const employeeForm = ref();
// 标题
const dialogTitle = ref("");
// 对话框控制器
const dialogVisible = ref(false);
// 表单校验规则
const rules = ref({
  name: [
    { required: true, message: '班级名称为必填项', trigger: 'blur' },
    { min: 4, max: 30, message: '用户名长度为4-30个字', trigger: 'blur' }
  ],
  room: [
    { min: 1, max: 20, message: '班级教室长度为1-20个字', trigger: 'blur' }
  ],
  beginDate: [{ required: true, message: '开课时间为必填项', trigger: 'change' }],
  endDate: [{ required: true, message: '结课时间为必填项', trigger: 'change' }],
  subject: [{ required: true, message: '学科为必填项', trigger: 'change' }]
})
// 确认操作
const confirm = ref();
// 取消操作
const cancel = ref();
// 关闭操作
const close = ref()
// 打开对话框
const openDialog = () =>{
  dialogVisible.value = true;
}
// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
  clear()
  clearValidate()
}
// 清除数据
const clear = () => {
  clazz.value = {
    name: "",
    room: "",
    beginDate: "",
    endDate: "",
    masterId: "",
    subject: "",
  }
}
// 清除表单验证
const clearValidate = () => {
  employeeForm.value.clearValidate();
}
// 设置标题
const setDialogTitle = (title) => {
  dialogTitle.value = title;
}
// 设置确认操作
const setConfirm = (func) =>{
  confirm.value = func;
}
// 设置取消操作
const setCancel = (func) =>{
  cancel.value = func;
}
// 设置关闭操作
const setClose = (func) => {
  close.value = func;
}
// 查询班主任
const queryEmpByJobId = async (jobId) => {
  const res = await queryEmpByJobIdApi(jobId);
  if (res.code) {
    masterList.value = res.data
  } else {
    ElMessage.error(res.message)
  }
}
// 校验表单
const checkForm = () => {
  return new Promise((resolve, reject) => {
    employeeForm.value.validate(valid => {
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
 * 添加操作
 * @author BanXia
 */
// 添加按钮
const addBut = () => {
  // 设置标题
  setDialogTitle('添加班级');
  // 添加操作设置
  setConfirm(addClazz);
  // 取消操作设置
  setCancel(cancelCreateDialog);
  // 关闭操作设置
  setClose(cancelCreateDialog);
  // 打开对话框
  openDialog();
}
// 添加操作
const addClazz = async () => {
  if(await checkForm()){
    const res = await addClazzApi(clazz.value);
    if (res.code) {
      ElMessage.success("添加成功");
      // 刷新列表
      await handleSearch();
      // 关闭对话框
      closeDialog();
    } else {
      ElMessage.error(res.message);
    }
  }else{
    ElMessage.error("请填写正确的信息");
  }
}
// 关闭添加对话框
const cancelCreateDialog = () => {
// 关闭对话框
  closeDialog();
}

/**
 * 更新操作
 * @author BanXia
 */
// 更新按钮
const updateBut = (clazzId) => {
  // 设置标题
  setDialogTitle('修改班级');
  // 回显操作
  echoUpdate(clazzId)
  // 添加操作设置
  setConfirm(updateClazz);
  // 取消操作设置
  setCancel(cancelUpdateButDialog);
  // 关闭操作设置
  setClose(cancelUpdateButDialog);
  // 打开对话框
  openDialog();
}
// 回显操作
const echoUpdate = async (clazzId) => {
  const res = await queryClazzByIdApi(clazzId)
  if(res.code){
    clazz.value = res.data;
  }else{
    ElMessage.error(res.message);
  }
}
// 更新操作
const updateClazz = async () => {
  if(await checkForm()){
    const res = await updateClazzApi(clazz.value);
    if (res.code) {
      ElMessage.success("修改成功");
      // 刷新列表
      await handleSearch();
      // 关闭对话框
      closeDialog();
    } else {
      ElMessage.error(res.message);
    }
  }else{
    ElMessage.error("请填写正确的信息");
  }

}
// 关闭添加对话框
const cancelUpdateButDialog = () => {
// 关闭对话框
  closeDialog();
}

/**
 * 删除操作
 */
// 确认删除对话框
const delByIdBox = async (deptId) => {
  // 弹出确认框
  ElMessageBox.confirm(
    '是否删除所选员工？',
    "是否删除",
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteDept(deptId)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
// 删除操作
const deleteDept = async (deptId) => {
  const res = await deleteClazzApi(deptId)
  if(res.code){
    // 刷新
    await handleSearch();
    ElMessage.success("删除成功")
  }else{
    ElMessage.error(res.msg)
  }
}

</script>

<template>
  <PageTitle>班级管理</PageTitle>


  <!--  搜索表单-->
  <div class="container">
    <el-form :inline="true" :model="searchClazz">
      <el-form-item label="班级名称">
        <el-input v-model="searchClazz.name" placeholder="请输入班级名称"></el-input>
      </el-form-item>

      <el-form-item label="结课时间">
        <el-date-picker
          v-model="searchClazz.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

<!--  添加按钮-->
  <div class="container">
    <el-button type="primary" @click="addBut">添加班级</el-button>
  </div>

<!--  数据表格-->
  <div class="container">
    <el-scrollbar max-height="600">
      <el-table
        :data="clazzList"
        border style="width: 100%">
        <el-table-column prop="id" label="序号" width="55" align="center"/>
        <el-table-column prop="name" label="班级名称" width="150" align="center"/>
        <el-table-column prop="room" label="班级教室" width="100" align="center"/>
        <el-table-column prop="masterName" label="班主任" width="100" align="center"/>
        <el-table-column prop="beginDate" label="开课时间" width="120" align="center"/>
        <el-table-column prop="endDate" label="结课时间" width="120" align="center"/>
        <el-table-column prop="status" label="状态" width="70" align="center"/>
        <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="updateBut(scope.row.id)"><el-icon><EditPen /></el-icon> 编辑</el-button>
            <el-button type="danger" size="small" @click="delByIdBox(scope.row.id)"><el-icon><Delete /></el-icon> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

  </div>

<!--  分页条-->
  <div class="container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 50, 75, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

<!--  添加&修改表单-->
<el-dialog
  v-model="dialogVisible"
  :title="dialogTitle"
  :before-close="close"
  width="35%">
      <el-form
        :model="clazz"
        label-width="80"
        :rules="rules"
        ref="employeeForm"
      >
        <!-- 基本信息 -->
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="班级名称" prop="name">
            <el-input v-model="clazz.name" placeholder="请输入班级名称 如：半夏一班"></el-input>
          </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="班级教室" prop="room">
              <el-input v-model="clazz.room" placeholder="请填写班级教室"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="开课时间" prop="beginDate">
              <el-date-picker v-model="clazz.beginDate"
                              type="date"
                              value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="结课时间" prop="endDate">
              <el-date-picker  v-model="clazz.endDate"
                               type="date"
                               value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="班主任">
              <el-select v-model="clazz.masterId" placeholder="请选择" style="width: 100%;">
                <el-option v-for="master in masterList" :key="master.name" :label="master.name" :value="master.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="学科" porp = "subject">
              <el-select v-model="clazz.subject" placeholder="请选择" style="width: 100%;">
                <el-option v-for="subject in subjects" :key="subject.name" :label="subject.name" :value="subject.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <el-row :gutter="20">
          <el-col :span="10" align="right">
            <el-button @click="cancel">取消</el-button>
          </el-col>
          <el-col :span="10" align="center">
            <el-button type="primary" @click="confirm">保存</el-button>
          </el-col>
        </el-row>


      </el-form>

    </el-dialog>


</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>