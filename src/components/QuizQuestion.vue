<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  isLast: { type: Boolean, default: false },
})
const emit = defineEmits(['answered', 'next'])

const selected = ref(null)
const answered = computed(() => selected.value !== null)
const isCorrect = computed(() => selected.value === props.question.answer)

function choose(index) {
  if (answered.value) return // lock after first choice
  selected.value = index
  emit('answered', index === props.question.answer)
}

function optionClass(index) {
  if (!answered.value) return ''
  if (index === props.question.answer) return 'correct'
  if (index === selected.value) return 'wrong'
  return 'dimmed'
}
</script>

<template>
  <section>
    <h2 class="question">{{ question.question }}</h2>

    <ul class="options">
      <li v-for="(option, index) in question.options" :key="index">
        <button
          class="option"
          :class="optionClass(index)"
          :disabled="answered"
          @click="choose(index)"
        >
          {{ option }}
        </button>
      </li>
    </ul>

    <p v-if="answered" class="feedback" :class="isCorrect ? 'good' : 'bad'">
      {{ isCorrect ? '✅ Correct!' : '❌ Not quite. The right answer is highlighted.' }}
    </p>

    <button v-if="answered" class="primary" @click="emit('next')">
      {{ isLast ? 'See results' : 'Next question' }}
    </button>
  </section>
</template>
