<script setup>
import { reactive, ref, watch } from 'vue'

const state = reactive({
  productName: '노트북',
  price: 1000,
})

const logAutoDeep = ref('대기 중...')
const logTarget = ref('대기 중...')

// reactive 객체를 그대로 감시하면 내부 속성도 자동으로 감시됩니다.
watch(state, (newValue, oldValue) => {
  logAutoDeep.value = `[자동 deep] 이전가격인척하는 값: ${oldValue.price}원 ➡️ 현재가격: ${newValue.price}원`
})

// price 값만 꺼내서 감시하면 실제 이전 값을 보존할 수 있습니다.
watch(
  () => state.price,
  (newPrice, oldPrice) => {
    logTarget.value = `[타겟 조준] 옛날값: ${oldPrice}원 ➡️ 바뀐값: ${newPrice}원`
  },
)
</script>

<template>
  <section class="practice-section">
    <h2>reactive() 데이터 watch 감시 규칙</h2>
    <h3>🛒 상품 정보 관리 (reactive)</h3>
    <p>상품명: {{ state.productName }} / 가격: {{ state.price }}원</p>
    <button @click="state.price += 500">가격 500원 인상</button>

    <div class="monitor auto">
      <strong>1) state 변수 통째로 감시 (deep 자동화)</strong>
      <p>{{ logAutoDeep }}</p>
      <small>주의: 객체의 이전 값과 현재 값이 똑같이 표시됩니다.</small>
    </div>

    <div class="monitor target">
      <strong>2) () =&gt; state.price를 감시 (과거 추적)</strong>
      <p>{{ logTarget }}</p>
      <small>특정 속성을 감시하면 실제 과거 가격이 보존됩니다.</small>
    </div>
  </section>
</template>

<style scoped>
.practice-section {
  padding: 24px;
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

.auto {
  border-left: 5px solid #ef4444;
  background: #fef2f2;
}

.target {
  border-left: 5px solid #10b981;
  background: #ecfdf5;
}
</style>
