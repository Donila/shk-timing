<template>
  <div>
    <v-app>
      <v-navigation-drawer v-model="drawer" location="right" app>
        <v-list dense>
          <v-list-item @click="home()">
            <template v-slot:prepend>
              <v-icon>mdi-home</v-icon>
            </template>
            <v-list-item-title>{{ $t('newAttack') }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>
              <Languages/>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <v-list-item-title>
              <Help/>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app>
        <v-app-bar-nav-icon class="d-lg-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="d-none d-lg-flex">{{ $t("title") }}</v-toolbar-title>
        <v-toolbar-title class="d-lg-none">{{ $t("titleShort") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="d-none d-md-flex">
          <Languages/>
          <v-btn variant="text" @click="home()">{{ $t('newAttack') }}</v-btn>
          <Help/>
        </div>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
      <v-footer app></v-footer>
    </v-app>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Languages from '@/components/Languages.vue'
import { useAttackStore } from '@/stores/attackStore'

export default {
  components: {
    Help,
    Languages
  },
  data() {
    return {
      drawer: false,
      store: useAttackStore()
    }
  },
  methods: {
    home() {
      this.store.newAttack()
      this.$router.push({ name: 'home', params: { atk: '' } })
    },
    about() {
      this.$router.push({ name: 'about' })
    }
  }
}
</script>

<style scoped>
@media (max-width: 968px) {
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
