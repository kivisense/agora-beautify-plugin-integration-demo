<template>
  <div id="app" ref="app">
    <live-anchor :channelId="channelId" class="layer" />
    <live-audience :channelId="channelId" class="layer audience" />
  </div>
</template>

<script>
import LiveAnchor from "@/components/live-anchor.vue";
import LiveAudience from "@/components/live-audience.vue";

export default {
  components: { LiveAudience, LiveAnchor },
  data() {
    return {
      channelId: "test" + Math.floor(Math.random() * 10000),
    };
  },
};
</script>

<style lang="less">
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.audience {
  top: 20px;
  left: 20px;
  width: 25%;
  height: 25%;
}
</style>
