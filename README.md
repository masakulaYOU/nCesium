# nCesium
使用vue 2.x配合cesiumJS构建一个三维webgis项目demo

## 构建过程
### 安装cnpm
cnpm是淘宝的完整npmjs.org的景象，因为服务器在中国，所有下载包的速度比npm快得多，可以使用cnpm代替官方版本，目前的更新频率为10分钟，以保证尽量与官方服务器同步。

```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```

*[更多cnpm信息参考官网](https://npm.taobao.org/)*

也可以使用[`yarn`]((https://yarn.org.cn/))代替，速度也比npm官方快很多

### 安装vue-cli脚手架
全局安装vue/cli和vue/cli-init
```bash
$ cnpm install -g @vue/cli
$ cnpm install -g @vue/cli-init
```

当前的vue-cli不带init部分，所以要使用其`init`命令，需要另外下载`@vue/cli-init`包

### 创建Webpack模板项目
我们选用webpack模板进行创建，命令如下

```
$ vue init <template-name> <project-name>
```

其中`<template-name>`是使用的模板，我们键入`webpack`,`<project-name>`即为项目名

之后根据提示选择需要的配置，安装成功后便可以输入`cd <project-name>`进入项目文件夹

### 安装Cesium环境

在当前项目的文件夹根目录，通过cnpm下载cesium

```
$ cnpm install --save cesium
```

`--save`命令是将当前安装的包同事写入`package.json`文件中

下载完成后便可以在`node_modules`文件夹中找到`cesium`文件夹

## Webpack环境配置

在vue中使用Cesium还需要对Webpack进行一些配置，这样才能正常打包Cesium的代码，否则将无法使用Cesium

### 修改webpack.base.conf.js
在工程目录的`build/webpack.base.conf.js`文件中，我们添加一下配置

1. 在头部定义`cesiumSource`路径字符串，路径就为node_modules中的cesium/Source,即`const cesiumSource = 'node_modules/cesium/Source'`，然后在`resolve.alias`中将cesium目录添加进去

```javascript
const cesiumSource = 'node_modules/cesium/Source'
...
resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'cesium': resolve(cesiumSource)
    }
  }
```

2. 在`module.exports`中的`output`中，我们添加`sourcePrefix: ' '`，这样可以webpack正确处理多行字符串
```javascript
output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    sourcePrefix: ' '
  }
``` 

3. 在`module`对象中添加`unknownContextCritical: false`，让webpack打印载入特定库时候的警告
4. 在`module`对象中添加`unknowContextRegExp: /^.\/.*$/`，为了解决错误`Error: Cannot find module "."`的错误

```javascript
 rules: [
      ...
    ],
    unknownContextRegExp: /^.\/.*$/,
    unknownContextCritical: false
```

### 配置webpack.dev.conf.js和webpack.prod.conf.js
在`build/webpack.dev.conf.js`和`build/webpack.prod.conf.js`中，修改步骤如下：

1. 首先定义source和worker的地址

```javascript
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
```

2. 在`plugins`中的`webpack.DefinePlugin`对象中添加cesium的baseURL
```javascript
new webpack.DefinePlugin({
  'process.env': require('../config/dev.env'),
  CESIUM_BASE_URL: JSON.stringify('')
})
```

3. 同样，在`plugins`中新添加三个插件，用于复制cesium所需的文件
```javascript
new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
```

## 编写Vue组件
webpack配置完成后，便可以编写组件了。

1. 在`src/components`目录中新建一个`cesiumViewer.vue`文件，内容只需要写盛放cesium三维地球的容器
```html
<template>
  <div id="cesiumContainer"></div>
</template>
```

2. 在`App.vue`中，引入`cesiumViewer.vue`组件，并定义样式
```html
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
```

3. 在`main.js`中，引入cesium以及css文件，并在Vue对象mounted之后创建Viewer对象
```javascript
import Vue from 'vue'
import App from './App'
import router from './router'
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  mounted(){
    this.viewer = new Cesium.Viewer('cesiumContainer')
  },
  data: {
    viewer: {}
  }
})
```

## 启动项目
以上工作完成后，回到项目根目录，执行`npm run dev`，进入`localhost:8080`，若出现了三维地球，则表示可以正常工作了

执行`npm run build`，会自动生成一个dist文件夹，里面包含了html文件、css文件和js文件，可以将这些文件部署到服务器上，供外网访问
