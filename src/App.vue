<template>
  <div>
    <v-app dark>
      <v-navigation-drawer v-model="drawer" fixed right app>
        <v-list dense>
          <v-list-tile @click="home()">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('newAttack') }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <Languages/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>info</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <Help/>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar fixed app>
        <v-toolbar-side-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title class="hidden-md-and-down">{{ $t("title") }}</v-toolbar-title>
        <v-toolbar-title class="hidden-lg-and-up">{{ $t("titleShort") }}</v-toolbar-title>
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
      drawer: false,
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
