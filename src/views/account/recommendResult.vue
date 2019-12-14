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
import md5 from 'md5'

export default {
  name: 'RegisterResult',
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
    this.register()
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
    register () {
      console.log(this.form)
      axios.post('/api/user/register', {
        params: {
          'email': this.form.email,
          'mobile': this.form.mobile,
          'password': md5(this.form.password),
          'studentNumber': this.form.studentNumber
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
