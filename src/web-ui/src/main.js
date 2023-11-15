// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { Auth, Logger, Analytics, Interactions } from 'aws-amplify';
import store from '@/store/store';
import AmplifyStore from '@/store/store';

import './styles/tokens.css'
import { ClickstreamAnalytics, SendMode } from "@aws/clickstream-web";

if (localStorage.getItem("clickstream_appId") !== null) {
  ClickstreamAnalytics.init({
    appId: localStorage.getItem("clickstream_appId"),
    endpoint: localStorage.getItem("clickstream_endpoint"),
    isLogEvents: true,
    sendMode: SendMode.Batch,
  })
}

// Base configuration for Amplify
const amplifyConfig = {
  Auth: {
    identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
    region: import.meta.env.VITE_AWS_REGION,
    identityPoolRegion: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
    mandatorySignIn: false,
  },
  Analytics: {
    disabled: false,
    autoSessionRecord: true,
    AWSPinpoint: {
      appId: import.meta.env.VITE_PINPOINT_APP_ID,
      region: import.meta.env.VITE_PINPOINT_REGION,
      mandatorySignIn: false,
    }
  },
  Interactions: {
    bots: {
      "RetailDemoStore": {
        "name": import.meta.env.VITE_BOT_NAME,
        "alias": import.meta.env.VITE_BOT_ALIAS,
        "region": import.meta.env.VITE_BOT_REGION,
      },
    }
  }
}

if (AmplifyStore.state.user?.id) {
  amplifyConfig.Analytics.AWSPinpoint.endpoint = {
    userId: AmplifyStore.state.user.id
  }
}

// Set the configuration
Auth.configure(amplifyConfig);
Analytics.configure(amplifyConfig);
Interactions.configure(amplifyConfig);

const logger = new Logger('main')

Auth.currentAuthenticatedUser()
  .then((user) => {
    logger.debug('Current Authenticated User Info:');
    logger.debug(user);
    return Auth.currentUserInfo()
  })
  .then((user) => logger.debug(user))
  .catch(err => logger.debug(err))

const app = createApp(App)
app.use(router)
app.use(store)

app.mount('#app')
