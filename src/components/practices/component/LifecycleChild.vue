<script setup>
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'

const count = ref(0)
let timerId = null

console.log('1. [setup] 컴포넌트가 생성되었습니다.')

onMounted(() => {
  console.log('2. [onMounted] 컴포넌트가 화면에 나타났습니다.')

  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

onUpdated(() => {
  console.log(`3. [onUpdated] 화면이 변경되었습니다. 현재 count: ${count.value}`)
})

onUnmounted(() => {
  clearInterval(timerId)
  console.log('4. [onUnmounted] 컴포넌트가 사라지고 타이머를 정리했습니다.')
})
</script>

<template>
  <h3>⏱️ 라이프사이클 훅 흐름 확인</h3>
  <div class="counter-display">
    <p>실시간 타이머 카운트: {{ count }}</p>
    <button type="button" @click="count++">수동으로 숫자 올리기</button>
  </div>
</template>

<style scoped>
.counter-display {
  padding: 15px;
  background: #e3fafc;
  border: 1px solid #99e9f2;
  border-radius: 8px;
  text-align: center;
}
</style>
