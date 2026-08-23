<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="not-found-view">
    <div class="error-icon">☀️❓</div>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청한 주소가 존재하지 않거나 아직 개발되지 않았습니다.</p>
    <button type="button" @click="router.push({ name: 'WeatherHome' })">날씨 메인으로 이동</button>
  </section>
</template>

<style scoped>
.not-found-view {
  padding: 48px 24px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
}

.error-icon {
  font-size: 72px;
}

h2 {
  margin: 12px 0;
  font-weight: 700;
}

button {
  margin-top: 20px;
  padding: 10px 22px;
  color: #ffffff;
  background: #3498db;
  border: 0;
  border-radius: 20px;
  cursor: pointer;
}
</style>
