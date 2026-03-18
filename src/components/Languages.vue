<template>
  <v-menu offset-y bottom origin="center center" transition="scale-transition">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">
        <v-img :src="lang.src" width="24"></v-img>
        <span>{{ $i18n.locale }}</span>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in languages"
        :key="index"
        @click="changeLanguage(item)"
      >
        <template v-slot:prepend>
          <v-img :src="item.src" width="24"></v-img>
        </template>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import ruFlag from '../assets/ru.png'
import enFlag from '../assets/en.png'
import plFlag from '../assets/pl.png'
import { logEvent } from '@/lib/events'

export default {
  data() {
    return {
      languages: [
        { name: 'ru', src: ruFlag },
        { name: 'en', src: enFlag },
        { name: 'pl', src: plFlag }
      ],
      lang: {}
    }
  },
  mounted() {
    if (localStorage.locale) {
      let language = this.languages.find(l => l.name === localStorage.locale)
      this.changeLanguage(language, false)
    } else {
      this.lang = this.languages[0]
    }
  },
  methods: {
    changeLanguage(lang, track = true) {
      this.$i18n.locale = lang.name
      this.lang = lang
      localStorage.locale = lang.name
      if (track) logEvent('change_language', { language: lang.name })
    }
  }
}
</script>

<style scoped>
</style>
