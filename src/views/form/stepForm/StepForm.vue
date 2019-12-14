<template>
  <page-view :title="true">
    <a-table
      :columns="columns"
      :dataSource="salaryList"
      :pagination="pagination"
      :loading="loading"
      bordered
    >
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{ text }}</a>
      </template>
    </a-table>
  </page-view>
</template>
<script>
import axios from 'axios'
import { PageView } from '@/layouts'
const columns = [
  {
    title: '工资id',
    dataIndex: 'salary_id',
    sorter: (a, b) => a.salary_id > b.salary_id,
    width: '20%',
    scopedSlots: { customRender: 'salary_id' }
  },
  {
    title: '税后工资',
    sorter: (a, b) => a.after_tax - b.after_tax,
    width: '13%',
    dataIndex: 'after_tax'
  },
  {
    title: '奖金浮动',
    sorter: (a, b) => a.bonus_float - b.bonus_float,
    width: '13%',
    dataIndex: 'bonus_float'
  },
  {
    title: '考核浮动',
    sorter: (a, b) => a.check_float - b.check_float,
    width: '13%',
    dataIndex: 'check_float'
  },
  {
    title: '缴纳税务',
    sorter: (a, b) => a.individual_income_tax - b.individual_income_tax,
    width: '13%',
    dataIndex: 'individual_income_tax'
  },
  {
    title: '餐补',
    sorter: (a, b) => a.meal_subsidy - b.meal_subsidy,
    width: '13%',
    dataIndex: 'meal_subsidy'
  },
  {
    title: '发送日期',
    sorter: (a, b) => a.salary_date > b.salary_date,
    width: '13%',
    dataIndex: 'salary_date'
  }
]

export default {
  components: {
    PageView
  },
  data () {
    return {
      salaryList: [],
      pagination: {},
      loading: false,
      columns
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      console.log(this.$store.getters.userInfo.roleId)
      axios.post('/api/user/salary', {
        params: {
          'username': this.$store.getters.userInfo.roleId
        }
      }).then(result => {
        console.log(result.data.data)
        this.salaryList = result.data.data
      })
    }
  }
}
</script>
