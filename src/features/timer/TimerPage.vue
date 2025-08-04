<template>
  <div class="row q-pa-md">
    <div class="col-12 text-center">
      <q-circular-progress
        show-value
        class="text-primary"
        :value="currentTime"
        :max="requestedTime"
        size="85vw"
        color="primary"
        :track-color="!isFlashing ? 'grey-8' : 'primary'"
        :thickness="0.1"
      >
        {{ formattedTime }}
      </q-circular-progress>
    </div>
    <div class="col-12 row justify-center q-mt-xl">
      <div class="col text-center">
        <q-btn @click="cancelTimer" icon="fas fa-times" color="secondary" size="xl" round outline />
      </div>
      <div v-if="currentTime === 0" class="col text-center">
        <q-btn @click="resetTimer" icon="fas fa-refresh" color="accent" size="xl" round outline />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'TimerPage',
  setup() {
    const $q = useQuasar();
    const $route = useRoute();
    const $router = useRouter();
    const requestedTime: number = parseInt(($route.params.time ?? '60').toString());
    const currentTime = ref<number>(requestedTime);
    let intervalId: number | null = null;
    let doneIntervalId: number | null = null;
    const isFlashing = ref<boolean>(false);
    let audio: HTMLAudioElement | null = new Audio('/sounds/timer-done.wav');

    const tickDown = () => {
      if (currentTime.value > 0) {
        currentTime.value--;
      } else {
        playSound();
        clearInterval(intervalId!);
        doneIntervalId = window.setInterval(tickOnceDone, 500);
      }
    };

    const formattedTime = computed(() => {
      if (currentTime.value === 0) {
        return 'Done';
      } else if (currentTime.value < 60) {
        return currentTime.value.toString();
      } else if (currentTime.value < 3600) {
        // less than 1 hour
        const minutes = Math.floor(currentTime.value / 60);
        const seconds = currentTime.value % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      } else {
        // 1 hour or more
        const hours = Math.floor(currentTime.value / 3600);
        const minutes = Math.floor((currentTime.value % 3600) / 60);
        const seconds = currentTime.value % 60;
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }
    });

    const tickOnceDone = () => {
      isFlashing.value = !isFlashing.value;
    };

    const playSound = () => {
      if (audio) {
        audio.loop = true;
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
      }
    };

    const cancelTimer = () => {
      void $router.replace({ name: 'face' });
    };

    const resetTimer = () => {
      clearInterval(doneIntervalId!);
      isFlashing.value = false;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      currentTime.value = requestedTime;
      intervalId = window.setInterval(tickDown, 1000);
    };

    onMounted(() => {
      $q.loading.hide();
      intervalId = window.setInterval(tickDown, 1000);
    });

    onBeforeUnmount(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (doneIntervalId) {
        clearInterval(doneIntervalId);
      }
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio = null;
      }
    });

    return {
      requestedTime,
      currentTime,
      formattedTime,
      isFlashing,
      cancelTimer,
      resetTimer,
    };
  },
});
</script>
