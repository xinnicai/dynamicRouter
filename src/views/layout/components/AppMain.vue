<template>
  <section class="app-main">
    <div style="padding:10px">
      <transition name="fade-transform" mode="out-in">
        <!-- or name="fade" -->
        <!-- <router-view :key="key"></router-view> -->
        <router-view />
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: 93%;
  position: relative;
  overflow: auto;
  background-color:#f8f8f8;
  /* padding:10px; */
}

</style>
