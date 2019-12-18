<template>
  <a-table bordered :dataSource="data" :columns="columns">
     <template slot="name" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>
       <template
        v-for="col in ['bookname', 'author','booknumber','press']"
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
          v-if="data.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a href="javascript:;">Delete</a>
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
import EditableCell from './EditableCell'
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
    title: '可借数量',
    width: '13%',
    dataIndex: 'booknumber',
    key: 'booknumber',
    sorter: (a, b) => a.booknumber > b.booknumber,
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'booknumber'
    },
    onFilter: (value, record) => record.booknumber.toString().toLowerCase().includes(value.toLowerCase()),
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
    width: '20%',
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
      axios.get('/api/admin/getBook', {
        params: {}
      }).then(result => {
        this.data = result.data.data
        this.data.forEach((item)=>item['key'] = item['ISBN'])
      }).catch(err=>{
        this.data = [
          {
              'ISBN':1,
              'bookname':1,
              'author':1,
              'booknumber':1,
              'press':1,
          },
          {
              'ISBN':2,
              'bookname':2,
              'author':2,
              'booknumber':2,
              'press':12,
          }
        ]
        
        this.data.forEach((item)=>item['key'] = item['ISBN'])}
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
      axios.post('/api/admin/deleteBook', {
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
      axios.post('/api/admin/reviseBook', {
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
