<script setup>
import { ref, watch } from 'vue'

const city = ref('서울')
const dateType = ref('오늘')
const apiStatus = ref('대기 중...')

// 감시할 ref 여러 개를 배열로 묶으면 어느 하나가 바뀌어도 실행됩니다.
watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => {
  apiStatus.value = `[변경 감지] ${oldCity}(${oldDate}) ➡️ ${newCity}(${newDate})`
  console.log(`🤖 [통합 API 호출] ${newCity}의 ${newDate} 날씨를 불러옵니다...`)
})
</script>

<template>
  <section class="practice-section">
    <h2>여러 개의 변수 동시 감시 (watch)</h2>
    <h3>날씨 조건 설정</h3>

    <div class="control-row">
      <label for="multi-watch-city">도시:</label>
      <select id="multi-watch-city" v-model="city">
        <option value="서울">서울</option>
        <option value="수원">수원</option>
        <option value="부산">부산</option>
      </select>
    </div>

    <div class="control-row">
      <span>날짜:</span>
      <label><input v-model="dateType" type="radio" value="오늘" /> 오늘</label>
      <label><input v-model="dateType" type="radio" value="내일" /> 내일</label>
      <label><input v-model="dateType" type="radio" value="주간예보" /> 주간예보</label>
    </div>

    <div class="monitor">
      <h3>통합 모니터링 로그</h3>
      <p>현재 상태: {{ apiStatus }}</p>
    </div>
  </section>
</template>

<style scoped>
.practice-section {
  padding: 24px;
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
}

select {
  padding: 7px 10px;
}

.monitor {
  margin-top: 16px;
  padding: 16px;
  border-left: 5px solid #8b5cf6;
  background: #f5f3ff;
  color: #213547;
}
</style>
