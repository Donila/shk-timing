<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="pa-4">{{ $t('titleShort') }}</v-card-title>
          <v-card-text class="pa-4 pb-0">
            <v-text-field
              v-model="email"
              :label="$t('emailLabel')"
              type="email"
              variant="outlined"
              :disabled="loginBlocked"
              @keyup.enter="doLogin"
            />
            <v-alert v-if="loginError" type="error" class="mb-3" density="compact">
              {{ loginError }}
            </v-alert>
          </v-card-text>
          <v-card-actions class="pa-4 pt-2">
            <v-btn
              color="primary"
              variant="flat"
              :disabled="loginBlocked || !email.trim()"
              :loading="loginLoading"
              @click="doLogin"
            >
              {{ $t('login') }}
            </v-btn>
            <v-btn
              variant="text"
              :disabled="!email.trim()"
              :loading="requestLoading"
              @click="doRequestAccess"
            >
              {{ $t('requestAccess') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" color="success" :timeout="3000">
      {{ $t('requestSuccess') }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { supabase } from '@/lib/supabase'
import { useAuthStore, MASTER_EMAILS } from '@/stores/authStore'

export default {
  data() {
    return {
      email: '',
      loginError: '',
      snackbar: false,
      loginLoading: false,
      requestLoading: false,
      loginTries: parseInt(sessionStorage.getItem('loginTries') || '0'),
      requestTries: parseInt(sessionStorage.getItem('requestTries') || '0'),
      store: useAuthStore()
    }
  },
  computed: {
    loginBlocked() {
      return this.loginTries >= 3
    }
  },
  methods: {
    async doLogin() {
      if (this.loginBlocked || !this.email.trim()) return
      this.loginError = ''
      this.loginLoading = true

      const emailLower = this.email.toLowerCase().trim()

      if (MASTER_EMAILS.includes(emailLower)) {
        this.store.login(emailLower)
        this.$router.push('/admin')
        return
      }

      const { data } = await supabase
        .from('whitelist')
        .select('email, status')
        .eq('email', emailLower)
        .eq('status', 'granted')
        .maybeSingle()

      this.loginLoading = false

      if (data) {
        this.store.login(emailLower)
        this.$router.push('/')
      } else {
        this.loginTries++
        sessionStorage.setItem('loginTries', this.loginTries.toString())
        this.loginError = this.loginTries >= 3
          ? this.$t('loginBlocked')
          : this.$t('loginFailed')
      }
    },

    async doRequestAccess() {
      if (this.requestTries >= 3 || !this.email.trim()) return
      this.requestLoading = true

      const emailLower = this.email.toLowerCase().trim()
      await supabase.from('whitelist').insert({ email: emailLower, status: 'waiting' })

      this.requestTries++
      sessionStorage.setItem('requestTries', this.requestTries.toString())
      this.requestLoading = false
      this.snackbar = true
    }
  }
}
</script>
