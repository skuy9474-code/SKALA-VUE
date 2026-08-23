<script setup>
import { ref } from 'vue'
import LifecycleChild from './LifecycleChild.vue'

const isShow = ref(true)
</script>

<template>
  <section class="practice-section">
    <h2>Component Lifecycle Hook</h2>
    <button type="button" class="toggle-button" @click="isShow = !isShow">
      {{ isShow ? '실습 컴포넌트 없애기' : '실습 컴포넌트 다시 보이기' }}
    </button>
    <hr />

    <LifecycleChild v-if="isShow" />
  </section>
</template>

<style scoped>
.toggle-button {
  width: 100%;
  margin-bottom: 15px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 700;
}
</style>
