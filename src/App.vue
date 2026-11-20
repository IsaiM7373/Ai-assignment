<script setup>
import { ref, computed } from 'vue'

const questions = [
  { question: 'Which function creates a Vue 3 application instance?', options: ['new Vue()', 'createApp()', 'mountApp()', 'startVue()'], answer: 1 },
  { question: 'Which directive renders a list of items in a template?', options: ['v-if', 'v-bind', 'v-for', 'v-model'], answer: 2 },
  { question: 'Which function creates a reactive primitive value in the Composition API?', options: ['ref()', 'state()', 'watch()', 'emit()'], answer: 0 },
  { question: 'What does Vite use for its fast dev server?', options: ['CommonJS bundling', 'Native ES modules', 'Webpack loaders', 'Server-side rendering only'], answer: 1 },
  { question: 'How does a child component send an event to its parent?', options: ['defineProps', 'v-once', 'emit', 'provide only'], answer: 2 },
  { question: 'Which directive creates two-way binding on a form input?', options: ['v-on', 'v-model', 'v-slot', 'v-text'], answer: 1 },
]

const letters = ['A', 'B', 'C', 'D']
const BEST_KEY = 'vueQuizBestScore'

function loadBest() {
  try {
    const n = parseInt(localStorage.getItem(BEST_KEY), 10)
    return Number.isFinite(n) ? n : 0
  } catch (e) {
    return 0
  }
}
function saveBest(n) {
  try {
    localStorage.setItem(BEST_KEY, String(n))
  } catch (e) {
    /* storage unavailable: ignore */
  }
}

const index = ref(0)
const score = ref(0)
const selected = ref(null)
const finished = ref(false)
const best = ref(loadBest())
const newRecord = ref(false)

const current = computed(() => questions[index.value])
const answered = computed(() => selected.value !== null)
const isCorrect = computed(() => selected.value === current.value.answer)
const isLast = computed(() => index.value === questions.length - 1)

function choose(i) {
  if (answered.value) return
  selected.value = i
  if (i === current.value.answer) score.value++
}
function next() {
  if (isLast.value) {
    newRecord.value = score.value > best.value
    if (newRecord.value) {
      best.value = score.value
      saveBest(best.value)
    }
    finished.value = true
    return
  }
  index.value++
  selected.value = null
}
function restart() {
  index.value = 0
  score.value = 0
  selected.value = null
  finished.value = false
  newRecord.value = false
}
function optionClass(i) {
  if (!answered.value) return ''
  if (i === current.value.answer) return i === selected.value ? 'correct picked' : 'correct'
  if (i === selected.value) return 'wrong picked'
  return 'dimmed'
}
function tag(i) {
  if (!answered.value) return ''
  if (i === current.value.answer) return i === selected.value ? '✓ Your answer' : '✓ Correct'
  return i === selected.value ? '✗ Your answer' : ''
}
const message = computed(() =>
  score.value === questions.length
    ? 'Perfect score! 🎉'
    : score.value >= questions.length / 2
      ? 'Nice work! Keep practicing.'
      : 'Good try. Give it another go!'
)
</script>

<template>
  <main class="card">
    <h1>Vue Quiz</h1>

    <section v-if="finished" class="result">
      <h2>Quiz complete!</h2>
      <p class="big">{{ score }} / {{ questions.length }}</p>
      <p class="best">Best: {{ best }} / {{ questions.length }}</p>
      <p v-if="newRecord" class="record">🏆 New high score!</p>
      <p>{{ message }}</p>
      <button class="primary" @click="restart">Play again</button>
    </section>

    <template v-else>
      <div class="status">
        <span>Question {{ index + 1 }} of {{ questions.length }}</span>
        <span>Score: {{ score }}</span>
        <button class="ghost" @click="restart">↻ Restart Quiz</button>
      </div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: (index / questions.length) * 100 + '%' }"></div>
      </div>

      <h2 class="question">{{ current.question }}</h2>
      <ul class="options">
        <li v-for="(option, i) in current.options" :key="i">
          <button class="option" :class="optionClass(i)" :disabled="answered" @click="choose(i)">
            <span class="badge">{{ letters[i] }}</span>
            <span class="label">{{ option }}</span>
            <span v-if="tag(i)" class="tag">{{ tag(i) }}</span>
          </button>
        </li>
      </ul>

      <p v-if="answered" class="feedback" role="status" :class="isCorrect ? 'good' : 'bad'">
        {{ isCorrect ? '✅ Correct!' : '❌ Not quite. The right answer is highlighted.' }}
      </p>
      <button v-if="answered" class="primary" @click="next">
        {{ isLast ? 'See results' : 'Next question' }}
      </button>
    </template>
  </main>
