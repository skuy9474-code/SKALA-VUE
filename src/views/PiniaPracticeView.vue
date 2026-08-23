<script setup>
import StoreCounter from '@/components/practices/directive/StoreCounter.vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <section class="pinia-view">
    <h2>🍍 Pinia 실습</h2>
    <p class="guide">아래 카운터는 <code>counter.js</code>의 state, getter, action을 사용합니다.</p>
    <StoreCounter />

    <div class="config-summary">
      <h3>날씨 설정 Store</h3>
      <p>현재 단위: {{ configStore.unitLabel }}({{ configStore.unitSymbol }})</p>
      <p>단위 변경 횟수: {{ configStore.changeCount }}회</p>
    </div>
  </section>
</template>

<style scoped>
.pinia-view {
  max-width: 600px;
  margin: 0 auto;
}

h2,
h3 {
  font-weight: 700;
}

.guide {
  margin: 8px 0 18px;
}

code {
  padding: 2px 5px;
  color: #d63031;
  background: #ffeaa7;
  border-radius: 3px;
}

.config-summary {
  margin-top: 18px;
  padding: 18px;
  background: #eef7ff;
  border: 1px solid #d7e5ef;
  border-radius: 8px;
}
</style>
