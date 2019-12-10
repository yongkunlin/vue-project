<!--template 组件容器 不会渲染至视图-->
<template>
  <div class="login_wrapper">
    <div class="login">
      <!--      :model 模型绑定 formLogin 没啥用-->
      <!--      el- 开头的标签为使用element框架插件-->
      <el-form :model="formLogin">
        <el-form-item>
          <h2 class="title">登录</h2>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.loginName" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登陆</el-button>
          <span v-show="this.errorInfo.isShowError" class='error'>
            {{this.errorInfo.text}}
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    // apis中定义了请求接口 调用即可实现请求功能
    import apis from '../apis/apis';
    // 默认导出组件 一个组件中只能存在一个
    export default {
        name: 'login',
        data() {
            return {
                formLogin: {   //表单对象
                    loginName: 'admin',
                    password: '123456'
                },
                errorInfo: {
                    text: '登陆失败,请重试',
                    isShowError: false //显示错误提示
                }

            }
        },
        created() { // html加载完成之前，执行。执行顺序：父组件-子组件

        },
        mounted() { // html加载完成后执行。执行顺序：子组件-父组件
            // 监听按键
            document.onkeydown = (event) => {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 13 && this.$route.path === '/login') { // enter 键
                    this.login();
                }
            };
            this.test();
        },
        methods: { // 事件方法执行
            login() {
                //调用后端登陆接口
                apis.shiroApi.loginIn(this.formLogin)
                    .then((data) => {
                        console.log('success:', data);
                        if (data && data.data) {
                            var json = data.data;
                            if (json.status === 'SUCCESS') {
                                this.$common.setSessionStorage('token', json.data.userInfo.token);
                                this.$common.setSessionStorage('username', json.data.userInfo.userName);
                                this.$common.setSessionStorage('lev', json.data.sysRoleVoList);
                                //存入菜单,渲染菜单
                                this.$store.dispatch("add_Menus", json.data.sysMenuVoList);

                                //动态设置路由
                                this.$store.dispatch("add_Routes", json.data.sysMenuVoList);
                                this.$router.replace({path: "/index"});
                                return;
                            } else if (json.message) {
                                this.errorInfo.text = json.message;
                            }
                        }
                        this.errorInfo.isShowError = true;
                        this.$store.dispatch("loginLog", loginLog);
                    })
                    .catch((err) => {
                        console.log('error:', err);
                        this.errorInfo.isShowError = true;
                        this.errorInfo.text = '系统接口异常';
                    });

            },
            test() {
                apis.testApi.test()
                    .then((data) => {
                        console.log(data);
                    }).catch((err) => {
                    console.log('error:', err);
                    this.errorInfo.isShowError = true;
                    this.errorInfo.text = '系统接口异常';
                });
            }
        },
        // watch() { // watch是去监听一个值的变化，然后执行相对应的函数。
        //
        // },
        // computed() { // computed是计算属性，也就是依赖其它的属性计算所得出最后的值
        //
        // }
    }
</script>
<!--scoped只让样式渲染本组件，不会全局渲染-->
<!--lang="scss" 好像是某种css动态语句的插件-->
<!--官方定义 Sass 是一款强化 CSS 的辅助工具，它在 CSS 语法的基础上增加了变量 (variables)、嵌套 (nested rules)、混合 (mixins)、导入 (inline imports) 等高级功能，这些拓展令 CSS 更加强大与优雅。使用 Sass 以及 Sass 的样式库（如 Compass）有助于更好地组织管理样式文件，以及更高效地开发项目。-->
<style lang="scss" scoped>
  $input_width: 300px;

  .login_wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .login {
      width: 460px;
      height: 350px;
      // margin-top: -150px;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;

      .title {
        text-align: center;
        color: #505458;
      }

      .el-form-item__content {
        width: $input_width;
      }

      .el-button {
        width: $input_width;
      }

      .el-form {
        margin: 30px 80px auto 80px;

        .error {
          display: block;
          text-align: center;
          color: red;
        }
      }
    }
  }

  .recover {
    position: absolute;
    bottom: 0;
    cursor: pointer;
    color: #E6A23C;
    // display: none;
  }

  .bei {
    position: absolute;
    bottom: 20px;
    cursor: pointer;
    color: #505458;
  }
</style>
