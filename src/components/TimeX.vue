<template>
  <v-layout row>
    <v-flex xs4 sm1 md1 px-1>
      <v-card>
        <v-card-text>{{ $t('serverTime') }}: {{serverTime}}</v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs4 offset-sm1 sm1 offset-md1 md1 px-1>
      <label>{{ $t('timingTime') }}</label>
      <v-text-field outline box v-model="time" :label="$t('hhMM')" mask="time"></v-text-field>
    </v-flex>
    <v-flex xs4 offset-sm1 sm1 offset-md1 md1 px-1>
      <v-card>
        <v-card-text>{{ $t('suggestedTime') }} {{suggestedTime}}</v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import * as attackHelper from '@/helpers/attack';
import * as timeHelper from '@/helpers/time';
import moment from 'moment';

export default {
  data() {
    return {
      store: this.$root.$data,
      time: '0000',
      serverTime: null,
      timer: null
    };
  },
  methods: {
    saveTime() {
      let hhmm = attackHelper.convertTimeInput(this.time);
      if (
        hhmm.hours >= 0 &&
        hhmm.hours < 24 &&
        hhmm.minutes >= 0 &&
        hhmm.minutes < 60
      ) {
        this.store.changeTime(this.time);
        console.log('time saved');
      } else {
        console.log('time wrong');
      }
    }
  },
  computed: {
    armies() {
      let armies = this.store.state.armies;

      return armies;
    },
    suggestedTime() {
      let slowestArmy = attackHelper.getSlowestArmy(this.store.state.armies);
      let time = timeHelper.getSuggestedTime(slowestArmy, 3);
      return time;
    },
    attackTime() {
      return this.store.state.time;
    }
  },
  watch: {
    time(newTime, oldTime) {
      if (newTime !== oldTime) {
        this.saveTime();
      }
    },
    attackTime() {
      this.time = this.store.state.time;
    }
  },
  mounted() {
    this.serverTime = moment.utc().format('HH:mm:ss');
    this.timer = setInterval(() => {
      this.serverTime = moment.utc().format('HH:mm:ss');
    }, 1000);
  }
};
</script>

<style scoped>
  .clock-separator {
    font-weight: bold;
    font-size: 2em;
    margin-left: 0.2em;
    margin-right: 0.2em;
  }
</style>