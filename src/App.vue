<template>
  <div id="app">
    <div class="loading">
      <a-spin size="large" tip="Loading..."></a-spin>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    overflow: hidden;
  }

  .loading {
    visibility: hidden;
    position: absolute;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 100%;
    width: 100%;
    z-index: 10000;
    background-color: #e0e2e7;
    opacity: 0.6;
  }
</style>
