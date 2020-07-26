<template>
  <div class="app">
    <!-- Navigation bar -->
    <nav class="navbar navbar-dark" style="background-color: #ff9900;">
      <a class="navbar-brand" href="#">
        <img src="@/assets/Amplify-Logo-White.svg" width="30" height="30" class="d-inline-block align-top" alt="">
        Signed Cookie Generator
      </a>
      <amplify-sign-out button-text="Sign Out" v-if="signInStatus === 'signedIn'"></amplify-sign-out>
    </nav>
    <div class="contents" v-if="signInStatus === 'signedIn'">
      <h1 class="display-4">{{ h1 }}</h1>
      <p class="lead">{{ lead }}</p>
      <div v-if="url">
        <hr class="my-4">
        <p>Click the button below to move to the previous page.</p>
        <a class="btn btn-outline-warning" v-bind:href="url" role="button">Back</a>
      </div>
    </div>
    <div class="contents" v-else>
      <div class="authenticator">
        <!-- https://github.com/aws-amplify/amplify-js/issues/5363 -->
        <amplify-authenticator username-alias="email">
          <amplify-sign-up
            slot="sign-up"
            username-alias="email"
            :form-fields.prop="signUpConfig.formFields"
          ></amplify-sign-up>
          <amplify-sign-in slot="sign-in" username-alias="email"></amplify-sign-in>
        </amplify-authenticator>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth, API, Hub, Logger } from "aws-amplify" 

Logger.LOG_LEVEL = 'INFO';
const logger = new Logger('App.vue', 'ERROR');

export default {
  name: 'App',
  data: function() {
    return {
      // Text
      h1: 'Generating your cookies...',
      lead: 'It takes few seconds to get them.',
      // Authentication
      signInStatus: 'signedOut',
      signUpConfig: {
        formFields: [
          {
            type: 'email',
            label: 'メールアドレス *',
            placeholder: 'メールアドレスを入力してください',
            required: true
          },
          {
            type: 'name',
            label: '名前 *',
            placeholder: '名前を入力してください',
            required: true
          },
          {
            type: 'password',
            label: 'パスワード *',
            placeholder: 'パスワードを入力してください',
            required: true
          }
        ],
      },
      // Control
      intervalId: undefined,
      url: ''
    }
  },
  created: async function() {
    Auth.currentAuthenticatedUser().then(() => {
      this.signInStatus = 'signedIn'
    }).catch(() => {
      this.signInStatus = 'signedOut'
    })
    Hub.listen("auth", async ({ payload: { event } }) => {
      switch (event) {
        case "signIn":
          Auth.currentAuthenticatedUser().then(() => {
            this.signInStatus = 'signedIn'
          }).catch(() => {
            this.signInStatus = 'signedOut'
          })
          break;
        case "signOut":
          this.signInStatus = 'signedOut'
          break;
        default: 
          this.signInStatus = 'signedOut' 
          break 
      }
    })
  },
  mounted: function() {
    this.intervalId = setInterval(() => {
      if (this.signInStatus == 'signedIn') {
        API.get("getcookie", "/cookie").then(response => {
          document.cookie = 'CloudFront-Policy=' + response['CloudFront-Policy'] + ';domain=' + response['Domain']
          document.cookie = 'CloudFront-Signature=' + response['CloudFront-Signature'] + ';domain=' + response['Domain']
          document.cookie = 'CloudFront-Key-Pair-Id=' + response['CloudFront-Key-Pair-Id'] + ';domain=' + response['Domain']
          this.h1 = 'Success'
          clearInterval(this.intervalId)
          if(this.url){
            window.location.href = this.url
          }else{
            this.lead = 'Saved the cookies on your browser 🎉'
          }
        }).catch(err => {
          this.h1 = 'Failure'
          this.lead = err
          logger.err(err)
        })
      }
    }, 10000)
    if(this.$route.query.url) {
      this.url = this.$route.query.url
      this.head = 'After the process, return to the original page automatically.'
    }
  },
  beforeDestroy: function() {
    clearInterval(this.intervalId)
  }
}
</script>

<style>
.btn-primary {
  color: #fff;
  background-color: #ff9900;
  border-color: #ff9900;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.contents {
  margin: 10px auto;
  width: 95% 
}
.authenticator {
  margin: 0 auto;
  max-width: 500px;
}
</style>
