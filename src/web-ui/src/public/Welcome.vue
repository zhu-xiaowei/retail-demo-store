<template>
  <Layout :showNav="false" :showFooter="false" :showTextAlerts="false" :showDemoGuide="false"
          backgroundColor="var(--aws-squid-ink)">
    <div class="container mb-2 text-left">
      <h1 class="heading my-5 text-center">Welcome to the Retail Demo Store!</h1>
      <h3 class="heading my-5 text-left">Configure SDK & Send example data</h3>

      <div class="mt-2 mb-4 my-sm-5 d-flex flex-column align-items-center align-items-sm-start">
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
          <button class="create-account mt-3 mt-sm-0 ml-sm-3 btn btn-primary"
                  @click.prevent="submit">Submit
          </button>
        </div>
        <router-link to="/" class="mt-3 skip-login btn btn-link">Skip configure</router-link>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout/Layout.vue'

export default {
  name: 'Welcome',
  components: {
    Layout,
  },
  data() {
    return {
      projectId: '',
      appId: '',
      endpoint: '',
    };
  },
  methods: {
    submit() {
      console.log(`ProjectId: ${ this.projectId }, AppId: ${ this.appId }, Endpoint: ${ this.endpoint }`);
      this.$router.push('/');
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
