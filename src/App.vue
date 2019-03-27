<template>
  <div>
    <v-app dark>
      <v-toolbar fixed app>
        <v-toolbar-title>{{ $t("title") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat @click="home()">new attack</v-btn>
          <v-btn flat @click="about()">about</v-btn>
          <v-btn flat @click="help()">help</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer app></v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      store: this.$root.$data
    };
  },
  methods: {
    home() {
      this.store.newAttack();
      this.$router.push({ name: 'home', params: { atk: '' } });
    },
    about() {
      this.$router.push({ name: 'about' });
    }
  }
};
</script>
