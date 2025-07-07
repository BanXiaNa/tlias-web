<script setup>
import PageTitle from '@/views/style/pageTitle.vue'
import { onMounted, ref } from "vue";
import { queryClazzAllApi } from "@/api/clazz";
import { ElMessage, ElMessageBox } from "element-plus";
import { queryStuListApi,
  addStuApi,
  queryStuByIdApi,
  updateStuApi,
  deleteStuApi,
  violationApi} from "@/api/stu";
import { Delete, EditPen, Plus } from "@element-plus/icons-vue";

/**
 * 钩子函数
 * @author BanXia
 */
onMounted(() => {
  getClazzs()
  queryClazz()
})

/**
 * 公共数据模型
 * @author BanXia
 */

/**
 * 条件查询
 * @author BanXia
 */
// 数据模型
const searchStu = ref({
  name: '',
  degree: '',
  clazzId: ''
})
//学历列表数据
const degrees = ref([
  { name: '初中', value: 1 },
  { name: '高中', value: 2 },
  { name: '大专', value: 3 },
  { name: '本科', value: 4 },
  { name: '硕士', value: 5 },
  { name: '博士', value: 6 }])
// 班级数据模型
const clazzs = ref()
// 查询班级信息
const getClazzs = async () => {
  const res = await queryClazzAllApi();
  if (res.code) {
    clazzs.value = res.data
  } else {
    ElMessage.error(res.message)
  }
}
// 查询
const queryClazz = async () => {
  const res = await queryStuListApi(searchStu.value.name,
                                    searchStu.value.degree,
                                    searchStu.value.clazzId,
                                    currentPage.value,
                                    pageSize.value);
  if (res.code) {
    stuList.value = res.data.rows
    total.value = res.data.total
  } else {
    ElMessage.error(res.message)
  }
}
// 清空
const clear = () => {
  searchStu.value = {
    name: '',
    degree: '',
    clazzId: ''
  }
}

/**
 * 表格
 * @author BanXia
 */
// 数据模型
const stuList = ref();
// 批量删除数据模型
const delIdList= ref([])
// 多选赋值函数
const handleSelectionChange = (val) => {
  delIdList.value = val;
}

/**
 * 分页条
 * @author BanXia
 */
// 每页显示的记录数
const currentPage = ref(1);
// 每页显示的记录数
const pageSize = ref(10);
// 总记录
const total = ref(0);
// 改变页码
const handleSizeChange = () => {
  queryClazz();
}
// 改变页码
const handleCurrentChange = () => {
  queryClazz();
}

/**
 * 添加，修改操作
 */
