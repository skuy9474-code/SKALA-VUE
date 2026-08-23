<template>
  <div class="base-card">
    <header class="card-header">
      <slot name="header"></slot>
    </header>

    <main class="card-body">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.base-card {
  overflow: hidden;
  margin-top: 14px;
  border: 2px solid #8b5cf6;
  border-radius: 10px;
  color: #213547;
}

.card-header {
  padding: 12px 18px;
  background: #ede9fe;
}

.card-body {
  padding: 18px;
  background: #faf8ff;
}
</style>
