<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'
import sunnyBackground from '@/assets/weather/sunny.jpg'
import cloudyBackground from '@/assets/weather/cloudy.jpg'
import rainyBackground from '@/assets/weather/rainy.jpg'
import snowyBackground from '@/assets/weather/snowy.jpg'
import windyBackground from '@/assets/weather/windy.jpg'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()

const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 42,
    wind: 2.5,
    aqi: 2,
    uv: 7,
    english: 'Seoul',
    isDefault: true,
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 78,
    wind: 4.1,
    aqi: 3,
    uv: 3,
    english: 'Suwon',
    isDefault: true,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 65,
    wind: 5,
    aqi: 2,
    uv: 6,
    english: 'Busan',
    isDefault: true,
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 23,
    status: '바람',
    humidity: 71,
    wind: 7.2,
    aqi: 1,
    uv: 8,
    english: 'Jeju City',
    isDefault: true,
  },
])

const searchQuery = ref('')
const selectedLocation = ref('')
const selectedCity = ref(null)
const focusedCity = ref(weatherList.value[0])
const selectedGender = ref('남자')
const dialogVisible = ref(false)
const isLoading = ref(false)
const isAddingCity = ref(false)
const uvApiAvailable = ref(true)
const dataSource = ref('학습용 Mock 데이터')
const apiMessage = ref('')
const stylePhotos = ref([])
const isStylePhotoLoading = ref(false)
const stylePhotoMessage = ref('')
const stylePhotoCache = {}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'
const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos'

const locationOptions = [
  { id: 'city_01', korean: '서울', english: 'Seoul,KR', isDefault: true },
  { id: 'city_02', korean: '수원', english: 'Suwon,KR', isDefault: true },
  { id: 'city_03', korean: '부산', english: 'Busan,KR', isDefault: true },
  { id: 'city_04', korean: '제주', english: 'Jeju City,KR', isDefault: true },
  { id: 'city_05', korean: '인천', english: 'Incheon,KR' },
  { id: 'city_06', korean: '대전', english: 'Daejeon,KR' },
  { id: 'city_07', korean: '대구', english: 'Daegu,KR' },
  { id: 'city_08', korean: '광주', english: 'Gwangju,KR' },
  { id: 'city_09', korean: '강릉', english: 'Gangneung,KR' },
  { id: 'city_10', korean: '춘천', english: 'Chuncheon,KR' },
  { id: 'city_11', korean: '전주', english: 'Jeonju,KR' },
]

