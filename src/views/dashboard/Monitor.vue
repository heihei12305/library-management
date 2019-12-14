<template>
  <a-table :dataSource="data" :columns="columns">
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
const columns = [
  {
    title: '工资id',
    dataIndex: 'salary_id',
    width: '15%',
    key: 'salary_id',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.salary_id.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '税后工资',
    width: '10%',
    dataIndex: 'after_tax',
    key: 'after_tax',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.after_tax.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '奖金浮动',
    width: '10%',
    dataIndex: 'bonus_float',
    key: 'bonus_float',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.bonus_float.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '考核浮动',
    width: '10%',
    dataIndex: 'check_float',
    key: 'check_float',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.check_float.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '缴纳税务',
    width: '10%',
    dataIndex: 'individual_income_tax',
    key: 'individual_income_tax',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.individual_income_tax.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '餐补',
    width: '10%',
    dataIndex: 'meal_subsidy',
    key: 'meal_subsidy',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.meal_subsidy.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '发送日期',
    width: '10%',
    dataIndex: 'salary_date',
    key: 'salary_date',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.salary_date.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  }
]
export default {
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
      axios.post('/api/admin/salary', {
        params: {
          'username': this.$store.getters.userInfo.roleId
        }
      }).then(result => {
        this.data = result.data.data
      })
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    }
  }
}
</script>
<style scoped>
  .highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
  }
</style>
