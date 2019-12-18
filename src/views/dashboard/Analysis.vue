<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="学号">
              <a-input v-model="queryParam.id" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="书籍状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">借阅中</a-select-option>
                <a-select-option value="2">已还</a-select-option>
                <a-select-option value="3">超期</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="借阅日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
      bordered
    >
     
      <template
        v-for="col in ['studentNumber','deadLine','bookName','studentName','status','updatedAt','loanTime']"
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
            ><span
              v-if="col==='status'"
            ><a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
            </span>
            <span
              v-else
            >{{ text }}</span>
          </template>
       </div>
    </template>
     <template slot="name" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
        <!-- <div class="editable-row-operations"> -->
          <span v-if="record.editable">
            <a @click="() => save(record.key)" style="margin-right:8px">Save</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">Edit</a>
          </span>
        <!-- </div> -->
        <!-- <a-popconfirm
          style="margin:0 0 0 15px"
          v-if="loadData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a href="javascript:;">Delete</a>
        </a-popconfirm> -->
      </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import StepByStepModal from './../list/modules/StepByStepModal'
import CreateForm from './../list/modules/CreateForm'
import axios from 'axios'
import EditableCell from './EditableCell'

const statusMap = {
  1: {
    status: 'processing',
    text: '借阅中'
  },
  2: {
    status: 'success',
    text: '已还'
  },
  3: {
    status: 'error',
    text: '超期'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    EditableCell
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'ISBN',
          dataIndex: 'ISBN',
          width: '12%',
          scopedSlots: { customRender: 'ISBN' },
          sorter: (a, b) => a.ISBN > b.ISBN,
        },
        {
          title: '书名',
          dataIndex: 'bookName',
          width: '12%',
          scopedSlots: { customRender: 'bookName' }
        },
        {
          title: '学号',
          dataIndex: 'studentNumber',
          width: '12%',
          scopedSlots: { customRender: 'studentNumber' },
          sorter: (a, b) => a.studentNumber > b.studentNumber,
        },
        {
          title: '姓名',
          dataIndex: 'studentName',
          width: '12%',
          scopedSlots: { customRender: 'studentName' }
        },
        {
          title: '借阅日期',
          dataIndex: 'loanTime',
          width: '12%',
          scopedSlots: { customRender: 'loanTime' },
          sorter: (a, b) => a.studentNumber > b.studentNumber,
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '12%',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '应还时间',
          dataIndex: 'deadLine',
          width: '12%',
          scopedSlots: { customRender: 'deadLine' },
          sorter: (a, b) => a.deadLine > b.deadLine
        },
        {
          title: '还书时间',
          dataIndex: 'updatedAt',
          width: '12%',
          scopedSlots: { customRender: 'updatedAt' },
          sorter: (a, b) => a.updatedAt > b.updatedAt,
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '12%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data:[],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let res ;
        return new Promise(resolve => {
          axios.post('/api/admin/searchRecord', {
            params: {
              parameter: parameter,
              queryParam:this.queryParam
            }
          }).then(result => {
            res = result.data;
            resolve(res);
            this.$refs.table.refresh(true)
          }).catch(err=>{
            res = {
              data:[
              {
                'no':'1',
                'studentNumber':1,
                'studentName':1,
                'status':1,
                'updatedAt':1,
                'action':1,
                'loanTime':1,
                'deadLine':1,
                'ISBN':1,
                'bookName':'1',
                'key':1,
                'editable':false
              },
              {
                'no':'12',
                'studentNumber':12,
                'studentName':12,
                'status':1,
                'updatedAt':12,
                'action':1,
                'loanTime':12,
                'deadLine':1,
                'ISBN':1,
                'bookName':'1',
                'key':12,
                'editable':false
              }
              ],
              pageNo:1,
              pageSize:12,
              totalCount:100,
              totalPage:12,
            }
            resolve(res);
            })
        
        }).then(res => {

          this.data = res.data;
          return res
        })
      },
      
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false  
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    this.tableOption()
  },
  mounted() {
      this.init();
   },
  methods: {
    init() {
      console.log('init',this.loadData)
    },
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onDelete (key) {
      let dataSource = [...this.data]
      console.log(dataSource)
      // this.loadData = dataSource.filter(item => item.key !== key)
      const deleSource = dataSource.filter(item => item.key === key)
      console.log(deleSource)
      axios.post('/api/admin/deleteRecord', {
        params: {
          data: deleSource[0]
        }
      }).then(result => {
        this.$message.success('删除成功！') 
        this.$refs.table.refresh(true)
      }).catch(err => {
        this.$message.error('删除失败！') 
        this.$refs.table.refresh(true)
      })
    },
     onCellChange (key, dataIndex, value) {
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.data = dataSource
      }
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
      axios.post('/api/admin/reviseRecord', {
        params: {
          data: target
        }
      }).then(result => {
        this.$message.success('修改成功！') 
        this.$refs.table.refresh(true)
      }).catch(err => {
        this.$message.error('修改失败！') 
        this.$refs.table.refresh(true)
      })
      if (target) {
        delete target.editable
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
      }
    },
    cancel (key) {
      this.$refs.table.refresh(true)
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        try{
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        }catch(err){}
        delete target.editable
        this.data = newData
      }
      
    }
  }
}
</script>
