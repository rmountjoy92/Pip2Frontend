import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'utils/api';

interface VoiceStoreNotificationsInterface {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  priority: number;
}

interface VoiceStoreInterface {
  notifications: Array<VoiceStoreNotificationsInterface>;
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): VoiceStoreInterface => ({
    notifications: [],
  }),

  actions: {
    async get_notifications(): Promise<void> {
      this.notifications = await api.get({
        endpoint: 'notifications',
      });
    },

    async dismissNotification(id: number): Promise<void> {
      this.removeNotification(id);
      await api.post({
        endpoint: `notifications/${id}/dismiss`,
      });
    },

    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => {
        return n.id !== id;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}
