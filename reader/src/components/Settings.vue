<template>
  <div class="settings" :style="styles">
    <div class="setting-item">
      <label>
        <span>配置作用域:</span>
        <label>
          <input type="radio" name="scope" value="all" v-model="vm.scope" /> 全局
        </label> &nbsp;
        <label>
          <input type="radio" name="scope" :value="bookId" v-model="vm.scope" /> 本书
        </label>
      </label>
    </div>
    <div class="setting-item">
      <label>
        <span>页面宽度:</span>
        <input class="form-control input-sm" type="text" placeholder="支持百分比和绝对值" v-model="settings.pageWidth" />
      </label>
    </div>
    <div class="setting-item">
      <label>
        <span>页面对齐:</span>
        <label>
          <input type="radio" name="align" value="left" v-model="settings.align" /> 左
        </label>&nbsp;
        <label>
          <input type="radio" name="align" value="center" v-model="settings.align" /> 中
        </label>&nbsp;
        <label>
          <input type="radio" name="align" value="right" v-model="settings.align" /> 右
        </label>
      </label>
    </div>
    <div class="setting-item">
      <label>
        <span>行高:</span>
        <input class="form-control input-sm" type="text" placeholder="比如 30px" v-model="settings.lineHeight" />
      </label>
    </div>
    <div class="setting-item">
      <label>
        <span>字符间距:</span>
        <input class="form-control input-sm" type="text" placeholder="比如 3px" v-model="settings.letterSpacing" />
      </label>
    </div>
    <div class="setting-item">
      <label>
        <span>边距:</span>
        <input class="form-control input-sm" type="text" placeholder="比如 20px" v-model="settings.padding" />
      </label>
    </div>
  </div>
</template>
<script>
import { getOrSetSettings } from "../services/api";
export default {
  props: {
    bookId: {
      required: true
    }
  },
  data() {
    const setting = getOrSetSettings()[this.bookId] || {};
    return {
      vm: {
        width: 300,
        marginLeft: 0,
        scope: setting.enabled ? this.bookId : "all"
      },
      settings: {
        pageWidth: "100%",
        align: "center",
        lineHeight: "",
        letterSpacing: "3px",
        padding: "0"
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const width = document.body.offsetWidth;
      this.vm.marginLeft = (width - this.vm.width) / 2;
      this.updateStyles();
    },
    updateStyles() {
      this.$nextTick(function() {
        const settings = getOrSetSettings();
        const useBookSetting =
          settings[this.bookId] && settings[this.bookId].enabled;
        const currentSetting =
          (useBookSetting ? settings[this.bookId] : settings["all"]) || {};

        console.log("update styles: ", currentSetting);

        const content = document.querySelector(".chapter-content");
        //设置页面宽度
        content.style.width = currentSetting.pageWidth || "auto";

        //设置页面对齐
        content.classList.remove("left");
        content.classList.remove("center");
        content.classList.remove("right");
        content.classList.add(currentSetting.align || "center");

        // 设置行高
        content.style.lineHeight = currentSetting.lineHeight || "normal";
        //设置字符间距
        content.style.letterSpacing = currentSetting.letterSpacing || "normal";
        //设置padding
        content.style.paddingLeft = currentSetting.padding || "5px";
        content.style.paddingRight = currentSetting.padding || "5px";
      });
    },
    updateSettings() {
      const scope = this.vm.scope;
      const existed = getOrSetSettings()[scope] || {};
      Object.keys(this.settings).forEach(key => {
        this.settings[key] = existed[key];
      });
    },
    saveSettings(newVal) {
      const existed = getOrSetSettings();
      existed[this.vm.scope] = newVal;

      if (!existed[this.bookId]) {
        existed[this.bookId] = {};
      }
      existed[this.bookId].enabled = this.vm.scope === this.bookId;

      getOrSetSettings(existed);
    }
  },
  computed: {
    styles() {
      return {
        "margin-left": this.vm.marginLeft + "px",
        width: this.vm.width + "px"
      };
    }
  },
  watch: {
    "vm.scope": {
      handler() {
        this.updateSettings();
      },
      immediate: true
    },
    settings: {
      handler(newVal) {
        this.saveSettings(newVal);
        this.updateStyles();
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.settings {
  position: fixed;
  padding: 15px 20px;
  box-shadow: 5px 3px 3px #eee;
  background-color: #ddd;
  color: #0094ff;
  z-index: 10;
  bottom: 70px;
}

.setting-item label > span {
  display: inline-block;
  width: 80px;
}
.setting-item .form-control {
  display: inline-block;
  width: 150px;
}
</style>