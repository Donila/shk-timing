<template>
  <v-dialog v-model="helpDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" v-bind="props">{{ $t('help') }}</v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary">
        <v-btn icon @click="helpDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('help') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn variant="text" @click="helpDialog = false">{{ $t('close') }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-container>
        <v-stepper v-model="helpStep" :direction="$vuetify.display.mdAndUp ? 'vertical' : 'horizontal'">
          <v-stepper-header>
            <v-stepper-item :complete="helpStep > 1" :value="1" :title="$t('step1Title')"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item :complete="helpStep > 2" :value="2" :title="$t('step2Title')"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item :complete="helpStep > 3" :value="3" :title="$t('step3Title')"></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item :value="1">
              <v-card>
                <v-row>
                  <v-col cols="12" md="5">
                    <v-responsive>
                      <v-img :src="steps[0].url" class="grey-darken-4"></v-img>
                    </v-responsive>
                  </v-col>
                  <v-col cols="12" md="7">
                    <v-card-title>
                      <div class="headline">{{ $t('step1Title') }}</div>
                    </v-card-title>
                    <v-card-text>{{ $t('step1Text') }}</v-card-text>
                  </v-col>
                </v-row>
              </v-card>
              <v-btn color="primary" @click="helpStep = 2">{{ $t('continue') }}</v-btn>
            </v-stepper-window-item>

            <v-stepper-window-item :value="2">
              <v-card>
                <v-row>
                  <v-col cols="12" md="5">
                    <v-responsive>
                      <v-img :src="steps[1].url" class="grey-darken-4"></v-img>
                    </v-responsive>
                  </v-col>
                  <v-col cols="12" md="7">
                    <v-card-title>
                      <div class="headline">{{ $t('step2Title') }}</div>
                    </v-card-title>
                    <v-card-text>{{ $t('step2Text') }}</v-card-text>
                  </v-col>
                </v-row>
              </v-card>
              <v-btn color="primary" @click="helpStep = 3">{{ $t('continue') }}</v-btn>
              <v-btn variant="text" @click="helpStep = 1">{{ $t('cancel') }}</v-btn>
            </v-stepper-window-item>

            <v-stepper-window-item :value="3">
              <v-card>
                <v-row>
                  <v-col cols="12" md="5">
                    <v-responsive>
                      <v-img :src="steps[2].url" class="grey-darken-4"></v-img>
                    </v-responsive>
                  </v-col>
                  <v-col cols="12" md="7">
                    <v-card-title>
                      <div class="headline">{{ $t('step3Title') }}</div>
                    </v-card-title>
                    <v-card-text>{{ $t('step3Text') }}</v-card-text>
                  </v-col>
                </v-row>
              </v-card>
              <v-btn color="primary" @click="helpDialog = false">{{ $t('continue') }}</v-btn>
              <v-btn variant="text" @click="helpStep = 2">{{ $t('cancel') }}</v-btn>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import timingTime from '../assets/timing-time.png'
import timedAttack from '../assets/timed_attack.jpg'
import perfectTiming from '../assets/perfect-timing.jpg'

export default {
  data() {
    return {
      steps: [
        { number: 1, url: timingTime },
        { number: 2, url: timedAttack },
        { number: 3, url: perfectTiming }
      ],
      helpStep: 1,
      helpDialog: false
    }
  },
  mounted() {
    if (localStorage.helpStep) {
      this.helpStep = localStorage.helpStep
    }
  },
  methods: {}
}
</script>

<style scoped>
@media (max-width: 968px) {
  .container, .v-stepper__content {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
