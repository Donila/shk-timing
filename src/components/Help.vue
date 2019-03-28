<template>
  <v-dialog v-model="helpDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn flat dark v-on="on">{{ $t('help') }}</v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="helpDialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('help') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat @click="helpDialog = false">{{ $t('close') }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-container>
        <v-stepper v-model="helpStep" vertical>
          <v-stepper-step :complete="helpStep > 1" step="1">{{ $t('step1Title') }}</v-stepper-step>

          <v-stepper-content step="1">
            <v-card>
              <v-layout>
                <v-flex xs5>
                  <v-responsive>
                    <v-img :src="steps[0].url" class="grey darken-4"></v-img>
                  </v-responsive>
                </v-flex>
                <v-flex xs7>
                  <v-card-title>
                    <div class="headline">{{ $t('step1Title') }}</div>
                  </v-card-title>
                  <v-card-text>{{ $t('step1Text') }}</v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
            <v-btn color="primary" @click="helpStep = 2">{{ $t('continue') }}</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="helpStep > 2" step="2">{{ $t('step2Title') }}</v-stepper-step>
          <v-stepper-content step="2">
            <v-card>
              <v-layout>
                <v-flex xs5>
                  <v-responsive>
                    <v-img :src="steps[1].url" class="grey darken-4"></v-img>
                  </v-responsive>
                </v-flex>
                <v-flex xs7>
                  <v-card-title>
                    <div class="headline">{{ $t('step2Title') }}</div>
                  </v-card-title>
                  <v-card-text>{{ $t('step2Text') }}</v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
            <v-btn color="primary" @click="helpStep = 3">{{ $t('continue') }}</v-btn>
            <v-btn flat @click="helpStep = 1">{{ $t('cancel') }}</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="helpStep > 3" step="3">{{ $t('step3Title') }}</v-stepper-step>
          <v-stepper-content step="3">
            <v-card>
              <v-layout>
                <v-flex xs5>
                  <v-responsive>
                    <v-img :src="steps[2].url" class="grey darken-4"></v-img>
                  </v-responsive>
                </v-flex>
                <v-flex xs7>
                  <v-card-title>
                    <div class="headline">{{ $t('step3Title') }}</div>
                  </v-card-title>
                  <v-card-text>{{ $t('step3Text') }}</v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
            <v-btn color="primary" @click="helpDialog = false">{{ $t('continue') }}</v-btn>
            <v-btn flat @click="helpStep = 2">{{ $t('cancel') }}</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        {
          number: 1,
          url: require('../assets/timing-time.png')
        },
        {
          number: 2,
          url: require('../assets/timed_attack.jpg')
        },
        {
          number: 3,
          url: require('../assets/perfect-timing.jpg')
        }
      ],
      helpStep: 1,
      helpDialog: false
    };
  },
  mounted() {
    if (localStorage.helpStep) {
      this.helpStep = localStorage.helpStep;
    }
  },
  methods: {}
};
</script>