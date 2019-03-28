<template>
  <div class="hello">
    <div>
      <TimeX/>
      <ArmiesTable/>
      <v-btn class="button" @click="addArmy()">{{ $t('addRandomArmy') }}</v-btn>
      <v-btn class="button success" @click="share()">{{ $t('shareLink') }}</v-btn>
    </div>
  </div>
</template>

<script>
import * as urlConverter from '@/helpers/urlConverter';
import * as attackHelper from '@/helpers/attack';

import ArmiesTable from '@/components/ArmiesTable';
import TimeX from '@/components/TimeX';

export default {
  name: 'Main',
  components: {
    ArmiesTable,
    TimeX
  },
  data() {
    return {
      store: this.$root.$data
    };
  },
  methods: {
    getAttack() {
      return this.store.getState();
    },
    setAttack(attack) {
      this.store.setState(attack);
    },
    setAttackFromUrl() {
      if (this.$route.params.atk) {
        let attackFromUrl = urlConverter.convertAttackFromUrl(
          this.$route.params.atk
        );
        this.setAttack(attackFromUrl);
      } else {
        this.setAttack(attackHelper.emptyAttack());
      }
    },
    addArmy() {
      this.store.addArmy({
        name: `Army ${Math.random()}`,
        time: 3600,
        delay: this.random(0, 15),
        speed: this.random(1, 6)
      });
    },
    share() {
      let atk = urlConverter.convertAttackToUrl(this.getAttack());
      this.$router.push({ name: 'attack', params: { atk } });
    },
    random(min, max) {
      return Math.floor(Math.random() * max) + min;
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  },
  mounted() {
    this.setAttackFromUrl();
  },
  watch: {
    $route() {
      this.setAttackFromUrl();
    }
  }
};
</script>
