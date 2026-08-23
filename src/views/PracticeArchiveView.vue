<script setup>
import { computed, ref } from 'vue'
import { practiceCategories, practiceList } from '@/data/practiceList'

const selectedCategory = ref('전체')
const filteredPractices = computed(() =>
  selectedCategory.value === '전체'
    ? practiceList
    : practiceList.filter((practice) => practice.category === selectedCategory.value),
)
</script>

<template>
  <section class="practice-page">
    <header class="practice-hero">
      <div>
        <span class="eyebrow">VUE PRACTICE ARCHIVE</span>
        <h1>CODE CHALLENGE</h1>
        <p>수업에서 진행한 Vue 실습을 주제별로 모았습니다. 카드를 누르면 해당 실습만 열립니다.</p>
      </div>
      <div class="hero-summary">
        <strong>{{ practiceList.length }}</strong
        ><span>전체 실습</span>
      </div>
    </header>

    <div class="list-heading">
      <div>
        <span class="eyebrow blue">PRACTICE LIBRARY</span>
        <h2>실습 목록</h2>
      </div>
      <span>{{ filteredPractices.length }}개</span>
    </div>

    <div class="category-filter" aria-label="실습 종류 선택">
      <button
        v-for="category in ['전체', ...practiceCategories]"
        :key="category"
        type="button"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="practice-grid">
      <RouterLink
        v-for="(practice, index) in filteredPractices"
        :key="practice.id"
        :to="practice.path || `/practice/${practice.id}`"
        class="practice-card"
      >
        <div class="card-top">
          <span>{{ String(index + 1).padStart(2, '0') }}</span
          ><i>→</i>
        </div>
        <small>{{ practice.category }}</small>
        <h3>{{ practice.title }}</h3>
        <p>예제 화면 열기</p>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.practice-page {
  color: #354747;
}
.practice-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding: 46px 48px;
  color: #fff;
  background: linear-gradient(125deg, #607f7a, #789b95 58%, #a8c1b6);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(75, 104, 105, 0.18);
}
.eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}
.practice-hero h1 {
  max-width: 650px;
  margin: 12px 0 10px;
  font-size: clamp(1.8rem, 3.5vw, 2.7rem);
  line-height: 1.25;
}
.practice-hero p {
  max-width: 660px;
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
}
.hero-summary {
  min-width: 118px;
  padding: 18px;
  text-align: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 18px;
  backdrop-filter: blur(8px);
}
.hero-summary strong,
.hero-summary span {
  display: block;
}
.hero-summary strong {
  font-size: 2rem;
}
.hero-summary span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.82rem;
}
.list-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 42px 2px 18px;
  color: #71809a;
  font-weight: 700;
}
.blue {
  color: #678f8b;
}
.list-heading h2 {
  margin: 6px 0 0;
  color: #405c5d;
  font-size: 1.65rem;
}
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 24px;
}
.category-filter button {
  padding: 9px 16px;
  color: #708384;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  background: #f4f8f7;
  border: 1px solid #dce8e5;
  border-radius: 999px;
  cursor: pointer;
}
.category-filter button:hover,
.category-filter button.active {
  color: #fff;
  background: #6f9993;
  border-color: #6f9993;
}
.practice-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.practice-card {
  min-height: 170px;
  padding: 22px;
  color: inherit;
  text-decoration: none;
  background: #fff;
  border: 1px solid #dce8e5;
  border-radius: 17px;
  box-shadow: 0 8px 24px rgba(75, 104, 105, 0.07);
  transition: 0.2s ease;
}
.practice-card:hover {
  border-color: #a8c9c2;
  box-shadow: 0 14px 30px rgba(75, 104, 105, 0.14);
  transform: translateY(-4px);
}
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #91a4a2;
  font-size: 0.76rem;
  font-weight: 800;
}
.card-top i {
  display: grid;
  width: 30px;
  height: 30px;
  color: #618e89;
  font-style: normal;
  background: #edf5f2;
  border-radius: 50%;
  place-items: center;
}
.practice-card small {
  display: block;
  margin-top: 24px;
  color: #618e89;
  font-weight: 800;
}
.practice-card h3 {
  margin: 6px 0;
  font-size: 1.08rem;
}
.practice-card p {
  margin: 0;
  color: #829493;
  font-size: 0.82rem;
}
@media (max-width: 880px) {
  .practice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .practice-hero {
    align-items: flex-start;
    padding: 34px 24px;
    flex-direction: column;
  }
  .practice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
