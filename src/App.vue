<template>
  <div>
    <v-app>
      <v-navigation-drawer v-if="authStore.isAuth" v-model="drawer" location="right" app>
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
          <v-list-item @click="logout()">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>{{ $t('logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar v-if="$route.name !== 'login'" app>
        <v-app-bar-nav-icon v-if="authStore.isAuth" class="d-lg-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="d-none d-lg-flex">{{ $t("title") }}</v-toolbar-title>
        <v-toolbar-title class="d-lg-none">{{ $t("titleShort") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="authStore.isAuth" class="d-none d-md-flex">
          <Languages/>
          <v-btn variant="text" @click="home()">{{ $t('newAttack') }}</v-btn>
          <Help/>
          <v-btn variant="text" @click="logout()">{{ $t('logout') }}</v-btn>
        </div>
      </v-app-bar>
      <v-main>
        <template v-if="$route.name === 'login'">
          <router-view></router-view>
        </template>
        <v-container v-else fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
      <v-footer v-if="$route.name !== 'login'" app></v-footer>
    </v-app>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Languages from '@/components/Languages.vue'
import { useAttackStore } from '@/stores/attackStore'
import { useAuthStore } from '@/stores/authStore'
import { logEvent } from '@/lib/events'

export default {
  components: {
    Help,
    Languages
  },
  data() {
    return {
      drawer: false,
      store: useAttackStore(),
      authStore: useAuthStore()
    }
  },
  methods: {
    home() {
      logEvent('new_attack_button_press')
      this.store.newAttack()
      this.$router.push({ name: 'home', params: { atk: '' } })
    },
    about() {
      this.$router.push({ name: 'about' })
    },
    logout() {
      this.authStore.logout()
      this.$router.push('/login')
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
