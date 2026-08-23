<script setup>
// 부모 컴포넌트로부터 전달받을 Props를 정의합니다.
defineProps({
  parentData: {
    type: String,
    required: true,
  },
})

// 부모 컴포넌트로 보낼 사용자 정의 이벤트를 등록합니다.
const emit = defineEmits(['update-request'])

const sendNotification = () => {
  const payload = 'Child에서 가공한 새로운 데이터'
  emit('update-request', payload)
}
</script>

<template>
  <div class="child-container">
    <h2>하위 컴포넌트 (Child)</h2>
    <p>
      수신된 Props 데이터: <strong>{{ parentData }}</strong>
    </p>
    <button @click="sendNotification">상위 컴포넌트로 갱신 요청 (Emit)</button>
  </div>
</template>

<style scoped>
.child-container {
  margin-top: 18px;
  padding: 20px;
  border: 2px solid #42b883;
  border-radius: 10px;
  background: #f2fbf7;
  color: #213547;
}

button {
  padding: 9px 14px;
  border: 0;
  border-radius: 6px;
  background: #42b883;
  color: white;
  cursor: pointer;
}
</style>
