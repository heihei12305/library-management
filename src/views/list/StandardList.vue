<template>
<div>
  <template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic title="书本总量" :value="totalBook" style="margin-right: 50px">
        <template v-slot:suffix>
          本
        </template>
      </a-statistic>
    </a-col>
    <a-col :span="12">
      <a-statistic title="金钱总额" :value="totalMoney" valueClass="demo-class">
        <template v-slot:suffix>
          <span> 元</span>
        </template>
      </a-statistic>
    </a-col>
  </a-row>
</template>
  <a-table bordered :dataSource="data" :columns="columns">
     <template slot="name" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>
       <template
        v-for="col in ['bookname', 'author','price','bookNumber','press']"
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
            <!-- <a @click="() => save(record.key)" style="margin-right:8px">保存</a> -->
             <a-button @click="() => save(record.key)" type="primary" size="small">保存</a-button>
            <a-popconfirm title="确定取消?" @confirm="() => cancel(record.key)">
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
  </div>
</template>

<script>
import axios from 'axios'
import EditableCell from './../dashboard/EditableCell'
const columns = [
  {
    title: 'ISBN',
    dataIndex: 'ISBN',
    width: '13%',
    key: 'ISBN',
    sorter: (a, b) => a.ISBN > b.ISBN,
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'ISBN'
    },
    onFilter: (value, record) => record.ISBN.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '书名',
    width: '13%',
    dataIndex: 'bookname',
    key: 'bookname',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'bookname'
    },
    onFilter: (value, record) => record.bookname.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '作者',
    width: '10%',
    dataIndex: 'author',
    key: 'author',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'author'
    },
    onFilter: (value, record) => record.author.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '单价',
    width: '8%',
    dataIndex: 'price',
    key: 'price',
    sorter: (a, b) => a.price > b.price,
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'price'
    },
    onFilter: (value, record) => record.price.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
   {
    title: '图书数量',
    width: '8%',
    dataIndex: 'bookNumber',
    key: 'bookNumber',
    sorter: (a, b) => a.bookNumber > b.bookNumber,
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'bookNumber'
    },
    onFilter: (value, record) => record.bookNumber.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '出版社',
    width: '15%',
    dataIndex: 'press',
    key: 'press',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'press'
    },
    onFilter: (value, record) => record.location.toString().toLowerCase().includes(value.toLowerCase()),
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
    width: '25%',
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
  computed:{
    totalBook(){
      return this.data.reduce((acc,next)=>acc+next.bookNumber*1,0)
    },
    totalMoney(){
      return this.data.reduce((acc,next)=>acc+next.bookNumber*next.price,0)
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      axios.get('/api/admin/bookProcurement', {
        params: {
          
        }
      }).then(result => {
        this.data = result.data.data
         this.data.forEach((item)=>item['key'] = item['ISBN'])
      })
      this.data = [
        {
            'ISBN':1,
            'bookname':1,
            'author':1,
            'bookNumber':1,
            'price':1,
            'press':1
        },
        {
            'ISBN':12,
            'bookname':12,
            'author':12,
            'bookNumber':12,
            'price':12,
            'press':12
        }
      ]
       this.data.forEach((item)=>item['key'] = item['ISBN'])
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
      console.log(key)
      const dataSource = [...this.data]
      console.log(dataSource)
      this.data = dataSource.filter(item => item.key !== key)
      const deleSource = dataSource.filter(item => item.key === key)
      console.log(deleSource)
      axios.post('/api/admin/deleteBookProcurement', {
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
      axios.post('/api/admin/reviseBookProcurement', {
        params: {
          data: target
        }
      }).then(result => {
        console.log('修改成功')
      })
      if (target) {
        if(target.bookNumber<0){
          this.$message.error('图书数量不能小于0！') 
        }else if(target.price<0){
          this.$message.error('单价不能小于0！') 
        }else{
          delete target.editable
          this.data = newData
          this.cacheData = newData.map(item => ({ ...item }))
        }
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