const fetchCityWeather = async (target) => {
  const weatherResponse = await axios.get(WEATHER_URL, {
    params: {
      q: target.english,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  const { lat, lon } = weatherResponse.data.coord
  const airResponse = await axios.get(AIR_POLLUTION_URL, {
    params: { lat, lon, appid: API_KEY },
  })
  let uv = target.uv ?? null

  try {
    const uvResponse = await axios.get(OPEN_METEO_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: 'uv_index_max',
        timezone: 'Asia/Seoul',
        forecast_days: 1,
      },
    })
    uv = uvResponse.data.daily.uv_index_max[0]
  } catch (uvError) {
    console.warn('자외선 API 호출 실패:', uvError)
    uvApiAvailable.value = false
  }

  return {
    id: target.id,
    name: target.korean,
    english: target.english,
    isDefault: target.isDefault ?? false,
    temp: weatherResponse.data.main.temp,
    status: weatherResponse.data.weather[0].description,
    humidity: weatherResponse.data.main.humidity,
    wind: weatherResponse.data.wind.speed,
    aqi: airResponse.data.list[0].main.aqi,
    uv,
  }
}

const fetchRealTimeWeather = async () => {
  apiMessage.value = ''

  if (!API_KEY) {
    apiMessage.value = 'OpenWeather API Key가 없어 현재는 Mock 데이터를 표시합니다.'
    ElMessage.warning('API Key가 없어 Mock 데이터를 사용합니다.')
    return
  }

  isLoading.value = true
  uvApiAvailable.value = true

  try {
    const targets = weatherList.value.map((city) => ({
      id: city.id,
      korean: city.name,
      english: city.english,
      isDefault: city.isDefault,
      uv: city.uv,
    }))

    weatherList.value = await Promise.all(targets.map(fetchCityWeather))

    if (selectedCity.value) {
      selectedCity.value = weatherList.value.find((city) => city.id === selectedCity.value.id)
    }
    if (focusedCity.value) {
      focusedCity.value = weatherList.value.find((city) => city.id === focusedCity.value.id)
    }

    dataSource.value = uvApiAvailable.value
      ? 'OpenWeather + Open-Meteo 실시간 데이터'
      : 'OpenWeather 실시간 데이터'
    apiMessage.value = uvApiAvailable.value
      ? '현재 날씨, 대기질, 자외선 지수를 가져왔습니다.'
      : '날씨와 대기질은 실시간이며, 자외선은 기존 값을 표시합니다.'
    ElMessage.success('실시간 날씨를 불러왔습니다.')
  } catch (error) {
    console.error('OOTD 날씨 API 호출 실패:', error)
    apiMessage.value = 'API 호출에 실패해 기존 Mock 데이터를 계속 표시합니다.'
    ElMessage.error('날씨를 가져오지 못해 Mock 데이터를 표시합니다.')
  } finally {
    isLoading.value = false
  }
}

const addSelectedCity = async () => {
  if (!selectedLocation.value) {
    ElMessage.warning('추가할 지역을 먼저 선택해 주세요.')
    return
  }

  if (weatherList.value.some((city) => city.id === selectedLocation.value)) {
    ElMessage.info('이미 추가된 지역입니다.')
    return
  }

  if (!API_KEY) {
    ElMessage.warning('새 지역을 추가하려면 OpenWeather API Key가 필요합니다.')
    return
  }

  const target = locationOptions.find((option) => option.id === selectedLocation.value)
  isAddingCity.value = true

  try {
    const newCity = await fetchCityWeather(target)
    weatherList.value.push(newCity)
    if (!focusedCity.value) focusedCity.value = newCity
    selectedLocation.value = ''
    ElMessage.success(`${newCity.name} 날씨를 추가했습니다.`)
  } catch (error) {
    console.error('지역 추가 실패:', error)
    ElMessage.error('선택한 지역을 추가하지 못했습니다.')
  } finally {
    isAddingCity.value = false
  }
}

const removeCity = (cityId) => {
  weatherList.value = weatherList.value.filter((city) => city.id !== cityId)
  if (focusedCity.value?.id === cityId) focusedCity.value = weatherList.value[0] ?? null
  ElMessage.success('지역을 목록에서 삭제했습니다.')
}

onMounted(() => {
  if (typeof route.query.search === 'string') {
    searchQuery.value = route.query.search
  }

  if (API_KEY) fetchRealTimeWeather()
})

watch(searchQuery, (newQuery) => {
  router.replace({
    name: 'WeatherHome',
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

const displayTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temperature * 9) / 5 + 32)
  }

  return Math.round(temperature * 10) / 10
}

const isRainy = computed(() => {
  if (!selectedCity.value) return false

  return selectedCity.value.status.includes('비') || selectedCity.value.status.includes('눈')
})

const outfitRecommendation = computed(() => {
  if (!selectedCity.value) return ''

  const temperature = selectedCity.value.temp
  let outfit

  if (selectedGender.value === '남자') {
    if (temperature >= 28) outfit = '반팔 티셔츠와 반바지'
    else if (temperature >= 23) outfit = '반팔 셔츠와 얇은 면바지'
    else if (temperature >= 17) outfit = '맨투맨 또는 셔츠와 청바지'
    else if (temperature >= 10) outfit = '후드와 가벼운 재킷, 긴바지'
    else outfit = '니트와 코트 또는 패딩, 기모바지'
  } else {
    if (temperature >= 28) outfit = '민소매 또는 반팔과 반바지, 얇은 스커트'
    else if (temperature >= 23) outfit = '반팔 블라우스와 얇은 팬츠 또는 스커트'
    else if (temperature >= 17) outfit = '긴팔 티셔츠와 가디건, 청바지'
    else if (temperature >= 10) outfit = '니트와 가벼운 재킷, 긴바지'
    else outfit = '니트와 코트 또는 패딩, 기모바지'
  }

  if (isRainy.value) outfit += ' + 얇은 방수 겉옷'
  if (selectedCity.value.uv >= 6) outfit += ' + 자외선 차단용 얇은 겉옷'
  return outfit
})

const hairRecommendation = computed(() => {
  if (!selectedCity.value) return ''

  if (selectedGender.value === '남자') {
    if (isRainy.value || selectedCity.value.humidity >= 75) {
      return '짧게 정돈한 머리와 고정력이 있는 왁스'
    }

    if (selectedCity.value.wind >= 7) return '앞머리를 올린 스타일 또는 모자'
    if (selectedCity.value.humidity <= 40) return '헤어 에센스를 바른 자연스러운 스타일'
    return '가벼운 가르마 또는 자연스러운 스타일'
  }

  if (isRainy.value || selectedCity.value.humidity >= 75) {
    return '포니테일 또는 번 헤어와 헤어스프레이'
  }

  if (selectedCity.value.wind >= 7) return '묶은 머리 또는 땋은 머리'
  if (selectedCity.value.humidity <= 40) return '헤어 에센스를 바른 자연스러운 웨이브'
  return '반묶음 또는 자연스럽게 푼 머리'
})

const shoesRecommendation = computed(() => {
  if (!selectedCity.value) return ''

  if (selectedGender.value === '남자') {
    if (isRainy.value) return '방수 운동화 또는 레인 슈즈'
    if (selectedCity.value.temp >= 28) return '메시 운동화 또는 샌들'
    if (selectedCity.value.temp <= 5) return '보온 운동화 또는 부츠'
    return '운동화 또는 로퍼'
  }

  if (isRainy.value) return '레인부츠 또는 방수 운동화'
  if (selectedCity.value.temp >= 28) return '샌들 또는 가벼운 운동화'
  if (selectedCity.value.temp <= 5) return '앵클부츠 또는 보온 운동화'
  return '운동화 또는 로퍼'
})

const preparationItems = computed(() => {
  if (!selectedCity.value) return []

  const items = []

  if (isRainy.value) items.push('우산')
  if (selectedCity.value.temp >= 17 && selectedCity.value.temp < 23) items.push('가디건')
  if (selectedCity.value.humidity >= 75 || selectedCity.value.wind >= 7) {
    items.push(selectedGender.value === '남자' ? '헤어 왁스' : '머리끈')
  }
  if (selectedCity.value.wind >= 7) items.push('모자')
  if (selectedCity.value.aqi >= 3) items.push('마스크')
  if (selectedCity.value.temp >= 28) items.push('물병')
  if (selectedCity.value.uv >= 3) items.push('선크림')
  if (selectedCity.value.uv >= 6) items.push('선글라스')
  if (selectedCity.value.uv >= 8 && !items.includes('모자')) items.push('모자')

  if (items.length === 0) items.push('가벼운 가방')
  return items
})

const weatherIcon = (status) => {
  if (status.includes('비')) return '🌧️'
  if (status.includes('눈')) return '🌨️'
  if (status.includes('구름') || status.includes('흐림')) return '☁️'
  if (status.includes('바람')) return '🌬️'
  return '☀️'
}

const weatherBackground = (status) => {
  if (status.includes('비')) return rainyBackground
  if (status.includes('눈')) return snowyBackground
  if (status.includes('바람')) return windyBackground
  if (status.includes('구름') || status.includes('흐림')) return cloudyBackground
  return sunnyBackground
}

const focusBackgroundStyle = computed(() => ({
  backgroundImage: focusedCity.value
    ? `linear-gradient(90deg, rgba(22, 42, 47, 0.82), rgba(22, 42, 47, 0.24)), url(${weatherBackground(focusedCity.value.status)})`
    : '',
}))

const focusOnCity = (city) => {
  focusedCity.value = city
}

const airQualityLabel = (aqi) => {
  const labels = ['', '좋음', '보통', '나쁨', '매우 나쁨', '위험']
  return labels[aqi]
}

const ultravioletLabel = (uv) => {
  if (uv === null || uv === undefined) return '확인 불가'
  if (uv < 3) return '낮음'
  if (uv < 6) return '보통'
  if (uv < 8) return '높음'
  return '매우 높음'
}

const getStylePhotoQuery = (city) => {
  const gender = selectedGender.value === '남자' ? 'male model' : 'female model'
  let clothes

  if (city.status.includes('비')) clothes = 'raincoat rainy day outfit'
  else if (city.status.includes('눈') || city.temp <= 5) clothes = 'winter coat warm outfit'
  else if (city.temp >= 28) clothes = 'summer t-shirt shorts outfit'
  else if (city.temp >= 23) clothes = 'short sleeve shirt pants outfit'
  else if (city.temp >= 17) clothes = 'cardigan jeans outfit'
  else if (city.temp >= 10) clothes = 'jacket long pants outfit'
  else clothes = 'knit coat winter outfit'

  return `${gender} wearing ${clothes} full body street style`
}

const getStylePhotoFallbackQuery = (city) => {
  const gender = selectedGender.value === '남자' ? 'men' : 'women'
  let season

  if (city.status.includes('비')) season = 'rainy day'
  else if (city.status.includes('눈') || city.temp <= 9) season = 'winter'
  else if (city.temp >= 23) season = 'summer'
  else season = 'spring autumn'

  return `${gender} ${season} fashion full body street style`
}

const selectMatchingPhotos = (photos) => {
  const personWords = ['man', 'woman', 'person', 'people', 'wearing']
  const clothesWords = ['shirt', 'jacket', 'coat', 'jeans', 'pants', 'shorts', 'outfit', 'fashion']
  const fullBodyWords = ['standing', 'walking', 'street', 'full body']
  const unsuitableWords = [
    'sneaker',
    'shoe',
    'footwear',
    'hanger',
    'flat lay',
    'headshot',
    'close up',
  ]

  const scoredPhotos = photos.map((photo) => {
    const description = `${photo.alt_description ?? ''} ${photo.description ?? ''}`.toLowerCase()
    const descriptionWords = description.split(/[^a-z]+/)
    let score = 0

    if (personWords.some((word) => description.includes(word))) score += 2
    if (clothesWords.some((word) => description.includes(word))) score += 5
    if (fullBodyWords.some((word) => description.includes(word))) score += 4
    if (unsuitableWords.some((word) => description.includes(word))) score -= 10
    if (selectedGender.value === '남자') {
      if (descriptionWords.includes('man') || descriptionWords.includes('male')) score += 6
      if (descriptionWords.includes('woman') || descriptionWords.includes('female')) score -= 10
    } else {
      if (descriptionWords.includes('woman') || descriptionWords.includes('female')) score += 6
      if (descriptionWords.includes('man') || descriptionWords.includes('male')) score -= 10
    }

    return { photo, score }
  })

  scoredPhotos.sort((first, second) => second.score - first.score)
  return scoredPhotos.slice(0, 3).map(({ photo }) => photo)
}

const fetchStylePhoto = async (city) => {
  stylePhotos.value = []
  stylePhotoMessage.value = ''

  if (!UNSPLASH_ACCESS_KEY) {
    stylePhotoMessage.value = 'Unsplash API 키를 설정하면 날씨에 맞는 스타일 사진이 표시됩니다.'
    return
  }

  const query = getStylePhotoQuery(city)

  if (stylePhotoCache[query]) {
    stylePhotos.value = stylePhotoCache[query]
    return
  }

  isStylePhotoLoading.value = true

  try {
    const response = await axios.get(UNSPLASH_SEARCH_URL, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      params: {
        query,
        per_page: 10,
        orientation: 'portrait',
        content_filter: 'high',
      },
    })
    let candidates = response.data.results

    if (candidates.length < 3) {
      const fallbackResponse = await axios.get(UNSPLASH_SEARCH_URL, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        params: {
          query: getStylePhotoFallbackQuery(city),
          per_page: 10,
          orientation: 'portrait',
          content_filter: 'high',
        },
      })
      const photoIds = new Set(candidates.map((photo) => photo.id))
      candidates = [
        ...candidates,
        ...fallbackResponse.data.results.filter((photo) => !photoIds.has(photo.id)),
      ]
    }

    const photos = selectMatchingPhotos(candidates)

    if (!photos.length) {
      stylePhotoMessage.value = '조건에 맞는 스타일 사진을 찾지 못했습니다.'
      return
    }

    const photoData = photos.map((photo) => ({
      imageUrl: photo.urls.regular,
      alt: photo.alt_description || `${selectedGender.value} 오늘의 OOTD 참고 이미지`,
      photographer: photo.user.name,
      photographerUrl: `${photo.user.links.html}?utm_source=skala_vue_ootd&utm_medium=referral`,
      unsplashUrl: `${photo.links.html}?utm_source=skala_vue_ootd&utm_medium=referral`,
    }))
    stylePhotoCache[query] = photoData
    stylePhotos.value = photoData
  } catch (error) {
    console.error('Unsplash 스타일 이미지 호출 실패:', error)
    stylePhotoMessage.value =
      '스타일 사진을 불러오지 못했습니다. 기존 OOTD 추천은 이용할 수 있습니다.'
  } finally {
    isStylePhotoLoading.value = false
  }
}

