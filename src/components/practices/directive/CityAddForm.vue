<script setup>
const props = defineProps({
  newCity: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-field', 'submit-city'])

const updateTextField = (field, event) => {
  emit('update-field', field, event.target.value)
}

const updateNumberField = (field, event) => {
  emit('update-field', field, Number(event.target.value))
}
</script>

<template>
  <form class="city-form" @submit.prevent="emit('submit-city')">
    <h3>➕ 나만의 도시 날씨 추가</h3>
    <p>Props로 값을 받고 Emits로 변경 내용을 부모에게 전달합니다.</p>

    <div class="form-grid">
      <label>
        도시 이름
        <input
          type="text"
          :value="newCity.name"
          placeholder="예: 광주"
          @input="updateTextField('name', $event)"
        />
      </label>
      <label>
        기온(°C)
        <input
          type="number"
          min="-30"
          max="50"
          :value="newCity.temp"
          @input="updateNumberField('temp', $event)"
        />
      </label>
      <label>
        날씨 상태
        <select :value="newCity.status" @change="updateTextField('status', $event)">
          <option>맑음</option>
          <option>비</option>
          <option>구름</option>
          <option>바람</option>
          <option>눈</option>
        </select>
      </label>
    </div>

    <button type="submit" class="add-button" :disabled="props.newCity.name.trim() === ''">
      날씨 카드 추가
    </button>
  </form>
</template>

<style scoped>
.city-form {
  margin-top: 18px;
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.city-form h3,
.city-form > p {
  margin: 0;
}

.city-form > p {
  margin-top: 5px;
  color: #64748b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
}

input,
select {
  box-sizing: border-box;
  padding: 10px 11px;
  color: #2c3e50;
  background: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 7px;
  font: inherit;
}

.add-button {
  width: 100%;
  margin-top: 18px;
  padding: 12px;
  color: white;
  background: #42b883;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.add-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 760px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
