<template>
  <a-list
    class="comment-list"
    :header="`${data.length} replies`"
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item">
      <a-comment :author="item.author" :avatar="item.avatar">
        <template slot="actions">
          <span v-for="(action,index) in item.actions" :key="index">{{action}}</span>
        </template>
        <p slot="content">{{item.content}}</p>
        <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
          <span>{{item.datetime.fromNow()}}</span>
        </a-tooltip>
      </a-comment>
    </a-list-item>
  </a-list>
</template>
<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        data: [
          {
            actions: ['Reply to'],
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              '听说你很强呢！',
            datetime: moment().subtract(1, 'days'),
          },
          {
            actions: ['Reply to'],
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              '软工实验给个优吧！',
            datetime: moment().subtract(2, 'days'),
          },
           {
            actions: ['Reply to'],
            author: '管理员',
            avatar: 'https://heihei12305.github.io/images/avatar.png?v=1576318119511',
            content:
              '借的《人类简史-从动物到上帝》快到期啦！',
            datetime: moment().subtract(3, 'days'),
          },
        ],
        moment,
      };
    },
  };
</script>
