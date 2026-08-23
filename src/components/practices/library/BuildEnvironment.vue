<script setup>
const myRegion = 'Suwon'
const regionGreeting = `웰컴 투 ${myRegion}`

const currentMode = import.meta.env.MODE
const currentApiUrl = import.meta.env.VITE_API_URL

console.log('현재 주입된 API 서버 주소:', currentApiUrl)
</script>

<template>
  <section class="build-practice">
    <h2>🛠️ Prettier와 환경변수 실습</h2>
    <p>Prettier 변환 결과: {{ regionGreeting }}</p>
    <p>현재 빌드 모드: {{ currentMode }}</p>
    <p>API 주소: {{ currentApiUrl || '개발 모드에서는 설정되지 않음' }}</p>
  </section>
</template>

<style scoped>
.build-practice {
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.build-practice h2 {
  margin-top: 0;
}
</style>
