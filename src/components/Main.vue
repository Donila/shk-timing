<template>
  <div class="hello">
    <div>
      <ArmiesTable/>
      <v-btn class="button" @click="addArmy()">Add Empty Army</v-btn>
      <v-btn class="button success" @click="share()">Share Link</v-btn>
    </div>
  </div>
</template>

<script>
import * as urlConverter from '@/helpers/urlConverter';
import * as attackHelper from '@/helpers/attack';

import ArmiesTable from '@/components/ArmiesTable';

export default {
  name: 'Main',
  components: {
    ArmiesTable
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
        time: '07:40',
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
    }
  },
  mounted() {
    this.setAttackFromUrl();
  },
  watch: {
    $route(to, from) {
      console.log(`from ${from.params.atk} to ${to.params.atk}`);
      this.setAttackFromUrl();
    }
  }
};
</script>
