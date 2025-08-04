<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'BlankLayout',
  setup() {
    const $q = useQuasar()
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      $q.dark.set(true)
    } else if (savedDarkMode === 'false') {
      $q.dark.set(false)
    }

    return {}
  },
})
</script>
