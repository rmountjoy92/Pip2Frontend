import { defineStore, acceptHMRUpdate } from 'pinia';

interface VoiceStoreInterface {
  isWaitingForCompletion: boolean;
  conversationMode: boolean;
}

export const useCompletionsStore = defineStore('completions', {
  state: (): VoiceStoreInterface => ({
    isWaitingForCompletion: false,
    conversationMode: false,
  }),

  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCompletionsStore, import.meta.hot));
}
