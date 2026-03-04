<template>
  <v-row>
    <v-col cols="12" sm="2" md="2" class="px-1">
      <v-card>
        <v-card-text>{{ $t('serverTime') }}: {{ serverTime }}</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" offset-sm="1" sm="6" offset-md="1" md="4" class="px-1 mb-2">
      <div>{{ $t('timingTime') }}</div>
      <v-time-picker v-model="clockTime" format="24hr" :landscape="$vuetify.display.mdAndUp"></v-time-picker>
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
      clockTime: null
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
    time(newTime, oldTime) {
      if (newTime !== oldTime) {
        this.saveTime()
      }
    },
    attackTime() {
      this.time = this.store.time
    },
    clockTime() {
      this.time = this.clockTime.replace(':', '')
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
  .clock-separator {
    font-weight: bold;
    font-size: 2em;
    margin-left: 0.2em;
    margin-right: 0.2em;
  }
</style>