</template>

<style>
:root {
  --bg: #f1f5f9; --card: #fff; --text: #0f172a; --muted: #64748b; --border: #e2e8f0;
  --primary: #4f46e5; --primary-dark: #4338ca; --good: #16a34a; --good-bg: #dcfce7; --bad: #dc2626; --bad-bg: #fee2e2;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a; --card: #1e293b; --text: #f1f5f9; --muted: #94a3b8; --border: #334155;
    --good-bg: #14532d; --bad-bg: #7f1d1d; color-scheme: dark;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1rem;
  background: var(--bg); color: var(--text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
#app { width: 100%; display: flex; justify-content: center; }
.card { width: 100%; max-width: 600px; background: var(--card); border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0, 0, 0, .1); }
h1 { margin: 0 0 1rem; font-size: 1.5rem; text-align: center; }
.status { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; justify-content: space-between; color: var(--muted); font-size: .9rem; margin-bottom: .5rem; }
.progress { height: 6px; background: var(--border); border-radius: 999px; overflow: hidden; margin-bottom: 1.25rem; }
.progress-bar { height: 100%; background: var(--primary); transition: width .3s ease; }
.question { font-size: 1.2rem; margin: 0 0 1rem; line-height: 1.4; }
.options { list-style: none; padding: 0; margin: 0 0 1rem; display: grid; gap: .6rem; }
.option {
  display: flex; align-items: center; gap: .75rem; width: 100%; text-align: left; padding: .8rem 1rem; font-size: 1rem;
  color: inherit; background: transparent; border: 2px solid var(--border); border-radius: 12px; cursor: pointer;
  transition: border-color .15s, background .15s, transform .1s;
}
.option:hover:not(:disabled) { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 10%, transparent); transform: translateY(-1px); }
.option:focus-visible, .ghost:focus-visible, .primary:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; }
.option:disabled { cursor: default; }
.badge { flex: none; width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: 8px; font-weight: 700; font-size: .9rem; background: var(--border); color: var(--text); }
.label { flex: 1; }
.tag { flex: none; font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; padding: .2rem .5rem; border-radius: 999px; }
.option.correct { border-color: var(--good); background: var(--good-bg); }
.option.correct .badge, .option.correct .tag { background: var(--good); color: #fff; }
.option.wrong { border-color: var(--bad); background: var(--bad-bg); }
.option.wrong .badge, .option.wrong .tag { background: var(--bad); color: #fff; }
.option.picked { border-width: 3px; padding: calc(.8rem - 1px) calc(1rem - 1px); }
.option.dimmed { opacity: .55; }
.feedback { font-weight: 600; margin: 0 0 1rem; }
.feedback.good { color: var(--good); }
.feedback.bad { color: var(--bad); }
.primary { width: 100%; padding: .85rem 1rem; font-size: 1rem; font-weight: 600; color: #fff; background: var(--primary); border: none; border-radius: 10px; cursor: pointer; transition: background .15s; }
.primary:hover { background: var(--primary-dark); }
.ghost { background: none; border: 1px solid var(--border); color: var(--muted); border-radius: 8px; padding: .3rem .7rem; font-size: .85rem; cursor: pointer; transition: color .15s, border-color .15s; }
.ghost:hover { color: var(--text); border-color: var(--primary); }
.result { text-align: center; }
.result .big { font-size: 3rem; font-weight: 700; margin: .5rem 0; color: var(--primary); }
.result .best { color: var(--muted); font-weight: 600; margin: 0 0 .5rem; }
.result .record { color: var(--good); font-weight: 700; margin: 0 0 .75rem; }
@media (max-width: 480px) { .card { padding: 1rem; } .question { font-size: 1.1rem; } }
</style>
