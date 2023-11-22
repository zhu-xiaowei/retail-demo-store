<template>
  <Layout :showNav="false" :showFooter="false" :showTextAlerts="false" :showDemoGuide="false"
          backgroundColor="var(--aws-squid-ink)">
    <div class="container mb-2 text-left">
      <h1 class="heading my-5 text-center">Configure SDK & Send example data</h1>
      <span v-if="isSubmitEnable">Please check the below parameters of the application are you just added. Then click the submit button.</span>
      <span v-else>Please add your application first.</span>

      <div class="mt-2 mb-4 my-sm-5 d-flex flex-column align-items-center align-items-sm-end">
        <div class="input-field input-group">
          <label>ProjectId</label>
          <input type="text" class="form-control" v-model="projectId">
        </div>
        <div class="input-field input-group">
          <label>AppId</label>
          <input type="text" class="form-control" v-model="appId">
        </div>
        <div class="input-field input-group">
          <label>Endpoint</label>
          <input type="text" class="form-control" v-model="endpoint">
        </div>
        <div class="d-flex flex-column flex-sm-row align-items-center">
          <button class=" mt-3 mt-sm-0 btn btn-primary"
                  :class="{'create-account-disable': !isSubmitEnable, 'create-account': isSubmitEnable}"
                  @click.prevent="submit">Confirm
          </button>
        </div>
        <router-link to="/" class="mt-3 skip-login btn btn-link" style="padding-right: 0;">Skip configure</router-link>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout/Layout.vue'
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { ClickstreamAnalytics, SendMode } from "@aws/clickstream-web";
import swal from "sweetalert";

const WorkshopRepository = RepositoryFactory.get('workshop');
export default {
  name: 'Configure',
  components: {
    Layout,
  },
  data() {
    return {
      projectId: '',
      appId: '',
      endpoint: '',
      isSubmitEnable: false,
    };
  },
  async created() {
    this.switchToHttpAndReload();
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data: appInfo } = await WorkshopRepository.getAppInfo();
      console.log(appInfo)
      if (appInfo && appInfo.projectId !== "" && appInfo.projectId !== "" && appInfo.projectId !== "") {
        this.projectId = appInfo.projectId
        this.appId = appInfo.appId
        this.endpoint = appInfo.endpoint
        this.isSubmitEnable = true
      } else {
        this.isSubmitEnable = false
      }
      console.log(`ProjectId: ${ this.projectId }, AppId: ${ this.appId }, Endpoint: ${ this.endpoint }`);
    },
    async submit() {
      if (!this.isSubmitEnable) return
      // send event
      const { status: status } = await WorkshopRepository.createEvent(this.projectId, this.appId, this.endpoint);
      if (status !== 200) {
        alert("Create event failed.")
        return
      }
      // config SDK
      localStorage.setItem("clickstream_appId", this.appId)
      localStorage.setItem("clickstream_endpoint", this.endpoint)
      ClickstreamAnalytics.init({
        appId: this.appId,
        endpoint: this.endpoint,
        isLogEvents: true,
        sendMode: SendMode.Batch,
      })
      this.renderSubmitConfirmation()
    },
    renderSubmitConfirmation() {
      swal({
        title: 'Configure Success',
        icon: 'success',
        buttons: {
          startShopping: 'Start Shopping',
        },
      }).then((value) => {
        switch (value) {
          case 'startShopping':
            this.$router.push('/');
        }
      });
    },
    switchToHttpAndReload() {
      let currentUrl = window.location.href;
      if (currentUrl.startsWith('https://')) {
        const httpUrl = currentUrl.replace('https://', 'http://');
        alert(`Please modify the browser url to ${httpUrl}`)
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 10vh;
  color: var(--white);
}

.create-account {
  border-color: var(--amazon-orange);
  border-radius: 4px;
  background: var(--amazon-orange);
}

.create-account-disable {
  border-color: var(--grey-300);
  border-radius: 4px;
  background: var(--grey-300);
}

.create-account:hover,
.create-account:focus {
  background: var(--amazon-orange-light);
  border-color: var(--amazon-orange-light);
}

.input-field {
  flex: 1;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.input-field label {
  margin-left: 20px;
  width: 120px;
  margin-right: 1px;
  color: white;
}

.input-field input {
  flex-grow: 1;
}
</style>
