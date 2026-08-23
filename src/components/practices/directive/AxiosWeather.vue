<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

const cityName = ref('Gwangju')
const weatherData = ref(null)
const airQuality = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

const airQualityLabel = computed(() => {
  const labels = ['', '좋음', '보통', '나쁨', '매우 나쁨', '위험']
  return labels[airQuality.value?.list?.[0]?.main?.aqi] ?? '확인 불가'
})

const handleFetchWeather = async () => {
  errorMessage.value = ''
  weatherData.value = null
  airQuality.value = null

  if (!API_KEY) {
    errorMessage.value =
      '.env.local 파일에 VITE_OPENWEATHER_API_KEY를 입력한 뒤 개발 서버를 다시 실행하세요.'
    return
  }

  if (!cityName.value.trim()) {
    errorMessage.value = '조회할 도시 이름을 입력하세요.'
    return
  }

  isLoading.value = true

  try {
    // 1. Current Weather API: 도시의 현재 날씨 조회
    const weatherResponse = await axios.get(WEATHER_URL, {
      params: {
        q: cityName.value.trim(),
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    weatherData.value = weatherResponse.data

    // 2. Air Pollution API: 같은 도시 좌표의 대기질 추가 조회
    const { lat, lon } = weatherResponse.data.coord
    const airResponse = await axios.get(AIR_POLLUTION_URL, {
      params: { lat, lon, appid: API_KEY },
    })

    airQuality.value = airResponse.data
  } catch (error) {
    console.error('OpenWeather API 호출 실패:', error)
    errorMessage.value = '날씨 데이터를 가져오지 못했습니다. 도시 이름과 API Key를 확인하세요.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="axios-weather">
    <h2>⚡ Axios OpenWeather 통신 실습</h2>
    <p class="description">Current Weather API와 Air Pollution API를 차례대로 호출합니다.</p>

    <form class="search-form" @submit.prevent="handleFetchWeather">
      <label for="axios-weather-city">영문 도시 이름</label>
      <input id="axios-weather-city" v-model.trim="cityName" type="text" placeholder="예: Seoul" />
      <button type="submit" :disabled="isLoading || !cityName">
        {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 가져오기' }}
      </button>
    </form>

    <p v-if="!API_KEY" class="key-guide">
      API Key가 아직 없습니다. 프로젝트의 <code>.env.example</code>을 참고해
      <code>.env.local</code>을 만들어 주세요.
    </p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="weatherData" class="result-card">
      <p>
        📍 위치: <strong>{{ weatherData.name }}</strong>
      </p>
      <p>
        🌡️ 현재 기온: <strong>{{ weatherData.main.temp }}℃</strong>
      </p>
      <p>
        ☁️ 날씨 상태: <strong>{{ weatherData.weather[0].description }}</strong>
      </p>
      <p>
        💧 습도: <strong>{{ weatherData.main.humidity }}%</strong>
      </p>
      <p v-if="airQuality">
        🌿 대기질: <strong>{{ airQualityLabel }}</strong>
      </p>
    </div>
    <p v-else-if="!errorMessage">아직 가져온 날씨 데이터가 없습니다.</p>
  </section>
</template>

<style scoped>
.axios-weather {
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

h2 {
  margin: 0;
  font-weight: 700;
}

.description {
  margin: 6px 0 16px;
  color: #64748b;
}

.search-form {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

input,
button {
  padding: 9px 12px;
  border-radius: 6px;
  font: inherit;
}

input {
  border: 1px solid #cbd5e1;
}

button {
  color: #ffffff;
  background: #0284c7;
  border: 0;
  cursor: pointer;
  font-weight: 700;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.key-guide,
.error-message {
  margin-top: 14px;
  padding: 12px;
  border-radius: 6px;
}

.key-guide {
  color: #7c2d12;
  background: #fff7ed;
}

.error-message {
  color: #b91c1c;
  background: #fef2f2;
}

code {
  padding: 2px 4px;
  background: #ffedd5;
  border-radius: 3px;
}

.result-card {
  margin-top: 16px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  line-height: 1.8;
}

.result-card strong {
  color: #0284c7;
}

@media (max-width: 700px) {
  .search-form {
    grid-template-columns: 1fr;
  }
}
</style>
