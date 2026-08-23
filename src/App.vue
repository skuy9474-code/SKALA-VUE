<script setup>
import UnitToggler from '@/components/practices/directive/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>👗 오늘의 OOTD 날씨 코치</h1>
      <nav class="navigation-bar" aria-label="주요 메뉴">
        <RouterLink to="/">오늘의 OOTD</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
        <RouterLink to="/practice">CODE CHALLENGE</RouterLink>
        <UnitToggler />
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  margin: 0 auto;
  padding: 10px 8px 32px;
  box-sizing: border-box;
  color: #354747;
}

.app-header h1 {
  margin: 0 0 16px;
  color: #405c5d;
  font-size: 1.7rem;
  font-weight: 700;
}

.navigation-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  padding: 14px;
  background: #f4f8f7;
  border: 1px solid #dce8e5;
  border-radius: 14px;
}

.navigation-bar a {
  padding: 5px 4px;
  color: #708384;
  text-decoration: none;
  font-weight: 700;
}

.navigation-bar a.router-link-exact-active {
  color: #548692;
  border-bottom: 2px solid #78aab4;
}

.main-content {
  margin-top: 24px;
}

@media (max-width: 760px) {
  .app-shell {
    padding: 8px 2px 24px;
  }
}
</style>
