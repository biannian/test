<template>
  <div>
    <a-form class="loginContainer" :model="loginParams">
      <h3 class="loginTitle"> 面试题登录 </h3>
      <a-form-item>
        <a-input v-model:value="loginParams.usrname" placeholder="Username"></a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="loginParams.password" type="password" placeholder="Password"
                 autocomplete="off"></a-input>
        <a-button size="small" type="link" @click="toRegister">Register</a-button>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary" style="width:100%"
          html-type="submit"
          @click="login"
          :disabled="loginParams.usrname === '' || loginParams.password === ''"
        >
          Log in
        </a-button>
      </a-form-item>
    </a-form>
    <!--注册弹窗-->
    <a-modal v-model:visible="showRegister" title="Register" @ok="register">
      <a-form ref="formRef" :model="registerForm">
        <a-form-item label="Account">
          <a-input v-model:value="registerForm.usrname"/>
        </a-form-item>
        <a-form-item label="Password">
          <a-input v-model:value="registerForm.password" type="password"/>
        </a-form-item>
        <a-form-item label="Secondary password" name="checkPass">
          <a-input v-model:value="registerForm.retype" type="password"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {message} from 'ant-design-vue';
  import api from "../api/api";

  export default {
    name: 'login',
    data() {
      return {
        loginParams: {
          usrname: '',
          password: '',
        },
        registerForm: {
          usrname: '',
          password: '',
          retype: '',
        },
        showRegister: false,
      }
    },
    watch: {
      showRegister() {
        this.registerForm = {
          usrname: '',
          password: '',
          retype: '',
        }
      },
    },
    mounted() {
    },
    methods: {
      login() {
        api.sign_in(this.loginParams).then(res => {
          if (res && res.data.code === 0) {
            message.success("login success")
            this.$router.push({path: '/HelloWorld'});
          } else {
            message.error(res.data.msg)
          }

        }).catch(error => {
          message.error("login fail")
        })
      },
      toRegister() {
        this.showRegister = true
      },
      register() {
        if (this.validate()) return;
        api.sign_up(this.registerForm).then(res => {
          if (res && res.data.code === 0) {
            message.success("register success")
            this.showRegister = false;
          } else {
            message.error(res.data.msg)
          }

        }).catch(error => {
          message.error("register fail")
        })

      },

      validate() {
        let msg = '';
        if (this.registerForm.retype !== '' && this.registerForm.password !== this.registerForm.retype) {
          msg = 'Secondary password should be same to password';
        }
        if (this.registerForm.retype === '') {
          msg = 'Please input Secondary password';
        }
        if (this.registerForm.password === '') {
          msg = 'Please input password';
        }
        if (this.registerForm.usrname === '') {
          msg = 'Please input username';
        }
        if (msg !== '') {
          message.info(msg);
          return true
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: aliceblue;
    border: 1px solid #a3add7;
    box-shadow: 0 0 25px #838ac4;
  }

  .loginTitle {
    margin: 0px auto 48px auto;
    text-align: center;
    font-size: 40px;
  }

  .loginRemember {
    text-align: left;
    margin: 0px 0px 15px 0px;
  }


</style>
