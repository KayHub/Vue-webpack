## `MVC和MVVM：

* MVVM是前端视图层的分层开发思想，主要把页面分为了M(Model)、V(View)、VM(ViewModel)，其中VM是MVVM的核心思想，是M(模型)和V(视图)之间的调度者
* M(模型)是每个页面中单独保存的数据模型，V是每个页面中的视图结构(HTML结构)，VM则是一个中间调度者，分隔了M和V，每当V(视图层)想要获取或保存数据时，都要由VM来做中间处理

* 数据的双向绑定由vm实例提供 





##  Vue中的对象数组使用注意事项：

<font color='red'>Vue中的数组在某些情况下无法实现数据更新触发视图更新，由于JavaScript的限制，Vue不能检测以下数组的变动：</font>

 1. 当你利用数组的索引直接为某一项赋值时：

    ```js
    vm.arr[index] = newValue
    ```

	2.	当你修改数组的长度时：

    ```javascript
    vm.arr.length = newLength
    ```

举个例子：

```js
const vm = new Vue({
	data:{
		arr:['a','b','c']
	}
})
vm.arr[0] = 'x' //不会触发视图更新
vm.arr.length = 5 //不会触发视图更新
```



为了解决第一个问题，以下两种方法都可以实现和 `vm.arr[index] = newLength` 相同的效果，同时也会触发状态更新：

```javascript
// Vue.set
Vue.set(vm.arr,index,newValue)

// Array.prototype.splice
vm.arr.splice(index,1,newValue)
```

也可以使用 `vm.$set` 实例方法，该方法是全局方法 `Vue.set` 的一个别名：

```javascript
vm.$set(vm.arr,index,newValue)
```

为了解决第二个问题，可以使用 `splice`：

```javascript
vm.arr.splice(newLength)
```



<font color='red'>对象更改检测注意事项：</font>

还是由于JavaScript的限制，**Vue不能检测对象属性的添加或删除**：

```js
const vm = new Vue({
    data:{
        message:'hello world' //此时message会触发视图更新
    }
})
vm.date = '2019/04/24' //vm.date不会触发视图更新
```

对于已经创建的实例，Vue不能动态添加**根级别**的响应式属性。但是可以使用 `Vue.set(object,key,value)` 方法向**嵌套对象**添加响应式属性。例如：

```js
const vm = new Vue({
    data:{
        info:{ //此时info属于data中的嵌套对象
            message:'hello world'
        }
    }
})
```

此时可以使用 `Vue.set` 方法添加一个新的date属性到嵌套的 `info` 对象：

```js
Vue.set(vm.info,'date','2019/04/24')
```

还可以使用 `vm.$set` 实例方法，它只是全局 `Vue.set` 的别名：

```js
vm.$set(vm.info,'date','2019/04/24')
```

有时可能需要为已有对象赋予多个新属性，比如使用 `Object.assign()` 或 `_.extend()`

在这种情况下，应该用两个对象的属性创建一个新的对象。所以，如果想添加新的响应式属性，**不要这样**：

```js
Object.assign(vm.info,{
    date:'2019/04/24',
    day:'星期三'
})
```

应该这样做：

```js
vm.info = Object.assgin({},vm.info,{
    date:'2019/04/24',
    day:'星期三'
}) //利用为数组或对象赋值重新赋值的方式触发视图更新
```



<font color='red'>Vue可以监测到数组变化的 数组原生方法 (这些方法 **会触发** 视图更新)：</font>

`splice()、push()、pop()、shift()、unshift()、sort()、reverse()`

也可以使用 `this.$forceUpdate()` 强制重新渲染Vue实例，并且不会影响其他组件





##  Vue结构、基本指令：

当导入 Vue.js 之后，在浏览器内存中的window对象就多了一个 **Vue构造函数**



#####  Vue基本结构：

```html
<div id='app'>
    {{ message }}
</div>
```

```js
const vm = new Vue({
    el:'#app',
    data:{
        // data 属性中存放的是el中要用到的数据
        message:'hello world',
        title:'这是一个标题'
    },
    methods:{
        // methods 中定义了当前 Vue 实例所有可用的方法
        showMessage(){
            console.log(this.message)
        }
    }
})
```



vue实例所控制的元素区域就是 **V(View)**，Vue实例对象就是 **VM(View-Model)**，Vue实例对象中的data属性就是**M(Model)**



#####  Vue生命周期：

从Vue实例创建、运行、到销毁期间，会伴随着各种各样的事件，这些事件统称为生命周期钩子函数

```js
const vm = new Vue({
    el:'#app',
    data:{},
    methods:{},
    beforeCreate(){
        //第一个被执行的生命周期钩子，在实例创建时会被执行
        //在beforeCreate执行时，data和methods中的数据和方法都还未被初始化，所以无法访问
    },
    created(){
        //第二个被执行的生命周期钩子
        //在created中，data和methods中的数据和方法都已经初始化完毕
        //如果要操作data和methods中的数据或方法，最早只能在created中进行
    },
    beforeMount(){
        //第三个被执行的生命周期钩子
        //表示DOM模板已在内存中编译完成，但尚未将模板渲染到页面中，页面中的内容还未被替换，只是之前写的一些插值表达式或模板字符串
    },
    mounted(){
        //第四个被执行的生命周期钩子
        //表示内存中的模板已经渲染到页面中，用户已经能够看到渲染好的页面
    },
    // mounted是实例创建期间执行的最后一个生命周期钩子，当执行完mounted就代表实例已经完全的创建完成
    // 如果要通过某些插件操作页面上的DOM节点，最早只能在mounted中进行
    // 当执行完mounted就表示整个Vue实例初始化完毕，此时组件已经脱离了创建阶段，进入到运行阶段
    
    //Vue实例运行时的两个钩子
    beforeUpdate(){
        //在beforeUpdate执行时，页面中的数据还没有被更新，但是data内存中的数据已经更新了，页面还尚未和data中最新的数据保持一致
    },
    updated(){
        //在updated执行时，页面和data中的数据已保持同步，都是最新的数据
    },
    
    //Vue实例销毁时的两个钩子
    beforeDestroy(){
        //在beforeDestroy执行时，Vue实例就已经从运行阶段进入到了销毁阶段
        //当执行beforeDestroy时，实例中的data和所有的methods以及过滤器、自定义执行、组件...等都处于可用状态，此时还没有真正执行销毁的过程
    },
    destroyed(){
        //在执行destroyed时，组件已经被完全销毁了，实例中的data和所有的methods以及过滤器、自定义指令、组件...等都不可用了
    }
})
```





#####  Vue基本指令：

