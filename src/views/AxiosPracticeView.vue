<script setup>
import AxiosWeather from '@/components/practices/directive/AxiosWeather.vue'
import AxiosJson from '@/components/practices/directive/AxiosJson.vue'
</script>

<template>
  <section class="axios-practice-view">
    <h1>🌐 Axios 실습</h1>
    <p class="page-guide">Axios로 날씨와 JSON 데이터를 요청해 본 실습입니다.</p>
    <AxiosWeather />
    <AxiosJson />
  </section>
</template>

<style scoped>
.axios-practice-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  margin: 0;
  font-weight: 700;
}

.page-guide {
  margin: -12px 0 0;
  color: #64748b;
}
</style>
