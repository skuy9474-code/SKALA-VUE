<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

// 부모가 관리하는 반응형 상태입니다.
const message = ref('Parent 초기 메시지')

// 자식이 emit으로 보낸 데이터가 newValue에 들어옵니다.
const handleUpdateRequest = (newValue) => {
  message.value = newValue
}
</script>

<template>
  <section class="practice-section">
    <h2>Props &amp; Emits</h2>

    <div class="parent-container">
      <h2>상위 컴포넌트 (Parent)</h2>
      <p>
        현재 로컬 데이터(State): <strong>{{ message }}</strong>
      </p>

      <PropsEmitsChild :parent-data="message" @update-request="handleUpdateRequest" />
    </div>
  </section>
</template>

<style scoped>
.practice-section {
  padding: 24px;
}

.parent-container {
  padding: 22px;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  background: #eff6ff;
  color: #213547;
}
</style>
