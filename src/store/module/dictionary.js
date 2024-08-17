import { listDict } from "@/common/api/api";
const dictionary = {
    state() {
        return {
            data: {} // 初始化为空对象
        }
    },
    mutations: {
        SET_DICTIONARY(state, payload) {
            state.data = payload;
        }
    },
    actions: {
        fetchDictionary({ commit },payload) {
            // 发起网络请求并获取字典数据
            listDict({codeList:payload.items}).then(response => {
                const dictData = response.data.data;
                commit('SET_DICTIONARY', dictData);
            });
        }
    },
    getters: {
        getDictionaryItem: (state) => (code, key) => {
            if (state.data.length > 0) {
                let dict=state.data
                for (const i in state.data) {
                    if (dict[i].code == code) {
                        let items=dict[i].childrenData
                        for (const j in items) {
                           let item =items[j]
                            if (item.item == key) {
                                return item.label
                            }
                        }
                    }
                }
                return key
            }
        }
    }
}
export default dictionary;