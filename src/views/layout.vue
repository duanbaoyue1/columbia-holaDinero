<template>
  <div class="web-layout">
    <keep-alive v-if="$route.meta.keepAlive">
      <!-- 这里是会被缓存的视图组件 -->
      <router-view />
    </keep-alive>
    <!-- 这里是不被缓存的视图组件 -->
    <router-view v-else />
    <message-box />
  </div>
</template>
