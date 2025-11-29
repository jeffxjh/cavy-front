import { listDict } from '@/common/api/api';

const dictionary = {
    state() {
        return {
            data: {}, // 初始化为空对象
        };
    },
    mutations: {
        SET_DICTIONARY(state, payload) {
            state.data = payload;
        },
    },
    actions: {
        fetchDictionary({ commit }, payload) {
            // 发起网络请求并获取字典数据
            listDict({ codeList: payload.items }).then((response) => {
                const dictData = response.data.data;
                commit('SET_DICTIONARY', dictData);
            });
        },
    },
    getters: {
        fmtDic: (state) => (code, key) => {
            // 修复：检查对象是否为空，而不是检查 length
            if (state.data && Object.keys(state.data).length > 0) {
                let dict = state.data;

                // 根据你的数据结构调整遍历方式
                for (const dictKey in dict) {
                    let dictItem = dict[dictKey];
                    // 根据你的实际数据结构调整条件
                    if (dictItem.code === code) {
                        let items = dictItem.childrenData || [];
                        for (const item of items) {
                            if (item.item == key || item.value == key) {
                                return item.label || item.name;
                            }
                        }
                    }
                }
                return key;
            }
            return key; // 如果字典数据为空，返回原值
        },
    },
};

export default dictionary;
