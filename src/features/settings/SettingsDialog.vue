<template>
  <q-dialog
    v-model="isOpen"
    position="bottom"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card v-touch-swipe.down="close" style="height: 100vh">
      <q-toolbar>
        <q-btn @click="close" icon="fas fa-times" round flat size="xl" color="secondary" />
      </q-toolbar>
      <div class="row justify-center">
        <div class="col-auto">
          <pre
            class="text-primary"
            style="font-family: 'Courier New', monospace; font-size: 0.7rem"
          >
███████╗███████╗████████╗████████╗██╗███╗   ██╗ ██████╗ ███████╗
██╔════╝██╔════╝╚══██╔══╝╚══██╔══╝██║████╗  ██║██╔════╝ ██╔════╝
███████╗█████╗     ██║      ██║   ██║██╔██╗ ██║██║  ███╗███████╗
╚════██║██╔══╝     ██║      ██║   ██║██║╚██╗██║██║   ██║╚════██║
███████║███████╗   ██║      ██║   ██║██║ ╚████║╚██████╔╝███████║
╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
          </pre>
        </div>
      </div>
      <div class="q-px-md">
        <q-list bordered separator class="rounded-borders">
          <q-item @click="conversationMode = !conversationMode" clickable v-ripple>
            <q-item-section avatar>
              <q-icon color="accent" name="fas fa-comments" size="xl" />
            </q-item-section>

            <q-item-section class="q-ml-md" style="font-size: 1.3rem">
              Conversation Mode
            </q-item-section>

            <q-item-section side top>
              <q-toggle v-model="conversationMode" color="accent" size="xl" />
            </q-item-section>
          </q-item>

          <q-expansion-item>
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon color="primary" name="fas fa-cubes" size="xl" />
              </q-item-section>

              <q-item-section class="q-ml-md" style="font-size: 1.3rem"> Apps </q-item-section>
            </template>
            <q-separator />
            <q-list>
              <q-item @click="$router.replace({ name: 'radar' })" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon color="accent" name="fas fa-bolt" size="xl" />
                </q-item-section>

                <q-item-section class="q-ml-md" style="font-size: 1.3rem"> Radar </q-item-section>
              </q-item>

              <q-item @click="$router.replace({ name: 'stopwatch' })" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon color="accent" name="fas fa-stopwatch" size="xl" />
                </q-item-section>

                <q-item-section class="q-ml-md" style="font-size: 1.3rem">
                  Stopwatch
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-item @click="reloadUi" clickable v-ripple>
            <q-item-section avatar>
              <q-icon color="accent" name="fas fa-refresh" size="xl" />
            </q-item-section>

            <q-item-section class="q-ml-md" style="font-size: 1.3rem"> Reload UI </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useCompletionsStore } from 'stores/completions-store';

export default defineComponent({
  name: 'SettingsDialog',
  setup(props, { expose }) {
    const isOpen = ref<boolean>(false);
    const completionsStore = useCompletionsStore();

    const conversationMode = computed({
      get: () => completionsStore.conversationMode,
      set: (v) => (completionsStore.conversationMode = v),
    });

    const open = () => {
      isOpen.value = true;
    };

    const close = () => {
      isOpen.value = false;
    };

    const reloadUi = () => {
      window.location.reload();
    };

    expose({ open });
    return {
      isOpen,
      close,
      conversationMode,
      reloadUi,
    };
  },
});
</script>
