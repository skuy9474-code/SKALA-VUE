<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return Math.round(rawTemp * 10) / 10
})
</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${cityItem.name} 지역이 선택되었습니다.`)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>

    <button
      type="button"
      class="btn-detail"
      @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
    >
      상세보기
    </button>
  </div>
</template>

<style scoped>
/* PDF 예시의 한 줄 날씨 카드 */
.weather-card {
  position: relative;
  padding: 12px;
  margin-bottom: 10px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  color: #ffffff;
  border-radius: 4px;
  font-size: 12px;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.btn-detail {
  position: absolute;
  top: 15px;
  right: 12px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
