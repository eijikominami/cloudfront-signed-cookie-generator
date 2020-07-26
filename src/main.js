/* Vue */
import Vue from 'vue'
import router from '@/router'
import App from '@/App.vue'

/* Bootstrap Vue */
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

/* Amplify */
import { Amplify, I18n } from 'aws-amplify'
import '@aws-amplify/ui-vue'
import awsconfig from './aws-exports'
Amplify.configure(awsconfig)

// プロダクションのヒントを非表示にする
Vue.config.devtools = true
Vue.config.productionTip = false

// 多言語対応
let languageDict = {
  ja:{
      // タイトル
      'Sign in to your account' : 'サインイン',
      'Create a new account': 'アカウントの新規作成',
      'Reset your password': 'パスワードをリセット',
      'Confirm Sign Up': 'メールアドレスの認証',
      // 入力項目
      'Email Address *' : 'メールアドレス *',
      'Username *' : 'メールアドレス *',
      'Name *' : '名前 *',
      'Password *' : 'パスワード *',
      'Code': '認証コード',
      'New Password': '新しいパスワード',
      'Confirmation Code': '認証コード',
      'Enter your username' : 'メールアドレスを入力してください',
      'Username' : 'メールアドレスを入力してください',
      'Enter your email address' : 'メールアドレスを入力してください',
      'Email' : 'メールアドレスを入力してください',
      'Enter your password' : 'パスワードを入力してください',
      'Password' : 'パスワードを入力してください',
      'Name' : '名前を入力してください',
      // 注釈
      'Forgot your password?' : 'パスワードを忘れた場合は ',
      'No account?' : 'アカウントの作成は ',
      'Have an account?': 'サインインは ', 
      'Lost your code? ': 'メールアドレスに認証コードが届きませんか? ', 
      // ボタン
      'Back to Sign In': 'サインイン',
      'Resend Code': '認証コードを再送信する',
      'Reset password' : 'パスワードを再設定',
      'Sign in' : 'こちら',
      'Sign In' : 'サインイン',
      'Sign Out' : 'サインアウト',
      'Create account' : 'こちら',
      'Create Account' : 'アカウントを作成',
      'Send Code': '次へ進む',
      'Submit': '送信',
      'Confirm': '登録完了',
      // エラーコード
      'Username cannot be empty': 'メールアドレスを入力してください',
      'null failed with error Generate callenges lambda cannot be called..': 'パスワードを入力してください',
      'Incorrect username or password.': 'メールアドレス もしくは パスワードが正しくありません',
      'Custom auth lambda trigger is not configured for the user pool.': 'メールアドレス もしくは パスワードが正しくありません',
      'User does not exist.': 'メールアドレス もしくは パスワードが正しくありません',
      'Username/client id combination not found.': 'メールアドレスが正しくありません',
      'PreSignUp failed with error Invalid email domain': 'そのメールアドレスは許可されていません',
      'Invalid verification code provided, please try again.': '認証コードが正しくありません',
      'Password reset required for the user': 'パスワードを再設定してください',
      'The following fields must be completed: Email, Name, Password': 'メールアドレス, 名前 および パスワード を入力してください',
      'The following fields must be completed: Email, Name': 'メールアドレス と 名前 を入力してください',
      'The following fields must be completed: Email, Password': 'メールアドレス と パスワード を入力してください',
      'The following fields must be completed: Name, Password': '名前 と パスワード を入力してください',
      'The following fields must be completed: Email': 'メールアドレス を入力してください',
      'The following fields must be completed: Name': '名前 を入力してください',
      'The following fields must be completed: Password': 'パスワード を入力してください',
  }
}
I18n.putVocabularies(languageDict)

new Vue({
  render: h => h(App),
  router,
  components: {
    App
  }
}).$mount('#app')