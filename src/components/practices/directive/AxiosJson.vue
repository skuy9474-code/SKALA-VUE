<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

const items = ref([])
const textInput = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const lastMethod = ref('아직 요청하지 않음')

const handleRead = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    lastMethod.value = `GET 성공 (${response.status})`
  } catch (error) {
    console.error('GET 실패:', error)
    errorMessage.value = 'GET 요청에 실패했습니다. 인터넷 연결을 확인하세요.'
  } finally {
    isLoading.value = false
  }
}

const handleCreate = async () => {
  if (!textInput.value.trim()) return

  errorMessage.value = ''

  try {
    const payload = { title: textInput.value.trim(), body: '샘플 내용', userId: 1 }
    const response = await axios.post(BASE_URL, payload)

    items.value.unshift(response.data)
    textInput.value = ''
    lastMethod.value = `POST 성공 (${response.status})`
  } catch (error) {
    console.error('POST 실패:', error)
    errorMessage.value = 'POST 요청에 실패했습니다.'
  }
}

const handleUpdate = async (id) => {
  errorMessage.value = ''

  try {
    const payload = {
      title: '✨ 수정된 날씨 게시글',
      body: 'PUT 요청으로 수정 완료',
      userId: 1,
    }
    const response = await axios.put(`${BASE_URL}/${id}`, payload)
    const index = items.value.findIndex((item) => item.id === id)

    if (index !== -1) items.value[index] = response.data
    lastMethod.value = `PUT 성공 (${response.status})`
  } catch (error) {
    console.error('PUT 실패:', error)
    errorMessage.value = 'PUT 요청에 실패했습니다.'
  }
}

const handleDelete = async (id) => {
  errorMessage.value = ''

  try {
    const response = await axios.delete(`${BASE_URL}/${id}`)
    items.value = items.value.filter((item) => item.id !== id)
    lastMethod.value = `DELETE 성공 (${response.status})`
  } catch (error) {
    console.error('DELETE 실패:', error)
    errorMessage.value = 'DELETE 요청에 실패했습니다.'
  }
}

onMounted(handleRead)
</script>

<template>
  <section class="axios-json">
    <div class="section-heading">
      <div>
        <h2>⚡ Axios JSONPlaceholder CRUD 실습</h2>
        <p>GET·POST·PUT·DELETE 요청 결과를 화면에 바로 반영합니다.</p>
      </div>
      <button type="button" class="read-button" :disabled="isLoading" @click="handleRead">
        {{ isLoading ? 'GET 요청 중...' : 'GET 다시 불러오기' }}
      </button>
    </div>

    <form class="input-zone" @submit.prevent="handleCreate">
      <input v-model="textInput" type="text" placeholder="저장할 텍스트를 입력하세요" />
      <button type="submit" class="post-button" :disabled="!textInput.trim()">POST (추가)</button>
    </form>

    <p class="request-status">마지막 요청: {{ lastMethod }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <ul class="item-list">
      <li v-for="item in items" :key="item.id" class="item-card">
        <div class="content">
          <span class="id-tag">ID: {{ item.id }}</span>
          <p>{{ item.title }}</p>
        </div>
        <div class="button-group">
          <button type="button" class="put-button" @click="handleUpdate(item.id)">
            PUT (수정)
          </button>
          <button type="button" class="delete-button" @click="handleDelete(item.id)">
            DEL (삭제)
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.axios-json {
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.section-heading,
.item-card,
.input-zone,
.button-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-heading {
  justify-content: space-between;
}

h2 {
  margin: 0;
  font-weight: 700;
}

.section-heading p {
  margin: 5px 0 0;
  color: #64748b;
}

.input-zone {
  margin: 20px 0 12px;
}

input {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
}

button {
  padding: 8px 12px;
  color: #ffffff;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.read-button {
  background: #0284c7;
}

.post-button {
  background: #22c55e;
}

.put-button {
  background: #eab308;
}

.delete-button {
  background: #ef4444;
}

.request-status {
  color: #475569;
  font-size: 13px;
}

.error-message {
  padding: 10px;
  color: #b91c1c;
  background: #fef2f2;
  border-radius: 6px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.item-card {
  justify-content: space-between;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.content {
  min-width: 0;
}

.content p {
  margin: 3px 0 0;
  color: #334155;
}

.id-tag {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 700px) {
  .section-heading,
  .item-card {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
