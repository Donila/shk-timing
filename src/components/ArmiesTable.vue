<template>
  <div>
    <v-toolbar flat color="dark">
      <v-toolbar-title>Armies table</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
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
    >
      <template v-slot:items="props">
        <td class="text-xs-left">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ humanizeArmyTime(props.item.h, props.item.m, props.item.s) }}</td>
        <td class="text-xs-left">{{ props.item.delay }}</td>
        <td class="text-xs-left">{{ props.item.speed }}</td>
      </template>

      <template v-slot:no-data>
        <div class="text-xs-center">No armies yet...</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import * as armyHelper from '@/helpers/army';

export default {
  data() {
    return {
      store: this.$root.$data,
      //armies: [],

      dialog: false,
      editing: null,
      snack: false,
      snackColor: '',
      snackText: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
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
          sortable: true
        },
        { text: 'Time' },
        { text: 'Delay', value: 'delay' },
        { text: 'Speed', value: 'speed' }
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
        counter: value => value.length <= 20 || 'Max 20 characters',
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
    humanizeArmyTime(h, m, s) {
      return armyHelper.humanizeArmyTime(h, m, s);
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
    formValid() {
      if (this.$refs && this.$refs.form) {
        return this.$refs.form.validate();
      }
      return false;
    },
    save() {
      if (this.formValid()) {
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
      this.armies = this.editableArmies;
      this.close();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    customSort(items, index, isDescending) {
      // The following is informations as far as I researched.
      // items: 'food' items
      // index: Enabled sort headers value. (black arrow status).
      // isDescending: Whether enabled sort headers is desc
      items.sort((a, b) => {
        if (index === 'delay') {
          if (isDescending) {
            return b.calories - a.calories;
          } else {
            return a.calories - b.calories;
          }
        }
      });

      return items;
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
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  }
};
</script>

<style scoped>

</style>