<script setup>

import {
  Avatar,
  EditPen,
  Grid, Histogram,
  StarFilled,
  SwitchButton,
  UserFilled
} from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

// 钩子函数
onMounted(() => {
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  if (loginData && loginData.name){
    userName.value = loginData.name
  }
})

const router = useRouter()

const logOut = () => {
  // 弹出确认框
  ElMessageBox.confirm(
    '退出登录吗？',
    "退出",
    {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      localStorage.removeItem("loginData")
      router.push("/login")
      ElMessage({
        type: 'success',
        message: '已退出登录',
      })
    })
    .catch(() => {
      ElMessage.info("已取消退出登录")
    })
}

// 当前登录的员工
const userName = ref("")
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a href="">
            <el-icon><EditPen /></el-icon> 修改密码 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          </a>
          <a href="javascript:;" @click = "logOut">
            <el-icon><SwitchButton /></el-icon> 退出登录 【{{userName}}】
          </a>
        </span>
      </el-header>
      
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-scrollbar>
            <el-menu router>
               <el-menu-item index="/index">
                 <template #title>
                   <el-icon><StarFilled /></el-icon>首页
                 </template>
               </el-menu-item>
              <el-sub-menu index="/manage">
                <template #title>
                  <el-icon><Grid /></el-icon>班级学员管理
                </template>
                <el-menu-item index="/clazz">
                  <el-icon><Menu /></el-icon>班级管理
                </el-menu-item>
                <el-menu-item index="/stu">
                  <el-icon><UserFilled /></el-icon>学员管理
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="/system">
                <template #title>
                  <el-icon><Grid /></el-icon>系统信息管理
                </template>
                <el-menu-item index="/dept">
                  <el-icon><Menu /></el-icon>部门管理
                </el-menu-item>
                <el-menu-item index="/emp">
                  <el-icon><Avatar /></el-icon>员工管理
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="/report">
                <template #title>
                  <el-icon><Grid /></el-icon>数据统计管理
                </template>
                <el-menu-item index="/empReport">
                  <el-icon><Histogram /></el-icon>员工信息统计
                </el-menu-item>
                <el-menu-item index="/stuReport">
                  <el-icon><Histogram /></el-icon>学员信息统计
                </el-menu-item>
                <el-menu-item index="/log">
                  <el-icon><Histogram /></el-icon>日志信息统计
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>

        <el-main>
        <!--右侧菜单-->
          <router-view></router-view>
        </el-main>
      </el-container>
      
    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool{
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
