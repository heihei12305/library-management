<template>
  <a-table bordered :dataSource="data" :columns="columns">
     <template slot="name" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>
       <template
        v-for="col in [ 'email','mobile']"
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
        <!-- <div class="editable-row-operations"> -->
          <span v-if="record.editable">
            <a-button @click="() => save(record.key)" type="primary" size="small">保存</a-button>
            <a-popconfirm title="确定取消？" @confirm="() => cancel(record.key)">
              <!-- <a>取消</a> -->
              <a-button type="primary" style="margin-left:8px" size="small">取消</a-button>
            </a-popconfirm>
          </span>
          <span v-else>
            <!-- <a @click="() => edit(record.key)">编辑</a> -->
            <a-button @click="() => edit(record.key)" type="primary">编辑</a-button>
          </span>
        <!-- </div> -->
        <a-popconfirm
          style="margin:0 0 0 15px"
          v-if="data.length"
          title="确定删除?"
          @confirm="() => onDelete(record.key)"
        >
          <!-- <a href="javascript:;">删除</a> -->
          <a-button  type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    <div
      slot="filterDropdown"
      slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      style="padding: 8px"
    >
      <a-input
        v-ant-ref="c => searchInput = c"
        :placeholder="`Search ${column.dataIndex}`"
        :value="selectedKeys[0]"
        @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
        @pressEnter="() => handleSearch(selectedKeys, confirm)"
        style="width: 188px; margin-bottom: 8px; display: block;"
      />
      <a-button
        type="primary"
        @click="() => handleSearch(selectedKeys, confirm)"
        icon="search"
        size="small"
        style="width: 90px; margin-right: 8px"
      >Search</a-button
      >
      <a-button
        @click="() => handleReset(clearFilters)"
        size="small"
        style="width: 90px"
      >Reset</a-button
      >
    </div>
    <a-icon
      slot="filterIcon"
      slot-scope="filtered"
      type="search"
      :style="{ color: filtered ? '#108ee9' : undefined }"
    />
    <template slot="customRender" slot-scope="text">
      <span v-if="searchText">
        <template
          v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
            :key="i"
            class="highlight"
          >{{ fragment }}</mark
          >
          <template
            v-else
          >{{ fragment }}</template
          >
        </template>
      </span>
      <template
        v-else
      >{{ text }}</template
      >
    </template>
  </a-table>
</template>

<script>
import axios from 'axios'
import EditableCell from './../../dashboard/EditableCell'
const columns = [
 {
    title: '学号',
    width: '24%',
    dataIndex: 'studentNumber',
    key: 'studentNumber',
    sorter: (a, b) => a.studentNumber > b.studentNumber,
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'studentNumber'
    },
    onFilter: (value, record) => record.studentNumber.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '24%',
    key: 'email',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'email'
    },
    onFilter: (value, record) => record.email.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  //{
  //  title: '密码',
  //  width: '19%',
  //  dataIndex: 'password',
  //  key: 'password',
  //  scopedSlots: {
  //    filterDropdown: 'filterDropdown',
  //    filterIcon: 'filterIcon',
  //    customRender: 'password'
  //  },
  //  onFilter: (value, record) => record.password.toString().toLowerCase().includes(value.toLowerCase()),
  //  onFilterDropdownVisibleChange: visible => {
  //    if (visible) {
  //      setTimeout(() => {
  //        this.searchInput.focus()
  //      }, 0)
  //    }
  //  }
  //}, 
  {
    title: '手机号',
    width: '30%',
    dataIndex: 'mobile',
    key: 'mobile',
    sorter: (a, b) => a.mobile > b.mobile,
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'mobile'
    },
    onFilter: (value, record) => record.mobile.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    EditableCell
  },
  data () {
    return {
      data: [],
      searchText: '',
      searchInput: null,
      columns
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      axios.get('/api/admin/getUser', 
        {}
      ).then(result => {
        this.data = result.data.data
        this.data.forEach((item)=>item.key = item.studentNumber)
      }).catch(err=>{
        this.data = [
          {
              'studentNumber':1,
              'email':1,
              'password':1,
              'mobile':1
          },
           {
              'studentNumber':2,
              'email':2,
              'password':2,
              'mobile':2
          }
        ]
        this.data.forEach((item)=>item.key = item.studentNumber)
        }
      )
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.data = dataSource
      }
    },
    onDelete (key) {
      const dataSource = [...this.data]
      console.log(dataSource)
      this.data = dataSource.filter(item => item.key !== key)
      const deleSource = dataSource.filter(item => item.key === key)
      console.log(deleSource)
      axios.post('/api/admin/deleteUser', {
        params: {
          data: deleSource[0]
        }
      }).then(result => {
        console.log('修改成功')
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
      axios.post('/api/admin/reviseUser', {
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
<style scoped>
  .highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
  }
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
