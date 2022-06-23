<script setup lang="ts">
import MusicPlayer from './components/MusicPlayer.vue'
</script>

<template>
  <main>
    <MusicPlayer />
  </main>
</template>

<style>
@import './assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

main {
    display: flex;
    justify-content: center;
}
</style>
