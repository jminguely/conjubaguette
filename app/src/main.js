import './assets/css/tailwind.css'
import 'vue-select/dist/vue-select.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vSelect from 'vue-select'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
app.component('v-select', vSelect)

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true
}
