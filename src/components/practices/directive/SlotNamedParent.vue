<script setup>
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <section class="practice-section">
    <h2>Named Slot 주입 실습</h2>

    <SlotNamedChild>
      <template v-slot:header>
        <h3>Child 주입 제목</h3>
      </template>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
      </p>
    </SlotNamedChild>
  </section>
</template>

<style scoped>
.practice-section {
  padding: 24px;
}
</style>
