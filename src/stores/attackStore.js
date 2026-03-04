import { defineStore } from 'pinia'
import { emptyAttack } from '@/helpers/attack'

export const useAttackStore = defineStore('attack', {
  state: () => emptyAttack(),

  actions: {
    getState() {
      return { ...this.$state }
    },

    setState(state) {
      this.$patch(state)
      console.log(`state changed(Whole State) to ${JSON.stringify(this.$state)}`)
    },

    addArmy(army) {
      if (army.name && !this.armies.find(a => a.name === army.name)) {
        this.armies.push(army)
        console.log(`state changed(Add Army) to ${JSON.stringify(this.$state)}`)
      } else {
        console.log('Failed add army, state unchanged')
      }
    },

    removeArmy(army) {
      this.armies = this.armies.filter(a => a.name !== army.name)
      console.log(`state changed(Remove Army) to ${JSON.stringify(this.$state)}`)
    },

    editArmy(name, army) {
      const idx = this.armies.findIndex(a => a.name === name)
      Object.assign(this.armies[idx], army)
      console.log(`state changed(Edit Army) to ${JSON.stringify(this.$state)}`)
    },

    changeSpeed(army, speed) {
      const idx = this.armies.findIndex(a => a.name === army.name)
      this.armies[idx].speed = speed
      console.log(`state changed - speed of ${JSON.stringify(this.armies[idx])}`)
    },

    newAttack() {
      this.$patch(emptyAttack())
      console.log('state changed - attack reset to empty')
    },

    changeTime(time) {
      this.time = time
      console.log(`state changed - attack time to ${time}`)
    }
  }
})
