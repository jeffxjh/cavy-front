export default {
    data() {
        return { btnSize: "small" }
    },
    methods: {
        randomString(encode = 36, number = -8) {
            return Math.random() // 生成随机数字,
                .toString(encode) // 转化成36进制
                .slice(number)
        }
    }
}