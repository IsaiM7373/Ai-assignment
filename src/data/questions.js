// `answer` is the index (0-3) of the correct option.
export const questions = [
  {
    question: 'Which function creates a Vue 3 application instance?',
    options: ['new Vue()', 'createApp()', 'mountApp()', 'startVue()'],
    answer: 1,
  },
  {
    question: 'Which directive renders a list of items in a template?',
    options: ['v-if', 'v-bind', 'v-for', 'v-model'],
    answer: 2,
  },
  {
    question: 'Which function creates a reactive primitive value in the Composition API?',
    options: ['ref()', 'state()', 'watch()', 'emit()'],
    answer: 0,
  },
  {
    question: 'What does Vite use for its fast dev server?',
    options: ['CommonJS bundling', 'Native ES modules', 'Webpack loaders', 'Server-side rendering only'],
    answer: 1,
  },
  {
    question: 'How does a child component send an event to its parent?',
    options: ['defineProps', 'v-once', 'emit', 'provide only'],
    answer: 2,
  },
]
