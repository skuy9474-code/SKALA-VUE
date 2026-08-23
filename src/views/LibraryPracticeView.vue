<script setup>
import ElementPlus from '@/components/practices/library/ElementPlus.vue'
import BuildEnvironment from '@/components/practices/library/BuildEnvironment.vue'
</script>

<template>
  <section class="library-view">
    <h1>UI Library와 Build 실습</h1>
    <p>Element Plus와 Vite 환경변수 Code Challenge를 확인하는 화면입니다.</p>

    <ElementPlus />
    <BuildEnvironment />
  </section>
</template>

<style scoped>
.library-view > h1 {
  margin-bottom: 6px;
}

.library-view > p {
  margin: 0 0 24px;
  color: #606266;
}
</style>
