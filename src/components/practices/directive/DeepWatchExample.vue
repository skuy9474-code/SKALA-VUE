<script setup>
import { ref, watch } from 'vue'

const user = ref({
  name: '홍길동',
  age: 20,
})

const logDeep = ref('아직 반응 없음')
const logTarget = ref('아직 반응 없음')

// 객체 내부의 모든 속성 변화를 감시합니다.
watch(
  user,
  (newValue) => {
    logDeep.value = `[deep 감지] 누군가 변경됨! 현재 이름: ${newValue.name}, 나이: ${newValue.age}`
  },
  { deep: true },
)

// age 하나만 감시하므로 변경 전 값과 변경 후 값을 모두 알 수 있습니다.
watch(
  () => user.value.age,
  (newAge, oldAge) => {
    logTarget.value = `[타겟 감지] 나이가 ${oldAge}세 ➡️ ${newAge}세로 변경됨!`
  },
)
</script>

<template>
  <section class="practice-section">
    <h2>ref 객체/배열 감시</h2>
    <h3>👨‍💻 회원 데이터 조작 패널</h3>
    <p>이름: {{ user.name }} / 나이: {{ user.age }}세</p>

    <div class="button-group">
      <button @click="user.name = '이순신'">이름만 변경</button>
      <button @click="user.age++">나이만 변경 (age++)</button>
    </div>

    <div class="monitor deep">
      <strong>1) deep: true 모니터 (전체 감시)</strong>
      <p>{{ logDeep }}</p>
    </div>

    <div class="monitor target">
      <strong>2) 화살표 함수 모니터 (나이만 타겟 감시)</strong>
      <p>{{ logTarget }}</p>
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
  margin-top: 14px;
  padding: 16px;
  color: #213547;
}

.deep {
  border-left: 5px solid #f59e0b;
  background: #fffbeb;
}

.target {
  border-left: 5px solid #10b981;
  background: #ecfdf5;
}
</style>