const openOotd = (city) => {
  selectedCity.value = city
  dialogVisible.value = true
  fetchStylePhoto(city)
}

watch(selectedGender, () => {
  if (dialogVisible.value && selectedCity.value) fetchStylePhoto(selectedCity.value)
})

const handleDetailJump = (city) => {
  router.push({
    name: 'WeatherDetail',
    params: { cityId: city.id },
    query: {
      name: city.name,
      english: city.english,
    },
  })
}
</script>

<template>
  <section class="ootd-dashboard">
    <div class="hero-section">
      <p class="hero-label">WEATHER OOTD</p>
      <h2>오늘 뭐 입지?</h2>
      <p>날씨를 확인하고 옷, 헤어스타일, 신발을 한 번에 추천받아 보세요.</p>
    </div>

    <section class="location-toolbar">
      <div class="toolbar-copy">
        <span>MY LOCATIONS</span>
        <h3>어디의 날씨를 볼까요?</h3>
        <p>지역을 추가하고 오늘 입을 옷을 확인해 보세요.</p>
      </div>

      <div class="toolbar-actions">
        <div class="location-add-controls">
          <el-select v-model="selectedLocation" clearable placeholder="지역 선택">
            <el-option
              v-for="option in locationOptions"
              :key="option.id"
              :label="option.korean"
              :value="option.id"
              :disabled="weatherList.some((city) => city.id === option.id)"
            />
          </el-select>
          <el-button type="primary" :loading="isAddingCity" @click="addSelectedCity">
            + 지역 추가
          </el-button>
        </div>

        <div class="list-tools">
          <el-input v-model="searchQuery" clearable placeholder="지역 검색" />
          <el-button :loading="isLoading" @click="fetchRealTimeWeather">↻ 새로고침</el-button>
        </div>
      </div>
    </section>

    <div class="data-information">
      <span class="live-dot"></span>
      <span>{{ dataSource }}</span>
      <span v-if="apiMessage" class="api-message">{{ apiMessage }}</span>
    </div>

    <section v-if="focusedCity" class="weather-focus" :style="focusBackgroundStyle">
      <div class="focus-copy">
        <span>SELECTED WEATHER</span>
        <h2>{{ focusedCity.name }}</h2>
        <p>{{ focusedCity.status }} · 오늘의 날씨</p>
      </div>
      <div class="focus-temperature">
        <span>{{ weatherIcon(focusedCity.status) }}</span>
        <strong>{{ displayTemperature(focusedCity.temp) }}{{ configStore.unitSymbol }}</strong>
      </div>
      <div class="focus-metrics">
        <span
          >습도 <strong>{{ focusedCity.humidity }}%</strong></span
        >
        <span
          >바람 <strong>{{ focusedCity.wind }}m/s</strong></span
        >
        <span
          >자외선 <strong>{{ ultravioletLabel(focusedCity.uv) }}</strong></span
        >
      </div>
      <div class="focus-actions">
        <button type="button" @click="openOotd(focusedCity)">OOTD 추천</button>
        <button type="button" @click="handleDetailJump(focusedCity)">상세 날씨 →</button>
      </div>
    </section>

    <div class="list-heading">
      <div>
        <h3>지역별 오늘 날씨</h3>
      </div>
      <span>{{ filteredWeatherList.length }}개 지역</span>
    </div>

    <div v-if="filteredWeatherList.length > 0" class="city-grid">
      <article
        v-for="city in filteredWeatherList"
        :key="city.id"
        class="city-card"
        :class="{ selected: focusedCity?.id === city.id }"
        role="button"
        tabindex="0"
        @click="focusOnCity(city)"
        @keydown.enter="focusOnCity(city)"
      >
        <div class="city-card-header">
          <div class="city-name-area">
            <span class="weather-icon">{{ weatherIcon(city.status) }}</span>
            <div>
              <h3>{{ city.name }}</h3>
              <span>{{ city.status }}</span>
            </div>
          </div>
          <button
            type="button"
            class="remove-city-button"
            :aria-label="`${city.name} 삭제`"
            @click.stop="removeCity(city.id)"
          >
            ×
          </button>
        </div>

        <div class="temperature-area">
          <strong>{{ displayTemperature(city.temp) }}{{ configStore.unitSymbol }}</strong>
          <span>오늘의 기온</span>
        </div>

        <div class="weather-metrics">
          <div>
            <span>습도</span><strong>{{ city.humidity }}%</strong>
          </div>
          <div>
            <span>바람</span><strong>{{ city.wind }}m/s</strong>
          </div>
          <div>
            <span>대기질</span><strong>{{ airQualityLabel(city.aqi) }}</strong>
          </div>
          <div>
            <span>자외선</span>
            <strong>{{ ultravioletLabel(city.uv) }} · {{ city.uv ?? '-' }}</strong>
          </div>
        </div>

        <div class="card-buttons">
          <button type="button" class="ootd-button" @click.stop="openOotd(city)">
            오늘의 OOTD 추천
          </button>
          <button type="button" class="detail-button" @click.stop="handleDetailJump(city)">
            날씨 상세 보기 →
          </button>
        </div>
      </article>
    </div>

    <el-empty v-else description="검색 결과와 일치하는 도시가 없습니다." />

    <el-dialog v-model="dialogVisible" class="ootd-dialog" width="min(720px, 92%)">
      <template #header>
        <div class="ootd-dialog-heading">
          <span>TODAY'S STYLE GUIDE</span>
          <h3>{{ selectedCity ? `${selectedCity.name} 오늘의 OOTD` : '오늘의 OOTD' }}</h3>
          <p>지금 날씨에 어울리는 외출 스타일을 준비했어요.</p>
        </div>
      </template>

      <div v-if="selectedCity" class="ootd-result">
        <div class="selected-weather">
          <div class="selected-weather-main">
            <span class="dialog-weather-icon">{{ weatherIcon(selectedCity.status) }}</span>
            <div>
              <small>CURRENT WEATHER</small>
              <strong
                >{{ displayTemperature(selectedCity.temp) }}{{ configStore.unitSymbol }}</strong
              >
            </div>
          </div>
          <div class="selected-weather-info">
            <b>{{ selectedCity.status }}</b>
            <span>습도 {{ selectedCity.humidity }}%</span>
            <span>자외선 {{ ultravioletLabel(selectedCity.uv) }}</span>
          </div>
        </div>

        <div class="gender-selector">
          <div><small>STYLE TYPE</small><strong>누구의 스타일을 추천할까요?</strong></div>
          <el-radio-group v-model="selectedGender">
            <el-radio value="남자">남자</el-radio>
            <el-radio value="여자">여자</el-radio>
          </el-radio-group>
        </div>

        <div class="style-photo-section" v-loading="isStylePhotoLoading">
          <div v-if="stylePhotos.length" class="style-photo-gallery">
            <article
              v-for="(photo, index) in stylePhotos"
              :key="photo.unsplashUrl"
              class="style-photo-box"
            >
              <img :src="photo.imageUrl" :alt="photo.alt" />
              <div class="style-photo-caption">
                <div>
                  <small>STYLE {{ index + 1 }}</small
                  ><strong>코디 참고</strong>
                </div>
                <span>
                  Photo by
                  <a :href="photo.photographerUrl" target="_blank" rel="noopener noreferrer">
                    {{ photo.photographer }}
                  </a>
                  on
                  <a :href="photo.unsplashUrl" target="_blank" rel="noopener noreferrer">
                    Unsplash
                  </a>
                </span>
              </div>
            </article>
          </div>
          <div v-else-if="!isStylePhotoLoading" class="style-photo-empty">
            <span>🖼️</span>
            <p>{{ stylePhotoMessage }}</p>
          </div>
        </div>

        <div class="recommendation-grid">
          <el-card shadow="never">
            <span class="recommendation-icon">👕</span>
            <small>OUTFIT</small>
            <h4>오늘의 옷</h4>
            <p>{{ outfitRecommendation }}</p>
          </el-card>
          <el-card shadow="never">
            <span class="recommendation-icon">💇</span>
            <small>HAIR</small>
            <h4>오늘의 헤어</h4>
            <p>{{ hairRecommendation }}</p>
          </el-card>
          <el-card shadow="never">
            <span class="recommendation-icon">👟</span>
            <small>SHOES</small>
            <h4>오늘의 신발</h4>
            <p>{{ shoesRecommendation }}</p>
          </el-card>
        </div>

        <div class="preparation-box">
          <div>
            <span>👜</span>
            <div>
              <small>CHECK LIST</small>
              <h4>오늘 챙길 것</h4>
            </div>
          </div>
          <div class="item-tags">
            <el-tag v-for="item in preparationItems" :key="item" round>
              {{ item }}
            </el-tag>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button class="dialog-close-button" round @click="dialogVisible = false"
          >확인했어요</el-button
        >
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.ootd-dashboard {
  max-width: 1120px;
  margin: 0 auto;
}

