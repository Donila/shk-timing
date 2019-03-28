<template>
  <v-menu offset-y bottom origin="center center" transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" v-on="on">
        <v-img :src="lang.src"></v-img>
        <span>{{$i18n.locale}}</span>
      </v-btn>
    </template>
    <v-list>
      <v-list-tile
        v-for="(item, index) in languages"
        :key="index"
        @click="changeLanguage(item)"
        avatar
      >
        <v-list-tile-avatar>
          <v-img :src="item.src"></v-img>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="item.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      languages: [
        { name: 'ru', src: require('../assets/ru.png') },
        { name: 'en', src: require('../assets/en.png') },
        { name: 'pl', src: require('../assets/pl.png') }
      ],
      lang: {}
    };
  },
  mounted() {
    if (localStorage.locale) {
      let language = this.languages.find(l => l.name === localStorage.locale);
      this.changeLanguage(language);
    } else {
      this.lang = this.languages[0];
    }
  },
  methods: {
    changeLanguage(lang) {
      this.$i18n.locale = lang.name;
      this.lang = lang;
      localStorage.locale = lang.name;
    }
  }
};
</script>

<style scoped>

</style>