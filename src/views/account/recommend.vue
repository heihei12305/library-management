<template>
  <div class="main user-layout-register">
    <h3><span>图书推荐</span></h3>
    <a-form ref="formRegister" :form="form" id="formRegister">
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="ISBN"
          v-decorator="['ISBN', {rules: [{ required: true,  message: '请输入正确的ISBN' ,pattern:  /^(?:ISBN(?:-13)?:? )?(?=[0-9]{13}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9]$/}], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="text"
          autocomplete="false"
          placeholder="书名"
          v-decorator="['bookname', {rules: [{ required: true, message: '书名不能为空！', pattern:  /\S/ }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          autocomplete="false"
          placeholder="出版社"
          v-decorator="['press', {rules: [{ required: true, message: '出版社不能为空！', pattern:  /\S/ }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          autocomplete="false"
          placeholder="作者"
          v-decorator="['author', {rules: [{ required: true, message: '作者不能为空！', pattern:  /\S/ }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          autocomplete="false"
          placeholder="推荐原因"
          v-decorator="['cause', {rules: [{ required: true, message: '推荐原因不能为空！', pattern:  /\S/ }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>
      
    </a-form>
    <div style="margin:0 auto">
        <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="register-button"
            :loading="registerBtn"
            @click.stop.prevent="handleSubmit"
            :disabled="registerBtn">提交
            </a-button>
    </div>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'Register',
  components: {
  },
  mixins: [mixinDevice],
  data () {
    return {
      form: this.$form.createForm(this),

      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false
    }
  },
  methods: {
    handlePhoneCheck (rule, value, callback) {
      console.log('handlePhoneCheck, rule:', rule)
      console.log('handlePhoneCheck, value', value)
      console.log('handlePhoneCheck, callback', callback)

      callback()
    },

    handlePasswordInputClick () {
      if (!this.isMobile()) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    handleSubmit () {
      const { form: { validateFields }, state, $router } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          state.passwordLevelChecked = false
          $router.push({ name: 'recommendResult', params: { ...values } })
        }
      })
    },
  },
  watch: {
    'state.passwordLevel' (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }

  }

  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
</style>
<style lang="less" scoped>
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .register-button {
      width: 50%;
      margin: 0 auto;
      display:table
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>
