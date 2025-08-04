<template>
  <div style="display: none"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted } from 'vue';
import socket from 'utils/socket';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'StopwatchSocketReactor',
  setup() {
    const $router = useRouter();

    onMounted(() => {
      socket.off('stopwatch');
      socket.on('stopwatch', () => {
        void $router.push({ name: 'stopwatch' });
      });
    });

    onBeforeMount(() => {
      socket.off('stopwatch');
    });

    return {};
  },
});
</script>
