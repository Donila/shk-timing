<template>
  <v-container fluid style="min-height: 100vh; display: flex; align-items: center; padding: 0;">
    <v-row align="center" class="ma-0" style="width: 100%; justify-content: space-evenly;">
      <v-col cols="12" sm="6" md="5" lg="4">
        <v-card>
          <v-card-title class="pa-4 justify-center">{{ $t('titleShort') }}</v-card-title>
          <v-card-text class="pa-4 pb-0">
            <v-text-field
              v-model="email"
              :label="$t('emailLabel')"
              type="email"
              variant="outlined"
              :disabled="loginBlocked"
              :error-messages="emailError"
              @keyup.enter="doLogin"
              @blur="validateEmail"
            />
            <v-alert v-if="loginError" type="error" class="mb-3" density="compact">
              {{ loginError }}
            </v-alert>
          </v-card-text>
          <v-card-actions class="pa-4 pt-2">
            <v-btn
              color="success"
              variant="flat"
              size="large"
              :disabled="loginBlocked || !isValidEmail"
              :loading="loginLoading"
              @click="doLogin"
            >
              {{ $t('login') }}
            </v-btn>
            <v-tooltip :text="$t('enterEmailFirst')" :disabled="!!email.trim()">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-btn
                    variant="text"
                    size="large"
                    :disabled="!isValidEmail"
                    :loading="requestLoading"
                    @click="doRequestAccess"
                  >
                    {{ $t('requestAccess') }}
                  </v-btn>
                </span>
              </template>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5" md="4" lg="3" class="d-flex align-center">
        <v-img
          :src="logoImg"
          :max-height="imgMaxHeight"
          contain
        />
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" color="success" :timeout="3000">
      {{ $t('requestSuccess') }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { dbSelect, dbInsert } from '@/lib/db'
import { useAuthStore, MASTER_EMAILS } from '@/stores/authStore'
import logoImg from '@/assets/wers2.png'

export default {
  data() {
    const now = Date.now()
    const requestResetAt = parseInt(sessionStorage.getItem('requestTriesResetAt') || '0')
    if (now - requestResetAt > 3600000) {
      sessionStorage.setItem('requestTries', '0')
      sessionStorage.setItem('requestTriesResetAt', now.toString())
    }
    return {
      logoImg,
      email: '',
      emailError: '',
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
      return !import.meta.env.DEV && this.loginTries >= 3
    },
    isValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())
    },
    imgMaxHeight() {
      return window.innerHeight - 80
    }
  },
  methods: {
    validateEmail() {
      if (this.email.trim() && !this.isValidEmail) {
        this.emailError = this.$t('emailInvalid')
      } else {
        this.emailError = ''
      }
    },
    async doLogin() {
      if (this.loginBlocked || !this.isValidEmail) return
      this.loginError = ''
      this.loginLoading = true

      const emailLower = this.email.toLowerCase().trim()

      if (MASTER_EMAILS.includes(emailLower)) {
        this.store.login(emailLower)
        this.$router.push('/admin')
        return
      }

      const rows = await dbSelect('whitelist', {
        select: 'email,status',
        eq: { email: emailLower, status: 'granted' }
      })
      const data = rows && rows.length > 0 ? rows[0] : null

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
      if ((!import.meta.env.DEV && this.requestTries >= 3) || !this.isValidEmail) return
      this.requestLoading = true

      const emailLower = this.email.toLowerCase().trim()
      await dbInsert('whitelist', { email: emailLower, status: 'waiting' })

      this.requestTries++
      sessionStorage.setItem('requestTries', this.requestTries.toString())
      this.requestLoading = false
      this.snackbar = true
    }
  }
}
</script>
