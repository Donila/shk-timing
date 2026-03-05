<template>
  <v-row>
    <v-col cols="12" sm="2" md="2" class="px-1">
      <v-card>
        <v-card-text>{{ $t('serverTime') }}: {{ serverTime }}</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" offset-sm="1" sm="6" offset-md="1" md="4" class="px-1 mb-2">
      <v-dialog v-model="dialog" width="auto">
        <template v-slot:activator="{ props: activatorProps }">
          <v-text-field
            v-model="clockTime"
            :label="$t('timingTime')"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="activatorProps"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="dialog"
          v-model="pendingTime"
          format="24hr"
        >
          <template v-slot:actions>
            <v-btn variant="text" color="primary" @click="dialog = false">{{ $t('cancel') }}</v-btn>
            <v-btn variant="text" color="primary" @click="confirmTime">{{ $t('save') }}</v-btn>
          </template>
        </v-time-picker>
      </v-dialog>
    </v-col>
    <v-col cols="12" offset-sm="1" sm="2" offset-md="1" md="2" class="px-1">
      <v-card>
        <v-card-text>{{ $t('suggestedTime') }} {{ suggestedTime }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import * as attackHelper from '@/helpers/attack'
import * as timeHelper from '@/helpers/time'
import moment from 'moment'
import { useAttackStore } from '@/stores/attackStore'

export default {
  data() {
    return {
      store: useAttackStore(),
      time: '0000',
      serverTime: null,
      timer: null,
      clockTime: null,
      dialog: false,
      pendingTime: null
    }
  },
  methods: {
    saveTime() {
      let hhmm = attackHelper.convertTimeInput(this.time)
      if (
        hhmm.hours >= 0 &&
        hhmm.hours < 24 &&
        hhmm.minutes >= 0 &&
        hhmm.minutes < 60
      ) {
        this.store.changeTime(this.time)
        console.log('time saved')
      } else {
        console.log('time wrong')
      }
    },
    confirmTime() {
      this.clockTime = this.pendingTime
      this.dialog = false
    }
  },
  computed: {
    armies() {
      return this.store.armies
    },
    suggestedTime() {
      let slowestArmy = attackHelper.getSlowestArmy(this.store.armies)
      let time = timeHelper.getSuggestedTime(slowestArmy, 3)
      return time
    },
    attackTime() {
      return this.store.time
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        this.pendingTime = this.clockTime
      }
    },
    time(newTime, oldTime) {
      if (newTime !== oldTime) {
        this.saveTime()
      }
    },
    attackTime() {
      this.time = this.store.time
    },
    clockTime(val) {
      if (val) {
        this.time = val.replace(':', '')
      }
    }
  },
  mounted() {
    this.serverTime = moment.utc().format('HH:mm:ss')
    this.timer = setInterval(() => {
      this.serverTime = moment.utc().format('HH:mm:ss')
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
</style>