// 表单数据模型
const stuForm = ref({
  name: '',
  no: '',
  gender: '',
  phone: '',
  idCard: '',
  isCollege: '',
  address:'',
  degree: '',
  graduationDate: '',
  clazzId: '',
})
// 性别数据模型
const genders = ref([
  { name: '男', value: 1 },
  { name: '女', value: 2 }
])
// 是否为本校学员数据模型
const isColleges = ref([
  { name: '是', value: 1 },
  { name: '否', value: 2 }
])
// 表单对象
const employeeForm = ref();
// 表单是否启动
const isOpen = ref(false);
// lable宽度
const labelWidth = ref(100);
// 表单校验操作
const rules = {
  name: [
    { required: true, message: '请输入学员姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度为2-10个字符', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '姓名仅限汉字和字母', trigger: 'blur' }
  ],
  no: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { len: 10, message: '学号为10位字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{10}$/, message: '学号仅限数字和字母', trigger: 'blur' }
    // 唯一性建议后端校验
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { len: 11, message: '手机号为11位', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号码非法', trigger: 'blur' }
    // 唯一性建议后端校验
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { len: 18, message: '身份证号为18位', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '身份证号非法', trigger: 'blur' }
    // 唯一性建议后端校验
  ],
  isCollege: [
    { required: true, message: '请选择是否院校学员', trigger: 'change' }
  ],
  address: [
    { max: 100, message: '联系地址最多100个字符', trigger: 'blur' }
  ]
}
// 标题
const title = ref();
// 确认操作
const confirm = ref();
// 取消操作
const cancel = ref();
// 关闭操作
const close = ref();
// 设置标题
const setTitle = (type) => {
  title.value = type;
}
// 打开弹窗
const openDialog = () => {
  isOpen.value = true;
}
// 关闭弹窗
const closeDialog = () => {
  isOpen.value = false;
}
// 清除表单数据
const clearTable = () => {
  stuForm.value = {
    name: '',
    no: '',
    gender: '',
    phone: '',
    idCard: '',
    isCollege: '',
    address:'',
    degree: '',
    graduationDate: '',
    clazzId: '',
  }
}
// 清除表单校验
const clearRuler = () => {
  employeeForm.value.clearValidate();
}
// 设置确认按钮行为
const setConfirm = (type) => {
  confirm.value = type;
}
// 设置取消按钮行为
const setCancel = (type) => {
  cancel.value = type;
}
// 设置关闭按钮行为
const setClose = (type) => {
  close.value = type;
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
 * 新增按钮
 * @author BanXia
 */
// 按钮触发
const addBut = () => {
  // 设置标题
  setTitle('添加学员');
  // 设置提交按钮行为
  setConfirm(submitAdd);
  // 设置取消按钮行为
  setCancel(cancelAdd);
  // 设置关闭按钮行为
  setClose(cancelAdd);
  // 打开弹窗
  openDialog();
}
// 提交操作
const submitAdd = async () => {
  if(await checkForm()){
    const res = await addStuApi(stuForm.value)
    if (res.code){
      ElMessage.success("添加学员成功");
      closeDialog();
      clearTable();
      clearRuler()
      await queryClazz()
    }else{
      ElMessage.error(res.message)
    }
  }
}
// 取消操作
const cancelAdd = () => {
//   关闭窗口
  closeDialog();
//   清理表单数据
  clearTable();
//   清除表单校验
  clearRuler();
}

/**
 * 修改按钮
 * @author BanXia
 */
// 按钮操作
const editBut = async (row) => {
  // 设置标题
  setTitle('修改学员');
  // 数据回显
  await getEmpById(row.id)
  // 设置提交按钮行为
  setConfirm(submitEdit);
  // 设置取消按钮行为
  setCancel(cancelEdit);
  // 设置关闭按钮行为
  setClose(cancelEdit);
  // 打开弹窗
  openDialog();
}
// 回显函数
const getEmpById = async (id) => {
  const res = await queryStuByIdApi(id)
  if (res.code) {
    stuForm.value = res.data
  }else {
    ElMessage.error(res.message)
  }
}
// 提交修改
const submitEdit = async () => {
  if(await checkForm()){
    const res = await updateStuApi(stuForm.value)
    if (res.code) {
      ElMessage.success("修改学员成功");
      closeDialog();
      clearTable();
      clearRuler();
      await queryClazz()
    }else{
      ElMessage.error(res.message)
    }
  }
}
// 取消操作
const cancelEdit = () => {
//   关闭窗口
  closeDialog();
//   清理表单数据
  clearTable();
//   清除表单校验
  clearRuler();
}

/**
 * 删除按钮
 * @author BanXia
 */
// 删除对话框
const delByIdBox = async (stuList) => {
  // 弹出确认框
  ElMessageBox.confirm(
    '是否删除所选学员？',
    "是否删除",
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteStuById(stuList)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
// 删除
const deleteStuById = async (stuList) => {
  if(stuList.length === 0){
    ElMessage.warning("请选择要删除的学员");
  }else{
    const IDList = [];
    for (let i = 0; i < stuList.length; i++) {
      IDList.push(stuList[i].id)
    }
    const res = await deleteStuApi(IDList)
    if (res.code) {
      ElMessage.success("删除成功");
      await queryClazz()
    }else{
      ElMessage.error(res.message)
    }
  }
}

/**
 * 违纪处理
 * @author BanXia
 */
// 违纪处理表单对象
const stuViolationForm = ref({
  id: '',
  violationScore: 0
})
// 危机处理对话框
const Discipline = ref(false)
// 显示违纪处理对话框
const showDiscipline = async (row) => {
  Discipline.value = true
  stuViolationForm.value.id = row.id
}
// 关闭窗口
const closeDiscipline = () => {
  Discipline.value = false
  stuViolationForm.value = {
    id: '',
    violationScore: ''
  }
}
// 提交处理
const submitDiscipline = async () => {
  const res = await violationApi(stuViolationForm.value.id, stuViolationForm.value.violationScore)
  if (res.code) {
    ElMessage.success("处理成功");
    closeDiscipline()
    await queryClazz()
  }else{
    ElMessage.error(res.message)
  }
}
// 取消处理
const cancelDiscipline = () => {
  closeDiscipline()
}

</script>

<template>
  <PageTitle>学员管理</PageTitle>

  <!--  搜索表单-->
  <div class="container">
    <el-form :inline="true" :model="searchStu">
      <el-form-item label="姓名">
        <el-input v-model="searchStu.name" placeholder="请输入学生姓名"></el-input>
      </el-form-item>

      <el-form-item label="最高学历">
        <el-select v-model="searchStu.degree" placeholder="请选择">
          <el-option v-for="degree in degrees" :label="degree.name" :value="degree.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属班级">
        <el-select v-model="searchStu.clazzId" placeholder="请选择">
          <el-option v-for="clazz in clazzs" :label="clazz.name" :value="clazz.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryClazz">查询</el-button>
        <el-button @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--  新增&删除按钮-->
  <div class="container">
    <el-button type="primary" @click="addBut"> + 新增学员</el-button>
    <el-button type="danger" @click="delByIdBox(delIdList)"> - 批量删除</el-button>
  </div>

<!--  表格-->
<div class="container">
    <el-scrollbar max-height="600">
      <el-table
        :data="stuList"
        border style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="name" label="姓名" width="90" align="center"/>
        <el-table-column prop="no" label="学号" width="110" align="center"/>
        <el-table-column prop="clazzName" label="班级" width="140" align="center"/>
        <el-table-column label="性别" width="120"  align="center">
          <template #default="scope">
            {{ scope.row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"  align="center"/>
        <el-table-column prop="degree" label="最高学历" width="120"  align="center">
          <template #default="scope">
            <span v-if="scope.row.degree === 1">初中</span>
            <span v-else-if="scope.row.degree === 2">高中</span>
            <span v-else-if="scope.row.degree === 3">大专</span>
            <span v-else-if="scope.row.degree === 4">本科</span>
            <span v-else-if="scope.row.degree === 5">硕士</span>
            <span v-else-if="scope.row.degree === 6">博士</span>
            <span v-else>其他</span>
          </template>
        </el-table-column>
        <el-table-column prop="violationCount" label="违纪次数" width="90"  align="center"/>
        <el-table-column prop="violationScore" label="违纪扣分" width="90"  align="center"/>
        <el-table-column prop="updateTime" label="最后操作时间" width="180"  align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editBut(scope.row)"><el-icon><EditPen /></el-icon> 编辑</el-button>
            <el-button type="primary" size="small" @click="showDiscipline(scope.row)"><el-icon><EditPen /></el-icon> 违纪</el-button>
            <el-button type="danger" size="small" @click="delByIdBox([scope.row])"><el-icon><Delete /></el-icon> 删除</el-button>
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

<!--  新增&修改对话框-->
  <el-dialog v-model="isOpen" :title="title" width="50%">
    <el-form :model="stuForm" ref="employeeForm" :rules="rules">
      <!-- 第一行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" :label-width="labelWidth" prop="name">
            <el-input v-model="stuForm.name" placeholder="请输入学员姓名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" :label-width="labelWidth" prop="no">
            <el-input v-model="stuForm.no" placeholder="请输入学员学号"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" :label-width="labelWidth"  prop="gender">
            <el-select v-model="stuForm.gender" placeholder="请选择" style="width: 100%;">
              <el-option v-for="gender in genders" :label="gender.name" :value="gender.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" :label-width="labelWidth"  prop="phone">
            <el-input v-model="stuForm.phone" placeholder="请输入手机号"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证号" :label-width="labelWidth"  prop="idCard">
            <el-input v-model="stuForm.idCard" placeholder="请输入身份证号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否院校" :label-width="labelWidth" prop="isCollege">
            <el-select v-model="stuForm.isCollege" placeholder="请选择" style="width: 100%;">
              <el-option v-for="w in isColleges" :label="w.name" :value="w.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系地址" :label-width="labelWidth">
            <el-input v-model="stuForm.address" placeholder="请输入联系地址"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高学历" :label-width="labelWidth">
            <el-select v-model="stuForm.degree" placeholder="请选择" style="width: 100%;">
              <el-option v-for="degree in degrees" :label="degree.name" :value="degree.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>


      <!-- 第五行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="毕业时间" :label-width="labelWidth">
            <el-date-picker v-model="stuForm.graduationDate" type="date" placeholder="请选择毕业时间" value-format="YYYY-MM-DD" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属班级" :label-width="labelWidth">
            <el-select v-model="stuForm.clazzId" placeholder="请选择" style="width: 100%;">
              <el-option v-for="clazz in clazzs" :label="clazz.name" :value="clazz.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">保存</el-button>
      </span>
    </template>
  </el-dialog>

<!--  违纪处理对话框-->
  <el-dialog v-model="Discipline" title="违纪处理" width="50%">
    <el-form :model="stuViolationForm">
      <el-row>
        <el-col :span="6"></el-col>
        <el-col :span="12">
          <el-form-item label="违纪扣分" prop="violationScore">
            <el-input v-model.number="stuViolationForm.violationScore" placeholder="请输入违纪扣分"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelDiscipline">取消</el-button>
        <el-button type="primary" @click="submitDiscipline">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>