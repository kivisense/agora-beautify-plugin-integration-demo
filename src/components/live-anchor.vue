<template>
  <div class="container">
    <div ref="player" class="player"></div>

    <button class="layer button" @click="handleEffectButtonClicked">
      {{ beautifyEnabled ? $t("turnOff") : $t("turnOn") }}
    </button>

    <div class="list-container layer">
      <ul
        class="list"
        ref="filterList"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
      >
        <li
          class="item"
          v-for="(item, index) in list"
          :key="item.id"
          @click="handleSelectMode(item.id)"
        >
          <span
            class="icon-mode"
            :title="$t(item.name)"
            :class="'icon-mode-' + (index + 1)"
          ></span>
        </li>
      </ul>
    </div>

    <div class="layer brightness">
      <img class="icon" src="../assets/dark.png" alt="dark" />

      <div class="rang-container">
        <vue-range-slider
          direction="vertical"
          ref="slider"
          v-model="brightness"
          :min="0"
          :max="1"
          :step="0.01"
          :width="10"
          :height="360"
          tooltip="hover"
          :bg-style="style.bg"
          :process-style="style.processStyle"
          :slider-style="style.sliderStyle"
        ></vue-range-slider>
      </div>
      <img class="icon" src="../assets/bright.png" alt="bright" />
    </div>

    <img class="layer logo-left" src="../assets/logo.png" alt="logo" />
    <img class="layer logo-right" src="../assets/logo.png" alt="logo" />
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk-ng";
import BeautifyExtension from "@kivisense/agora-beautify";
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