* **v-cloak**

  ```html
  <div v-cloak>
      {{ messgae }}
  </div>
  ```

  ```css
  div[v-cloak]{
      display:none;
  }
  ```

  利用 **v-cloak** 配合属性选择器加css样式 `display:none;` 可以解决 **页面加载时插值表达式闪烁** 问题

  

* **v-text：**

  ```html
  <div v-text='message'>
      我会被v-text指令中的数据替换掉
  </div>
  ```

  v-text和v-cloak的区别：

  &emsp; &emsp; v-text默认没有闪烁问题，但是v-cloak可以在插值表达式前后添加任意内容，只会替换自己的插值表达式占位符，v-text则等同于innerText，会覆盖替换元素中的所有内容。

  

* **v-html：**

  ```html
  <div v-html='documentFragment'>
      我会被v-html指令中的数据替换掉
  </div>
  ```

  v-html也会覆盖元素中的所有内容，同时会将数据当做html片段解析执行，等同于innerHTML

  

* **v-bind：**

  ```html
  <button v-bind:title='myTitle'>
      touchMe
  </button>
  ```

  v-bind 是用于绑定 **HTML标签属性** 的指令，将data中的属性赋值给HTML中的标签属性，也可以在绑定的html属性值中使用 **JavaScript合法表达式**，例如：

  ```html
  <button v-bind:title='myTitle + "newTitle"'>
      touchMe
  </button>
  ```

  v-bind可以简写为 **:要绑定的属性**，例如：

  ```html
  <button :title='myTitle'>
      touchMe
  </button>
  ```

  

* **v-on：**

  Vue中提供了 **v-on事件绑定机制**，例如`v-on:click='getUserInfo'`

  ```html
  <button type='button' v-on:click='getUserInfo'>
      获取用户信息
  </button>
  ```

  v-on传递事件源是用$event，例如：

  ```html
  <button type='button' v-on:click='getUserInfo($event)'>
      获取用户信息
  </button>
  ```

  v-on的缩写是@，例如：

  ```html
  <button type='button' @click='getUserInfo'>
      获取用户信息
  </button>
  ```

  在Vue中使用事件绑定机制，为HTML标签指定事件处理函数的时候，在事件名后加 **()** 就可以传递参数了，例如：

  ```html
  <ul v-for='(item,index) in info' :key='info.id'>
      <li @click='getCurrentIndex(index)'>我是li</li>
  </ul>
  ```



* **v-model：**

  使用 `v-model` 指令，可以实现表单元素和 Model 中数据的双向绑定，例如：

  ```html
  <textarea v-model='feedback' placeholder='请输入反馈内容'></textarea>
  ```

  注：*`v-model` 只能运用在表单元素中*

  

* **v-for：**

  ```js
  const vm = new Vue({
      el:'#app',
      data:{
          numList:[1,2,3,4,5],
          userInfo:{
              id:0,
              name:'Tony Stark'
          },
          userList:[
              { id:0,name:'I’m Alive' },
              { id:1,name:'Dirt & Roses' },
              { id:2,name:'Breath' },
          ]
      },
      methods:{
          getCount(){
              return 10-5
          },
      }
  })
  ```

  ```html
  <div id='app'>
      <div v-for='item in numList' :key='item'>
          {{ item }} 
      </div>
      <div v-for='item in userInfo' :key='item'>
          {{ item }}
      </div>
      <div v-for='(item,index) in userLust' :key='item.id'>
          {{ item.name }}
      </div>
  </div>
  ```

  

  v-for还可以循环到指定的数值，例如：

  ```html
  <div id='app'>
      <div class='n in 10' :key='n'>
          第{{ n }}次循环
      </div> 
  </div>
  ```

  注： *若 v-for迭代到指定的数值，则 n默认从1开始*

  ​		 *v-for循环中，key属性值只能为 Number 或 String*

  

  v-for的循环目标也可以是methods中方法的返回值：

  ```html
  <div id='app'>
      <div v-for='n in getCount()' :key='n'>
          第{{ n }}次循环
      </div>
  </div>
  ```

  

* **v-if：**

  如果条件为 true，则创建dom元素，如果为 false，则删除dom元素。特点是每次都会进行dom的创建或删除

  ```html
  <div v-if='isTrue'>
      这是一个v-if控制的元素
  </div>
  ```

  

* **v-show：**

  如果条件为 true，则显示dom元素，如过为 false，则隐藏dom元素。特点是通过 `display:block;` 和 `display:none;` 控制的，不会进行dom的创建或删除

  ```html
  <div v-show='isTrue'>
      这是一个v-show控制的元素
  </div>
  ```




#####  自定义全局指令：

<font color='red'>注：Vue中所有的指令，在调用的时候都必须以 **v-** 开头</font>



如何自定义：

使用`directive()`定义全局指令。

```js
Vue.directive('指令名称',{
    
})
//参数1为指令名称，参数2是一个对象，对象中是自定义指令相关的函数
//参数2对象中的函数可以在特定的阶段执行相关的操作
```

<font color='red'>注：在定义指令时，指令名称不能加**v-前缀**，在调用的时候，**必须在指令前缀**</font>

自定义指令有以下生命周期函数：

```js
Vue.directive('指令名称',{
    bind(element,binding){
        //当指令绑定到元素上时，会立即执行bind方法，只执行一次
        //和js属性相关的操作，一般都可以在bind中执行
    },
    inserted(element,binding){
        //当元素插入到dom中时会执行inserted方法，只执行一次
        //和js行为相关的操作，最好在inserted中执行，防止js行为不生效
    },
    update(element,binding){
        //当VNode更新的时候会执行update方法，可能执行多次
    }
})
```

在每个自定义指令生命周期函数中，第一个参数是固定的，表示指令绑定的目标元素，是dom对象。第二个参数是binding对象，binding对象的属性有：

```js
name:'指令名称', //不包含v-
value:'指令绑定的值计算后的结果',
expression:'绑定的值的初始形态'
```



自定义全局指令如何传参：

```html
<div v-color='"red"'>
    我是一个div
</div>
```

```js
Vue.directive('color',{
    bind(element,binding){
        element.style.color=binding.value
    },
    inserted(element,binding){
        // todo
    },
    update(element,binding){
        // todo
    }
})
```

<font color='red'>注：所有全局自定义指令和全局过滤器都要放在Vue代码的最上方</font>

自定义全局指令简写方式：

```js
Vue.directive('color',function(element,binding){
    element.style.color=binding.value
}) //等价于在bind钩子和update钩子中同时创建了该函数
```



#####  自定义私有指令：

```js
const vm = new Vue({
    el:'#app',
    directives:{ //自定义私有指令
        'color':{
            bind(element,binding){
                element.style.color=binding.value
            },
            inserted(element,binding){
                // todo
            },
            update(element,binding){
                // todo
            }
        }
    }
})
```





##  Vue中css样式与class的使用：