.hero-section {
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  padding: 30px;
  color: #ffffff;
  background: linear-gradient(135deg, #78aab9, #9bbfb2);
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(86, 133, 139, 0.18);
}

.hero-section::after {
  position: absolute;
  top: -45px;
  right: -35px;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  content: '';
}

.hero-section h2,
.hero-section p {
  margin: 0;
}

.hero-section h2 {
  margin: 3px 0 7px;
  font-size: 30px;
  font-weight: 700;
}

.hero-label {
  opacity: 0.85;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
}

.search-card {
  margin-bottom: 20px;
  border-color: #dce8e5;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(74, 102, 103, 0.06);
}

.location-add-controls,
.list-tools {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.location-panel-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.location-panel-title > div,
.list-heading > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-panel-title strong {
  color: #405c5d;
  font-size: 17px;
}

.location-panel-title p {
  max-width: 390px;
  margin: 0;
  color: #7b8c8c;
  font-size: 13px;
  text-align: right;
}

.section-number {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #83aeb4;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
}

.location-add-controls :deep(.el-select) {
  width: 100%;
}

.location-add-controls :deep(.el-button--primary) {
  background: #6f9eaa;
  border-color: #6f9eaa;
  border-radius: 9px;
}

.location-add-controls :deep(.el-button--primary:hover) {
  background: #5e8d99;
  border-color: #5e8d99;
}

.list-tools {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #e5eeec;
}

.data-information {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  color: #728282;
  font-size: 13px;
}

.list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 26px 2px 14px;
}

.list-heading h3 {
  margin: 0;
  color: #405c5d;
  font-size: 20px;
}

.list-heading > span {
  color: #829292;
  font-size: 13px;
}

.location-toolbar {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 30px;
  padding: 26px;
  background: #f7f4ed;
  border: 1px solid #e8e2d8;
  border-radius: 20px;
}

.toolbar-copy span {
  color: #8ca5a1;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.toolbar-copy h3 {
  margin: 6px 0 5px;
  color: #364f50;
  font-size: 20px;
}

.toolbar-copy p {
  margin: 0;
  color: #7b8886;
  font-size: 13px;
}

.toolbar-actions .list-tools {
  margin-top: 10px;
  padding-top: 10px;
}

.data-information {
  min-height: 22px;
  margin: 10px 4px 0;
}

.live-dot {
  width: 7px;
  height: 7px;
  background: #70a993;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(112, 169, 147, 0.13);
}

.api-message {
  padding-left: 10px;
  border-left: 1px solid #d7e2df;
}

.weather-focus {
  position: relative;
  display: grid;
  min-height: 230px;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'copy temperature'
    'metrics actions';
  align-items: end;
  gap: 24px;
  margin-top: 22px;
  padding: 30px 34px;
  overflow: hidden;
  color: #ffffff;
  background-position: center;
  background-size: cover;
  border-radius: 22px;
  box-shadow: 0 15px 34px rgba(44, 72, 77, 0.18);
  animation: focus-in 0.25s ease;
}

@keyframes focus-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.focus-copy {
  grid-area: copy;
}

.focus-copy > span {
  opacity: 0.78;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.focus-copy h2 {
  margin: 5px 0 1px;
  font-size: 32px;
}

.focus-copy p {
  margin: 0;
  opacity: 0.83;
}

.focus-temperature {
  display: flex;
  grid-area: temperature;
  align-items: center;
  gap: 14px;
}

.focus-temperature > span {
  font-size: 43px;
}

.focus-temperature strong {
  font-size: 44px;
  line-height: 1;
  letter-spacing: -2px;
}

.focus-metrics {
  display: flex;
  grid-area: metrics;
  gap: 10px;
}

.focus-metrics > span {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.17);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9px;
  font-size: 12px;
  backdrop-filter: blur(7px);
}

.focus-actions {
  display: flex;
  grid-area: actions;
  gap: 8px;
}

.focus-actions button,
.focus-close {
  color: #ffffff;
  cursor: pointer;
}

.focus-actions button {
  padding: 9px 13px;
  background: rgba(255, 255, 255, 0.17);
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 9px;
  backdrop-filter: blur(7px);
}

.focus-actions button:first-child {
  color: #385657;
  background: #ffffff;
}

.focus-close {
  position: absolute;
  top: 15px;
  right: 17px;
  width: 29px;
  height: 29px;
  background: rgba(20, 37, 42, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  font-size: 18px;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.city-card {
  overflow: hidden;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #dce7e4;
  border-radius: 22px;
  box-shadow: 0 9px 24px rgba(74, 102, 103, 0.07);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.city-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 26px rgba(74, 102, 103, 0.12);
}

.city-card.selected {
  border-color: #7fa9a7;
  box-shadow: 0 12px 28px rgba(74, 111, 112, 0.16);
}

.city-card-header,
.card-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.city-card-header h3 {
  margin: 0;
  color: #405c5d;
  font-weight: 700;
}

.city-name-area {
  display: flex;
  align-items: center;
  gap: 11px;
}

.city-name-area > div {
  display: flex;
  flex-direction: column;
}

.city-name-area > div > span {
  color: #84918f;
  font-size: 12px;
}

.weather-icon {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  background: #f5f8f6;
  border-radius: 14px;
  font-size: 23px;
}

.city-card-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-city-button {
  width: 27px;
  height: 27px;
  padding: 0;
  color: #9a7272;
  background: #fffafa;
  border: 1px solid #ead7d7;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
}

.remove-city-button:hover {
  color: #ffffff;
  background: #c78f8f;
  border-color: #c78f8f;
}

.temperature-area {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 25px 2px 18px;
}

.temperature-area strong {
  color: #4e7f88;
  font-size: 42px;
  line-height: 1;
  letter-spacing: -2px;
}

.temperature-area span {
  color: #98a3a1;
  font-size: 12px;
}

.weather-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.weather-metrics > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f6f8f7;
  border-radius: 10px;
}

.weather-metrics span {
  color: #87918f;
  font-size: 12px;
}

.weather-metrics strong {
  color: #4f6261;
  font-size: 12px;
}

.weather-summary strong {
  color: #5f939e;
  font-size: 30px;
}

.weather-summary div {
  display: flex;
  flex-direction: column;
  color: #718181;
  font-size: 13px;
  text-align: right;
}

.weather-progress {
  margin-top: 14px;
  color: #718181;
  font-size: 13px;
}

.condition-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 12px 0;
  font-size: 13px;
}

.condition-tags span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-buttons .el-button {
  flex: 1;
  margin: 0;
}

.card-buttons {
  flex-direction: column;
  margin-top: 18px;
}

.ootd-button,
.detail-button {
  width: 100%;
  border: 0;
  cursor: pointer;
}

.ootd-button {
  padding: 12px;
  color: #ffffff;
  background: #6e9b8e;
  border-radius: 11px;
  font-weight: 700;
}

.ootd-button:hover {
  background: #5e8c7f;
}

.detail-button {
  padding: 5px;
  color: #728785;
  background: transparent;
  font-size: 12px;
}

.detail-button:hover {
  color: #4e7978;
}

.card-buttons :deep(.el-button) {
  border-radius: 9px;
}

.card-buttons :deep(.el-button--success) {
  background: #7fa89a;
  border-color: #7fa89a;
}

.card-buttons :deep(.el-button--success:hover) {
  background: #6d998a;
  border-color: #6d998a;
}

.selected-weather {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  margin-bottom: 18px;
  padding: 22px 24px;
  color: #526968;
  background: linear-gradient(135deg, #eaf4f3, #f7f3e9);
  border: 0;
  border-radius: 20px;
}

.selected-weather-main,
.selected-weather-info {
  display: flex;
  align-items: center;
}

.selected-weather-main {
  gap: 14px;
}

.dialog-weather-icon {
  display: grid;
  width: 58px;
  height: 58px;
  font-size: 1.8rem;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  place-items: center;
}

.selected-weather-main small,
.gender-selector small,
.recommendation-grid small,
.preparation-box small {
  display: block;
  margin-bottom: 4px;
  color: #86a19d;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.selected-weather-info {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px 12px;
}

.selected-weather-info b {
  width: 100%;
  color: #476364;
  text-align: right;
}

.selected-weather-info span {
  color: #748886;
  font-size: 0.82rem;
}

.gender-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px 18px;
  background: #fbfcfb;
  border: 1px solid #e1ebe8;
  border-radius: 16px;
}

.gender-selector strong {
  display: block;
  color: #476364;
  font-size: 0.9rem;
}

.selected-weather strong {
  display: block;
  color: #5f8d92;
  font-size: 1.8rem;
  line-height: 1;
}

.style-photo-section {
  min-height: 130px;
  margin-bottom: 18px;
}

.style-photo-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.style-photo-box {
  position: relative;
  min-height: 130px;
  overflow: hidden;
  background: #f2f6f4;
  border-radius: 20px;
}

.style-photo-box img {
  display: block;
  width: 100%;
  height: 290px;
  object-fit: cover;
  object-position: center 25%;
}

.style-photo-caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;
  padding: 35px 14px 13px;
  color: #fff;
  background: linear-gradient(transparent, rgba(25, 43, 43, 0.78));
}

