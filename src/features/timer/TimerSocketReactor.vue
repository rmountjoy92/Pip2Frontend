<template>
  <div style="display: none"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted } from 'vue';
import socket from 'utils/socket';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TimerSocketReactor',
  setup() {
    const $router = useRouter();

    onMounted(() => {
      socket.off('timer');
      socket.on('timer', (data) => {
        void $router.push({ name: 'timer', params: { time: data.seconds } });
      });
    });

    onBeforeMount(() => {
      socket.off('timer');
    });

    return {};
  },
});
</script>
