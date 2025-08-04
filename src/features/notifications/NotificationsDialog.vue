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
      <q-carousel
        ref="carousel"
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="white"
        navigation
        padding
        class="text-white shadow-1 rounded-borders"
        style="height: calc(100vh - 72px)"
      >
        <q-carousel-slide
          v-for="(notification, index) in notifications"
          :key="index"
          :name="index"
          :class="`${priorityColor(notification.priority)} column no-wrap flex-center`"
        >
          <div style="font-size: 128px">
            {{ notification.emoji }}
          </div>
          <h2 class="q-my-none text-center">
            {{ notification.title }}
          </h2>
          <h5 class="q-my-sm text-center text-italic">
            {{ notification.subtitle }}
          </h5>
          <div class="q-my-sm">
            <q-btn
              @click="dismissNotification(notification.id, index)"
              label="dismiss"
              color="white"
              outline
              size="xl"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import type { QCarousel } from 'quasar';
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { useNotificationsStore } from 'stores/notifications-store';
import socket from 'utils/socket';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'NotificationsDialog',
  setup(props, { expose }) {
    const $q = useQuasar();
    const notificationsStore = useNotificationsStore();
    const isOpen = ref<boolean>(false);
    const slide = ref<number>(0);
    const carousel = ref<QCarousel | null>(null);

    const notifications = computed(() => {
      return notificationsStore.notifications;
    });

    const priorityColor = (priority: number): string => {
      if (priority === 1) {
        return 'bg-info';
      } else if (priority === 2) {
        return 'bg-positive';
      } else if (priority === 3) {
        return 'bg-warning';
      } else if (priority === 4) {
        return 'bg-negative';
      }
      return '';
    };

    const open = () => {
      isOpen.value = true;
    };

    const close = () => {
      isOpen.value = false;
    };

    const dismissNotification = (id: number, index: number) => {
      if (index + 1 === notifications.value.length) {
        carousel.value?.previous();
      }
      void notificationsStore.dismissNotification(id);
      $q.notify({
        message: 'Dismissed',
      });
      if (notifications.value.length === 0) {
        close();
      }
    };

    onMounted(async () => {
      await notificationsStore.get_notifications();
      socket.on('notification-created', (notification) => {
        void new Audio('/sounds/notification.mp3').play();
        notificationsStore.notifications.unshift(notification);
        if (!isOpen.value) {
          isOpen.value = true;
        }
      });
      socket.on('notification-dismissed', (data) => {
        notificationsStore.removeNotification(data.id);
      });
    });

    onBeforeUnmount(() => {
      socket.off('notification-created');
      socket.off('notification-dismissed');
    });

    expose({ open });
    return {
      isOpen,
      close,
      slide,
      notifications,
      priorityColor,
      dismissNotification,
      carousel,
      lorem:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.',
    };
  },
});
</script>