.style-photo-caption small,
.style-photo-caption strong {
  display: block;
}

.style-photo-caption small {
  margin-bottom: 3px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.11em;
}

.style-photo-caption span {
  overflow: hidden;
  max-width: 100%;
  font-size: 0.62rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.style-photo-caption a {
  padding: 0;
  color: #fff;
  text-decoration: underline;
}

.style-photo-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 130px;
  padding: 24px;
  color: #7d908d;
  text-align: center;
}

.style-photo-empty span {
  font-size: 1.5rem;
}

.style-photo-empty p {
  margin: 0;
  font-size: 0.82rem;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.recommendation-grid :deep(.el-card) {
  min-height: 205px;
  background: #f3f8f6;
  border: 0;
  border-radius: 19px;
}

.recommendation-grid :deep(.el-card:nth-child(2)) {
  background: #f8f4eb;
}

.recommendation-grid :deep(.el-card:nth-child(3)) {
  background: #eef5f7;
}

.recommendation-grid :deep(.el-card__body) {
  padding: 21px 18px;
}

.recommendation-icon {
  display: grid;
  width: 44px;
  height: 44px;
  margin-bottom: 22px;
  font-size: 1.3rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  place-items: center;
}

.recommendation-grid h4,
.recommendation-grid p,
.preparation-box h4 {
  margin: 0;
}

.recommendation-grid h4 {
  margin-bottom: 8px;
  color: #476364;
  font-weight: 700;
}

.recommendation-grid p {
  color: #6f8280;
  font-size: 0.84rem;
  line-height: 1.65;
}

.preparation-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 18px;
  padding: 18px 20px;
  background: #f8f4ea;
  border: 0;
  border-radius: 18px;
}

