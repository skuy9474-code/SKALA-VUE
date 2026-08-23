<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityMapping = {
  city_01: { name: '서울', english: 'Seoul,KR' },
  city_02: { name: '수원', english: 'Suwon,KR' },
  city_03: { name: '부산', english: 'Busan,KR' },
  city_04: { name: '제주', english: 'Jeju City,KR' },
}

const mockDetails = {
  city_01: {
    temp: 28,
    feelsLike: 30,
    tempMin: 24,
    tempMax: 32,
    status: '맑음',
    humidity: 55,
    wind: 2.5,
    aqi: 2,
    uv: 7,
  },
  city_02: {
    temp: 24,
    feelsLike: 25,
    tempMin: 21,
    tempMax: 27,
    status: '비',
    humidity: 85,
    wind: 4.1,
    aqi: 3,
    uv: 3,
  },
  city_03: {
    temp: 26,
    feelsLike: 28,
    tempMin: 23,
    tempMax: 29,
    status: '구름',
    humidity: 65,
    wind: 5,
    aqi: 2,
    uv: 6,
  },
  city_04: {
    temp: 23,
    feelsLike: 24,
    tempMin: 20,
    tempMax: 26,
    status: '바람',
    humidity: 71,
    wind: 6.2,
    aqi: 1,
    uv: 8,
  },
}

const queryCity =
  typeof route.query.name === 'string' && typeof route.query.english === 'string'
    ? { name: route.query.name, english: route.query.english }
    : null
const targetCity = cityMapping[route.params.cityId] ?? queryCity
const initialMock = mockDetails[route.params.cityId]
const cityData = ref(initialMock && targetCity ? { ...targetCity, ...initialMock } : null)
const isLoading = ref(false)
const apiMessage = ref('학습용 Mock 상세 데이터')

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const UV_URL = 'https://api.open-meteo.com/v1/forecast'

