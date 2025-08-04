<template>
  <div class="column" style="height: 100vh">
    <div class="col-auto" style="height: 270px">
      <q-img @click="openVoiceRecorder" src="http://wolfdesk.local:8000/api/v1/eyes/stream" />
    </div>
    <div v-touch-swipe.up="handleSwipeUp" class="col">
      <VoiceRecorderDialog ref="voiceRecorder" />
      <PlaySpeechDialog @closed="onSpeechDialogClose" ref="playSpeechDialog" />
    </div>

    <q-page-sticky v-if="notifications.length > 0" position="bottom" :offset="[0, 18]">
      <q-btn
        @click="notificationsDialog?.open()"
        icon="fas fa-exclamation"
        color="primary"
        round
        outline
        size="xl"
      />
    </q-page-sticky>

    <SettingsDialog ref="settingsDialog" />
    <NotificationsDialog ref="notificationsDialog" />
  </div>
  <TimerSocketReactor />
  <RadarSocketReactor />
  <StopwatchSocketReactor />
</template>

<script lang="ts">
import type OpenableDialogInterface from 'src/interfaces/openable-dialog';
import type PlaySpeechDialogInterface from 'src/interfaces/play-speech-dialog-interface';

import { computed, defineComponent, onBeforeMount, onMounted, ref, watch } from 'vue';
import VoiceRecorderDialog from 'features/speech/VoiceRecorderDialog.vue';
import TimerSocketReactor from 'features/timer/TimerSocketReactor.vue';
import PlaySpeechDialog from 'features/speech/PlaySpeechDialog.vue';
import { useCompletionsStore } from 'stores/completions-store';
import { useQuasar, QSpinnerBall } from 'quasar';
import RadarSocketReactor from 'features/radar/RadarSocketReactor.vue';
import SettingsDialog from 'features/settings/SettingsDialog.vue';
import socket from 'utils/socket';
import StopwatchSocketReactor from 'features/stopwatch/StopwatchSocketReactor.vue';
import NotificationsDialog from 'features/notifications/NotificationsDialog.vue';
import { useNotificationsStore } from 'stores/notifications-store';

export default defineComponent({
  name: 'FacePage',
  components: {
    NotificationsDialog,
    StopwatchSocketReactor,
    SettingsDialog,
    RadarSocketReactor,
    PlaySpeechDialog,
    TimerSocketReactor,
    VoiceRecorderDialog,
  },
  setup() {
    const $q = useQuasar();
    const completionsStore = useCompletionsStore();
    const notificationsStore = useNotificationsStore();
    const voiceRecorder = ref<OpenableDialogInterface | null>(null);
    const playSpeechDialog = ref<PlaySpeechDialogInterface | null>(null);
    const settingsDialog = ref<OpenableDialogInterface | null>(null);
    const notificationsDialog = ref<OpenableDialogInterface | null>(null);

    const conversationMode = computed(() => {
      return completionsStore.conversationMode;
    });

    const notifications = computed(() => {
      return notificationsStore.notifications;
    });

    const openVoiceRecorder = () => {
      if (voiceRecorder.value) {
        voiceRecorder.value.open();
      }
    };

    const onSpeechDialogClose = () => {
      if (conversationMode.value && voiceRecorder.value) {
        voiceRecorder.value.open();
      }
    };

    const handleSwipeUp = () => {
      if (settingsDialog.value) {
        settingsDialog.value.open();
      }
    };

    watch(
      () => completionsStore.isWaitingForCompletion,
      (first) => {
        if (first) {
          $q.loading.show({
            spinner: QSpinnerBall,
            spinnerColor: 'primary',
            spinnerSize: 48,
          });
        } else {
          $q.loading.hide();
        }
      },
    );

    onMounted(() => {
      // if (notificationsDialog.value) {
      //   notificationsDialog.value.open();
      // }
      socket.off('wake');
      socket.on('wake', () => {
        openVoiceRecorder();
      });
    });

    onBeforeMount(() => {
      socket.off('wake');
    });

    return {
      voiceRecorder,
      playSpeechDialog,
      notificationsDialog,
      openVoiceRecorder,
      onSpeechDialogClose,
      handleSwipeUp,
      settingsDialog,
      notifications,
    };
  },
});
</script>

<style>
iframe .top-bar {
  display: none;
}
</style>
