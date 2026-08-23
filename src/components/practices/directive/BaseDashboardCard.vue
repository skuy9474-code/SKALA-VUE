<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
/* 검색 영역과 목록 영역의 공통 박스 */
.base-dashboard-card {
  padding: 15px;
  margin-bottom: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}
</style>
