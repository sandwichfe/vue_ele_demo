import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        realPath: "D:",

        goP:"http://192.168.31.215:6688/"
    },
    mutations: {
        changeP(state, p) {
            if (p == true) {
                state.realPath = "D:";
            } else if (p == false) {
                state.realPath = "E:";
            }
        }
    },
    actions: {},
    modules: {}
})
