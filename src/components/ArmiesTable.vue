<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>{{ $t('armiesTable') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog
        v-model="dialog"
        max-width="500px"
        persistent
        :fullscreen="$vuetify.display.xs"
      >
        <template v-slot:activator="{ props }">
          <v-btn color="light-blue-accent-4" variant="flat" class="mb-2" v-bind="props">{{ $t('newArmy') }}</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      ref="name"
                      v-model="editedItem.name"
                      :label="$t('armyName')"
                      :rules="[rules.required, rules.counter]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      ref="h"
                      v-model="editedItem.h"
                      :label="$t('hours')"
                      :rules="[rules.hours]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      ref="m"
                      v-model="editedItem.m"
                      :label="$t('minutes')"
                      :rules="[rules.minSec]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      ref="s"
                      v-model="editedItem.s"
                      :label="$t('seconds')"
                      :rules="[rules.minSec]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      ref="delay"
                      v-model="editedItem.delay"
                      :label="$t('delay')"
                      :rules="[rules.delay]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      ref="speed"
                      v-model="editedItem.speed"
                      :label="$t('speed')"
                      :items="speeds"
                      item-title="text"
                      item-value="value"
                      :rules="[rules.required]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <div class="text-body-2 text-medium-emphasis mb-2">Color</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                      <span
                        v-for="c in paletteColors"
                        :key="c.value"
                        :title="c.name"
                        :style="{
                          backgroundColor: c.value,
                          width: '28px',
                          height: '28px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          boxSizing: 'border-box',
                          border: editedItem.color === c.value ? '3px solid white' : '3px solid transparent',
                          outline: editedItem.color === c.value ? '2px solid ' + c.value : '2px solid transparent',
                        }"
                        @click="editedItem.color = c.value"
                      ></span>
                      <v-btn v-if="editedItem.color" size="x-small" variant="text" @click="editedItem.color = null">Clear</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close">{{ $t('cancel') }}</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="save">{{ $t('save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="editableArmies"
      class="elevation-2"
      :items-per-page="-1"
      hide-default-footer
    >
      <template v-slot:item="{ item }">
        <tr :style="item.color ? { backgroundColor: item.color + '55' } : {}"  >
          <td>
            <v-icon size="small" class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
          <td>{{ item.name }}</td>
          <td class="text-left">{{ whenToGo(item) }}</td>
          <td class="text-left">{{ secondsToDuration(secondsLeft[item.name]) }}</td>
          <td class="text-left">{{ item.delay }}</td>
          <td
            v-for="(speed, index) in speeds"
            :key="speed.value"
            :class="{ 'bg-indigo-darken-4': (item.speed ?? 1) - 1 == index }"
          >
            <a style="cursor: pointer" @click="changeSpeed(item, speed.value)">{{ stringifyArmyTime(buildXTable(item)[index]) }}</a>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        <div class="text-center">{{ $t('noArmies') }}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import * as armyHelper from '@/helpers/army'
import * as timeHelper from '@/helpers/time'
import { useAttackStore } from '@/stores/attackStore'
import { logEvent } from '@/lib/events'

export default {
  data() {
    return {
      store: useAttackStore(),
      speeds: armyHelper.SPEEDS,
      paletteColors: [
        { name: 'Red', value: '#F44336' },
        { name: 'Pink', value: '#E91E63' },
        { name: 'Purple', value: '#9C27B0' },
        { name: 'Indigo', value: '#3F51B5' },
        { name: 'Blue', value: '#2196F3' },
        { name: 'Light Blue', value: '#03A9F4' },
        { name: 'Cyan', value: '#00BCD4' },
        { name: 'Teal', value: '#009688' },
        { name: 'Green', value: '#4CAF50' },
        { name: 'Light Green', value: '#8BC34A' },
        { name: 'Yellow', value: '#FFEB3B' },
        { name: 'Amber', value: '#FFC107' },
        { name: 'Orange', value: '#FF9800' },
        { name: 'Deep Orange', value: '#FF5722' },
        { name: 'Brown', value: '#795548' },
        { name: 'Blue Grey', value: '#607D8B' },
        { name: 'Grey', value: '#9E9E9E' },
      ],

      dialog: false,
      editing: null,
      snack: false,
      snackColor: '',
      snackText: '',
      counters: {},
      intervals: {},

      editedIndex: -1,
      editedItem: {
        name: '',
        h: 0,
        m: 0,
        s: 0,
        delay: 0,
        speed: 1,
        color: null
      },
      defaultItem: {
        name: '',
        h: 0,
        m: 0,
        s: 0,
        delay: 0,
        speed: 1,
        color: null
      },

      rules: {
        required: value => !!value || this.$t('required'),
        number: value =>
          typeof value === 'number' || this.$t('valueMustBeANumber'),
        counter: value => value.length <= 50 || this.$t('maxCharacters'),
        delay: value => (value >= 0 && value < 60) || this.$t('delayMustBe'),
        hours: value => !isNaN(value) || this.$t('valueMustBeANumber'),
        minSec: value => (value > -1 && value < 60) || this.$t('minSecMustBe'),
        speed: value => (value > 0 && value < 7) || this.$t('speedMustBe')
      }
    }
  },
  mounted() {},
  methods: {
    getAttack() {
      if (this.store) {
        return this.store.getState()
      } else {
        return null
      }
    },

    stringifyArmyTime(time) {
      return armyHelper.stringifyArmyTime(time)
    },

    editItem(item) {
      logEvent('army_edit_button_press', { army_name: item.name })
      this.editedItem = { ...item, speed: 1, color: item.color || null }
      this.dialog = true
      this.editing = item.name
    },

    deleteItem(item) {
      if (confirm(this.$t('deleteConfirm'))) {
        logEvent('army_delete', item)
        this.store.removeArmy(item)
      }
    },

    close() {
      this.dialog = false
      this.editing = null
      setTimeout(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      }, 300)
    },

    armyValid() {
      if (
        this.editItem.h === 0 &&
        this.editItem.m === 0 &&
        this.editItem.s === 0
      ) {
        return false
      }
      if (this.$refs && this.$refs.form) {
        return this.$refs.form.validate()
      }
      return false
    },

    save() {
      if (this.armyValid()) {
        this.saveArmy()
      }
    },

    saveArmy() {
      let army = armyHelper.fromEditableModel(this.editedItem)
      if (this.editing) {
        logEvent('army_edit', army)
        this.store.editArmy(this.editing, army)
      } else {
        logEvent('new_army_save', army)
        this.store.addArmy(army)
      }

      this.close()
    },

    buildXTable(army) {
      return armyHelper.buildXTable(army)
    },

    changeSpeed(army, speed) {
      logEvent(`speed_change_${speed}x`, { army_name: army.name })
      this.store.changeSpeed(army, speed)
    },

    whenToGo(army) {
      return armyHelper
        .whenToGo(army, this.store.time)
        .format('HH:mm:ss')
    },

    whenToGoCounter(army) {
      return armyHelper.whenToGoCounter(army, this.store.time)
    },

    setCountDown(army) {
      if (this.intervals[army.name]) {
        clearInterval(this.intervals[army.name])
      }
      this.intervals[army.name] = setInterval(() => {
        const seconds = armyHelper.whenToGoCounter(army, this.store.time)
        this.counters[army.name] = seconds
      }, 1000)
    },

    setCountDowns() {
      this.store.armies.map(this.setCountDown)
    },

    secondsToDuration(seconds) {
      return timeHelper.secondsToDuration(seconds)
    }
  },
  computed: {
    formTitle() {
      return this.editing ? this.$t('editArmy') : this.$t('newArmy')
    },
    editableArmies() {
      let attack = this.getAttack()
      if (attack) {
        return attack.armies.map(army => ({
          ...armyHelper.toEditableModel(army),
          whenToGo: armyHelper.whenToGo(army, this.store.time).valueOf(),
          countdown: armyHelper.whenToGoCounter(army, this.store.time)
        }))
      } else {
        return []
      }
    },
    secondsLeft() {
      return this.counters
    },
    headers() {
      return [
        {
          title: this.$t('actions'),
          key: 'actions',
          sortable: false,
          align: 'start'
        },
        {
          title: this.$t('armyName'),
          align: 'start',
          key: 'name',
          sortable: true,
        },
        { title: this.$t('whenToGo'), key: 'whenToGo', sortable: true },
        { title: this.$t('countdown'), key: 'countdown', sortable: true },
        { title: this.$t('delay'), key: 'delay', sortable: true },
        { title: '1x', key: 'x1', sortable: false },
        { title: '2x', key: 'x2', sortable: false },
        { title: '3x', key: 'x3', sortable: false },
        { title: '4x', key: 'x4', sortable: false },
        { title: '5x', key: 'x5', sortable: false },
        { title: '6x', key: 'x6', sortable: false }
      ]
    }
  },
  watch: {
    dialog(val) {
      if (val && !this.editing) logEvent('new_army_button_press')
      val || this.close()
    },
    editableArmies() {
      this.setCountDowns()
    }
  }
}
</script>

<style scoped>
</style>
