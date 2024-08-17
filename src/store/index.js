import Vue from "vue"
import Vuex from 'vuex';
import dictionaryModule from './module/dictionary';
 
Vue.use(Vuex);

 
const store = new Vuex.Store({
  modules: {
    dictionary: dictionaryModule
  }
});
 
export default store;