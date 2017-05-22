# gulp-front-ui
>基于gulp的前端页面工作流

#### 1. 配置环境
**nodejs + npm**
[https://nodejs.org/en/](https://nodejs.org/en/)

**git**
[https://git-scm.com/](https://git-scm.com/)

#### 2. clone code
```cmd
$ git clone https://github.com/cesc-yu/gulp-front-ui.git
```

#### 3. 安装依赖包
```cmd
$ npm install
```

#### 4. 运行
````cmd
// 实时刷新浏览器
$ gulp
or
$ gulp run

// 合并css
$ gulp concat-css

// 合并css，并生成html文件，替换css引用路径
$ gulp concat-all

// css 代码风格检测
$ lint-css

// js 代码风格检测
$ lint-js

// 编译es6代码
$ babel-js
````
