<template>
  <div class="row justify-center q-pa-md">
    <h1
      v-if="!formattedTime.hr_min_sec"
      class="col-12 text-center q-pb-lg"
      style="font-size: 10rem"
    >
      {{ formattedTime.min_sec }}
    </h1>
    <h1 v-else class="col-12 text-center q-pb-lg" style="font-size: 7rem">
      {{ formattedTime.hr_min_sec }}
    </h1>
    <div class="col-auto">
      <q-btn
        :icon="isRunning ? 'fas fa-pause' : 'fas fa-play'"
        :color="isRunning ? 'accent' : 'primary'"
        size="32px"
        round
        outline
        @click="togglePause"
      />
    </div>
    <div class="col-auto" style="margin-left: 160px">
      <q-btn icon="fas fa-refresh" color="info" size="32px" round outline @click="reset" />
    </div>
    <div class="col-12 text-center" style="margin-top: 80px">
      <q-btn
        icon="fas fa-times"
        color="secondary"
        size="xl"
        round
        outline
        @click="$router.replace({ name: 'face' })"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'StopwatchPage',
  setup() {
    const $q = useQuasar();
    const time = ref(0);
    const isRunning = ref(false);
    const timer = ref<number | null>(null);

    const formattedTime = computed(() => {
      const hours = Math.floor(time.value / 3600000);
      const minutes =
        hours >= 1 ? Math.floor((time.value % 3600000) / 60000) : Math.floor(time.value / 60000);
      const seconds = Math.floor((time.value % 60000) / 1000);

      return {
        min_sec: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        hr_min_sec:
          hours >= 1
            ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : null,
      };
    });

    const startTimer = () => {
      if (!isRunning.value) {
        isRunning.value = true;
        timer.value = window.setInterval(() => {
          time.value += 10;
        }, 10);
      }
    };

    const pauseTimer = () => {
      if (isRunning.value && timer.value !== null) {
        isRunning.value = false;
        clearInterval(timer.value);
        timer.value = null;
      }
    };

    const togglePause = () => {
      if (isRunning.value) {
        pauseTimer();
      } else {
        startTimer();
      }
    };

    const reset = () => {
      time.value = 0;
    };

    onMounted(() => {
      $q.loading.hide();
      startTimer();
    });

    onUnmounted(() => {
      if (timer.value !== null) {
        clearInterval(timer.value);
      }
    });

    return {
      time,
      isRunning,
      formattedTime,
      togglePause,
      reset,
    };
  },
});
</script>
