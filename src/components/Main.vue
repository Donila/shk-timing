<template>
  <div class="hello">
    <div>
      <TimeX/>
      <ArmiesTable/>
      <v-btn class="button" @click="addArmy()">{{ $t('addRandomArmy') }}</v-btn>
      <v-btn class="button success" @click="share()">{{ $t('shareLink') }}</v-btn>
      <v-dialog
        v-model="dialog"
        max-width="1200px"
        persistent
        :fullscreen="$vuetify.breakpoint.xsOnly"
      >
        <template v-slot:activator="{ on }">
          <v-btn class="button info" v-on="on">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="discord" style="width: 30px;">
          </v-btn>
        </template>
        <v-card>
          <v-container grid-list-md>
            <v-textarea
              v-model="pastedFromBot"
              label="???"
            ></v-textarea>
          </v-container>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="button" @click="fromDiscordBot()">{{ $t('save') }}</v-btn>
            <v-btn color="blue darken-1" flat @click="dialog = false;">{{ $t('cancel') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import * as urlConverter from '@/helpers/urlConverter';
import * as attackHelper from '@/helpers/attack';
import * as discordParserHelper from '@/helpers/discordBotArmiesParser';

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
      store: this.$root.$data,
      pastedFromBot: '',
      dialog: false,
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
    },
    fromDiscordBot() {
      this.store.newAttack();
      try {
        const armies = discordParserHelper.convertFromDiscordBot(this.pastedFromBot);

        if (armies.length) {
          
          armies.forEach(army => {
            this.store.addArmy(army);
          });
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
        console.log(e);
      }
      this.pastedFromBot = '';
      this.dialog = false;
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
