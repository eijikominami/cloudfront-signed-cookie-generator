[**English**](README.md) / 日本語

# cloudfront-signed-cookie-generator
![GitHub](https://img.shields.io/github/license/eijikominami/cloudfront-signed-cookie-generator)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/eijikominami/cloudfront-signed-cookie-generator) 

``cloudfront-signed-cookie-generator`` は、Amazon CloudFront 上のWEBサイトへアクセスするための署名付きCookieを生成する、AWS Amplify アプリケーションです。このアプリケーションは、Vue.js で記述されており、Amazon API Gateway, Amazon Cognito, AWS Lambda, AWS Secret Manager および Amplify CLI が使用されています。

![screenshot](public/screenshot.gif)

## アーキテクチャ

![architecture](public/architecture.png)

```
$ amplify status

| Category | Resource name         | Operation | Provider plugin   |
| -------- | --------------------- | --------- | ----------------- |
| Function | getcookie             | No Change | awscloudformation |
| Function | signedcookiePreSignup | No Change | awscloudformation |
| Auth     | signedcookie          | No Change | awscloudformation |
| Api      | getcookie             | No Change | awscloudformation |
| Secret   | signedcookie          | No Change | awscloudformation |
```

``Secret`` カテゴリは、 このアプリケーション独自のカスタムリソースです。

## AWS Amplify Console を用いたデプロイ

AWS Amplify Console は、フルスタックサーバレスアプリケーションをホスティングします。AWSアカウントにサインインした上で下のボタンをクリックし、このアプリケーションをデプロイしてください。

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://ap-northeast-1.console.aws.amazon.com/amplify/home?region=ap-northeast-1#/deploy?repo=https://github.com/eijikominami/cloudfront-signed-cookie-generator)

AWS Amplify Console は、このリポジトリをあなたの GitHub アカウント上にフォークします。その後、バックエンドとフロントエンドのビルドとデプロイを実行します。生成されたアプリケーションは、 ``https://master.appid.amplifyapp.com`` で利用可能となります。

## 設定

デプロイ完了後、以下の設定を行なってください。

### CloudFront キーペアの作成

CloudFront 署名付きCookieを利用するためには、CloudFront キーペアが必要です。 [キーペアを生成](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html#private-content-creating-cloudfront-key-pairs) して、AWS Security Manager に秘密鍵を保存してください。

### メールのドメインリストの更新

このアプリケーションには、Cognito のサインアップ前 Lambda トリガーによって実行される関数があります。この関数は、ホワイトリストに掲載されたEメールのみ登録を許可し、初期時には ``@gmail.com`` ドメインのみ登録されています。このリストを変更される場合は、 ``/amplify/backend/function/signedcookiePreSignup/function-parameter.json`` を更新してください。

```
{
 "DOMAINWHITELIST": "gmail.com"
}
```

### カスタムポリシーの設定

このアプリケーションは、[カスタムポリシー](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/private-content-setting-signed-cookie-custom-policy.html)を用いた署名付きCookieを生成します。カスタムポリシーは、JSON形式で、署名付きCookieの認証条件を明記しています。自身の環境に合わせて ``amplify/backend/function/getcookie/parameters.json`` もしくは [AWS Amplify の ``環境変数``](https://docs.aws.amazon.com/ja_jp/amplify/latest/userguide/environment-variables.html) を更新してください。

以下のパラメータを指定することができます。

| parameters.json | 環境変数 | タイプ | 詳細 |
| --- | --- | --- | --- |
| AccessKey | ACCESS_KEY | String | キーペアID |
| Domain | DOMAIN | String | リクエストするファイルのドメイン名 |
| Duration | DURATION | String | リクエスト時刻を起点とした署名付きCookieの有効期限 |
| IpAddress | IP_ADDRESS | String | 許可するIPアドレス  |
| ResourcePath | RESOURCE_PATH | String | 許可するリクエストパス |

```json:amplify/backend/function/getcookie/parameters.json
{
    "AccessKey": "XXXXXXXXXXXXXXXX",
    "Domain": "example.com",
    "Duration": 3600,
    "IpAddress": "0.0.0.0/0",
    "ResourcePath": "https://example.com/*"
}
```