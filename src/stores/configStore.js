import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state: 현재 온도 단위와 사용자가 단위를 바꾼 횟수
  const unit = ref('celsius')
  const changeCount = ref(0)

  // getters: 화면에서 사용할 단위 기호와 한글 이름
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))
  const unitLabel = computed(() => (unit.value === 'celsius' ? '섭씨' : '화씨'))

  // actions: 온도 단위 변경과 초기화
  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
    changeCount.value += 1
  }

  const resetUnit = () => {
    unit.value = 'celsius'
    changeCount.value = 0
  }

  return { unit, changeCount, unitSymbol, unitLabel, toggleUnit, resetUnit }
})
