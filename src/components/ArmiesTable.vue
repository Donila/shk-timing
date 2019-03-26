<template>
  <div>
    <v-toolbar flat color="dark">
      <v-toolbar-title>Armies table</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px" persistent>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Army</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      ref="name"
                      v-model="editedItem.name"
                      label="Army name"
                      :rules="[rules.required, rules.counter]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field
                      ref="h"
                      v-model="editedItem.h"
                      label="Hours"
                      :rules="[rules.hours]"
                      :mask="numberMask"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field
                      ref="m"
                      v-model="editedItem.m"
                      label="Minutes"
                      :rules="[rules.minSec]"
                      :mask="numberMask"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field
                      ref="s"
                      v-model="editedItem.s"
                      label="Seconds"
                      :rules="[rules.minSec]"
                      :mask="numberMask"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      ref="delay"
                      type="number"
                      v-model="editedItem.delay"
                      label="Delay"
                      :rules="[rules.delay]"
                      :mask="numberMask"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      ref="speed"
                      v-model="editedItem.speed"
                      label="Speed"
                      :rules="[rules.required, rules.speed]"
                      :mask="numberMask"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="editableArmies"
      :custom-sort="customSort"
      class="elevation-2"
      hide-actions
    >
      <template v-slot:items="props">
        <td class="text-xs-left">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ whenToGo(props.item) }}</td>
        <td class="text-xs-left">{{ secondsToDuration(secondsLeft[props.item.name]) }}</td>

        <td class="text-xs-left">{{ props.item.delay }}</td>
        <td
          v-for="(speed, index) in speeds"
          :key="speed.value"
          :class="{ 'indigo darken-4': props.item.speed - 1 == index }"
        >
          <a
            @click="changeSpeed(props.item, speed.value)"
          >{{ stringifyArmyTime(buildXTable(props.item)[index]) }}</a>
        </td>
      </template>

      <template v-slot:no-data>
        <div class="text-xs-center">No armies yet...</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import * as armyHelper from '@/helpers/army';
import * as timeHelper from '@/helpers/time';

export default {
  data() {
    return {
      store: this.$root.$data,
      speeds: armyHelper.SPEEDS,

      dialog: false,
      editing: null,
      snack: false,
      snackColor: '',
      snackText: '',
      counters: [],
      intervals: [],
      headers: [
        {
          text: 'Actions',
          sortable: false,
          align: 'left'
        },
        {
          text: 'Army Name',
          align: 'left',
          value: 'name',
          sortable: false
        },
        { text: 'When to go', sortable: true, value: 'time' },
        { text: 'Countdown', sortable: true, value: 'time' },
        { text: 'Delay', value: 'delay' },
        { text: '1x', sortable: false },
        { text: '2x', sortable: false },
        { text: '3x', sortable: false },
        { text: '4x', sortable: false },
        { text: '5x', sortable: false },
        { text: '6x', sortable: false }
      ],

      editedIndex: -1,
      editedItem: {
        name: '',
        h: 0,
        m: 0,
        s: 0,
        delay: 0,
        speed: 1
      },
      defaultItem: {
        name: '',
        h: 0,
        m: 0,
        s: 0,
        delay: 0,
        speed: 1
      },

      numberMask: '##',

      rules: {
        required: value => !!value || 'Required.',
        number: value => typeof value === 'number' || 'Value must be a number',
        counter: value => value.length <= 50 || 'Max 50 characters',
        delay: value =>
          (value > -60 && value < 60) || 'Delay must be from -59 to 59',
        hours: value => !isNaN(value) || 'Hours must be number',
        minSec: value => (value > -1 && value < 60) || 'Must be from 0 to 59',
        speed: value => (value > 0 && value < 7) || 'Must be from 1 to 6'
      }
    };
  },
  methods: {
    getAttack() {
      if (this.store) {
        return this.store.getState();
      } else {
        return null;
      }
    },

    stringifyArmyTime(time) {
      return armyHelper.stringifyArmyTime(time);
    },

    editItem(item) {
      this.editedItem = { ...item };
      this.dialog = true;
      this.editing = item.name;
    },

    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.store.removeArmy(item);
    },

    close() {
      this.dialog = false;
      this.editing = null;
      setTimeout(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      }, 300);
    },

    armyValid() {
      if (
        this.editItem.h === 0 &&
        this.editItem.m === 0 &&
        this.editItem.s === 0
      ) {
        return false;
      }
      if (this.$refs && this.$refs.form) {
        return this.$refs.form.validate();
      }
      return false;
    },

    save() {
      if (this.armyValid()) {
        this.saveArmy();
      }
    },

    saveArmy() {
      let army = armyHelper.fromEditableModel(this.editedItem);
      if (this.editing) {
        this.store.editArmy(this.editing, army);
      } else {
        this.store.addArmy(army);
      }

      this.close();
    },

    buildXTable(army) {
      return armyHelper.buildXTable(army);
    },

    changeSpeed(army, speed) {
      this.store.changeSpeed(army, speed);
    },

    customSort(items, index, isDescending) {
      items.sort((a, b) => {
        if (index === 'delay') {
          if (isDescending) {
            return b.delay - a.delay;
          } else {
            return a.delay - b.delay;
          }
        }
        if (index === 'time') {
          if (isDescending) {
            return timeHelper.fullTime(b) - timeHelper.fullTime(a);
          } else {
            return timeHelper.fullTime(a) - timeHelper.fullTime(b);
          }
        }
      });

      return items;
    },

    whenToGo(army) {
      return armyHelper
        .whenToGo(army, this.store.state.time)
        .format('HH:mm:ss');
    },

    whenToGoCounter(army) {
      return armyHelper.whenToGoCounter(army, this.store.state.time);
    },

    setCountDown(army) {
      if (this.intervals[army.name]) {
        clearInterval(this.intervals[army.name]);
      }
      this.intervals[army.name] = setInterval(() => {
        const seconds = armyHelper.whenToGoCounter(army, this.store.state.time);

        this.$set(this.counters, army.name, seconds);
      }, 1000);
    },

    setCountDowns() {
      this.store.state.armies.map(this.setCountDown);
    },

    secondsToDuration(seconds) {
      return timeHelper.secondsToDuration(seconds);
    }
  },
  computed: {
    formTitle() {
      return this.editing ? 'Edit Army' : 'New Army';
    },
    editableArmies() {
      let attack = this.getAttack();
      if (attack) {
        let editable = attack.armies.map(armyHelper.toEditableModel);
        return editable;
      } else {
        return [];
      }
    },
    secondsLeft() {
      return this.counters;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    editableArmies(val) {
      this.setCountDowns();
      console.log(`army changed: ${val}`);
    }
  }
};
</script>

<style scoped>

</style>