import { computed, effect, signal } from "alien-signals";

const count = signal(1);
const doubleCount = computed(() => count() * 2);

effect(() => {
  console.log(`Count is: ${count()}`);
});

console.log(doubleCount());

count(2);

console.log(doubleCount());
