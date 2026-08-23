<script setup>
import { computed, ref } from 'vue'

const count = ref(0)
const dummy = ref(0)

// 일반 함수는 컴포넌트가 다시 렌더링될 때마다 실행됩니다.
const getMethodResult = () => {
  console.log('❌ 일반 함수 실행됨!')
  return count.value * 2
}

// computed는 count가 바뀔 때만 다시 계산하고, 나머지는 저장된 값을 사용합니다.
const doubleCount = computed(() => {
  console.log('✅ computed 연산 실행됨!')
  return count.value * 2
})
</script>

<template>
  <section class="practice-section">
    <h2>computed() 캐싱 동작 비교</h2>
    <p>count: {{ count }} | dummy: {{ dummy }}</p>

    <div class="button-group">
      <button @click="count++">count 증가 (의존성 변경)</button>
      <button @click="dummy++">dummy 증가 (무관한 변경)</button>
    </div>

    <div class="monitor">
      <p>일반 함수 결과: {{ getMethodResult() }}</p>
      <p>computed 결과: {{ doubleCount }}</p>
      <small>dummy 버튼을 누른 뒤 콘솔에서 두 방식의 실행 차이를 확인해 보세요.</small>
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
  border-left: 5px solid #42b883;
  background: #f2fbf7;
  color: #213547;
}
</style>
