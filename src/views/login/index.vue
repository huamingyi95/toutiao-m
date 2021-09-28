<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <!-- 后退上一页:  $router.back() 或 $router.go(-1) -->
        <van-icon name="cross" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请填写手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!--【增加图标】-->
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请填写验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <!--【增加图标】-->
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <!--【增加发送验证码按钮】-->
        <template #button>
          <!--这里注意，要加上native-type,否则也可以实现表单提交-->
          <van-button
            v-if="isCountDownShow"
            class="send-sms-btn"
            round
            size="mini"
            native-type="button"
            type="default"
            @click="onSendSms"
          >
            发送验证码
          </van-button>
          <!-- 倒计时组件 -->
          <van-count-down
            v-else
            :time="time"
            format="ss s"
            @finish="isCountDownShow = true"
          />
        </template>
      </van-field>

      <div class="login-btn-wrap">
        <van-button round block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- / 登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      time: 60 * 1000,
      isCountDownShow: true, // 是否展示倒计时
      user: {
        mobile: '',
        code: ''
      }, // 验证规则对象
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0 // 持续展示 toast
      })
      try {
        const { data } = await login(this.user)
        console.log(data)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登陆成功')
        // 登录成功，跳转回原来页面
        // back 的方式不严谨，后面讲功能优化的时候再说
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast('手机号或验证码错误')
        } else {
          console.log('登录失败，请稍后重试', err)
          this.$toast.fail('登陆失败')
        }
      }
    },
    // 发送短息验证码
    async onSendSms () {
      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = false
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时，显示发送按钮
        this.isCountDownShow = true
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
