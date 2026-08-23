<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span>
      날씨 단위:
      <strong>{{ configStore.unitLabel }}({{ configStore.unitSymbol }})</strong>
    </span>
    <button type="button" class="toggle-button" @click="configStore.toggleUnit">단위 변경</button>
    <button
      v-if="configStore.changeCount > 0"
      type="button"
      class="reset-button"
      @click="configStore.resetUnit"
    >
      섭씨로 초기화
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 14px;
}

button {
  padding: 6px 10px;
  color: #ffffff;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
}

.toggle-button {
  background: #4b6584;
}

.reset-button {
  background: #7f8c8d;
}

@media (max-width: 760px) {
  .unit-toggler {
    width: 100%;
    margin-left: 0;
  }
}
</style>