#####  使用class类：

* **以数组的形式添加class：**

  ```html
  <div :class="['className1','className2']">
      我是一个div
  </div>
  ```

  数组中的className为 **String** 类型，如果不是String类型，则会从Vue实例中的data属性或者methods中查找对应的属性名或方法名

  

* **在class类中的数组内使用三元表达式：**

  ```html
  <div :class="['className1',isTrue?'className2':'']">
      我是一个div
  </div>
  ```

  

* **在class类中的数组内使用对象：**

  ```html
  <div :class="['className1',{'className2':isTrue}]">
      我是一个div
  </div> <!-- 效果与class类中使用三元表达式相同 -->
  ```

  

* **在class类中直接使用对象：**

  ```html
  <div :class="{'className1':isTrue,'className2':isTrue}">
      我是一个div
  </div>
  ```

  

* **在class类种也可以直接使用data内的数据对象：**

  ```html
  <div :class='classList'>
      我是一个div
  </div>
  ```

  ```js
  const vm = new Vue({
      data:{
          classList:{
              className1:true,
              className2:false
          }
      }
  })
  ```

  

#####  使用v-bind绑定内联样式：

```html
<div :style='{color:"red","font-size":"24px",width:currentWidth}'>
    我是一个div <!-- width的属性currentWidth则引用data或methods的属性 -->
</div>
```

注：如果style绑定的对象中的属性是直接赋值，则为 **String** 类型，否则将在data或methods中引用对应的属性或方法名



在内联样式中使用多个对象：

```html
<div :style='[data中的数据对象，data中的数据对象]'>
    我是一个div
</div>
```



绑定的style属性和绑定的class类中都可以使用methods中的方法：

```html
<div id='app'>
    <div id='first' :style='{color:red()}'>
        我是first
    </div>
    <div id='last' :class='blue()'>
        我是last
    </div>
</div>
```

```css
.blue{
    color:blue;
}
```

```js
const vm = new Vue({
    el:'#app',
    data:{},
    methods:{
        red(){
            return 'red'
        },
        blue(){
            return 'blue'
        }
    }
})
```





##  Vue过滤器：

Vue可以自定义过滤器，可被用作一些常见的文本格式化 (如时间格式化)，

<font color='red'>注：过滤器只能在两个地方使用，插值表达式和v-bind表达式</font>

#####  如何定义全局过滤器：

```js
Vue.filter('filterName',function(data,arg){
    // data是通过表达式中的|(管道符)传递过来的参数,是固定的
})
```

如何使用：

```html
<div>
    {{ name | filterName(arg,...) }}
</div>
```

在一个表达式中使用多个过滤器：

```html
<div>
    {{ name | filterName(arg,...) | filterName2(arg,...) }}
</div>
```

过滤器的执行顺序是从左向右的。

**全局过滤器必须定义到vue代码的最上方。**



#####  如何定义私有过滤器：

在Vue实例中定义filters属性：

```js
const vm = new Vue({
    filters:{
        filterName(data){
            // todo
            return data
        }
    }
})
```

调用过滤器时，采用的是就近原则，如果私有过滤器和全局过滤器名称一致，则优先调用私有过滤器。





## Vue修饰符：

#####  事件修饰符：

- **.stop (阻止事件冒泡)：**

  ```html
  <div @click='parentClick'>
      <div @click.stop='childClick'>
          我的冒泡行为会被.stop修饰符阻止,不再会触发祖先元素的click事件
      </div>
  </div>
  ```

  

- **.prevent (阻止默认行为)：**

  ```html
  <a href='https://www.baidu.com' @click.prevent='showConsole'>
  	我的默认跳转行为会被.prevent修饰符阻止，不再会出现跳转行为
  </a>
  ```

  

- **.capture (按照事件捕获顺序从外向内触发)：**

  事件捕获默认是从 **外层祖先元素向内层后代元素逐级捕获**

  事件冒泡则是 **先从外层祖先元素向内层后代元素逐级捕获，再由最内层后代元素向外层祖先元素逐级冒泡触发**

  `.capture` 则是 **将其绑定的事件** 在捕获阶段直接触发

  ```html
  <div id='app' @click='parentClick'>
      <div @click.capture='firstClick'>
          <div @click='lastClick'>
              clickMe
          </div>
      </div>	<!-- 输出顺序为 first last parent -->
  </div>
  ```

  ```js
  const vm = new Vue({
      el:'#app',
      methods:{
          parentClick(){
              console.log('parent')
          },
          firstClick(){
              console.log('first')
          },
          lastClick(){
              console.log('last')
          },
      }
  })
  ```

  

- **.self (只有点击当前元素才会触发事件处理函数)：**

  只有当点击当前元素本身的时候才会触发事件处理函数，事件冒泡则不会触发时间函数，例如：

  ```html
  <div>
      <p @click.self='clickP'>
          我是p标签
          <span @click='clickSpan'>我是span</span>
      </p> <!-- 只有当点击目标为p标签时才会触发clickP事件处理函数，点击span标签则不会触发 -->
  </div>
  ```

  

- **.once (事件处理函数只触发一次)：**

  事件触发一次之后，`.prevent` 修饰符也会失效



&emsp;   注：*事件修饰符可以同时使用多个* 



- **.stop和.self的区别：**

  `.stop` 会阻止所有的事件冒泡行为，`.self` 只会阻止自己本身冒泡行为的触发，并不是真正的阻止冒泡，其他元素依然可以触发事件冒泡行为



#####  按键修饰符：

为按键按下事件添加修饰符，当按下指定按键时触发事件。

常用按键修饰符：

```js
.enter
.tab
.delete
.esc
.space
.up
.down
.left
.right
```

如何使用：

```html
<div @keyup.enter='login'>
    登录
</div>
<!-- 还可以直接使用键盘号 -->
<div @keyup.13='login'>
    登录
</div>
```

自定义全局按键修饰符：

```js
Vue.config.keyCodes.f2=113 // 将f2的键盘号修改为113
```





##  Vue中的动画：



#####  单模块动画：

使用 `<transition></transition>` 标签包裹需要被动画控制的元素。

