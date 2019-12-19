<template>
  <result
    :isSuccess="true"
    :content="false"
    :title="email"
    :description="description">

    <template slot="action">
      <a-button size="large" type="primary" style="margin-left: 8px" @click="goHomeHandle">返回首页</a-button>
    </template>

  </result>
</template>

<script>
import { Result } from '@/components'
import axios from 'axios'

export default {
  components: {
    Result
  },
  data () {
    return {
      description: '软工实验给个优吧！',
      form: {}
    }
  },
  mounted () {
    this.recommend()
  },
  computed: {
    email () {
      const v = this.form && this.form.bookname || 'xxx'
      const title = `你推荐的：${v} 上传成功`
      return title
    }
  },
  created () {
    this.form = this.$route.params
  },
  methods: {
    recommend () {
      console.log(this.form)
      axios.post('/api/user/recommend', {
        params: {
          'ISBN': this.form.ISBN,
          'author': this.form.author,
          'bookname': this.form.bookname,
          'cause': this.form.cause,
          'press': this.form.press,
          'studentNumber':this.$store.getters.userInfo.creatorId
        }
      }).then(result => {
        
      })
    },
    goHomeHandle () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>

</style>
