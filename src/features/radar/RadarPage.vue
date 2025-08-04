<template>
  <div>
    <q-toolbar>
      <q-btn
        @click="$router.replace({ name: 'face' })"
        icon="fas fa-times"
        flat
        round
        size="lg"
        color="secondary"
      />
    </q-toolbar>
    <iframe
      width="100%"
      style="height: calc(100vh - 180px)"
      src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=mph&zoom=7&overlay=radar&product=radar&level=surface&lat=35.285&lon=-82.289&message=true"
      frameborder="0"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'RadarPage',
  setup() {
    const $q = useQuasar();

    onMounted(() => {
      $q.loading.hide();
      setTimeout(() => {
        const playBtn = document.querySelector('div[data-ref="play"]');
        console.log(playBtn);
        playBtn?.classList.remove('off');
      }, 1000);
    });
    return {};
  },
});
</script>

<style scoped>
iframe {
  transform: scale(1.3); /* Adjust scale factor to make elements larger */
  transform-origin: top left; /* Ensure scaling starts from top-left */
  border: none; /* Optional: clean up iframe border */
}
</style>