![avatar](<https://cn.vuejs.org/images/transition.png>)

`v-enter ` 元素进入页面时

`v-enter-to`  元素进入页面后

`v-leave`  元素离开页面前

`v-leave-to`  元素离开页面后



`v-enter` 和 `v-leave-to` 可以当做一组，`v-enter-active` 和 `v-leave-active` 可以当做一组。

`v-enter` 和 `v-leave-to` 设置元素的起始状态和结束状态。

`v-enter-avtive` 和 `v-leave-active` 设置元素的动画过程。



如何使用：

如果 `v-enter` 和 `v-leave-to` 的状态相同，`v-enter-to` 和 `v-leave` 的样式相同，则可以为其分别设置对应的相同的一组样式：

```css
.v-enter,.v-leave-to{
    opacity:0;transform:translateX(-100px);
}
.v-enter-to,.v-leave{
    opacity:1;transform:translateX(-10px);
}
.v-enter-acitve,.v-leave-active{ 
    //设置动画过程中的过渡效果，也可以单独设置，单独设置就分别为两个类设置单独的过渡效果
	transition:opacity .4s linear;
}
```

如果入场动画和离场动画效果不同，则需要单独为其设置入场动画和离场动画：

```css
.v-enter{
    opacity:0;transform:translateX(100px);
}
.v-leave-to{
    opacity:0;transform:translateY(80px);
}
.v-enter-acitve,.v-leave-active{
	transition:opacity .4s linear;
}
```

如果有类似动画回弹效果，则需要在v-enter-to和v-leave的class类上设置样式，同时还要在动画作用元素上设置过渡效果。

**上述所有类会在动画开始之前添加到元素中，当动画结束后，该样式会被移除掉，只作为动画过程中的样式，不会直接成为于元素的最终样式**





##### 自定义动画class前缀：

利用 transition 标签的 name 属性，如果name属性未定义，Vue中的动画类型前缀默认为 v-，如果自定义 name 属性后，前缀就是自定义的 name 属性值，如：

```html
<transition name='my'>
	<div>
        <!-- elements... -->
    </div>
</transition>
```

```css
.my-enter,.my-leave-to{
    // todo
}
.my-enter-active,.my-leave-active{
    // todo
}
```



#####  使用第三方动画库：

只需要在 transition 标签上添加动画入场属性 `enter-active-class` 和动画离场属性 `leave-active-class`，再分别添加 animated 类名，然后添加对应的入场和离场动画即可。

```html
<transition enter-active-class='animated 第三方动画类名' leave-active-class='animated 第三方动画类名'>
	<div>
        <!-- elements... -->
    </div>
</transition>
```



animated 也可以在想要执行动画的指定元素上添加，如果在指定元素上添加 animated 类的话，则 transition 元素属性中 animated 类可省略。

```html
<transition enter-active-class='第三方动画类名' leave-active-class='第三方动画类名'>
	<div>	
        <div>
            我是一个div
        </div>
        <div class='animated'> <!-- 为transition中的某个元素指定动画效果 -->
            我是一个动画
        </div>
    </div>
</transition>
```



使用 `v-bind:duration='毫秒值'` 统一设置入场和离场动画时长

```html
<transition  enter-active-class='animated 第三方类名' leave-active-class='animated 第三方类名' :duration='400'>
	<div>
        <!-- elements... -->
    </div>
</transition>
```



使用 `v-bind:duration='{enter:毫秒值,leave:毫秒值}'` 分别设置入场和离场动画时长

```html
<transition  enter-active-class='animated 第三方类名' leave-active-class='animated 第三方类名' :duration='{enter:200,leave:400}'>
	<div>
        <!-- elements... -->
    </div>
</transition>
```





#####  动画钩子函数：

```html
<transition
  v-on:before-enter='beforeEnter'  	<!-- 动画进入之前 --> 
  v-on:enter='enter'			<!-- 动画进入中 -->
  v-on:after-enter='afterEnter'		<!-- 动画进入之后 -->
  v-on:enter-cancelled='enterCancelled'	<!-- 动画取消 -->

  v-on:before-leave='beforeLeave'		<!-- 动画离开之前 -->
  v-on:leave='leave'			<!-- 动画离开中 -->
  v-on:after-leave='afterLeave'		<!-- 动画离开之后 -->
  v-on:leave-cancelled='leaveCancelled'	<!-- 动画取消 -->
>
  <!-- ... -->
</transition>
```

<font color='red'>注：动画钩子函数的第一个参数是要执行动画的那个DOM元素</font>

```js
methods: {
  // 进入中
  beforeEnter: function (el) {
    // ...
  },
  enter: function (el, done) {
    // ...		//这里的done指的是afterEnter钩子函数，其实就是afterEnter钩子函数的引用
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },
      
  // 离开时
  beforeLeave: function (el) {
    // ...
  },
  leave: function (el, done) {
    // ...		//这里的done指的是afterLeave钩子函数，其实就是afterLeave钩子函数的引用
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```

当只用 JavaScript 过渡的时候，**在** **enter** **和** **leave** **中必须使用** **done** **进行回调**。否则，它们将被同步调用，过渡会立即完成，而结束动画会等待

 

Vue把一个完整的动画使用钩子函数拆分成了两部分，上半场和下半场动画，我们使用flag标识符来控制动画的上半场和下半场，flag从false到true是上半场，flag从true到false是下半场。

flag标识符第一个作用是控制元素的显示和隐藏，第二个功能是选择是否跳过后半场动画，如果在afterEnter函数中写this.flag=!this.flag就代表跳过后半场动画，直接让flag变为false





#####  列表动画：

在实现列表过渡的时候，如果需要过渡的元素是通过 `v-for` 循环渲染出来的不能使用 transition 包裹，需要使用**transitionGroup**

如何使用：

```html
<transition-group tag='ul'>
	<li v-for='item in data' :key='item.id'>{{ item }}</li>
</transition-group>
<!-- 其余使用方法同transition -->
```

<font color='red'>注：transition-group的子元素都必须绑定独立切唯一的key，动画才能正常工作。 循环出来的下标不能当做key，否则动画无效</font>



transitionGroup配合使用以下两个类，能够实现列表删除目标元素时，之后的元素渐渐上移的效果，解决删除列表元素后续元素动画生硬的问题

```css
.v-move{
	transition:all .6s linear;
}
.v-leave-active{
	position:absolute;
}
```



给transitionGroup标签添加appear属性，页面加载后就会给元素添加入场动画：

```html
<transition-group tag='ul' apper>
	<li v-for='item in data' :key='item.id'>{{ item }}</li>
</transition-group>
```





##  Vue中的组件：

##### 组件化、模块化

模块化：是从代码逻辑的角度进行划分的

组件化：是从UI界面的角度进行划分的



如何使用组件：

如果要使用组件，直接把组件的名称以html标签的形式，引入页面即可，如果组件名称是驼峰命名法，则要把驼峰转为小写并在中间用 - 拼接

如：组件名是 `myCom`，引入之后则是 `<my-com></my-com>`



##### 创建组件的三种方式：

* 使用 `Vue.extend` 创建全局组件

  ```js
  const component = Vue.extend({
      template:'<div>{{ text }}</div>',
      data(){
          return {}
      },
      props:['text']
  })
  ```

  使用 `Vue.component` 注册全局组件

  ```js
  Vue.component('myCom',component) //参数1为组件名称，参数2为组件对象
  ```

  

* 使用 `Vue.component` 直接创建全局组件

  ```js
  Vue.component('myCom',{
      template:'<div>{{ text }}</div>',
      data(){
          return {}
      },
      props:['text']
  })
  ```

  

* 使用 `template` 标签和 `Vue.component` 创建全局组件

  ```html
  <template id='temp'>
  	<div>
          {{ text }}
      </div>
  </template>
  ```

  ```js
  Vue.component({
      template:'#temp',
      data(){
          return {}
      },
      props:['text']
  })
  ```



<font color='red'>注：不论是哪种方式创建出来的组件，组件template属性指向的模板内容，必须有且只有唯一的一个根元素</font>





#####  创建私有组件：

```js
const vm = new Vue({
	el:'#app',
	data:{},
	methods:{},
	components:{ //定义私有组件
		login:{
			template:'<div>这是一个私有组件</div>'
			data(){
        		return {}
    		},
			props:[]
		}
	}
})
```



**为什么子组件中的data必须是一个function，必须要返回一个对象**

因为对象是引用类型，每次 return 出来的对象都是一个新对象，在组件重复使用时互不干扰





#####  组件之间的切换：

* 利用 v-if 和 v-else 配合 flag 实现

  

* 利用 Vue 提供的标签 `<component>` 实现

  ```js
  <component :is='组件名称'></component>
  //:is属性，可以用来指定要展示的组件名称
  ```

  

* 利用 router 切换



#####  组件切换动画：

利用 transition 元素将 component 元素包裹起来，transition 元素使用方法和之前相同，再通过给 transition 元素添加 mode 属性来设置组件的先出后进，或者先进后出

```html
<transition mode='out-in'> <!-- in-out是先进后出 -->
	<component :is='组件名称'></component>
</transition> <!-- 其中的mode属性是为组件设置执行动画顺序 -->
```



##### 组件之间的传值：

 ######     父组件向子组件传值：

子组件默认无法访问父组件的data中的数据和methods中的方法。

父组件可以在引用子组件的时候通过属性绑定的形式，把需要传递给子组件的数据以属性绑定的形式传递到子组件内部，子组件再用props属性接收数据

```html
<div id='app'>
	<alert :parmsg='msg'></alert>
</div> 
```

```js
const vm = new Vue({
	el:'#app',
	data:{
		msg:'父组件中的数据'
	},
	components:{
		alert:{
			template:'<div>{{ parMsg }}</div>',
			props:['parMSg']
		}
	}
})
```

<font color='red'>子组件中的 data 数据，并不是通过父组件传递进来的，而是子组件自身私有的，比如 ajax 请求回来的数据都可以放到 data 身上，props 中的数据都是从父组件传递进来的，data 中的数据都是可读可写的，props 中的数据都是只读的。</font>



**组件中data和props的区别：**

* data中的数据是组件私有的，props中的数据是通过父组件传递进来的
* data中的数据都是可读可写的，props中的数据都是只读的





######  子组件向父组件传值：

**子组件需要通过事件调用向父组件传值**。父组件向子组件传递自定义方法，使用的是事件绑定机制 `v-on`，当自定义一个事件属性后，子组件就能通过 `this.$emit('事件名',arg..)` 来调用传递过来的方法了

```html
<div id='app'>
    <my-com :title='title' @settitle='parentTitle'></my-com>
</div>
```

```js
const vm = new Vue({
    el:'#app',
    data:{
        title:'父组件中的title'
    },
    methods:{
        parentTitle(data){
            console.log('这个data是子组件中的title,' + data)
        }
    },
    components:{
        myCom:{
            template:'<div>{{ title }}</div>',
            props:['title'],
            data(){
                return {
                    title:'子组件中的title'
                }
            },
            methods:{
                changeTitle(){	//子组件通过调用这个方法执行this.$emit()向父组件传值
                    this.$emit('settitle',this.title)
                } //this.$emit()方法传入的事件名称不能用驼峰命名法，只能用小写
            }
        }
    }
})
```





#####  ref获取DOM元素和组件：

<font color='red'>给组件或元素定义ref属性可以通过ref属性获取到组件的属性和方法</font>

`ref` 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs`对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例

当 `v-for` 用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的数组。

注：因为 ref 本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们，它们还不存在！`$refs` 也不是响应式的，因此你不应该试图用它在模板中做数据绑定，ref 最早只能在mounted中获取到





##  VueRouter：

#####  前端路由和后端路由：

后端路由：对于普通的网站，所有的超链接都是URL地址，所有的URL地址都对应服务器上相应的资源

前端路由：对于单页面应用程序来说，主要通过URL中的hash(#号)来实现不同页面之间的切换，同时，hash有一个特点，HTTP请求中不会包含hash相关的内容，所以单页面程序中的跳转主要用hash实现，在单页面应用程序中，这种通过hash改变来切换页面的方式，称为前端路由（区别于后端路由）





#####  VueRouter安装：

* 直接在script标签中引用vue-router.js，它会自动安装路由

* 通过npm

  npm install vue-router --save

  如果在一个模块化的工程 (webpack) 中使用，必须通过 `Vue.use()` 明确的手动安装路由功能

  在 router.js 文件中：

  ```js
  //router.js
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  Vue.use(VueRouter)
  
  //如果在webpack中的webpack.providePlugin中配置了全局的Vue和全局的VueRouter，只需要使用Vue.use()安装即可
  
  //webpack.config.js
  plugins:[
      new webpack.providePlugin({
          Vue:['vue','default']，
          VueRouter:['vue-router','default']
      })
  ]
  //router.js
  Vue.use()
  ```





#####  VueRouter使用：

<font color='red'>路由的作用是为了不同组件之间的切换</font>

创建路由对象：

当引入 vue-router 之后，在window对象中就有了一个路由的构造函数 `VueRouter`，在 new 路由子实例对象的时候，可以为其传递一个配置对象

```js
//router.js
const router = new VueRouter({
    routes:[ //设置路由匹配规则
        {
            path:'/home', //监听的路由地址
            component:'组件对象', //当前路由显示的组件
            meta:{ //其他的自定义属性，用来执行一些操作
                   //关于路由的其他参数只能定义在meta对象中，否则无效
                title:'...',
                keepAlive:false
            }
        }，
        {
        	path:'/',
        	redirect:'/home' //路由重定向，重定向到指定路由地址
        }
    ]
})
export default router
```

路由注册成功之后，在vm实例身上添加一个router属性，将注册好的路由引用即可：

```js
//main.js
import router from './router.js'
const vm = new Vue({
    el:'#app',
    data:{},
    router:router
})
```





#####  路由的切换：

router-view 标签：

路由切换是基于 vue-router 提供的 `router-view` 标签实现的，这个标签是专门用来当做占位符的，将来路由规则匹配到的组件就会展示到这个router-view中去



router-link 标签：

如果想要在页面上实现点击链接组件切换的话，需要用 router-view 配合 router-link 标签来实现

**首先注册路由规则，并在要切换路由的位置插入 router-view 标签，之后在要点击匹配路由的位置处添加 router-link 标签**

```html
<router-link to='/home' tag='button'>
	首页   <!-- to属性 指定路由跳转地址 -->
	      <!-- router-link默认渲染为a标签，如果想渲染为其他标签，使用 tag属性 为其指定标签，无论渲染成什么元素，都可以实现跳转 --> 
</router-link>
```





#####  **设置路由选中的样式(路由高亮)**：

* 使用 router-link 自带的 class 属性 `.router-link-active` 为选中项设置样式

* 在 `VueRouter` 实例中用 `linkActiveClass` 属性指定自己的类名，并设置样式

  在 `VueRouter` 构造函数的配置对象中，在和路由匹配规则属性 `routes` 平级的地方添加 `linkActiveClass` 属性，并为其赋值，其值就是新的class类名

  ```js
  //router.js
  const router = new VueRouter({
      routes:[
          // 规则列表..
      ],
      linkActiveClass:'myActive' //myActive 就是路由匹配成功后 router-link 标签所包含的类名
  })
  ```





#####  为路由切换启用动画：

直接将 `router-view` 标签用 `transition` 标签包裹起来，并为 `transition` 设置相应的动画样式，使用方法同`transition` 标签





#####  路由传参：

* 在路由地址中使用查询字符串 (queryString) 传参

  ```html
  <!-- home.vue中传递参数 -->
  <router-link to='/login?id=1&&age=5' tag='button'>
  	登陆
  </router-link>
  ```

  ```js
  // login.vue中接收参数
  export default {
      data(){
          return {
              id:null,
              age:null,
          }
      },
     	methods:{
          getUserInfo(){
              this.id = this.$route.query.id
              this.age = this.$route.query.age
          }
      },
      created(){
          this.getUserInfo()
      },
  }
  
  ```

* 在路由规则对象 `path` 属性中使用 `/:属性名` (利用params获取传递的参数)

  ```html
  <!-- home.vue中传递参数 -->
  <router-link to='/login/1/5' tag='button'>
      登录
  </router-link>
  ```

  同时修改 router.js 中 `/login` 的匹配规则

  ```js
  // router.js
  new VueRouter({
      routes:[
          { 
              // path:'/login', 修改为
              path:'/login/:id/:age'
              component:'组件对象'
          }
      ]
  })
  ```

  ```js
  // login.vue中接收参数
  export default {
      data(){
          return {
              id:null,
              age:null,
          }
      },
      methods:{
          getUserInfo(){
              this.id = this.$route.params.id
              this.age = this.$route.params.age
          }
      },
      created(){
          this.getUserInfo()
      }
  }
  ```

  <font color='red'>注：`/:` 属性名这种方法路由规则中有几个参数，路由地址中也必须有几个参数，否则匹配不到。</font>

  <font color='red'>如果参数值个数不够或者没有参数值的话，`redirect` 重定向也会匹配不到，所以 `redirect` 重定向如果用 `/:` 属性名 的方法的话，必须要使参数值和参数名个数一样。</font>





#####  子路由的嵌套：

在 `VueRouter实` 例中的 `routes` 数组对象中的指定路由规则对象中添加 `children` 属性指定子路由的匹配规则

```js
// router.js
const router = new VueRouter({
    routes:[
        {
            path:'/login',
            component:'路由对象',
            children:[
                {
                    path:'admin',
                    comnponent:'路由对象'
                    // 子路由规则不能加/，否则以根路径请求
                },
                {
                    path:'user',
                    comnponent:'路由对象'
                    // 子路由规则不能加/，否则以根路径请求
                }
            ],
        }
    ]
})
```

```html
<!-- login.vue -->
<router-link to='/login/admin' tag='button'>
	管理员登录
</router-link>
<router-link to='/login/user' tag='button'>
	用户登录
</router-link>
<div>
    <router-view></router-view> <!-- 嵌套的子组件会在这里显示 -->
</div>
```





#####  命名视图，同一路由地址显示多个组件：

在同一个路由地址，如何实现同时显示多个不同组件：

```js
// router.js
const router = new VueRouter({
    routes:[
        path:'/',
        component:{
        	default:'组件对象', //不加name属性默认显示的组件
        	left:'组件对象', //name属性值为left时显示的组件
        	right:'组件对象', //name属性值为right时显示的组件
        }
    ]
})
```

```html
<!-- home.vue -->
<router-view></router-view> <!-- 显示default中的组件 -->
<router-view name='left'></router-view> <!-- 显示left中的组件 -->
<router-view name='right'></router-view> <!-- 显示right中的组件 -->
```





#####  watch监听路由或数据改变：

```js
export default {
    data(){
        return {}
    },
    watch:{
        '$route.path'(newValue,oldValue){
            //newVal代表调用方法之后监听的数据对象的新值，oldVal代表旧值
            if(newVlaue === '/login'){
                console.log('这是登录页')
            }
        }
    }
}
```





#####  Vue-router编程式导航：

######  router.push()：

**在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用 this.$router.push。**

想要导航到不同的 URL，则使用 `router.push` 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

当你点击 `<router-link>` 时，这个方法会在内部调用，所以说，点击 `<router-link :to="...">` 等同于调用 `router.push(...)`

该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：

```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

**注：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：**

```js
const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123

// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```

同样的规则也适用于 `router-link` 组件的 `to` 属性。

在 2.2.0+，可选的在 `router.push` 或 `router.replace` 中提供 `onComplete` 和 `onAbort` 回调作为第二个和第三个参数。这些回调将会在导航成功完成 (在所有的异步钩子被解析之后) 或终止 (导航到相同的路由、或在当前导航完成之前导航到另一个不同的路由) 的时候进行相应的调用。

**注**： 如果目的地和当前路由相同，只有参数发生了改变 (比如从一个用户资料到另一个 `/users/1` -> `/users/2`)，你需要使用 [`beforeRouteUpdate`](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#响应路由参数的变化) 来响应这个变化 (比如抓取用户信息)。



###### router.replace()：

跟 `router.push` 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。



###### router.go(n)：

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 `window.history.go(n)`

```js
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```



你也许注意到 `router.push`、 `router.replace` 和 `router.go` 跟 [`window.history.pushState`、 `window.history.replaceState` 和 `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History)好像， 实际上它们确实是效仿 `window.history`API 的。

因此，如果你已经熟悉 [Browser History APIs](https://developer.mozilla.org/en-US/docs/Web/API/History_API)，那么在 Vue Router 中操作 history 就是超级简单的。

还有值得提及的，Vue Router 的导航方法 (`push`、 `replace`、 `go`) 在各类路由模式 (`history`、 `hash` 和 `abstract`) 下表现一致。



#####  导航守卫：

###### 全局导航守卫：

```js
const router = new VueRouter({ ... })

router.beforeEach((to,form,next)=>{
    //...
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 **等待中**。

每个守卫方法接收三个参数：

- **to: Route**: 即将要进入的目标 [路由对象](https://router.vuejs.org/zh/api/#路由对象)
- **from: Route**: 当前导航正要离开的路由
- **next: Function**: 一定要调用该方法来 **resolve** 这个钩子。执行效果依赖 `next` 方法的调用参数。
  - **next()**: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)。
  - **next(false)**: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
  - **next('/') 或者 next({ path: '/' })**: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 [`router-link` 的 `to` prop](https://router.vuejs.org/zh/api/#to) 或 [`router.push`](https://router.vuejs.org/zh/api/#router-push) 中的选项。
  - **next(error)**: (2.4.0+) 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 [`router.onError()`](https://router.vuejs.org/zh/api/#router-onerror) 注册过的回调。

**确保要调用 next 方法，否则钩子就不会被 resolved**



###### 全局解析守卫：

> 2.5.0 新增

在 2.5.0+ 你可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，区别是在导航被确认之前，**同时在所有组件内守卫和异步路由组件被解析之后**，解析守卫就被调用



###### 全局后置钩子：

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  // ...
})
```



###### 路由独享的守卫：

你可以在路由配置上直接定义 `beforeEnter` 守卫：

```js
//router.js
const router = new VueRouter({
	routes: [
    	{
      		path: '/home',
      		component: '路由对象',
      		beforeEnter: (to, from, next) => {
        		// ...
      		}
    	}
  	]
})
```

这些守卫与全局前置守卫的方法参数是一样的。



###### 组件内的守卫：

你可以在路由组件内直接定义以下路由导航守卫：

- `beforeRouteEnter`

- `beforeRouteUpdate` (2.2 新增)

- `beforeRouteLeave`

  ```vue
  <template>
  	<div>
          home 页面
      </div>
  </template>
  <script>
  	export default{
      	data(){
          	return {}
      	},
      	beforeRouteEnter(to,from,next){
              // 在渲染该组件的对应路由被 confirm 前调用
      		// 不！能！获取组件实例 `this`
      		// 因为当守卫执行前，组件实例还没被创建
          },
          beforeRouteUpdate (to, from, next) {
              // 在当前路由改变，但是该组件被复用时调用
              // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
              // 可以访问组件实例 `this`
        	},
          beforeRouteLeave (to, from, next) {
              // 导航离开该组件的对应路由时调用
              // 可以访问组件实例 `this`
          }
  	}
  </script>
  ```
  
`beforeRouteEnter` 守卫 **不能** 访问 `this`，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建。
  

  
不过，你可以通过传一个回调给 `next`来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
  
```js
  beforeRouteEnter (to, from, next) {
    	next(vm => {
      	// 通过 `vm` 访问组件实例
    	})
  }
  ```
  
注意 `beforeRouteEnter` 是支持给 `next` 传递回调的唯一守卫。对于 `beforeRouteUpdate` 和 `beforeRouteLeave` 来说，`this` 已经可用了，所以**不支持**传递回调，因为没有必要了。
  
```js
  beforeRouteUpdate (to, from, next) {
    	// just use `this`
    	this.name = to.params.name
    	next()
  }
  ```
  
这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 **`next(false)` **来取消。
  


###### 完整的导航解析流程：

1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。



#####  router按需加载：

```js
const Login = () => import('./components/Login.vue')
```

使用该方法引入路由组件时，webpack 会将路由打包成单独的 js 文件，以实现使用时再加载。





##  计算属性computed：

```html
<div id='app'>
    <input v-model='a'>
	<input v-model='b'>
	<input v-model='c'>
</div>
```

```js
const vm = new Vue({
    el:'#app',
    data:{
        a:'',
        b:''
    },
    computed:{
        //在computed中，可以定义一些属性，叫做计算属性，计算属性的本质就是一个方法，只不过在使用计算属性时是把它们的名称直接当做属性来使用的，并不会把计算属性当做方法来调用
        c(){ //在引用计算属性的时候，一定不要加()去调用，直接把它当做一个普通的属性去引用即可
            return this.a + 'and' + this.b 
            // 只要计算属性这个function内部所用到的 任何 data中 的数据发生了变化，就会立即重新计算 这个计算属性的值
            // data的中的数据未发生变化时，重复引用多次计算属性也不会使计算属性重新计算
        }
    }
})
```

<font color='red'>注：computed在页面加载时就会执行一次</font>





##  Vue中的render：

```html
<!-- index.html -->
<div id='app'></div>
```



```js
// main.js
import App form './App.vue'
const vm = new Vue({
    el:'#app',
    data:{},
    methods:{},
    render:function(createElement){
        // createElement这个形参是一个方法，调用并返回它就能把指定的组件模板渲染为html结构
        return createElement(App)
        // 这里return的结果，会替换页面中el指定的那个容器
    }
})
```

<font color='red'>注：`render` 会替换整个 `el` 指定元素的内容，而且 `render` 是唯一的不能共存</font>





##  export default和export的区别：

在ES6的新标准中，规定了如何导入和导出模块：

* 导入模块

  ```js
  import '模块名称' from '模块标识符' 
  // 或 
  import '文件路径名称'
  ```

* 导出模块

  ```js
  export default '导出对象' //export default导出可以直接是一个对象
  export '导出变量名称' //export 导出的必须是一个变量名称
  ```

<font color='red'>注：`export default` 向外导出模块，可以使用任意变量来接收。在一个模块中，`export default`  只允许向外导出一次</font>

**在一个模块中可以同时使用 `export default` 和 `export` 向外导出成员**



**使用 `export` 向外导出的成员，只能使用 { export导出的参数名 } 的形式来接收，这种形式叫做 [按需导出]**

```js
import { export导出的参数名 } from '文件路径名称'
```

使用 `export` 导出的成员，必须严格按照导出时候的名称，参数名是什么，import 用 { } 导入的参数名就必须是什么，**`export` 可以向外导出多个成员，用逗号分隔即可**

```js
import { export导出的参数名,export导出的参数名,export导出的参数名 } from '文件路径名称'
```



**使用 `export` 导出的成员，如果想换个名称来接收，可以使用 `as` 来起别名**

```js
import { export导出的参数名 as 新的参数名} from  '文件路径名称'
```



**export default 和export 同时使用后导入模块：**

```js
import 模块名称,{ export导出的要接收的参数名 } from '文件路径名称'
```





##  组件中style标签lang属性和scoped属性：

##### scoped属性：

组件中的style标签默认会作用于整个页面，如果不想让其作用于整个页面的话，需要在style标签中添加scoped属性：

```vue
<style scoped></style>
```

注：添加了scoped属性之后，样式还会作用于当前组件里路由中的子组件。

样式的 `scoped` 是通过CSS的属性选择器实现的，每一个组件都会生成一个唯一的 `data-v-**` 属性，vue 会自动为该组件内的元素和 css 选择器添加 `data-v-**` 属性选择器。

######  lang属性：

**组件中的style标签默认只支持原生的css语法，通过指定lang属性用来支持其他语法，如less，sass：**

```vue
<style scoped lang='less'></style>
```





## axios：

get方法：

```js
this.$axios.get(url,{
	params:{
	//参数列表
	}
}).then('成功回调').catch('失败回调')
// 或者
this.$axios(url,{
	params:{
		//参数列表
	}
}).then('成功回调').catch('失败回调')
```



post方法：

**axios利用post发送数据时，数据格式是Request Payload，并非我们常用的Form Data格式，所以参数必须要以键值对形式传递，不能以json形式传参。**

传参方式：

* 自己拼接为键值对

* 使用transformRequest，在请求发送之前进行数据转换

  ```js
  this.$axios({
  	method: 'post',
  	url: 'http://backstage.befiv.com/Try/api_test',
  	data: this.sendData,//data属性中传入数据对象
  	headers: {	//上传的信息如果是一段json而不是键值对的话，设置此headers
  		'Content-Type': 'application/json;charset=utf-8'
  	},
  	transformRequest: function (sendData) { 
  		//使用transformRequest属性创建方法，方法的参数就是data传入的对象
  		let data = []
  		for (let key in sendData) { 
  			data.push(key + '=' + sendData[key])
  		}
  		console.log(data.join('&'))
  		//处理完成之后返回对象即可
  		return data.join('&')
  	}
  }).then(response => {
  	console.log(response)
  }).catch(err=>{
  	//异常处理回调
  })
  ```



<font color='red'>注：axios不支持跨域请求</font>



使用axios上传图片：

```html
<div>
    <button @click='showImgInput'>
        上传图片
    </button>
    <input type='file' @change='setUserImage' ref='fileInput'>
</div>
```



```js
export default {
    data(){
        return {}
    },
    methods:{
        showImgInput(){
            this.$refs.fileInput.click()
        },
        setUserImage(e){
            let formData = new FormData()
            formData.append('img',e.target.files[0])
            axios({
                method:'post',
                data:formData
                url:'/uploadFile'
            }).then(
            	res=>{
                    console.log(res)
                }
            )
        },
    }
}
```

注：上传图片不加请求头 (Content-Type)，上传成功之后服务器会返回一个图片的url路径地址

FormData 对象追加参数默认有两个参数，第一个参数为属性名，第二个参数为属性值，如果服务器端上传文件没有要求指定属性名字段的话，随便写一个属性名即可



**ajax中的options请求：**

对于一些可能对服务器数据有影响的请求，如 PUT，DELETE 和搭配某些 MIME 类型的 POST 方法，浏览器必须先发送一个“预检请求”——也就是刚才说的 preflight response，来确认服务器是否允许该请求，允许的话再真正发送相应的请求。

 

发送的请求内容类型如果不是 `application/x-www-form-urlencoded`，`multipart/form-data` 或 `text/plain` 这三者的话，便会触发 OPTIONS 请求

 

简单请求（simple request）, 只要同时满足以下两大条件，就属于简单请求：

请求方法是以下三种方法之一：

\- HEAD

\- GET

\- POST

HTTP的头信息不超出以下几种字段：

\- Accept

\- Accept-Language

\- Content-Language

\- Last-Event-ID

\- Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

 

**非简单请求（not-so-simple request）:**

**- 请求方法不是GET/HEAD/POST** 

**- POST请求的Content-Type并非application/x-www-form-urlencoded, multipart/form-data, 或       text/plain** 

**- 请求设置了自定义的header字段**







##  Vuex：

Vuex是一个专为Vue.js应用程序开发的状态管理模式，它可以把一些共享的数据保存到Vuex中，方便整个程序中的任何组件直接获取或修改公共数据

<font color='red'>注：当页面刷新后，Vuex中保存的数据也会丢失</font>

安装：

npm install vuex --save

引用注册并使用：

```js
//store.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.store({
    state:{ //类似于vue实例中的data对象
        count:0, //如果想要在组件内访问store中的数据，只能通过this.$sotre.state.***访问
    },
    mutations:{ //类似于vue实例中的methods对象，操作state中的数据的方法
        // 如果要操作 store 的 state 中的数据，只能通过调用 mutations 提供的方法，才能操作对应的数据，不推荐在组件中直接操作，原因是万一导致了数据的紊乱，不能快速定位到错误原因，因为每个组件都可能有操作数据的方法
        calcCount(state){ //第一个参数永远是store中的state数据对象
            state.count++
        },
        subCount(state,a){
        	//注意：mutations中的函数参数列表中最多支持两个参数，其中参数1是state数据对象，参数2是通过commit传递过来的参数，最多只能接收一个自定义参数，如果想传递多个参数的话，可以使用对象的方式来代替
            //如果组件想要调用mutations中的方法，只能使用this.$store.commit('方法名')
        }
    },
    getters:{
        //这里的getters只负责对外提供数据，不负责修改数据，如果想要修改state中的数据，必须使用mutations
        getCount(state){ //this.$store.getters.optCount 调用
            return '当前最新的属性值是:'+state.count
        },
        //getters中的方法和组件中的filters类似，因为filters和getters都没有修改原数据，都是把原数据做了一层包装，提供给了调用者
        //其次，getters也和computed比较像，因为只要state中的数据发生变化，如果getters也正好引用了这个数据，那么就会立即触发getters的重新求值
    }
})
export default store
```

将 `store` 添加到 Vue 实例中：

```js
//main.js
import store from './store.js'
const vm = new Vue({
    el:'#app',
    data:{},
    store:store //只要挂载到vm上，任何组件都能使用store中的数据了
})
```

注：

* state中的数据不能直接修改，如果想要修改，必须通过mutations

* 如果组件想要直接从state上获取数据，需要使用this.$store.state.\**\*

* 如果组件想要修改数据，必须使用mutations提供的方法，需要通过this.$store.commit('方法名',唯一的一个参数)

* 如果store中state上的数据，在对外提供的时候，需要做一层包装，那么推荐使用getters，如果需要使用getters，则用this.$store.getters.\**\*