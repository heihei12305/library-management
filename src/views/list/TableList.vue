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
            <a-form-item label="荐书状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">已购</a-select-option>
                <a-select-option value="2">已拒绝</a-select-option>
                <a-select-option value="3">未处理</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="推荐日期">
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
        v-for="col in ['studentName','status','recommendReason','recommendBook','loanTime']"
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
        <a-popconfirm
          style="margin:0 0 0 15px"
          v-if="loadData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a href="javascript:;">Delete</a>
        </a-popconfirm>
      </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import axios from 'axios'
import EditableCell from './../dashboard/EditableCell'

const statusMap = {
  1: {
    status: 'processing',
    text: '已购'
  },
  2: {
    status: 'success',
    text: '已拒绝'
  },
  3: {
    status: 'error',
    text: '未处理'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
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
          title: '学号',
          dataIndex: 'studentNumber',
          width: '15%',
          scopedSlots: { customRender: 'studentNumber' },
          sorter: (a, b) => a.studentNumber > b.studentNumber,
        },
        {
          title: '姓名',
          dataIndex: 'studentName',
          width: '15%',
          scopedSlots: { customRender: 'studentName' }
        },
        {
          title: '推荐书籍',
          dataIndex: 'recommendBook',
          width: '15%',
          scopedSlots: { customRender: 'recommendBook' },
        },
        {
          title: '推荐理由',
          dataIndex: 'recommendReason',
          width: '15%',
          scopedSlots: { customRender: 'recommendReason' },
        },
        {
          title: '推荐日期',
          dataIndex: 'loanTime',
          width: '15%',
          scopedSlots: { customRender: 'loanTime' },
          sorter: (a, b) => a.studentNumber > b.studentNumber,
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '15%',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '15%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data:[],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let res ;
        return new Promise(resolve => {
          axios.post('/api/admin/getRecommendBook', {
            params: {
              parameter: parameter,
              queryParam:this.queryParam
            }
          }).then(result => {
            res = result.data;
            resolve(res);
            // this.$refs.table.refresh(true)
          }).catch(err=>{
            res = {
              data:[
              {
                'no':'1',
                'studentNumber':1,
                'studentName':1,
                'status':1,
                'recommendBook':1,
                'recommendReason':1,
                'loanTime':1
              },
              {
                'no':'12',
                'studentNumber':12,
                'studentName':12,
                'status':1,
                'recommendBook':12,
                'recommendReason':1,
                'loanTime':12,
              }
              ],
              pageNo:1,
              pageSize:12,
              totalCount:20,
              totalPage:2,
            }
            resolve(res);
            })
        
        }).then(res => {
          res.data.forEach((item)=>{
            item.key = item.no;
            item.editable = false;
          })
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
      axios.post('/api/admin/deleteRecommendBook', {
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
      axios.post('/api/admin/reviseRecommendBook', {
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
