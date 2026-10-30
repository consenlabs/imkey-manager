<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<style type="text/css">
* {
  padding: 0;
  margin: 0;
}
html {
  font-family: PingFang SC;
}
html,
body,
#app {
  height: 100%;
  overflow: hidden;
  min-width: 1440px;
  min-height: 862px;
}
button {
  outline: none;
  border: none;
  cursor: pointer;
}
a[href],
[role='button']:not([aria-disabled='true']) {
  cursor: pointer;
}
</style>
