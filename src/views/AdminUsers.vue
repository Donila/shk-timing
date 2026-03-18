<template>
  <v-container>
    <v-tabs class="mb-4">
      <v-tab :to="'/admin/users'">{{ $t('adminTabUsers') }}</v-tab>
      <v-tab :to="'/admin/events'">{{ $t('adminTabEvents') }}</v-tab>
    </v-tabs>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h5">{{ $t('adminTitle') }}</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="error" variant="text" @click="doLogout">{{ $t('logout') }}</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
    >
      <template #item.status="{ item }">
        <v-chip
          :color="item.status === 'granted' ? 'success' : 'warning'"
          size="small"
        >
          {{ item.status === 'granted' ? $t('adminStatusGranted') : $t('adminStatusWaiting') }}
        </v-chip>
      </template>
      <template #item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          v-if="item.status === 'waiting'"
          color="success"
          size="small"
          variant="flat"
          class="mr-1"
          @click="approve(item)"
        >
          {{ $t('adminApprove') }}
        </v-btn>
        <v-btn
          v-if="item.status === 'waiting'"
          color="warning"
          size="small"
          variant="flat"
          class="mr-1"
          @click="remove(item)"
        >
          {{ $t('adminDecline') }}
        </v-btn>
        <v-btn
          v-if="item.status === 'granted'"
          color="error"
          size="small"
          variant="flat"
          @click="remove(item)"
        >
          {{ $t('adminDelete') }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { dbSelect, dbUpdate, dbDelete } from '@/lib/db'
import { useAuthStore } from '@/stores/authStore'

export default {
  data() {
    return {
      items: [],
      loading: false,
      store: useAuthStore()
    }
  },
  computed: {
    headers() {
      return [
        { title: this.$t('adminEmail'), key: 'email' },
        { title: this.$t('adminStatus'), key: 'status' },
        { title: this.$t('adminCreatedAt'), key: 'created_at' },
        { title: this.$t('adminActions'), key: 'actions', sortable: false }
      ]
    }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.loading = true
      const data = await dbSelect('whitelist', { select: '*', order: 'created_at.desc' })
      this.items = data || []
      this.loading = false
    },
    async approve(item) {
      await dbUpdate('whitelist', { status: 'granted' }, { id: item.id })
      await this.load()
    },
    async remove(item) {
      await dbDelete('whitelist', { id: item.id })
      await this.load()
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
