<template>
<div >
  <a-carousel 
    arrows 
    autoplay
    >
    <div
      slot="prevArrow"
      class="custom-slick-arrow"
      style="left: 10px;zIndex: 1"
    >
      <a-icon type="left-circle" />
    </div>
    <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
      <a-icon type="right-circle" />
    </div>
    <div><h3>重要通知：xxxx新书到啦</h3></div>
    <div><h3>老师给个优吧！</h3></div>
    <div><h3>不看错亿呀！图书馆使用指南</h3></div>
  </a-carousel>
  <br/>
    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="近期热门图书"
            :body-style="{ padding: 0 }">
            <a slot="extra">全部图书</a>
            <div>
              <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in books">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                       <a-avatar size="big" :src="item.cover"/>
                      <a>{{ item.title }}</a>
                    </div>
                    <div slot="description" class="card-description">
                      {{ item.description }}
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">软工实验A++++队</a>
                    <span class="datetime">9小时前</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading="loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.user.avatar" />
                  <div slot="title">
                    <span>{{ item.user.nickname }}</span>&nbsp;
                    在&nbsp;<a href="#">{{ item.project.name }}</a>&nbsp;
                    <span>{{ item.project.action }}</span>&nbsp;
                    <a href="#">{{ item.project.event }}</a>
                  </div>
                  <div slot="description">{{ item.time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="资源导航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <a>馆藏目录</a>
              <a>整合检索</a>
              <a>站内搜索</a>
              <a>我的图书馆</a>
              <a>电子图书</a>
              <a>CADAL</a>
              <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
            </div>
          </a-card>
          <a-card title="图书馆近期概况" style="margin-bottom: 24px" :loading="radarLoading" :bordered="false" :body-style="{ padding: 0 }">
            <div style="min-height: 400px;">
              <!-- :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  -->
              <radar :data="radarData" />
            </div>
          </a-card>
          <a-card :loading="loading" title="常用链接" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    </div>
</template>
<script>
import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import { Radar } from '@/components'
const DataSet = require('@antv/data-set')
  export default {
    components: {
      HeadInfo,
      Radar
    },
    data () {
      return {
        avatar: '',
        user: {},
        books: [{
            id: 1,
            cover: 'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike220%2C5%2C5%2C220%2C73/sign=7772a7083ad3d539d53007915bee8235/7dd98d1001e939019fa70ac877ec54e737d1969b.jpg',
            title: '云边有个小卖部',
            description: '有些人刻骨铭心，没几年会遗忘。有些人不论生死，都陪在身旁。满镇开着桔梗，蒲公英飞得比石榴树还高，一直飘进山脚的稻海。在大多数人心中，自己的故乡后来会成为一个点，如同亘古不变的孤岛。',
            status: 1,
            updatedAt: '2018-07-26 00:00:00'
          },
          {
            id: 2,
            cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
            title: 'Angular',
            description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
            status: 1,
            updatedAt: '2018-07-26 00:00:00'
          },
          {
            id: 3,
            cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
            title: 'Ant Design',
            description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
            status: 1,
            updatedAt: '2018-07-26 00:00:00'
          },
          {
            id: 4,
            cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
            title: 'Ant Design Pro',
            description: '那时候我只会想自己想要什么，从不想自己拥有什么',
            status: 1,
            updatedAt: '2018-07-26 00:00:00'
          },
          {
            id: 5,
            cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
            title: 'Bootstrap',
            description: '凛冬将至',
            status: 1,
            updatedAt: '2018-07-26 00:00:00'
          },
          {
            id: 6,
            cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
            title: 'Vue',
            description: '生命就像一盒巧克力，结果往往出人意料',
            status: 1,
            updatedAt: '2018-07-26 00:00:00'
          }
          ],
        loading: false,
        radarLoading: false,
        activities: [{
            id: 1,
            user: {
              nickname: '@name',
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
            },
            project: {
              name: '白鹭酱油开发组',
              action: '更新',
              event: '番组计划'
            },
            time: '2018-08-23 14:47:00'
          },
          {
            id: 1,
            user: {
              nickname: '蓝莓酱',
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
            },
            project: {
              name: '白鹭酱油开发组',
              action: '更新',
              event: '番组计划'
            },
            time: '2018-08-23 09:35:37'
          },
          {
            id: 1,
            user: {
              nickname: '@name',
              avatar: '@image(64x64)'
            },
            project: {
              name: '白鹭酱油开发组',
              action: '创建',
              event: '番组计划'
            },
            time: '2017-05-27 00:00:00'
          },
          {
            id: 1,
            user: {
              nickname: '曲丽丽',
              avatar: '@image(64x64)'
            },
            project: {
              name: '高逼格设计天团',
              action: '更新',
              event: '六月迭代'
            },
            time: '2018-08-23 14:47:00'
          },
          {
            id: 1,
            user: {
              nickname: '@name',
              avatar: '@image(64x64)'
            },
            project: {
              name: '高逼格设计天团',
              action: 'created',
              event: '六月迭代'
            },
            time: '2018-08-23 14:47:00'
          },
          {
            id: 1,
            user: {
              nickname: '曲丽丽',
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
            },
            project: {
              name: '高逼格设计天团',
              action: 'created',
              event: '六月迭代'
            },
            time: '2018-08-23 14:47:00'
          }
          ],
        teams: [{
          id: 1,
          name: '资讯台',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
        },
        {
          id: 2,
          name: '好书推荐',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
        },
        {
          id: 1,
          name: '读者建购',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
        },
        {
          id: 1,
          name: '新生专栏',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png'
        },
        {
          id: 1,
          name: '科技查新',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png'
        }
        ],
        // data
        axis1Opts: {
          dataKey: 'item',
          line: null,
          tickLine: null,
          grid: {
            lineStyle: {
              lineDash: null
            },
            hideFirstLine: false
          }
        },
        axis2Opts: {
          dataKey: 'score',
          line: null,
          tickLine: null,
          grid: {
            type: 'polygon',
            lineStyle: {
              lineDash: null
            }
          }
        },
        scale: [{
          dataKey: 'score',
          min: 0,
          max: 80
        }],
        radarData: [{
          item: '引用',
          '个人': 70,
          '团队': 30,
          '部门': 40
        },
        {
          item: '口碑',
          '个人': 60,
          '团队': 70,
          '部门': 40
        },
        {
          item: '产量',
          '个人': 50,
          '团队': 60,
          '部门': 40
        },
        {
          item: '贡献',
          '个人': 40,
          '团队': 50,
          '部门': 40
        },
        {
          item: '热度',
          '个人': 60,
          '团队': 70,
          '部门': 40
        },
        {
          item: '引用',
          '个人': 70,
          '团队': 50,
          '部门': 40
        }
        ]
      }
    },
    mounted () {
      this.init()
    },
    methods:{
      init() {
        console.log(this.project)
        const dv = new DataSet.View().source(this.radarData)
        dv.transform({
          type: 'fold',
          fields: ['个人', '团队', '部门'],
          key: 'user',
          value: 'score'
        })
        this.radarData = dv.rows;
      }
    }
  };
</script>
<style scoped>
  /* For demo */
  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel >>> .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }
  .ant-carousel >>> .custom-slick-arrow:before {
    display: none;
  }
  .ant-carousel >>> .custom-slick-arrow:hover {
    opacity: 0.5;
  }

  .ant-carousel >>> .slick-slide h3 {
    color: #fff;
  }
</style>
<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
