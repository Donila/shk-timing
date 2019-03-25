import * as defaults from '@/helpers/attack'

let store = {
  state: defaults.emptyAttack(),

  getState() {
    return { ...this.state };
  },

  setState(state) {
    this.state = state;

    console.log(`state changed(Whole State) to ${JSON.stringify(this.state)}`);
  },

  addArmy(army) {
    if (army.name && this.state.armies.map((a) => a.name).indexOf(army.name) < 0) {
      this.state.armies.push(army)
      console.log(`state changed(Add Army) to ${JSON.stringify(this.state)}`);
    } else {
      console.log('Failed add army, state unchanged')
    }
  },

  removeArmy(army) {
    this.state.armies = this.state.armies.filter((a) => a.name !== army.name)

    console.log(`state changed(Remove Army) to ${JSON.stringify(this.state)}`);
  },

  editArmy(name, army) {
    let index = this.state.armies.findIndex(a => a.name === name)
    Object.assign(this.state.armies[index], army)

    console.log(`state changed(Edit Army) to ${JSON.stringify(this.state)}`);
  }
}

export default store