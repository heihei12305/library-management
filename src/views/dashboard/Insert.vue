<template>
    <div id="components-form-demo-advanced-search">
      <div>手动输入：</div>
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
           <a-col
            :key="8"
            :span="8"
            :style="{ display: 'block' }"
          >
            <a-form-item label="ISBN">
              <a-input
                v-decorator="[
                  columns[0]['dataIndex'],
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入正确的ISBN!',
                        pattern: /^(?:ISBN(?:-13)?:? )?(?=[0-9]{13}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9]$/
                      },
                    ],
                  },
                ]" />
            </a-form-item>
          </a-col>
           <a-col
            :key="8"
            :span="8"
            :style="{ display: 'block' }"
          >
            <a-form-item label="可借数量">
              <a-input
                v-decorator="[
                  columns[1]['dataIndex'],
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入非负整数!',
                        pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
                      },
                    ],
                  },
                ]" />
            </a-form-item>
         </a-col>
        <a-col
            :key="8"
            :span="8"
            :style="{ display: 'block' }"
          >
             <a-form-item label="详情链接">
              <a-input
                v-decorator="[
                  columns[2]['dataIndex'],
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入正确链接!',
                        pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
                      },
                    ],
                  },
                ]" />
            </a-form-item>
          </a-col>
          <a-col
            v-for="i in columns.length-4"
            :key="i"
            :span="8"
            :style="{ display: 'block'}"
          >
            <a-form-item :label="`${columns[i+2]['title']}`">
              <a-input
                v-decorator="[
                  `${columns[i+2]['dataIndex']}`,
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Input something!',
                      },
                    ],
                  },
                ]"
                placeholder=""
              />
            </a-form-item>
          </a-col>
          <a-col
            :key="8"
            :span="8"
            :style="{ display: 'block' }"
          >
            <a-form-item label="采购日期">
              <a-date-picker
                v-decorator="[
                  columns[7]['dataIndex'],
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Input something',
                      },
                    ],
                  },
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">
              提交
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              重置
            </a-button>
            <!-- <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              Collapse <a-icon :type="expand ? 'up' : 'down'" />
            </a> -->
          </a-col>
        </a-row>
      </a-form>
      <br/>
      <div>文件上传:</div>
      <a-upload-dragger
        name="file"
        :multiple="true"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </a-upload-dragger>
    </div>
  </template>
  <script>
  import axios from 'axios'
  const columns = [
    {
      'title': 'ISBN',
      'dataIndex': 'ISBN'
    },
    {
      'title': '可借数量',
      'dataIndex': 'booknumber'
    },
    {
      'title': '详情链接',
      'dataIndex': 'link'
    },
    {
      'title': '书名',
      'dataIndex': 'bookname'
    },
    {
      'title': '作者',
      'dataIndex': 'author'
    },
    {
      'title': '出版社',
      'dataIndex': 'press'
    },
    {
      'title': '描述',
      'dataIndex': 'description'
    },
    {
      'title': '采购日期',
      'dataIndex': 'purchase_date'
    }
  ]
  export default {
    data () {
      return {
        expand: false,
        form: this.$form.createForm(this, { name: 'advanced_search' }),
        columns
      }
    },
    computed: {
      count () {
        return this.expand ? 11 : 7
      }
    },
    methods: {
      handleSearch (e) {
        e.preventDefault()
        this.form.validateFields((error, values) => {
          console.log('error', error)
          if (error) {
            console.log(error)
          } else {
            console.log('Received values of form: ', values)
            console.log(values.purchase_date._d.getFullYear())
            const d = values.purchase_date._d
            let resD = d.getFullYear() + '-'
            if (d.getMonth() < 10) {
              resD += '0'
            }
            resD += (d.getMonth() + 1) + '-'
            if (d.getDate() < 10) {
              resD += '0'
            }
            resD += d.getDate()
            console.log(resD)
            values.purchase_date = resD
            axios.post('/api/admin/insertBook', {
              params: {
                'data': values
              }
            }).then(result => {
              this.$notification.open({
                message: '通知：',
                description:
                  '    添加成功！',
                icon: <a-icon type="smile" style="color: #108ee9" />
              })
            })
          }
        })
      },
  
      handleReset () {
        this.form.resetFields()
      },
  
      toggle () {
        this.expand = !this.expand
      }
    }
  }
  </script>
  <style>
  .ant-advanced-search-form {
    padding: 24px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
  }
  
  .ant-advanced-search-form .ant-form-item {
    display: flex;
  }
  
  .ant-advanced-search-form .ant-form-item-control-wrapper {
    flex: 1;
  }
  
  #components-form-demo-advanced-search .ant-form {
    max-width: none;
  }
  #components-form-demo-advanced-search .search-result-list {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
  }
  </style>
  