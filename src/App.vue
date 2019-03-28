<template>
  <div>
    <v-app dark>
      <v-toolbar fixed app>
        <v-toolbar-title>{{ $t("title") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <Languages/>
          <v-btn flat @click="home()">{{ $t('newAttack') }}</v-btn>
          <Help/>
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
import Help from '@/components/Help';
import Languages from '@/components/Languages';

export default {
  components: {
    Help,
    Languages
  },
  data() {
    return {
      helpDialog: false,
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
