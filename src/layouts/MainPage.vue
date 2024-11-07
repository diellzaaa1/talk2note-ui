<template>
  <div class="main-container">
    <Header class="header" />
    <div class="content-container">
      <SideBar />
      <router-view /> 
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import Header from '@/components/header.vue';

export default {
  components: {
    Header,
    SideBar,
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
  background-color: rgba(17, 17, 17, 255); 
}

.header {
  height: 80px; 
  display: flex;
  padding: 0 20px;
}

.content-container {
  display: flex;
  flex: 1;
}
</style>
