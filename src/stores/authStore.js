import { defineStore } from 'pinia'

export const MASTER_EMAILS = ['daniil.dziaruhin@gmail.com', 'wers@admin.gg']

const STORAGE_KEY = 'shk_auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: null,
    isMaster: false,
    isAuth: false
  }),
  actions: {
    login(email) {
      this.email = email
      this.isMaster = MASTER_EMAILS.includes(email.toLowerCase())
      this.isAuth = true
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: this.email, isMaster: this.isMaster }))
    },
    logout() {
      this.email = null
      this.isMaster = false
      this.isAuth = false
      localStorage.removeItem(STORAGE_KEY)
    },
    loadFromStorage() {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const { email, isMaster } = JSON.parse(stored)
          this.email = email
          this.isMaster = isMaster
          this.isAuth = true
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }
})
