<template>
  <div id="app">
    <cesium-viewer></cesium-viewer>
  </div>
</template>

<script>
import cesiumViewer from './components/cesiumViewer.vue'
export default {
  name: 'App',
  components: {
    cesiumViewer
  }
}
</script>

<style>
html, body, #cesiumContainer {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
</style>
