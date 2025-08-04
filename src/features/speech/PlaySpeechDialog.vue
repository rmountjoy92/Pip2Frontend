<template>
  <q-dialog
    v-model="isOpen"
    position="bottom"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="height: 100vh">
      <q-card-section class="row">
        <div class="col-auto">
          <q-btn @click="cancelAudio" icon="fas fa-times" round flat size="xl" color="secondary" />
        </div>
        <div class="col"></div>
        <div class="col-auto">
          <q-btn
            @click="toggleConversationMode"
            icon="fas fa-comments"
            round
            flat
            size="xl"
            :color="conversationMode ? 'primary' : 'secondary'"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-scroll-area
        @click="hasScrolledOnText = true"
        ref="scrollArea"
        style="height: calc(100vh - 106px)"
      >
        <div class="q-pa-md">
          <div style="font-size: 2rem" class="text-grey-6">
            {{ textResponse }}
          </div>
        </div>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import socket from 'utils/socket';
import { useCompletionsStore } from 'stores/completions-store';
import { useQuasar } from 'quasar';
import type { QScrollArea } from 'quasar';

export default defineComponent({
  name: 'PlaySpeechDialog',
  emits: ['closed'],
  setup(props, { expose, emit }) {
    const $q = useQuasar();
    const completionsStore = useCompletionsStore();

    const isOpen = ref<boolean>(false);
    const audio = ref<HTMLAudioElement | null>(null);
    const textResponse = ref<string | null>(null);
    const hasScrolledOnText = ref<boolean>(false);
    const scrollArea = ref<QScrollArea | null>(null);

    const conversationMode = computed(() => {
      return completionsStore.conversationMode;
    });

    const open = () => {
      isOpen.value = true;
    };

    const cancelAudio = () => {
      audio.value?.pause();
      audio.value = null;
      isOpen.value = false;
      emit('closed');
    };

    const toggleConversationMode = () => {
      completionsStore.conversationMode = !completionsStore.conversationMode;
      $q.notify({
        message: `Conversation mode ${completionsStore.conversationMode ? 'enabled' : 'disabled'}`,
      });
    };

    const scrollToBottom = (duration: number) => {
      if (scrollArea.value) {
        scrollArea.value.setScrollPosition(
          'vertical',
          scrollArea.value.getScrollTarget().scrollHeight,
          duration,
        );
      }
    };

    onMounted(() => {
      socket.on('new-completion', (response) => {
        textResponse.value = response.response;
        completionsStore.isWaitingForCompletion = false;
        isOpen.value = true;
        audio.value = new Audio(
          `http://wolfdesk.local:8000/static/audio/response.wav?timestamp=${new Date().getTime()}`,
        );
        void audio.value.play();

        audio.value.addEventListener('loadedmetadata', () => {
          if (audio.value) {
            scrollToBottom(Math.floor(audio.value.duration * 1000) + 5000);
          }
        });

        audio.value.onended = () => {
          setTimeout(() => {
            isOpen.value = false;
            emit('closed');
          }, 500);
        };

        audio.value.onerror = (error) => {
          alert(error);
        };
      });
    });

    onBeforeUnmount(() => {
      socket.off('new-completion');
    });

    expose({ open });
    return {
      isOpen,
      cancelAudio,
      textResponse,
      hasScrolledOnText,
      toggleConversationMode,
      conversationMode,
      scrollArea,
    };
  },
});
</script>
