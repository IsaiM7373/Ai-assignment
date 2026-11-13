<script setup>
import { ref, computed } from 'vue'
import { questions } from './data/questions.js'
import QuizQuestion from './components/QuizQuestion.vue'
import QuizResult from './components/QuizResult.vue'

const currentIndex = ref(0)
const score = ref(0)
const finished = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value])

function handleAnswered(isCorrect) {
  if (isCorrect) score.value++
}

function handleNext() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  } else {
    finished.value = true
  }
}

function restart() {
  currentIndex.value = 0
  score.value = 0
  finished.value = false
}
</script>

<template>
  <main class="card">
    <h1>Vue Quiz</h1>

    <QuizResult
      v-if="finished"
      :score="score"
      :total="questions.length"
      @restart="restart"
    />

    <template v-else>
      <div class="status">
        <span>Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
        <span>Score: {{ score }}</span>
      </div>
      <div class="progress">
        <div
          class="progress-bar"
          :style="{ width: (currentIndex / questions.length) * 100 + '%' }"
        ></div>
      </div>

      <QuizQuestion
        :key="currentIndex"
        :question="currentQuestion"
        :is-last="currentIndex === questions.length - 1"
        @answered="handleAnswered"
        @next="handleNext"
      />
    </template>
  </main>
</template>
<style>
:root {
  --bg: #f1f5f9;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --primary: #4f46e5;
  --primary-dark: #4338ca;
  --good: #16a34a;
  --good-bg: #dcfce7;
  --bad: #dc2626;
  --bad-bg: #fee2e2;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --card: #1e293b;
    --text: #f1f5f9;
    --muted: #94a3b8;
    --border: #334155;
    --good-bg: #14532d;
    --bad-bg: #7f1d1d;
  }
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.card {
  width: 100%;
  max-width: 600px;
  background: var(--card);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

h1 { margin: 0 0 1rem; font-size: 1.5rem; text-align: center; }

.status {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.progress {
  height: 6px;
  background: var(--border);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.progress-bar {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}

.question { font-size: 1.2rem; margin: 0 0 1rem; line-height: 1.4; }

.options { list-style: none; padding: 0; margin: 0 0 1rem; display: grid; gap: 0.6rem; }

.option {
  width: 100%;
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  color: inherit;
  background: transparent;
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
}
.option:hover:not(:disabled) { border-color: var(--primary); transform: translateY(-1px); }
.option:disabled { cursor: default; }
.option.correct { border-color: var(--good); background: var(--good-bg); }
.option.wrong { border-color: var(--bad); background: var(--bad-bg); }
.option.dimmed { opacity: 0.5; }

.feedback { font-weight: 600; margin: 0 0 1rem; }
.feedback.good { color: var(--good); }
.feedback.bad { color: var(--bad); }

.primary {
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: var(--primary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.primary:hover { background: var(--primary-dark); }

.result { text-align: center; }
.result .big { font-size: 3rem; font-weight: 700; margin: 0.5rem 0; color: var(--primary); }

@media (max-width: 480px) {
  .card { padding: 1rem; }
  .question { font-size: 1.1rem; }
}
</style>