.preparation-box > div:first-child {
  display: flex;
  align-items: center;
  gap: 11px;
}

.preparation-box > div:first-child > span {
  display: grid;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.78);
  border-radius: 50%;
  place-items: center;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 0;
}

.item-tags :deep(.el-tag) {
  color: #5f7f79;
  background: rgba(255, 255, 255, 0.82);
  border-color: #dce7df;
}

:deep(.ootd-dialog) {
  overflow: hidden;
  border-radius: 26px;
  box-shadow: 0 20px 50px rgba(55, 83, 84, 0.2);
}

:deep(.ootd-dialog .el-dialog__header) {
  margin: 0;
  padding: 28px 30px 24px;
  background: linear-gradient(135deg, #769f9a, #9db9ae);
}

.ootd-dialog-heading span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.ootd-dialog-heading h3 {
  margin: 6px 0 4px;
  color: #fff;
  font-size: 1.45rem;
}

.ootd-dialog-heading p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.82rem;
}

:deep(.ootd-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
}

:deep(.ootd-dialog .el-dialog__body) {
  padding: 25px 30px 10px;
}

:deep(.ootd-dialog .el-dialog__footer) {
  padding: 18px 30px 25px;
}

.dialog-close-button {
  min-width: 120px;
  color: #fff;
  background: #789f99;
  border: 0;
}

