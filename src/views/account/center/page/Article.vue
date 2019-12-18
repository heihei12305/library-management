<template>
  <div>
    <a-card :bordered="false">
      <div class="title">现借图书</div>
      <s-table
        style="margin-bottom: 24px"
        row-key="ISBN"
        :columns="goodsColumns"
        :data="loadGoodsData">

      </s-table>

      <div class="title">历史借阅</div>
      <s-table
        style="margin-bottom: 24px"
        row-key="ISBN"
        :columns="scheduleColumns"
        :data="loadScheduleData">

        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status" :text="status | statusFilter"/>
        </template>

      </s-table>
    </a-card>
  </div>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import DetailList from '@/components/tools/DetailList'
import axios from 'axios'
const DetailListItem = DetailList.Item

export default {
  components: {
    PageView,
    DetailList,
    DetailListItem,
    STable
  },
  data () {
    return {
      goodsColumns: [
        {
          title: 'ISBN',
          dataIndex: 'ISBN',
          key: 'ISBN'
        },
        {
          title: '书名',
          dataIndex: 'bookName',
          key: 'bookName'
        },
        {
          title: '作者',
          dataIndex: 'author',
          key: 'author'
        },
        {
          title: '借出时间',
          dataIndex: 'loanTime',
          key: 'loanTime',
          align: 'right'
        },
        {
          title: '应还时间',
          dataIndex: 'deadline',
          key: 'deadline',
          align: 'right'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadGoodsData: () => {
        return new Promise(resolve => {
          console.log(1,this.$store.getters.userInfo)
          axios.get('/api/user/borrowingRecord', {
               params: {
                  'son':this.$store.getters.userInfo.creatorId
                }
            }).then(result => {
              this.operation1 = result.data;
              resolve(result.data);
            }).catch(err=>{          
              resolve({
              data: [
                {
                  ISBN: '1234561',
                  bookName: '矿泉水 550ml',
                  author: '12421432143214321',
                  loanTime: '2.00',
                  deadline: '1',
                },
                {
                  ISBN: '1234562',
                  bookName: '凉茶 300ml',
                  author: '12421432143214322',
                  loanTime: '3.00',
                  deadline: '2',
                }
              ],
              pageSize: 10,
              pageNo: 1,
              totalPage: 1,
              totalCount: 10
            })
          })
        }).then(res => {
          return res
        })
      },

      scheduleColumns: [
        {
          title: 'ISBN',
          dataIndex: 'ISBN',
          key: 'ISBN'
        },
        {
          title: '书名',
          dataIndex: 'bookName',
          key: 'bookName'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '借出时间',
          dataIndex: 'loanTime',
          key: 'loanTime'
        },
        {
          title: '还书时间',
          dataIndex: 'returnTime',
          key: 'returnTime'
        }
      ],
      loadScheduleData: () => {
        return new Promise(resolve => {
          axios.get('/api/user/borrowRecord', {
               params: {
                  'son':this.$store.getters.userInfo.creatorId
                }
            }).then(result => {
              this.operation1 = result.data;
              resolve(result.data);
            }).catch(err=>{    
          resolve({
            data: [
              {
                ISBN: '2017-10-01 14:10',
                bookName: '联系客户',
                status: 'processing',
                loanTime: '取货员 ID1234',
                returnTime: '5mins'
              },
              {
                ISBN: '2017-10-01 14:05',
                bookName: '取货员出发',
                status: 'error',
                loanTime: '取货员 ID1234',
                returnTime: '1h'
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10
            })
          })
        }).then(res => {
          return res
        })
      }
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'processing': '借阅中',
        'success': '已还',
        'error': '超期'
      }
      return statusMap[status]
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  }

}
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
