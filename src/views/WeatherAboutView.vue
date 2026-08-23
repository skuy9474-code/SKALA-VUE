<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="about-view">
    <header class="about-hero">
      <div class="hero-copy">
        <span class="hero-label">ABOUT TODAY'S OOTD</span>
        <h2>날씨를 확인하는 순간,<br />오늘의 스타일도 완성됩니다</h2>
        <p>
          기온만 알려주는 날씨 서비스에서 한 걸음 더 나아가, 오늘 입을 옷부터 헤어스타일과 신발까지
          한 번에 추천합니다.
        </p>
        <el-button class="hero-button" round @click="router.push('/')">
          오늘의 추천 확인하기 <span>→</span>
        </el-button>
      </div>

      <div class="hero-visual" aria-label="OOTD 추천 항목">
        <span class="weather-chip">☀️ 23℃ · 맑음</span>
        <div class="style-orbit main-orbit">👗</div>
        <div class="style-orbit hair-orbit">💇</div>
        <div class="style-orbit shoes-orbit">👟</div>
        <p>WEATHER<br /><strong>TO STYLE</strong></p>
      </div>
    </header>

    <section class="feature-section">
      <div class="section-heading">
        <div>
          <span>WHAT WE OFFER</span>
          <h3>오늘 외출에 필요한 정보를 모았어요</h3>
        </div>
        <p>여러 화면을 오가지 않고 한곳에서 확인할 수 있습니다.</p>
      </div>

      <div class="feature-grid">
        <article>
          <i>01</i><span class="feature-icon">🌦️</span>
          <h4>지역별 실시간 날씨</h4>
          <p>OpenWeather를 이용해 현재 기온, 체감온도, 습도와 바람 정보를 확인합니다.</p>
        </article>
        <article>
          <i>02</i><span class="feature-icon">👕</span>
          <h4>성별 맞춤 OOTD</h4>
          <p>남성과 여성으로 나누어 날씨에 어울리는 옷, 헤어스타일, 신발을 추천합니다.</p>
        </article>
        <article>
          <i>03</i><span class="feature-icon">☀️</span>
          <h4>자외선과 대기질</h4>
          <p>자외선 지수와 대기질을 함께 확인하고 우산이나 자외선 차단제도 안내합니다.</p>
        </article>
        <article>
          <i>04</i><span class="feature-icon">📍</span>
          <h4>원하는 지역 관리</h4>
          <p>관심 지역을 직접 추가하거나 삭제하고, 선택한 지역의 상세 날씨를 살펴봅니다.</p>
        </article>
      </div>
    </section>

    <section class="service-flow">
      <div class="flow-intro">
        <span>HOW IT WORKS</span>
        <h3>세 단계면 준비 끝</h3>
        <p>복잡한 입력 없이 지역과 성별만 선택하면 지금 필요한 추천을 확인할 수 있습니다.</p>
      </div>
      <ol>
        <li>
          <strong>01</strong>
          <div><b>지역 선택</b><span>오늘 외출할 지역을 고릅니다.</span></div>
        </li>
        <li>
          <strong>02</strong>
          <div><b>날씨 확인</b><span>현재 날씨와 생활 지수를 확인합니다.</span></div>
        </li>
        <li>
          <strong>03</strong>
          <div><b>OOTD 완성</b><span>옷, 헤어, 신발 추천을 확인합니다.</span></div>
        </li>
      </ol>
    </section>
  </section>
</template>

