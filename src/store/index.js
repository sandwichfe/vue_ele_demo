import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        realPath: "root",
        goP:"http://192.168.8.68:6694/"
    },
    mutations: {
        changeP(state, p) {
            state.realPath = p;
        }
    },
    actions: {},
    modules: {}
})
