// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import axios from "axios";
import resolveBaseURL from './resolveBaseURL'

const baseURL = resolveBaseURL(
  import.meta.env.VITE_CLICKSTREAM_WORKSHOP_DOMAIN,
)

const connection = axios.create({
  baseURL
})

export default {
  createEvent(appId, endpoint) {
    return connection.get(`api/createEvent?appId=${ appId }&endpoint=${ endpoint }`)
  },
  getAppInfo() {
    return connection.get(`api/getAppInfo`)
  },
  updateConfigure(projectId) {
    if (!projectId || projectId.length === 0)
      throw "projectId required"
    return connection.get(`api/updateConfigure?projectId=${ projectId }`)
  },
}
