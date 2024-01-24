<template>
  <div class="page">
    <div v-show="showPlayer" ref="player" class="player"></div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk-ng";

let rtc = {
  client: null,
};

export default {
  data() {
    return {
      showPlayer: false,
    };
  },
  props: {
    channelId: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    this.start();
  },
  methods: {
    async start() {
      // 创建直播的本地客户端
      rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

      // 设置本地客户端角色为观众
      rtc.client.setClientRole("audience");

      // 加入房间
      await rtc.client.join(
        process.env.VUE_APP_AGORA_APPID,
        this.channelId,
        null,
        Math.floor(Math.random() * 10000)
      );

      // 接收到远端用户发布了新的音频轨道或者视频轨道
      rtc.client.on("user-published", async (user, mediaType) => {
        // 订阅该轨道
        await rtc.client.subscribe(user, mediaType);

        this.showPlayer = true;

        // 如果是视频，则播放视频流
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          remoteVideoTrack.play(this.$refs.player);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.player {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
</style>
