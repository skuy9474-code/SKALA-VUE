<script setup>
import SlotDefaultChild from './SlotDefaultChild.vue'
</script>

<template>
  <section class="practice-section">
    <h2>Default Slot 레이아웃 주입 실습</h2>

    <SlotDefaultChild>
      <p>단순한 텍스트 문장을 주입합니다.</p>
    </SlotDefaultChild>

    <SlotDefaultChild>
      <h2 class="warning-title">🔥 경고 상태</h2>
      <button>확인</button>
    </SlotDefaultChild>

    <!-- 전달하는 콘텐츠가 없으므로 자식의 기본 콘텐츠가 표시됩니다. -->
    <SlotDefaultChild />
  </section>
</template>

<style scoped>
.practice-section {
  padding: 24px;
}

.warning-title {
  color: #e74c3c;
}

button {
  padding: 8px 14px;
}
</style>
