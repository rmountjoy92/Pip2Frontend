<template>
  <q-dialog v-model="isOpen" position="bottom" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="text-center">
        <q-spinner-bars color="primary" size="xl" />
      </q-card-section>
      <q-card-section class="text-center text-weight-bold text-grey-4" style="font-size: 2rem">
        {{ transcribedText }}
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn @click="cancel" icon="fas fa-times" color="secondary" size="xl" round outline />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'utils/api';
import { useCompletionsStore } from 'stores/completions-store';
import { QSpinnerBall, useQuasar } from 'quasar';
import { turnWakeWordListenerOff, turnWakeWordListenerOn } from 'utils/wake-word-listener-toggle';

export default defineComponent({
  name: 'VoiceRecorderDialog',
  emits: ['response'],
  setup(props, { expose }) {
    const $q = useQuasar();
    const completionsStore = useCompletionsStore();
    const isOpen = ref<boolean>(false);
    const transcribedText = ref<string>('');
    const sr = ref<any>(null);
    const recognition = ref<any>(null);

    const open = () => {
      transcribedText.value = '...';
      recognition.value.start();
      $q.loading.show({
        spinner: QSpinnerBall,
        spinnerColor: 'primary',
        spinnerSize: 48,
      });
      void turnWakeWordListenerOff().then(() => {
        $q.loading.hide();
        isOpen.value = true;
      });
    };

    const cancel = () => {
      isOpen.value = false;
      transcribedText.value = '';
      recognition.value.stop();
      completionsStore.conversationMode = false;
      void turnWakeWordListenerOn();
    };

    const sendPrompt = async () => {
      isOpen.value = false;
      if (transcribedText.value.length > 0 && transcribedText.value !== '...') {
        completionsStore.isWaitingForCompletion = true;
        await api.post({
          endpoint: 'completions',
          data: { prompt: transcribedText.value },
        });
        void turnWakeWordListenerOn();
      }
      transcribedText.value = '';
    };

    expose({ open });

    onMounted(() => {
      sr.value = (<any>window).SpeechRecognition || (<any>window).webkitSpeechRecognition;
      recognition.value = new sr.value();

      recognition.value.continuous = false; // Stop after one phrase
      recognition.value.interimResults = true; // Only final results
      recognition.value.lang = 'en-US';

      recognition.value.onresult = (event: any) => {
        transcribedText.value = event.results[0][0].transcript;
      };

      recognition.value.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        void turnWakeWordListenerOn();
        transcribedText.value = '';
      };

      recognition.value.onend = () => {
        setTimeout(() => {
          void sendPrompt();
        }, 500);
      };
    });

    return {
      isOpen,
      open,
      cancel,
      transcribedText,
    };
  },
});
</script>
