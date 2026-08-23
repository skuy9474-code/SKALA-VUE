<script setup>
import { ref, watchEffect } from 'vue'

const username = ref('홍길동')
const age = ref(20)
const logMessage = ref('대기 중...')

// 내부에서 사용한 username과 age를 Vue가 자동으로 감시합니다.
watchEffect(() => {
  logMessage.value = `[자동 감지] 이름: ${username.value} / 나이: ${age.value}세`
  console.log('🤖 watchEffect가 내부 변수 변경을 감지하여 실행되었습니다.')
})
</script>

<template>
  <section class="practice-section">
    <h2>자동 감시자 watchEffect()</h2>
    <p>이름: {{ username }} / 나이: {{ age }}세</p>

    <div class="button-group">
      <button @click="username = '이순신'">이름을 '이순신'으로 변경</button>
      <button @click="age++">나이 한 살 추가 (age++)</button>
    </div>

    <div class="monitor">
      <h3>👁️ watchEffect 자동 모니터링 시스템</h3>
      <p>{{ logMessage }}</p>
      <small>새로고침 직후에도 로그가 이미 표시되는 점을 확인해 보세요.</small>
    </div>
  </section>
</template>

<style scoped>
.practice-section {
  padding: 24px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}

.monitor {
  margin-top: 16px;
  padding: 16px;
  border-left: 5px solid #ec4899;
  background: #fdf2f8;
  color: #213547;
}
</style>
