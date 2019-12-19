<template>
  <div>
    <a-table bordered :dataSource="dataSource" :columns="columns">
      <template slot="name" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataSource.length"
          title="确定删除?"
          @confirm="() => onDelete(record.key)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
import EditableCell from './EditableCell'
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
export default {
  components: {
    EditableCell
  },
  data () {
    return {
      dataSource: [],
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
        console.log(result.data.data)
        this.dataSource = result.data.data
        for (let i = 0, len = this.dataSource.length; i < len; i++) {
          this.dataSource[i].key = i
        }
      })
    },
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    onDelete (key) {
      console.log(key)
      const dataSource = [...this.dataSource]
      console.log(dataSource)
      this.dataSource = dataSource.filter(item => item.key !== key)
      const deleSource = dataSource.filter(item => item.key === key)
      console.log(deleSource)
      axios.post('/api/admin/delete', {
        params: {
          data: deleSource[0]
        }
      }).then(result => {
        console.log('修改成功')
      })
    }
  }
}
</script>
<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>
