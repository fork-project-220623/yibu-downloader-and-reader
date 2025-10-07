<template>
  <ol class="breadcrumb" v-if="shared.book.ubookName">
    <li>
      <router-link to="/">首页</router-link>
    </li>
    <li>
      <a href="javascript:void(0)" @click="toggleToC">{{shared.book.ubookName}}</a>
    </li>
    <li class="active">{{shared.category.selected.name}}</li>
  </ol>
</template>
<script>
import { SharedInfo } from "../services/store";
export default {
  data() {
    return {
      shared: SharedInfo
    };
  },
  methods: {
    toggleToC() {
      this.shared.category.showToC = !this.shared.category.showToC;
    }
  }
};
</script>