.dialog-close-button:hover {
  color: #fff;
  background: #688f89;
}

:deep(.el-progress-bar__inner) {
  background: #83aeb4;
}

@media (max-width: 650px) {
  .location-toolbar,
  .city-grid,
  .recommendation-grid,
  .location-add-controls,
  .list-tools {
    grid-template-columns: 1fr;
  }

  .location-panel-title,
  .data-information,
  .card-buttons,
  .condition-tags {
    align-items: stretch;
    flex-direction: column;
  }

  .location-panel-title p {
    text-align: left;
  }

  .hero-section {
    padding: 24px 20px;
  }

  .location-toolbar {
    gap: 18px;
    padding: 20px;
  }

  .weather-focus {
    grid-template-columns: 1fr;
    grid-template-areas: 'copy' 'temperature' 'metrics' 'actions';
    padding: 27px 22px;
  }

  .focus-metrics {
    flex-wrap: wrap;
  }

  .selected-weather,
  .preparation-box {
    align-items: stretch;
    flex-direction: column;
  }

  .selected-weather-info,
  .item-tags {
    justify-content: flex-start;
  }

  .selected-weather-info b {
    text-align: left;
  }

  .gender-selector {
    align-items: flex-start;
    flex-direction: column;
  }

  .style-photo-caption {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .style-photo-gallery {
    grid-template-columns: 1fr;
  }

  .style-photo-box img {
    height: 260px;
  }

  :deep(.ootd-dialog .el-dialog__header),
  :deep(.ootd-dialog .el-dialog__body),
  :deep(.ootd-dialog .el-dialog__footer) {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
