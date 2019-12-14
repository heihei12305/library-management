<template>
  <a-table :columns="columns" :dataSource="data" bordered>
    <template
      v-for="col in ['after_tax', 'bonus_float', 'check_float','individual_income_tax','meal_subsidy','salary_date']"
      :slot="col"
      slot-scope="text, record"
    >
      <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, col)"
        />
        <template
          v-else
        >{{ text }}</template>
      </div>
    </template>
    <template slot="operation" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">Save</a>
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
            <a>Cancel</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a @click="() => edit(record.key)">Edit</a>
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
import axios from 'axios'
const columns = [
  {
    title: '工资id',
    dataIndex: 'salary_id',
    sorter: (a, b) => a.salary_id > b.salary_id,
    width: '15%',
    scopedSlots: { customRender: 'salary_id' }
  },
  {
    title: '税后工资',
    sorter: (a, b) => a.after_tax - b.after_tax,
    width: '10%',
    dataIndex: 'after_tax',
    scopedSlots: { customRender: 'after_tax' }
  },
  {
    title: '奖金浮动',
    sorter: (a, b) => a.bonus_float - b.bonus_float,
    width: '10%',
    dataIndex: 'bonus_float',
    scopedSlots: { customRender: 'bonus_float' }
  },
  {
    title: '考核浮动',
    sorter: (a, b) => a.check_float - b.check_float,
    width: '10%',
    dataIndex: 'check_float',
    scopedSlots: { customRender: 'check_float' }
  },
  {
    title: '缴纳税务',
    sorter: (a, b) => a.individual_income_tax - b.individual_income_tax,
    width: '10%',
    dataIndex: 'individual_income_tax',
    scopedSlots: { customRender: 'individual_income_tax' }
  },
  {
    title: '餐补',
    sorter: (a, b) => a.meal_subsidy - b.meal_subsidy,
    width: '10%',
    dataIndex: 'meal_subsidy',
    scopedSlots: { customRender: 'meal_subsidy' }
  },
  {
    title: '发送日期',
    sorter: (a, b) => a.salary_date > b.salary_date,
    width: '10%',
    dataIndex: 'salary_date',
    scopedSlots: { customRender: 'salary_date' }
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  })
}
export default {
  data () {
    this.cacheData = data.map(item => ({ ...item }))
    return {
      data,
      columns
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      axios.post('/api/admin/salary', {
        params: {
          'username': this.$store.getters.userInfo.roleId
        }
      }).then(result => {
        this.data = result.data.data
      })
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      console.log(target)
      axios.post('/api/admin/revise', {
        params: {
          data: target
        }
      }).then(result => {
        console.log('修改成功')
      })
      if (target) {
        delete target.editable
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
      }
    },
    cancel (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
    }
  }
}
</script>
<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
