<template>
	<div>
		<el-menu :default-active="activeIndex" class="d-flex" mode="horizontal" router="true" type="flex">
			<el-menu-item class="mr-auto">FZY</el-menu-item>
			<el-menu-item index="/home"></el-menu-item>
			<el-menu-item index="/archive"></el-menu-item>
			<el-menu-item index="/about"></el-menu-item>
			<el-submenu>
				<template slot="title"></template>
				<el-menu-item @click="toggleLang('zh')"></el-menu-item>
				<el-menu-item @click="toggleLang('en')"></el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: '/home'
			};
		},
		methods: {
			toggleLang(lang) {
				if(lang === 'zh') {
					localStorage.setItem('locale', 'zh')
					this.$i18n.locale = localStorage.getItem('locale')
					this.$message({
						message: '切换为中文！',
						type: 'success'
					})
				} else if(lang === 'en') {
					localStorage.setItem('locale', 'en')
					this.$i18n.locale = localStorage.getItem('locale')
					this.$message({
						message: 'Switch to English!',
						type: 'success'
					})
				}
			}
		}
	}
</script>

<style scoped>

</style>