<style scoped>
.about-view {
  color: #354747;
}
.about-hero {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  min-height: 430px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f4f8f7 0%, #fbf7ee 52%, #eef6f6 100%);
  border: 0;
  border-radius: 30px;
  box-shadow: 0 16px 42px rgba(74, 102, 103, 0.09);
}
.hero-copy {
  position: relative;
  z-index: 2;
  padding: 68px 58px;
}
.hero-label,
.section-heading span,
.flow-intro > span {
  color: #6e958e;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}
.hero-copy h2 {
  margin: 15px 0 18px;
  color: #405c5d;
  font-size: clamp(2rem, 4vw, 3.35rem);
  line-height: 1.22;
  letter-spacing: -0.045em;
}
.hero-copy p {
  max-width: 640px;
  margin: 0;
  color: #6d807e;
  line-height: 1.85;
}
.hero-button {
  margin-top: 30px;
  padding: 20px 25px;
  color: #fff;
  font-weight: 800;
  background: #78a8a4;
  border: 0;
}
.hero-button:hover {
  color: #fff;
  background: #678f8b;
}
.hero-button span {
  margin-left: 12px;
}
.hero-visual {
  position: relative;
  display: grid;
  min-height: 430px;
  overflow: hidden;
  color: #557675;
  background: transparent;
  place-items: center;
}
.hero-visual::before,
.hero-visual::after {
  position: absolute;
  content: '';
  border: 1px solid rgba(120, 170, 185, 0.24);
  border-radius: 50%;
}
.hero-visual::before {
  width: 330px;
  height: 330px;
  background: rgba(255, 255, 255, 0.42);
}
.hero-visual::after {
  width: 235px;
  height: 235px;
  background: linear-gradient(145deg, rgba(120, 170, 185, 0.16), rgba(155, 191, 178, 0.2));
}
.hero-visual > p {
  z-index: 1;
  margin: 0;
  text-align: center;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  line-height: 1.7;
}
.hero-visual strong {
  color: #527777;
  font-size: 1.35rem;
}
.weather-chip {
  position: absolute;
  top: 28px;
  right: 28px;
  z-index: 2;
  padding: 9px 14px;
  font-size: 0.78rem;
  color: #52706f;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(121, 161, 158, 0.18);
  box-shadow: 0 8px 24px rgba(74, 102, 103, 0.08);
  border-radius: 999px;
  backdrop-filter: blur(8px);
}
.style-orbit {
  position: absolute;
  z-index: 2;
  display: grid;
  width: 58px;
  height: 58px;
  font-size: 1.55rem;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 12px 28px rgba(74, 102, 103, 0.1);
  place-items: center;
}
.main-orbit {
  top: 95px;
  left: 48px;
  transform: rotate(-7deg);
}
.hair-orbit {
  right: 42px;
  bottom: 78px;
  transform: rotate(8deg);
}
.shoes-orbit {
  bottom: 42px;
  left: 62px;
  transform: rotate(5deg);
}
.feature-section {
  padding: 72px 4px 34px;
}
.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 26px;
}
.section-heading h3,
.flow-intro h3 {
  margin: 8px 0 0;
  color: #405c5d;
  font-size: 1.75rem;
}
.section-heading p {
  margin: 0;
  color: #849391;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.feature-grid article {
  position: relative;
  min-height: 220px;
  padding: 28px 25px;
  background: #f3f8f7;
  border: 0;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(75, 104, 105, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.feature-grid article:nth-child(2) {
  background: #f8f4eb;
}
.feature-grid article:nth-child(3) {
  background: #eef6f7;
}
.feature-grid article:nth-child(4) {
  background: #f5f3f7;
}
.feature-grid article:hover {
  box-shadow: 0 16px 34px rgba(75, 104, 105, 0.11);
  transform: translateY(-4px);
}
.feature-grid article > i {
  position: absolute;
  top: 20px;
  right: 21px;
  color: #b3c2bf;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 800;
}
.feature-icon {
  display: grid;
  width: 52px;
  height: 52px;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.78);
  border-radius: 50%;
  place-items: center;
}
.feature-grid h4 {
  margin: 24px 0 10px;
  font-size: 1.06rem;
}
.feature-grid p {
  margin: 0;
  color: #7b8d8b;
  font-size: 0.88rem;
  line-height: 1.7;
}
.service-flow {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 60px;
  margin-top: 32px;
  padding: 52px 54px;
  background: linear-gradient(135deg, #f7f4ec, #eef5f2);
  border: 1px solid #e4ece8;
  border-radius: 28px;
  box-shadow: 0 12px 32px rgba(75, 104, 105, 0.06);
}
.flow-intro h3 {
  color: #405c5d;
}
.flow-intro p {
  color: #788b89;
  line-height: 1.7;
}
.flow-intro > span {
  color: #6e958e;
}
.service-flow ol {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.service-flow li {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 17px 19px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(220, 232, 229, 0.9);
  border-radius: 18px;
  box-shadow: 0 7px 18px rgba(75, 104, 105, 0.045);
}
.service-flow li > strong {
  display: grid;
  width: 34px;
  height: 34px;
  color: #fff;
  background: #88aaa3;
  border-radius: 50%;
  font-size: 0.78rem;
  place-items: center;
}
.service-flow li div {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}
.service-flow b {
  color: #405c5d;
}
.service-flow li span {
  color: #849391;
  font-size: 0.86rem;
}
@media (max-width: 900px) {
  .about-hero {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    min-height: 300px;
  }
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .service-flow {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
@media (max-width: 600px) {
  .hero-copy {
    padding: 40px 24px;
  }
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .service-flow {
    padding: 34px 22px;
  }
  .service-flow li div {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }
}
</style>
