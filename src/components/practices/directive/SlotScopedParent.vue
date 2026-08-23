<script setup>
import SlotScopedChild from './SlotScopedChild.vue'
</script>

<template>
  <section class="practice-section">
    <h2>Scoped Slot 주입 실습</h2>
    <h3>상위 컴포넌트 (Parent)</h3>

    <SlotScopedChild v-slot="slotBag">
      <div class="display-panel">
        <p>알림 메시지: {{ slotBag.text }}</p>
        <p>접속자 수: {{ slotBag.count }}명</p>
      </div>
    </SlotScopedChild>

    <!-- 부모가 마크업을 전달하지 않으므로 자식의 기본 화면이 표시됩니다. -->
    <SlotScopedChild />
  </section>
</template>

<style scoped>
.practice-section {
  padding: 24px;
}

.display-panel {
  padding: 14px;
  border-radius: 8px;
  background: white;
}
</style>
