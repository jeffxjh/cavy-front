<template>
	<div class="about">
		<el-row class="main" type="flex" justify="center">
			<el-col :span="16">
				<h5 class="title"><i class="el-icon-star-on"></i></h5>
				<div class="statement">
					<div class="item">it技术的探索者</div>
					<div class="item">座右铭：向上的路并不拥挤，而大多数人选择了安逸。</div>
				</div>
				<div class="statement">
					<div class="item">Email：fengziy@aliyun.com</div>
					<div class="item">QQ：1224971566</div>
					<div class="item">CSDN：
						<a target="_blank" href="https://blog.csdn.net/feng_zi_ye">https://blog.csdn.net/feng_zi_ye</a>
					</div>
				</div>
				<h5 class="title"><i class="el-icon-star-on"></i></h5>
				<el-card shadow="always">
					<dl class="dl-blog">
						<dt></dt>
						<dd>
							<a target="_blank" href="https://gitee.com/fengziy/Fblog"><img class="icon" src="../assets/mayun.png" alt="码云" /></a>
						</dd>
						<dt></dt>
						<dd>Vue、Vue-Router、Element-ui、Vue-i18n</dd>
						<dt></dt>
						<dd>百度分享、点击爱心特效、复制追加版权信息</dd>
					</dl>
				</el-card>
				<h5 class="title"><i class="el-icon-star-on"></i></h5>
				<el-card shadow="always">
					<el-form label-position="left" :rules="rules" label-width="80px" ref="formLabelAlign" :model="formLabelAlign">
						<el-form-item :label="" prop="name">
							<el-input v-model="formLabelAlign.name"></el-input>
						</el-form-item>
						<el-form-item :label="" prop="email">
							<el-input v-model="formLabelAlign.email"></el-input>
						</el-form-item>
						<el-form-item :label="" prop="content">
							<el-input type="textarea" v-model="formLabelAlign.content"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm('formLabelAlign')"></el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		name: 'about',
		data() {
			return {
				formLabelAlign: {
					name: '',
					email: '',
					content: ''
				},
				rules: {
					name: [{
						required: true,
						message: '',
						trigger: 'blur'
					}],
					email: [{
							required: true,
							message: '',
							trigger: 'blur'
						},
						{
							type: 'email',
							message: '',
							trigger: ['blur', 'change']
						}
					],
					content: [{
						required: true,
						message: '',
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						alert('submit!');
					} else {
						return false;
					}
				});
			}
		}
	}
</script>

<style scoped>
	.dl-blog dd {
		margin-left: 30px;
	}

	.dl-blog .icon {
		width: 20px;
		height: 20px;
	}

	.title {
		margin-top: 40px;
	}

	.statement {
		border-left: 3px solid #F56C6C;
		padding: 20px;
		background-color: #EBEEF5;
		margin-top: 20px;
	}
</style>
