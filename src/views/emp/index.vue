<script setup>
import PageTitle from "@/views/style/pageTitle.vue";
import { onMounted, ref, watch } from "vue";
import { Delete, EditPen, Plus } from "@element-plus/icons-vue";
import { addApi, deleteAvatarApi, queryByIdApi, queryPageApi, updateApi, deleteApi} from "@/api/emp";
import { ElMessage, ElMessageBox } from "element-plus";
import { queryDeptList } from "@/api/dept";

/**
 * 钩子函数
 * author: BanXia
 */
onMounted(() => {
  // 页面加载时查询数据
  handleSearch()
  // 获取部门列表
  getDeptList()
})


/**
 * 搜索表单
 * author: BanXia
 */
// 数据模型
const searchEmp = ref({
  name: "",
  gender: "",
  date: [],
  begin: "",
  end: ""
})
// 监听函数
watch(() => searchEmp.value.date,(newValue) => {
    if(newValue.length === 2){
      searchEmp.value.begin = newValue[0]
      searchEmp.value.end = newValue[1]
    }else {
      searchEmp.value.begin = ''
      searchEmp.value.end = ''
    }
  })
// 查询函数
const handleSearch = async () => {
  const result = await queryPageApi(searchEmp.value.name, searchEmp.value.gender, searchEmp.value.begin, searchEmp.value.end, currentPage.value, pageSize.value)
  if (result.code) {
    empList.value = result.data.rows
    total.value = result.data.total
  } else {
    ElMessage.error(res.message)
  }
};
// 清空函数
const handleReset = () => {
  searchEmp.value = {
    name: "",
    gender: "",
    date: [],
    begin: "",
    end: ""
  }
  handleSearch()
};

/**
 * 新增&删除按钮
 * author: BanXia
 */


/**
 * 表格
 */
// 数据模型
const empList = ref([]);
// 批量删除数据模型
const delIdList= ref([])
// 多选赋值函数
const handleSelectionChange = (val) => {
  delIdList.value = val;
}

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
 * 新增，修改对话框
 * @author BanXia
 */
// 表单对象
const employeeForm = ref(null);
// 数据模型
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})
// 性别模型
const genderList = ref([
  { name: '男', value: 1 },
  { name: '女', value: 2 }])
//职位列表数据
const jobList = ref([
  { name: '班主任', value: 1 },
  { name: '讲师', value: 2 },
  { name: '学工主管', value: 3 },
  { name: '教研主管', value: 4 },
  { name: '咨询师', value: 5 },
  { name: '其他', value: 6 }])