export default {
  components: {
    VueRangeSlider,
  },
  props: {
    channelId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      beautifyEnabled: true,
      brightnessEnabled: true,
      brightness: 0.5, // 值范围为0 - 1，0.5表示不调整亮度
      beautifyStyle: 1,
      style: {
        bg: {
          background: "#a7a7a7",
          overflow: "hidden",
        },
        processStyle: {
          background: "#fff",
          "border-radius": 0,
        },
        sliderStyle: {
          background: "transparent",
          "box-shadow": "none",
          width: "10px",
          height: "10px",
          left: 0,
          "border-radius": 0,
        },
      },

      list: [
        {
          id: 1,
          name: "Beautify",
        },
        {
          id: 2,
          name: "Moonlight",
        },
        {
          id: 3,
          name: "Sienna",
        },
        {
          id: 4,
          name: "Villa",
        },
        {
          id: 5,
          name: "Linen",
        },
        {
          id: 6,
          name: "Honey",
        },
        {
          id: 7,
          name: "Marine",
        },
        {
          id: 8,
          name: "Sable",
        },
        {
          id: 9,
          name: "VintageFilm",
        },
        {
          id: 10,
          name: "Hongkong",
        },
        {
          id: 11,
          name: "River",
        },
        {
          id: 12,
          name: "Dusk",
        },
      ],
    };
  },
  async mounted() {
    this.scrollLeft = 0;
    this.maxScrollLeft =
      73 * this.list.length - this.$refs.filterList.offsetWidth;
    this.start();

    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
  },
  watch: {
    brightness() {
      this.handleBrightnessChanged();
    },
  },
  methods: {
    async start() {
      // 创建直播的本地客户端
      rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

      // 注册插件
      const extension = new BeautifyExtension();
      AgoraRTC.registerExtensions([extension]);
      const processor = extension.createProcessor();

      // 设置本地客户端角色为主播
      rtc.client.setClientRole("host");
      // 加入房间
      await rtc.client.join(
        process.env.VUE_APP_AGORA_APPID,
        this.channelId,
        null,
        Math.floor(Math.random() * 10000)
      );

      // 创建本地音频流
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // 创建本地视频流
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: "720p_2",
      });

      // 推送本地音频流和视频流
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      // 本地播放视频流
      rtc.localVideoTrack.play(this.$refs.player);

      // 设置视频的处理管道
      rtc.localVideoTrack
        .pipe(processor)
        .pipe(rtc.localVideoTrack.processorDestination);

      // 开启美颜插件效果
      await processor.enable();

      this.processor = processor;
    },

    handleEffectButtonClicked() {
      this.beautifyEnabled = !this.beautifyEnabled;

      this.setProcessorOptions();
    },

    handleSelectMode(id) {
      this.beautifyStyle = id;

      this.setProcessorOptions();
    },

    handleBrightnessChanged() {
      if (this.inter) {
        clearTimeout(this.inter);
        this.inter = null;
      }
      this.inter = setTimeout(() => {
        this.setProcessorOptions();
      }, 50);
    },

    async setProcessorOptions() {
      // 设置插件参数
      await this.processor.setOptions({
        beautifyEnabled: this.beautifyEnabled,
        brightnessEnabled: this.brightnessEnabled,
        brightness: this.brightness,
        beautifyStyle: this.beautifyStyle,
      });
    },

    handleMouseDown(e) {
      const { clientX } = e;

      this.lastClientX = clientX;
    },
    handleMouseUp() {
      this.lastClientX = null;
    },
    handleMouseMove(e) {
      const { clientX } = e;
      if (this.lastClientX) {
        this.scrollLeft = this.scrollLeft + this.lastClientX - clientX;
        this.scrollLeft = Math.max(
          0,
          Math.min(this.maxScrollLeft, this.scrollLeft)
        );
        this.$refs.filterList.scrollLeft = this.scrollLeft;
        this.lastClientX = clientX;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  text-align: center;
}
.player {
  width: 100%;
  height: 100%;
}

.button {
  border-radius: 18px;
  border: 1px solid #ddcfc2;
  width: 190px;
  height: 36px;
  background: linear-gradient(
    242deg,
    rgba(62, 62, 62, 0.9) -2.25%,
    rgba(255, 255, 255, 0.9) -2.24%,
    rgba(159, 159, 159, 0.9) -2.23%,
    rgba(247, 238, 204, 0.9) 92.28%
  );
  color: #fff;
  font-size: 16px;
  line-height: 130%;
  letter-spacing: 0.9px;
  bottom: 100px;
  top: initial;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

.list-container {
  transform: translateX(-50%);
  left: 50%;
  top: initial;
  bottom: 10px;
  width: auto;
  height: auto;
}
.list {
  list-style: none;
  padding-left: 0;
  display: flex;
  align-items: center;
  height: auto;
  max-width: 600px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  .item {
    margin: 0 9px;
    cursor: pointer;
  }
  .icon-mode {
    width: 55px;
    height: 55px;
    background-image: url(../assets/mode.png);
    display: block;
    background-size: 330px 330px;
    border-radius: 50%;
  }
  .icon-mode-1 {
    background-position: -22px -39.5px;
  }
  .icon-mode-2 {
    background-position: -100px -39.5px;
  }
  .icon-mode-3 {
    background-position: -177px -39.5px;
  }
  .icon-mode-4 {
    background-position: -254px -39.5px;
  }
  .icon-mode-5 {
    background-position: -22px -143.5px;
  }
  .icon-mode-6 {
    background-position: -100px -143.5px;
  }
  .icon-mode-7 {
    background-position: -177px -143.5px;
  }
  .icon-mode-8 {
    background-position: -254px -143.5px;
  }
  .icon-mode-9 {
    background-position: -22px -246.5px;
  }
  .icon-mode-10 {
    background-position: -100px -246.5px;
  }
  .icon-mode-11 {
    background-position: -177px -246.5px;
  }
  .icon-mode-12 {
    background-position: -254px -246.5px;
  }
}

.brightness {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  right: 10px;
  width: 30px;
  height: auto;
  left: initial;
  transform: translateY(-50%);
  .rang-container {
    height: 360px;
  }
  .icon {
    width: 23px;
    height: 23px;
    margin-left: 7.5px;
    margin-right: 7.5px;
  }
}

.logo-left {
  width: 22vw;
  height: auto;
  left: 10px;
  bottom: 10px;
  top: initial;
}
.logo-right {
  width: 22vw;
  height: auto;
  left: initial;
  right: 10px;
  top: 10px;
}
</style>
