<template>
  <div>
    <v-app dark>
      <v-toolbar fixed app>
        <v-toolbar-title>Stronghold Kingdoms Timing Attacks</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat @click="home()">Home</v-btn>
          <v-btn flat @click="about()">About</v-btn>
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
  methods: {
    home() {
      this.$router.push({ name: 'home', params: { atk: '' } });
    },
    about() {
      this.$router.push({ name: 'about' });
    }
  }
};
</script>
