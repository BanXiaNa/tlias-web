<script setup>
import PageTitle from "@/views/style/pageTitle.vue";
import { ref, onMounted } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { queryDeptList } from "@/api/dept";

// 钩子函数
onMounted(() => {
  getDeptList();
});

// 查询所有部门
const getDeptList = async () => {
  const res = await queryDeptList();
  if (res.code) {
    DeptList.value = res.data;
  }
};

// 存储部门列表
const DeptList = ref([]);
</script>

<template>
<!--  Title-->
  <PageTitle>部门管理</PageTitle>

<!--  添加部门按钮-->
  <div class="container">
    <el-button type="primary">添加部门</el-button>
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
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
