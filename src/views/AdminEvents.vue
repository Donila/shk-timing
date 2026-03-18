<template>
  <v-container>
    <v-tabs class="mb-4">
      <v-tab :to="'/admin/users'">{{ $t('adminTabUsers') }}</v-tab>
      <v-tab :to="'/admin/events'">{{ $t('adminTabEvents') }}</v-tab>
    </v-tabs>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h5">{{ $t('adminEventsTitle') }}</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="error" variant="text" @click="doLogout">{{ $t('logout') }}</v-btn>
      </v-col>
    </v-row>

    <v-row align="center" class="mb-2">
      <v-col cols="12" sm="3">
        <v-autocomplete
          v-model="filterUser"
          :items="userOptions"
          :loading="usersLoading"
          :label="$t('adminFilterByUsername')"
          clearable
          density="compact"
          hide-details
          no-filter
          @update:search="onUserSearch"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select
          v-model="filterEventType"
          :items="eventTypeOptions"
          :label="$t('adminFilterByEventType')"
          clearable
          density="compact"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="filterFrom"
          :label="$t('adminFilterFrom')"
          type="datetime-local"
          density="compact"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="filterTo"
          :label="$t('adminFilterTo')"
          type="datetime-local"
          density="compact"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2" class="d-flex ga-2">
        <v-btn color="primary" @click="applyFilters">{{ $t('adminApply') }}</v-btn>
        <v-btn variant="text" @click="resetFilters">{{ $t('adminReset') }}</v-btn>
      </v-col>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :page="page"
      :items-per-page-options="[10, 25, 50]"
      @update:options="onTableOptions"
    >
      <template #item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
      <template #item.params="{ item }">
        <v-btn
          v-if="item.params"
          size="x-small"
          variant="outlined"
          @click="openParams(item.params)"
        >
          {{ $t('adminShowParams') }}
        </v-btn>
        <span v-else class="text-disabled">—</span>
      </template>
    </v-data-table-server>

    <v-dialog v-model="paramsDialog" max-width="600px">
      <v-card>
        <v-card-title>{{ $t('adminEventParams') }}</v-card-title>
        <v-card-text>
          <pre style="white-space: pre-wrap; word-break: break-all; font-size: 13px;">{{ JSON.stringify(selectedParams, null, 2) }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="paramsDialog = false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { dbSelect, dbCount } from '@/lib/db'
import { useAuthStore } from '@/stores/authStore'

function defaultFrom() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 16)
}

function defaultTo() {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.toISOString().slice(0, 16)
}

export default {
  data() {
    return {
      store: useAuthStore(),
      items: [],
      totalItems: 0,
      loading: false,
      page: 1,
      itemsPerPage: 25,
      filterUser: null,
      filterEventType: null,
      filterFrom: defaultFrom(),
      filterTo: defaultTo(),
      paramsDialog: false,
      selectedParams: null,
      userOptions: [],
      usersLoading: false,
      // track applied filter state separately from input state
      appliedUser: null,
      appliedEventType: null,
      appliedFrom: defaultFrom(),
      appliedTo: defaultTo()
    }
  },
  computed: {
    headers() {
      return [
        { title: this.$t('adminColTimestamp'), key: 'created_at', sortable: false },
        { title: this.$t('adminColUsername'), key: 'user_email', sortable: false },
        { title: this.$t('adminColEventType'), key: 'event_type', sortable: false },
        { title: this.$t('adminColParams'), key: 'params', sortable: false }
      ]
    },
    eventTypeOptions() {
      return [
        'login', 'logout',
        'new_attack_button_press',
        'new_army_button_press', 'new_army_save',
        'army_edit_button_press', 'army_edit', 'army_delete',
        'speed_change_1x', 'speed_change_2x', 'speed_change_3x',
        'speed_change_4x', 'speed_change_5x', 'speed_change_6x',
        'share_link', 'discord_button_press', 'parse_discord_armies',
        'change_language', 'help_button_press'
      ]
    }
  },
  async mounted() {
    await this.loadUsers()
  },
  methods: {
    buildQueryOptions() {
      const opts = {
        select: '*',
        order: 'created_at.desc',
        limit: this.itemsPerPage,
        offset: (this.page - 1) * this.itemsPerPage
      }
      const eq = {}
      if (this.appliedUser) eq.user_email = this.appliedUser
      if (this.appliedEventType) eq.event_type = this.appliedEventType
      if (Object.keys(eq).length) opts.eq = eq
      if (this.appliedFrom) opts.gte = { created_at: new Date(this.appliedFrom).toISOString() }
      if (this.appliedTo) opts.lte = { created_at: new Date(this.appliedTo).toISOString() }
      return opts
    },
    buildCountOptions() {
      const opts = {}
      const eq = {}
      if (this.appliedUser) eq.user_email = this.appliedUser
      if (this.appliedEventType) eq.event_type = this.appliedEventType
      if (Object.keys(eq).length) opts.eq = eq
      if (this.appliedFrom) opts.gte = { created_at: new Date(this.appliedFrom).toISOString() }
      if (this.appliedTo) opts.lte = { created_at: new Date(this.appliedTo).toISOString() }
      return opts
    },
    async load() {
      this.loading = true
      const [data, count] = await Promise.all([
        dbSelect('events', this.buildQueryOptions()),
        dbCount('events', this.buildCountOptions())
      ])
      this.items = data || []
      this.totalItems = count
      this.loading = false
    },
    onTableOptions(options) {
      this.page = options.page
      this.itemsPerPage = options.itemsPerPage
      this.load()
    },
    applyFilters() {
      this.appliedUser = this.filterUser || null
      this.appliedEventType = this.filterEventType || null
      this.appliedFrom = this.filterFrom
      this.appliedTo = this.filterTo
      this.page = 1
      this.load()
    },
    resetFilters() {
      this.filterUser = null
      this.filterEventType = null
      this.filterFrom = defaultFrom()
      this.filterTo = defaultTo()
      this.applyFilters()
    },
    async loadUsers(search = '') {
      this.usersLoading = true
      const opts = { select: 'user_email', order: 'created_at.desc', limit: 500 }
      if (search) opts.ilike = { user_email: search }
      const rows = await dbSelect('events', opts)
      const seen = new Set()
      const unique = []
      for (const r of rows || []) {
        if (!seen.has(r.user_email) && unique.length < 50) {
          seen.add(r.user_email)
          unique.push(r.user_email)
        }
      }
      this.userOptions = unique
      this.usersLoading = false
    },
    onUserSearch(val) {
      if (!val || val === this.filterUser) return
      clearTimeout(this._userSearchTimer)
      this._userSearchTimer = setTimeout(() => this.loadUsers(val), 300)
    },
    openParams(params) {
      this.selectedParams = params
      this.paramsDialog = true
    },
    doLogout() {
      this.store.logout()
      this.$router.push('/login')
    },
    formatDate(iso) {
      if (!iso) return ''
      return new Date(iso).toLocaleString()
    }
  }
}
</script>
