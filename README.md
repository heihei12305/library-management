> ### 现存后端接口需求

* [软工实验A++++(2)](https://heihei12305.github.io/post/ruan-gong-shi-yan-a2-2/)
* [软工实验A++++](https://heihei12305.github.io/post/ruan-gong-shi-yan-a/)


<br/>

> ### 前端技术栈：

* 脚手架 ant design pro vue 
* 框架 vue
* 请求发送 axios
* 组件库  ant design vue

> ### 大体概述：

* 组件修改主要在：src\views 目录下,看源码的时候主要查看views文件夹下的内容就好了。

* 跨域修改在 [vue.config.js](vue.config.js) 的 93行左右修改



* <b>路由配置</b>：[src/config/router.config.js](src\config\router.config.js)

```
//例如：
 // dashboard
{
path: '/dashboard',
name: 'dashboard',
redirect: '/dashboard/workplace',
component: RouteView,
meta: { title: '图书流通', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
children: [
    {
    path: '/dashboard/insert',
    name: 'TestWork',
    component: () => import('@/views/dashboard/Insert'),
    meta: { title: '书籍信息添加', keepAlive: true, permission: [ 'dashboard' ] }
    },
    {
    path: '/dashboard/find',
    name: 'find',
    component: () => import('@/views/dashboard/Find'),
    meta: { title: '书籍信息修改', keepAlive: true, permission: [ 'dashboard' ] }
    },
    {
    path: '/dashboard/analysis',
    name: 'analysis',
    component: () => import('@/views/dashboard/Analysis'),
    meta: { title: '学生借阅管理', keepAlive: true, permission: [ 'dashboard' ] }
    }
]
},
```

#### 说明：因为采用已经很完善的脚手架，前端代码的组件跟实际功能可能相差很远。推荐阅读修改顺序：
  1. 开启服务
  2. 从网页上查看页面路由
  3. 查看路由配置（router.config.js）
  4. 在src/views下找到具体的组件。

<br/>


<br/>

* 组件部分

如果不知道组件实现什么功能，推荐搜索  ant design vue 看一看封装的单独组件，其实主要是table组件。


<br/>

由于vue技术栈，可能会比原生Js更难理解一些，看一看，尽力就好。


* 请求发送部分

登陆因为涉及权限渲染，使用的是ant design pro 把axios再封装了一次的发送方式，看起来可能比较复杂，可以跳过。<b>admin和普通用户的区分还没写！可以看[软工实验A++++(2)](https://heihei12305.github.io/post/ruan-gong-shi-yan-a2-2/)的底部部分，在info请求时根据用户名修改返回的permissions列表即可</b>

<br/>

其余大部分都是自己写的axios请求，形式上类似ajax(axios更轻量一些)

<br/>

示例：
```
 axios.post('/api/admin/searchRecord', {
    params: {
        parameter: parameter,
        queryParam:this.queryParam
    }
    }).then(result => {
    res = result.data;
    resolve(res);
    this.$refs.table.refresh(true)
    }).catch(err=>{
    res = {
        data:[
        {
        'no':'1',
        'studentNumber':1,
        'studentName':1,
        'status':1,
        'updatedAt':1,
        'action':1,
        'loanTime':1,
        'key':1,
        'editable':false
        },
        {
        'no':'12',
        'studentNumber':12,
        'studentName':12,
        'status':1,
        'updatedAt':12,
        'action':1,
        'loanTime':12,
        'key':12,
        'editable':false
        }
        ],
        pageNo:1,
        pageSize:12,
        totalCount:100,
        totalPage:12,
    }
```


### 说明：前期我没有加catch（可以理解成发送失败处理），后面的几个页面加上了（几个管理员相关的页面），可以酌情修改


<br/>

其中`.then(result=>{})`也即是后端返回的回调。


<br/>

如果发现形式有问题，想把result打印出来，看看格式，(@cc  .data.data警告)可以考虑

* `.then(result=>{console.log(result)})`,然后通过chrome的console查看。

* `.then(result=>{alert(JSON.stringify(result))})` 将json格式对象转化为字符串，alert弹窗出来看一下格式。


<br/>

### 技巧：因为可能的修改大多都是请求时未成功拿到数据，可以在 vscode 的 搜索框（左上角文件底下那个放大镜）直接搜索 axios，然后进行修改阅读。





