<template>
  <v-layout row>
    <v-flex xs4 sm1 md1>
      <v-card>
        <v-card-text>Server Time: {{serverTime}}</v-card-text>
      </v-card>
    </v-flex>
    <v-flex offset-xs4 xs4 offset-sm1 sm1 offset-md1 md1>
      <label>Timing time</label>
      <v-text-field outline box type="time" v-model="time" label="HH:MM" mask="time"></v-text-field>
    </v-flex>
    <v-flex offset-xs4 xs4 offset-sm1 sm1 offset-md1 md1>
      <v-card>
        <v-card-text>Suggested Time: {{suggestedTime}}</v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import * as attackHelper from '@/helpers/attack';
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
      return '00:00';
    }
  },
  watch: {
    time() {
      this.saveTime();
    },
    armies() {
      console.log('Armies changed from timeX');
    }
  },
  created() {
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