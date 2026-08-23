<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { practiceList } from '@/data/practiceList'
import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'
import VHtmlExample from '@/components/practices/directive/VHtmlExample.vue'
import XssHtml from '@/components/practices/directive/XssHtml.vue'
import DirectiveHtml from '@/components/practices/directive/DirectiveHtml.vue'
import BindExample from '@/components/practices/directive/BindExample.vue'
import BindingExample from '@/components/practices/directive/BindingExample.vue'
import SbindingExample from '@/components/practices/directive/SbindingExample.vue'
import EkscnrExam from '@/components/practices/directive/EkscnrExam.vue'
import VifelseifExample from '@/components/practices/directive/VifelseifExample.vue'
import VshowExample from '@/components/practices/directive/VshowExample.vue'
import VforExample from '@/components/practices/directive/VforExample.vue'
import VonExample from '@/components/practices/directive/VonExample.vue'
import VpreExample from '@/components/practices/directive/VpreExample.vue'
import VcloakExample from '@/components/practices/directive/VcloackExample.vue'
import VonceExample from '@/components/practices/directive/VonceExample.vue'
import VmemoExample from '@/components/practices/directive/VmemoExample.vue'
import VonEvent from '@/components/practices/directive/VonEvent.vue'
import EventobExample from '@/components/practices/directive/EventobExample.vue'
import EventmodiExample from '@/components/practices/directive/EventmodiExample.vue'
import VmodelExample from '@/components/practices/directive/VmodelExample.vue'
import FormHand from '@/components/practices/directive/FormHand.vue'
import VmodifiExample from '@/components/practices/directive/VmodifiExample.vue'
import VueStyle from '@/components/practices/directive/VueStyle.vue'
import RefExample from '@/components/practices/directive/RefExample.vue'
import ReactiveExample from '@/components/practices/directive/ReactiveExample.vue'
import ComputedExample from '@/components/practices/directive/ComputedExample.vue'
import WatchExample from '@/components/practices/directive/WatchExample.vue'
import MultiWatchExample from '@/components/practices/directive/MultiWatchExample.vue'
import DeepWatchExample from '@/components/practices/directive/DeepWatchExample.vue'
import ReactiveWatchExample from '@/components/practices/directive/ReactiveWatchExample.vue'
import WatchEffectExample from '@/components/practices/directive/WatchEffectExample.vue'
import LifecycleParent from '@/components/practices/component/LifecycleParent.vue'
import PropsEmitsParent from '@/components/practices/directive/PropsEmitsParent.vue'
import SlotDefaultParent from '@/components/practices/directive/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/directive/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/directive/SlotScopedParent.vue'
import WeatherMockup from '@/components/practices/directive/WeatherMockup.vue'
import WeatherComposition from '@/components/practices/directive/WeatherComposition.vue'
import WeatherParent from '@/components/practices/directive/WeatherParent.vue'

const route = useRoute()
const componentMap = {
  SampleOne,
  SampleTwo,
  VHtmlExample,
  XssHtml,
  DirectiveHtml,
  BindExample,
  BindingExample,
  SbindingExample,
  EkscnrExam,
  VifelseifExample,
  VshowExample,
  VforExample,
  VonExample,
  VpreExample,
  VcloakExample,
  VonceExample,
  VmemoExample,
  VonEvent,
  EventobExample,
  EventmodiExample,
  VmodelExample,
  FormHand,
  VmodifiExample,
  VueStyle,
  RefExample,
  ReactiveExample,
  ComputedExample,
  WatchExample,
  MultiWatchExample,
  DeepWatchExample,
  ReactiveWatchExample,
  WatchEffectExample,
  LifecycleParent,
  PropsEmitsParent,
  SlotDefaultParent,
  SlotNamedParent,
  SlotScopedParent,
  WeatherMockup,
  WeatherComposition,
  WeatherParent,
}
const practice = computed(() => practiceList.find((item) => item.id === route.params.practiceId))
const practiceComponent = computed(() => componentMap[practice.value?.component])
</script>

<template>
  <section class="detail-page">
    <RouterLink to="/practice" class="back-link">← 실습 목록으로</RouterLink>

    <template v-if="practice && practiceComponent">
      <header class="detail-heading">
        <div>
          <span>{{ practice.category }}</span>
          <h1>{{ practice.title }}</h1>
        </div>
        <span class="practice-badge">PRACTICE</span>
      </header>
      <div class="practice-stage"><component :is="practiceComponent" /></div>
    </template>

    <div v-else class="not-found">
      <strong>실습을 찾을 수 없습니다.</strong>
      <p>주소가 올바른지 확인하거나 실습 목록에서 다시 선택해 주세요.</p>
    </div>
  </section>
</template>

<style scoped>
.detail-page {
  color: #354747;
}
.back-link {
  display: inline-flex;
  margin-bottom: 20px;
  color: #618e89;
  text-decoration: none;
  font-weight: 800;
}
.detail-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 30px 34px;
  color: #fff;
  background: linear-gradient(125deg, #607f7a, #8eaaa1);
  border-radius: 20px 20px 0 0;
}
.detail-heading span {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  opacity: 0.82;
}
.detail-heading h1 {
  margin: 7px 0 0;
  font-size: clamp(1.55rem, 3vw, 2.15rem);
}
.practice-badge {
  padding: 9px 13px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
}
.practice-stage {
  min-height: 360px;
  padding: 38px 42px;
  overflow: auto;
  background: #fff;
  border: 1px solid #dce8e5;
  border-top: 0;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 16px 38px rgba(75, 104, 105, 0.1);
}
.not-found {
  padding: 60px;
  text-align: center;
  background: #f4f8f7;
  border-radius: 20px;
}
.not-found strong {
  font-size: 1.3rem;
}
@media (max-width: 600px) {
  .detail-heading,
  .practice-stage {
    padding: 26px 20px;
  }
  .practice-badge {
    display: none;
  }
}
</style>
