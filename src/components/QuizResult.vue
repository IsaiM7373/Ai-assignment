<script setup>
defineProps({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
})
defineEmits(['restart'])
</script>

<template>
  <section class="result">
    <h2>Quiz complete!</h2>
    <p class="big">{{ score }} / {{ total }}</p>
    <p>
      {{
        score === total
          ? 'Perfect score! 🎉'
          : score >= total / 2
            ? 'Nice work! Keep practicing.'
            : 'Good try. Give it another go!'
      }}
    </p>
    <button class="primary" @click="$emit('restart')">Play again</button>
  </section>
</template>
