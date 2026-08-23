<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // 나만의 데이터로 제주를 추가했다.
  { id: 'city_04', name: '제주', temp: 23, status: '바람' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        @input="searchQuery = $event.target.value"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name} 지역이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}℃</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button
          type="button"
          class="detail-button"
          @click.stop="showDetail(item.name, item.status)"
        >
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  max-width: 100%;
  margin: 0 auto;
}

.search-box,
.list-box {
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.search-box input {
  width: 100%;
  padding: 8px;
}

.weather-card {
  position: relative;
  margin-bottom: 10px;
  padding: 12px;
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
  background: #ff7675;
}

.cool {
  background: #74b9ff;
}

.detail-button {
  position: absolute;
  top: 15px;
  right: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.status-bar {
  padding: 10px;
  color: #2e7d32;
  background: #e8f5e9;
  border-radius: 6px;
  text-align: center;
  font-weight: 700;
}
</style>