const fetchDetail = async () => {
  if (!targetCity || !API_KEY) {
    if (!API_KEY) apiMessage.value = 'API Key가 없어 Mock 데이터를 표시합니다.'
    return
  }

  isLoading.value = true
  try {
    const weather = await axios.get(WEATHER_URL, {
      params: { q: targetCity.english, appid: API_KEY, units: 'metric', lang: 'kr' },
    })
    const raw = weather.data
    const { lat, lon } = raw.coord
    let aqi = cityData.value?.aqi ?? 0
    let uvValue = cityData.value?.uv ?? null
    let tempMin = cityData.value?.tempMin ?? raw.main.temp_min
    let tempMax = cityData.value?.tempMax ?? raw.main.temp_max
    let uvApiFailed = false

    try {
      const air = await axios.get(AIR_URL, { params: { lat, lon, appid: API_KEY } })
      aqi = air.data.list[0].main.aqi
    } catch (airError) {
      console.warn('대기질 API 호출 실패:', airError)
    }

    try {
      const uv = await axios.get(UV_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          daily: 'uv_index_max,temperature_2m_max,temperature_2m_min',
          timezone: 'Asia/Seoul',
          forecast_days: 1,
        },
      })
      uvValue = uv.data.daily.uv_index_max[0]
      tempMin = uv.data.daily.temperature_2m_min[0]
      tempMax = uv.data.daily.temperature_2m_max[0]
    } catch (uvError) {
      console.warn('자외선 API 호출 실패:', uvError)
      uvApiFailed = true
    }

    cityData.value = {
      ...targetCity,
      temp: raw.main.temp,
      feelsLike: raw.main.feels_like,
      tempMin,
      tempMax,
      status: raw.weather[0].description,
      humidity: raw.main.humidity,
      wind: raw.wind.speed,
      aqi,
      uv: uvValue,
      sunrise: raw.sys.sunrise,
      sunset: raw.sys.sunset,
    }
    apiMessage.value = uvApiFailed
      ? 'OpenWeather 실시간 데이터 · 자외선은 기존 데이터'
      : 'OpenWeather + Open-Meteo 실시간 상세 데이터'
  } catch (error) {
    console.error('상세 날씨 API 호출 실패:', error)
    apiMessage.value = 'API 호출에 실패해 기존 데이터를 표시합니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDetail)

const convertTemp = (temp) =>
  configStore.unit === 'fahrenheit' ? Math.round((temp * 9) / 5 + 32) : Math.round(temp * 10) / 10
const displayTemp = computed(() => (cityData.value ? convertTemp(cityData.value.temp) : 0))
const weatherIcon = computed(() => {
  const status = cityData.value?.status ?? ''
  if (status.includes('비')) return '🌧️'
  if (status.includes('눈')) return '🌨️'
  if (status.includes('구름') || status.includes('흐림')) return '☁️'
  if (status.includes('바람')) return '🌬️'
  return '☀️'
})
const airLabel = computed(
  () => ['', '좋음', '보통', '나쁨', '매우 나쁨', '위험'][cityData.value?.aqi] ?? '-',
)
const uvLabel = computed(() => {
  const uv = cityData.value?.uv
  if (uv === null || uv === undefined) return '확인 불가'
  if (uv < 3) return '낮음'
  if (uv < 6) return '보통'
  if (uv < 8) return '높음'
  return '매우 높음'
})
const formatTime = (time) =>
  time
    ? new Date(time * 1000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : '-'
const advice = computed(() => {
  if (!cityData.value) return ''
  const city = cityData.value
  const result = []
  if (city.status.includes('비') || city.status.includes('눈')) result.push('우산을 챙기세요')
  if (city.temp >= 28) result.push('가볍고 시원한 옷이 좋아요')
  else if (city.temp <= 10) result.push('따뜻한 겉옷이 필요해요')
  else result.push('얇은 겉옷을 준비하면 좋아요')
  if (city.uv >= 6) result.push('선크림과 선글라스를 챙기세요')
  if (city.aqi >= 3) result.push('외출할 때 마스크를 권장해요')
  return result.join('. ') + '.'
})
</script>

<template>
  <section class="detail-page">
    <button class="back-link" type="button" @click="router.push('/')">← 지역 목록으로</button>
    <div v-if="isLoading" class="loading">실시간 상세 날씨를 불러오는 중입니다...</div>

    <template v-if="cityData">
      <header class="weather-hero">
        <div>
          <p>WEATHER DETAIL</p>
          <h2>{{ cityData.name }}의 오늘</h2>
          <span>{{ cityData.status }} · {{ apiMessage }}</span>
        </div>
        <div class="hero-temperature">
          <span>{{ weatherIcon }}</span>
          <div>
            <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong
            ><small>체감 {{ convertTemp(cityData.feelsLike) }}{{ configStore.unitSymbol }}</small>
          </div>
        </div>
      </header>

      <section class="content-section">
        <div class="section-title">
          <div>
            <span>01</span>
            <h3>현재 기상 상태</h3>
          </div>
          <p>외출 전에 기온 차이와 바람을 확인하세요.</p>
        </div>
        <div class="weather-grid">
          <article>
            <span>체감온도</span
            ><strong>{{ convertTemp(cityData.feelsLike) }}{{ configStore.unitSymbol }}</strong
            ><small>실제로 느껴지는 온도</small>
          </article>
          <article>
            <span>최저 / 최고</span
            ><strong
              >{{ convertTemp(cityData.tempMin) }}° / {{ convertTemp(cityData.tempMax) }}°</strong
            ><small>오늘의 온도 범위</small>
          </article>
          <article>
            <span>습도</span><strong>{{ cityData.humidity }}%</strong><small>헤어스타일 참고</small>
          </article>
          <article>
            <span>바람</span><strong>{{ cityData.wind }}m/s</strong><small>겉옷과 모자 참고</small>
          </article>
        </div>
      </section>

      <section class="content-section outside-box">
        <div class="section-title">
          <div>
            <span>02</span>
            <h3>외출 정보</h3>
          </div>
          <p>피부 보호와 외출 준비물을 확인하세요.</p>
        </div>
        <div class="outside-grid">
          <article>
            <b>☀️</b>
            <div>
              <small>자외선</small><strong>{{ uvLabel }} · {{ cityData.uv ?? '-' }}</strong>
            </div>
          </article>
          <article>
            <b>🍃</b>
            <div>
              <small>대기질</small><strong>{{ airLabel }}</strong>
            </div>
          </article>
          <article>
            <b>🌅</b>
            <div>
              <small>일출</small><strong>{{ formatTime(cityData.sunrise) }}</strong>
            </div>
          </article>
          <article>
            <b>🌇</b>
            <div>
              <small>일몰</small><strong>{{ formatTime(cityData.sunset) }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="advice-box">
        <span>👗</span>
        <div>
          <small>TODAY'S OOTD TIP</small>
          <h3>오늘의 한 줄 외출 조언</h3>
          <p>{{ advice }}</p>
        </div>
        <button type="button" @click="router.push('/')">OOTD 추천 확인하기</button>
      </section>
    </template>

    <div v-else-if="!isLoading" class="missing">
      <span>🌫️</span>
      <h2>상세 날씨를 찾지 못했습니다.</h2>
      <button type="button" @click="router.push('/')">지역 목록으로</button>
    </div>
  </section>
</template>

<style scoped>
.detail-page {
  max-width: 1120px;
  margin: 0 auto;
}
button {
  font: inherit;
}
.back-link {
  margin-bottom: 15px;
  padding: 0;
  color: #718583;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-weight: 700;
}
.loading {
  margin-bottom: 12px;
  padding: 10px 15px;
  color: #4f716f;
  background: #edf6f3;
  border-radius: 10px;
}
.weather-hero {
  display: flex;
  min-height: 240px;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 38px 48px;
  color: white;
  background: linear-gradient(125deg, #658f9b, #9ab8a8);
  border-radius: 26px;
  box-shadow: 0 18px 38px rgba(70, 104, 105, 0.17);
}
.weather-hero p {
  margin: 0;
  opacity: 0.8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}
.weather-hero h2 {
  margin: 8px 0 5px;
  font-size: 34px;
}
.weather-hero > div > span {
  opacity: 0.85;
  font-size: 13px;
}
.hero-temperature {
  display: flex;
  align-items: center;
  gap: 20px;
}
.hero-temperature > span {
  font-size: 72px;
}
.hero-temperature div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.hero-temperature strong {
  font-size: 56px;
  line-height: 1;
  letter-spacing: -3px;
}
.hero-temperature small {
  margin-top: 7px;
  opacity: 0.85;
}
.content-section {
  margin-top: 34px;
}
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-title > div {
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-title > div > span {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  color: white;
  background: #7fa8a5;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
}
.section-title h3,
.section-title p {
  margin: 0;
}
.section-title h3 {
  color: #3d5655;
  font-size: 20px;
}
.section-title p {
  color: #879592;
  font-size: 13px;
}
.weather-grid,
.outside-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.weather-grid article {
  display: flex;
  min-height: 145px;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background: white;
  border: 1px solid #dfe9e6;
  border-radius: 18px;
  box-shadow: 0 7px 20px rgba(62, 89, 89, 0.05);
}
.weather-grid span,
.weather-grid small,
.outside-grid small {
  color: #899694;
  font-size: 12px;
}
.weather-grid strong {
  color: #4f797c;
  font-size: 23px;
}
.outside-box {
  padding: 26px;
  background: #f7f4ed;
  border: 1px solid #e8e1d5;
  border-radius: 22px;
}
.outside-grid article {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 14px;
}
.outside-grid b {
  font-size: 27px;
}
.outside-grid article div {
  display: flex;
  flex-direction: column;
}
.outside-grid strong {
  color: #4c6260;
}
.advice-box {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  margin-top: 28px;
  padding: 26px 30px;
  background: #eaf3f0;
  border-radius: 20px;
}
.advice-box > span {
  font-size: 38px;
}
.advice-box small {
  color: #7b9b95;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.advice-box h3,
.advice-box p {
  margin: 0;
}
.advice-box h3 {
  margin: 3px 0;
  color: #3f5d59;
}
.advice-box p {
  color: #637976;
}
.advice-box button,
.missing button {
  padding: 11px 17px;
  color: white;
  background: #6c978c;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}
.missing {
  padding: 60px;
  text-align: center;
}
.missing > span {
  font-size: 50px;
}
@media (max-width: 800px) {
  .weather-hero,
  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }
  .weather-hero {
    padding: 28px 24px;
  }
  .hero-temperature div {
    align-items: flex-start;
  }
  .weather-grid,
  .outside-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .advice-box {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
}
@media (max-width: 480px) {
  .weather-grid,
  .outside-grid {
    grid-template-columns: 1fr;
  }
  .hero-temperature strong {
    font-size: 45px;
  }
}
</style>
