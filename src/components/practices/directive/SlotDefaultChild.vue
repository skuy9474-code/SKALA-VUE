<template>
  <div class="base-card">
    <slot>
      <p>기본 콘텐츠 영역입니다.</p>
    </slot>
  </div>
</template>

<style scoped>
.base-card {
  margin: 14px 0;
  padding: 18px;
  border: 2px solid #42b883;
  border-radius: 10px;
  background: #f2fbf7;
  color: #213547;
}
</style>
