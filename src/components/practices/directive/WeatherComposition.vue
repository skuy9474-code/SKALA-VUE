<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 23, status: '바람' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 추가 반응형 상태: 더운 도시를 구분할 기준 온도
const temperatureThreshold = ref(25)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

// 추가 computed: 평균 기온과 기준 온도 이상인 도시 수
const averageTemperature = computed(() => {
  let total = 0
  weatherList.value.forEach((city) => {
    total += city.temp
  })

  return Math.round((total / weatherList.value.length) * 10) / 10
})

const warmCityCount = computed(
  () => weatherList.value.filter((city) => city.temp >= temperatureThreshold.value).length,
)

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 선택 도시 문구 변경: ${newInfo}`)
})

watch(temperatureThreshold, (newTemperature, oldTemperature) => {
  console.log(`[custom watch] 기준 온도: ${oldTemperature}℃ → ${newTemperature}℃`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: ${searchQuery.value}`)
})

const showDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}
</script>

<template>
  <section class="composition-dashboard">
    <div class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        placeholder="Composition 도시 검색"
        @input="searchQuery = $event.target.value"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery || '없음' }}</strong>
      </p>
    </div>

    <div class="custom-state-box">
      <label for="temperature-threshold">더운 도시 기준 온도</label>
      <input
        id="temperature-threshold"
        v-model.number="temperatureThreshold"
        type="number"
        min="0"
        max="40"
      />
      <p>
        평균 {{ averageTemperature }}℃ · {{ temperatureThreshold }}℃ 이상
        <strong>{{ warmCityCount }}개</strong>
      </p>
    </div>

    <div class="list-box">
      <h3>🏙️ Composition API 날씨 현황</h3>

      <article
        v-for="city in filteredWeatherList"
        :key="city.id"
        class="weather-card"
        @click="selectedCityInfo = `${city.name} 지역이 선택되었습니다.`"
      >
        <h4>{{ city.name }} ({{ city.status }})</h4>
        <p>현재 기온: {{ city.temp }}℃</p>
        <span v-if="city.temp >= temperatureThreshold" class="badge hot"> 🔥 기준 온도 이상 </span>
        <span v-else class="badge cool">❄️ 기준 온도 미만</span>
        <button type="button" @click.stop="showDetail(city)">상세보기</button>
      </article>

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </div>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </section>
</template>

<style scoped>
.composition-dashboard {
  width: 600px;
  max-width: 100%;
  margin: 0 auto;
}

.search-box,
.custom-state-box,
.list-box {
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

h3,
h4,
p {
  margin-top: 0;
}

.search-box input {
  width: 100%;
  padding: 8px;
}

.custom-state-box {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px 12px;
  background: #eef7ff;
}

.custom-state-box input {
  width: 80px;
  padding: 7px;
}

.custom-state-box p {
  grid-column: 1 / -1;
  margin-bottom: 0;
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

.weather-card button {
  position: absolute;
  top: 15px;
  right: 12px;
  padding: 6px 10px;
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

.status-bar {
  padding: 10px;
  color: #2e7d32;
  background: #e8f5e9;
  border-radius: 6px;
  text-align: center;
  font-weight: 700;
}

.empty-message {
  margin: 0;
  padding: 10px;
  color: #e74c3c;
  text-align: center;
}
</style>
