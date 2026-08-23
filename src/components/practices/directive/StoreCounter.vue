<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter.js'

const counterStore = useCounterStore()

// state와 getter는 storeToRefs()로 반응성을 유지합니다.
const { count, doubleCount } = storeToRefs(counterStore)

// action은 일반 구조 분해를 해도 됩니다.
const { increment } = counterStore
</script>

<template>
  <section class="counter-practice">
    <h2>Counter Store 활용 실습</h2>
    <p>
      원본 카운트 데이터(state): <strong>{{ count }}</strong>
    </p>
    <p>
      2배 연산 데이터(getter): <strong>{{ doubleCount }}</strong>
    </p>
    <button type="button" @click="increment">숫자 1 증가(action)</button>
  </section>
</template>

<style scoped>
.counter-practice {
  padding: 24px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
}

h2 {
  margin: 0 0 16px;
  font-weight: 700;
}

p {
  margin: 8px 0;
}

button {
  margin-top: 12px;
  padding: 9px 14px;
  color: #ffffff;
  background: #42b883;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
}
</style>
