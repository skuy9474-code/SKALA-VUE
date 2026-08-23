<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import CityAddForm from './CityAddForm.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 23, status: '바람' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const nextCityNumber = ref(5)
const newCity = ref({
  name: '',
  temp: 20,
  status: '맑음',
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 추가 기능: 현재 등록된 도시의 평균 기온
const averageTemperature = computed(() => {
  if (weatherList.value.length === 0) return 0

  let total = 0
  weatherList.value.forEach((city) => {
    total += city.temp
  })

  return Math.round((total / weatherList.value.length) * 10) / 10
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구: ${newInfo}`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: ${searchQuery.value}`)
})

// 추가 기능: 도시 목록의 변화를 감시한다.
watch(
  weatherList,
  (newList) => {
    console.log(`[custom watch] 현재 등록된 도시: ${newList.length}개`)
  },
  { deep: true },
)

const updateQuery = (value) => {
  searchQuery.value = value
}

const selectCard = (message) => {
  selectedCityInfo.value = message
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const updateNewCityField = (field, value) => {
  newCity.value = { ...newCity.value, [field]: value }
}

const addCity = () => {
  const cityName = newCity.value.name.trim()

  if (!cityName || weatherList.value.some((city) => city.name === cityName)) {
    window.alert(!cityName ? '도시 이름을 입력해 주세요.' : '이미 등록된 도시입니다.')
    return
  }

  weatherList.value.push({
    id: `city_${nextCityNumber.value}`,
    ...newCity.value,
    name: cityName,
  })
  nextCityNumber.value += 1
  selectedCityInfo.value = `${cityName} 날씨 카드가 추가되었습니다.`
  newCity.value = {
    name: '',
    temp: 20,
    status: '맑음',
  }
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="updateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="selectCard"
        @click-detail="showDetail"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

    <div class="custom-summary">
      <strong>나만의 Computed:</strong>
      총 {{ weatherList.length }}개 도시의 평균 기온은 {{ averageTemperature }}℃입니다.
    </div>

    <CityAddForm :new-city="newCity" @update-field="updateNewCityField" @submit-city="addCity" />
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  max-width: 100%;
  margin: 0 auto;
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
  padding: 10px 0;
  color: #e74c3c;
  text-align: center;
}

.custom-summary {
  margin-top: 12px;
  padding: 12px;
  color: #0f4c5c;
  background: #e0f7fa;
  border-radius: 6px;
  text-align: center;
}
</style>
