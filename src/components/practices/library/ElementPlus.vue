<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }

  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }

  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}

const productQuantity = ref(1)
const productRate = ref(4)

const downloadProgress = ref(0)
const isDownloading = ref(false)

const confirmDelete = () => {
  ElMessageBox.confirm('서버에서 해당 파일을 영구히 삭제하시겠습니까?', '🔥 최종 경고', {
    confirmButtonText: '네, 삭제합니다',
    cancelButtonText: '취소',
    type: 'danger',
  })
    .then(() => {
      ElMessage.success('🗑️ 파일이 안전하게 파쇄되었습니다.')
    })
    .catch(() => {
      ElMessage.info('❌ 삭제 작업이 취소되었습니다.')
    })
}

const startDownload = () => {
  if (isDownloading.value) return

  isDownloading.value = true
  downloadProgress.value = 0

  const interval = setInterval(() => {
    downloadProgress.value += 20

    if (downloadProgress.value >= 100) {
      clearInterval(interval)
      isDownloading.value = false
      ElMessage.success('💾 대용량 데이터 로드가 완료되었습니다!')
    }
  }, 400)
}
</script>

<template>
  <section class="element-practice">
    <h2>🧪 Element Plus 활용 실습</h2>

    <el-card class="box-card">
      <template #header>
        <strong>📝 실습 1. 회원가입 Form</strong>
      </template>

      <div class="card-body">
        <div class="input-group">
          <span>이메일 주소</span>
          <el-input
            v-model="userForm.email"
            placeholder="example@email.com"
            clearable
            class="email-input"
          />
        </div>

        <el-switch v-model="userForm.agree" active-text="개인정보 수집 및 이용약관에 동의합니다." />
        <el-button type="success" @click="handleRegister">회원가입하기</el-button>
      </div>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <strong>🛒 실습 2. 상품 수량 및 별점</strong>
      </template>

      <div class="card-body">
        <div class="input-group">
          <span>구매 수량</span>
          <el-input-number v-model="productQuantity" :min="1" :max="10" />
        </div>

        <div class="input-group">
          <span>상품 만족도</span>
          <el-rate v-model="productRate" show-score score-template="{value}점" />
        </div>

        <p class="result-preview">
          선택 수량 {{ productQuantity }}개 / 내가 준 점수 {{ productRate }}점
        </p>
      </div>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <strong>⚙️ 실습 3. 시스템 피드백</strong>
      </template>

      <div class="card-body">
        <div class="button-zone">
          <el-button type="danger" plain @click="confirmDelete">파일 삭제 테스트</el-button>
          <el-button type="primary" :loading="isDownloading" @click="startDownload">
            {{ isDownloading ? '동기화 중...' : '데이터 동기화 시작' }}
          </el-button>
        </div>

        <el-progress
          :percentage="downloadProgress"
          :status="downloadProgress === 100 ? 'success' : ''"
        />
      </div>
    </el-card>
  </section>
</template>

<style scoped>
.element-practice h2 {
  margin-top: 0;
}

.box-card {
  margin-bottom: 20px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group,
.button-zone {
  display: flex;
  align-items: center;
  gap: 15px;
}

.email-input {
  max-width: 300px;
}

.result-preview {
  margin: 0;
  padding: 10px;
  background: #f4f4f5;
  border-radius: 6px;
}

@media (max-width: 600px) {
  .input-group,
  .button-zone {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
