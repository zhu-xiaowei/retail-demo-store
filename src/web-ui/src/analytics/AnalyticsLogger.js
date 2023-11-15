import { ClickstreamAnalytics } from "@aws/clickstream-web";
import { getAnalytics, logEvent, setUserProperties, setUserId } from "firebase/analytics";

export const AnalyticsLogger = {

  /**
   * Centralized events log method
   * @param eventName
   * @param attributes
   * @param items
   */
  log(eventName, attributes) {
    attributes = attributes ?? {}
    const { ["items"]: items, ...mAttributes } = attributes;

    // Clickstream Analytics SDK
    let name = "";
    if (!eventName.startsWith("exp_")) {
      name = "_" + eventName;
    }

    if (this.clickstreamEnabled()) {
      ClickstreamAnalytics.record({
        name: name, attributes: mAttributes, items: items
      })
    }

    //Firebase SDK
    if (this.firebaseEnabled()) {
      const analytics = getAnalytics();
      logEvent(analytics, eventName, attributes);
    }
  },

  setUserAttributes(attributes) {
    // Clickstream SDK
    if (this.clickstreamEnabled()) {
      ClickstreamAnalytics.setUserAttributes(attributes);
    }

    // Firebase SDK
    if (this.firebaseEnabled()) {
      const analytics = getAnalytics();
      setUserProperties(analytics, attributes);
    }
  },

  setUserId(userId) {
    //Clickstream SDK
    if (this.clickstreamEnabled()) {
      ClickstreamAnalytics.setUserId(userId)
    }
    //Firebase SDK
    if (this.firebaseEnabled()) {
      const analytics = getAnalytics();
      setUserId(analytics, userId);
    }
  },

  firebaseEnabled() {
    return false
  },

  clickstreamEnabled() {
    return localStorage.getItem("clickstream_appId") !== null
  }

}