// 控制弹窗
const dialogVisible = ref(false)
// 标题
const dialogTitle = ref()
// 所属部门数据模型
const deptList = ref([])
//表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ]
});
// 确认操作
const confirm = ref()
// 取消操作
const cancel = ref()
// 关闭操作
const close = ref()
// 打开对话框
const openDialog = () => {
  dialogVisible.value = true
}
// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  employeeForm.value.resetFields();
}
// 清空数据模型
const clearEmp = () => {
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  }
}
// 设置确认操作
const setConfirm = (func) => {
  confirm.value = func
}
// 设置取消操作
const setCancel = (func) => {
  cancel.value = func
}
// 设置关闭操作
const setClose = (func) => {
  close.value = func
}
// 设置标题
const setDialogTitle = (title) => {
  dialogTitle.value = title
}
// 查询部门列表
const getDeptList = async () => {
  const res = await queryDeptList()
  if (res.code){
    deptList.value = res.data
  }else{
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
 * 头像上传
 * @author BanXia
 */
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  employee.value.image = response.data
  ElMessage.success("上传成功")
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  deleteAvatar(employee.value.image)
  return true
}
// 删除头像
const deleteAvatar = async () => {
  if(employee.value.image.length){
    const path = employee.value.image.replace(/^https?:\/\/[^\/]+\//, "");
    await deleteAvatarApi(path)
  }
}
// 通过url组删除头像
const deleteAvatarByUrl = async (urls) => {
  urls = urls.replace(/^https?:\/\/[^\/]+\//, "");
  await deleteAvatarApi(urls)
}
/**
 * 工作经历
 * @author BanXia
 */
// 工作经历
const expr = ref({
  company: '',
  job: '',
  begin: '',
  end: '',
  date: []
})
// 添加工作经历
const addExpr = () => {
  employee.value.exprList.push({
    company: '',
    job: '',
    begin: '',
    end: '',
    date: []
  })
}
// 删除工作经历
const deleteExpr = async (index) => {
  employee.value.exprList.splice(index, 1)
}
// 深度监听时间
watch(employee, () => {
  if(employee.value.exprList) {
    employee.value.exprList.forEach(expr => {
      expr.begin = expr.date[0]
      expr.end = expr.date[1]
    })
  }
}, {deep: true})

/**
 * 新增员工
 * @author BanXia
 */
// 按钮触发
const addEmpBut = async () => {
  // 设置确认操作
  setConfirm(addEmp)
  // 设置取消操作
  setCancel(cancelCreate)
  // 设置关闭操作
  setClose(cancelCreate)
  // 设置标题
  setDialogTitle('新增员工');
  // 打开表单
  openDialog();
}
// 新增操作
const addEmp = async () => {
  if(await checkForm()){
    const res = await addApi(employee.value)
    if (res.code) {
      ElMessage.success("新增成功")
      clearEmp()
      closeDialog()
      await handleSearch()
    } else {
      ElMessage.error(res.message)
    }
  }
}
// 取消创建
const cancelCreate = () => {
  deleteAvatar()
  clearEmp()
  closeDialog()
}

/**
 * 修改员工
 * @author BanXia
 */
// 按钮触发
const updateBut = async (empId) => {
  // 回显员工
  await getEmpById(empId)
  // 设置确认操作
  setConfirm(updateEmp)
  // 设置取消操作
  setCancel(cancelUpdate)
  // 设置关闭操作
  setClose(cancelUpdate)
  // 设置标题
  setDialogTitle('编辑员工');
  // 打开表单
  openDialog();
}
// 回显员工
const getEmpById = async (empId) => {
  const res = await queryByIdApi(empId)
  if (res.code) {
    employee.value = res.data
    employee.value.exprList.forEach(expr => {
      expr.date = [expr.begin, expr.end]
    })
  } else {
    ElMessage.error(res.message)
  }
}
// 提交编辑
const updateEmp = async () => {
  if (await checkForm()) {
    const res = await updateApi(employee.value)
    if(res.code){
      ElMessage.success("更新成功")
      await handleSearch()
      closeDialog()
    }else {
      ElMessage.error(res.message)
    }
  }
}
// 取消操作
const cancelUpdate = () => {
  closeDialog();
  clearEmp();
}

/**
 * 删除员工
 * @author BanXia
 */
// 删除员工确认框
const delByIdBox = async (emp) => {
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
      deleteEmpById(emp)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
// 批量删除员工确认框
const delByIdsBox = async (emp) => {
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
      deleteEmpById(emp)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
// 删除员工
const deleteEmpById = async (emp) => {
  if(emp.length === 0){
    ElMessage.error("请至少选择一名员工")
    return;
  }
  const delIdList = [];
  for (let i = 0; i < emp.length; i++) {
    await deleteAvatarByUrl(emp[i].image)
    delIdList.push(emp[i].id)
  }
  const res = await deleteApi(delIdList)
  if(res.code){
    await handleSearch()
    ElMessage.success("删除成功")
  }else{
    ElMessage.error(res.message)
  }
}
</script>

<template>
  <PageTitle>员工管理</PageTitle>

<!--  搜索表单-->
  <div class="container">
    <el-form :inline="true" :model="searchEmp">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名"></el-input>
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="入职日期">
        <el-date-picker
          v-model="searchEmp.date"
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

<!--  新增&删除按钮-->
  <div class="container">
    <el-button type="primary" @click="addEmpBut"> + 新增员工</el-button>
    <el-button type="danger" @click="delByIdsBox(delIdList)"> - 批量删除</el-button>
  </div>

<!--  数据表格-->
  <div class="container">
    <el-scrollbar max-height="600">
      <el-table
        :data="empList"
        border style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="name" label="姓名" width="120" align="center"/>
        <el-table-column label="性别" width="120"  align="center">
          <template #default="scope">
            {{ scope.row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column label="头像" width="120"  align="center">
          <template #default="scope">
            <img v-if="scope.row.image" :src="scope.row.image" height="30px" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="所属部门" width="120"  align="center"/>
        <el-table-column prop="job" label="职位" width="120"  align="center">
          <template #default="scope">
            <span v-if="scope.row.job === 1">班主任</span>
            <span v-else-if="scope.row.job === 2">讲师</span>
            <span v-else-if="scope.row.job === 3">学工主管</span>
            <span v-else-if="scope.row.job === 4">教研主管</span>
            <span v-else-if="scope.row.job === 5">咨询师</span>
            <span v-else>其他</span>
          </template>
        </el-table-column>
        <el-table-column prop="entryDate" label="入职日期" width="180"  align="center"/>
        <el-table-column prop="updateTime" label="最后操作时间" width="200"  align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="updateBut(scope.row.id)"><el-icon><EditPen /></el-icon> 编辑</el-button>
            <el-button type="danger" size="small" @click="delByIdBox([scope.row])"><el-icon><Delete /></el-icon> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

  </div>

<!-- 分页条 -->
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

<!--  上传/修改对话框-->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :before-close="close">
    <el-form
      :model="employee"
      label-width="80px"
      :rules="rules"
      ref="employeeForm"
      >
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;" >
              <el-option v-for="gender in genderList" :key="gender.name" :label="gender.name" :value="gender.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
              <el-option v-for="job in jobList" :key="job.name" :label="job.name" :value="job.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
              <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="employee.image" :src="employee.image" class="avatar"  alt=""/>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>


      <!-- 工作经历 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click="addExpr">+ 添加工作经历</el-button>
          </el-form-item>
        </el-col>
      </el-row>

<!--       第七行 ...  工作经历 -->
      <el-row :gutter="3" v-for="(exprItem , index) in employee.exprList">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker v-model="exprItem.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input v-model="exprItem.company" placeholder="请输入公司名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input v-model="exprItem.job" placeholder="请输入职位"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click = "deleteExpr(index)">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">保存</el-button>
        </span>
    </template>
  </el-dialog>

</template>

<style scoped>
.container {
  margin: 10px 0;
}
.avatar {
  height: 40px;
}
.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>