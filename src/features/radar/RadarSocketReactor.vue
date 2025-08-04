<template>
  <div style="display: none"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted } from 'vue';
import socket from 'utils/socket';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'RadarSocketReactor',
  setup() {
    const $router = useRouter();

    onMounted(() => {
      socket.off('radar');
      socket.on('radar', () => {
        void $router.push({ name: 'radar' });
      });
    });

    onBeforeMount(() => {
      socket.off('radar');
    });

    return {};
  },
});
</script>
