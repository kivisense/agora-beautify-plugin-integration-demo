import Vue from "vue";
import "normalize.css";
import App from "./App.vue";
import i18n from "./i18n";

function start() {
  new Vue({
    i18n,
    render: (h) => h(App),
  }).$mount("#app");
}

start();
