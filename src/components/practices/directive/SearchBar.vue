<script setup>
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

const updateQuery = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      placeholder="검색할 도시 이름 입력"
      @input="updateQuery"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
/* PDF 예시의 단순한 검색창 크기 */
.search-inner input {
  width: 90%;
  padding: 8px;
  font-size: 14px;
}
</style>
