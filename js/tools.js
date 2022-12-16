// 定义全局变量，便于将结果暴露出去
window.pageTools = window.pageTools || {};

// 定义 (function(){})()是匿名函数，主要利用函数内的变量作用域，
// 避免产生全局变量，影响整体页面环境，增加代码的兼容性。
(function () {
  // 1、注冊&登录
  // 通过isLogin去区分是登录还是注册
  function Login(isLogin, superViewSelector, eventListiner) {
    this.isLogin = isLogin;
    this.superView = $(superViewSelector);
    this.init();
    this.eventListiner = eventListiner;
  }

  // 添加对话框页面初始化函数
  Login.prototype.init = function () {
    var isShow = this.isLogin ? 'none' : 'block';//登录或注册对话框确认按钮要不要显示
    var buttonText = this.isLogin ? '登录' : '注册';//设置提交按钮上的文字内容
    // 添加对话框DOM
    this.dialog = $('<div class="dialog">\
    <button class="close-btn">&times;</button>\
    <div class="input-box">\
    <input type="text" placeholder="用户名">\
    <input type="password" placeholder="密码">\
    <input type="password" placeholder="确认密码" class="again-pwd">\
    <button class="btn"></button>\
    </div>\
    </div>');
    //添加DOM到文档中
    this.superView.append(this.dialog);

    //如果是登录则不显示确认密码框，如果是注册则显示
    $('.again-pwd').css('display', isShow);

    // 单击“登录”或“注册”按钮
    $('.btn').html(buttonText).click(function () {
      this.dialog.remove(); // 清除dialog这个div中所有内容，且包括自身。
      this.dialog = null; // 垃圾回收处理（null表示指针没有指向，意味着不占用内存了）
      this.eventListiner();
    }.bind(this)); // 改变this的指向

    // 当单击“关闭”按钮时，清除上面创建的对话框DOM
    $('.close-btn').click(function () {
      this.dialog.remove();
      this.dialog = null;
      this.eventListiner();
    }.bind(this));
  }

  // 2.导航
  function Nav(selector, datas, callback) {
    // @selector:将处理的结果渲染到指定的DOM上
    // @datas:动态获取导航栏菜单项内容
    // @callback:菜单要执行的一些附带操作
    this.width = 1200;
    this.datas = datas || []; // 避免传参时没传参数的处理
    this.callback = callback;
    this.superView = $(selector || '');
    this.createView();
  }

  // 创建导航栏页面
  Nav.prototype.createView = function () {
    var nav = $('<ul class="nav"></ul>'); // 创建导航栏DOM
    this.datas.forEach(function (info) {
      var item = $('<li class="nav-item" style="width:' + this.width / this.datas.length + 'px;">\
      <a href="'+ info.url + '"><img class="icon" src="' + info.imageUrl + '"><span>' + info.title + '</span></a></li>');
      nav.append(item); // 将所有菜单项添加到前面的ul标签中
    }.bind(this));

    this.superView.append(nav); // 将结果渲染到前端
  }

  // 3.分类
  function Category(el, data, callback) {
    this.el = $(el || '');
    this.data = data || [];
    this.callback = callback;
    this.createView();
  }

  Category.prototype.createView = function () {
    var self = this;
    // 创建分类一级菜单
    var category_menu = $('<ul class="category-menu"></ul>');
    this.el.append(category_menu);
    this.data.forEach(function (item) {
      var category_menu_item = $('<li><a href="#">' + item.title + '</a></li>');
      category_menu.append(category_menu_item);

      category_menu_item.mouseenter(function (item) {
        return function (e) {
          e.preventDefault();//阻止a标签的默认行为
          self.callback($(this).text)//回调函数模拟处理

          if ($('.category-sub-menu')) {//如果二级菜单有内容则先清除
            $('.category-sub-menu').remove();
          }

          // 创建二级菜单
          var category_sub_menu = $('<ul class="category_sub_menu"></ul>');
          $(this).append(category_sub_menu)
          category_sub_menu.css('width', category_sub_menu.css('width') != '20rem' ? '20rem' : '0');
          item.des.forEach(function (info) {
            var sub_menu_item = $('<li><a href="#">' + info.title + '</a></li>');
            category_sub_menu.append(sub_menu_item);
          })
        }
      }(item)).mouseleave(function () {
        $('.category_sub_menu').remove();
      })
    }.bind(this))
  }


  // 4.商品列表
  function Goods(el, data, callback) {
    this.el = $(el || '');
    this.data = data || [];
    this.callback = callback;
    this.createView();
  }

  Goods.prototype.createView = function () {
    var goods_container = $('<ul class="goods"></ul>');
    this.el.append(goods_container);
    this.data.forEach(function (item) {
      // 商品一级分类
      var goods_item = $('<li class="item">\
      <div class="addr" style="background-image:url(' + item.addr + ')"></div>\
      <h3 id="' + item.id + '" class="title">' + item.title + '</h3>\
      </li>');

      goods_container.append(goods_item);// 4
      // 商品二级分类
      var goods = $('<ul class="goods-list"></ul>');
      goods_item.append(goods);

      item.des.forEach(function (info) {
        var goods_item = $('<li class="goods-item"><a href="../view/goods_details.html?type=' + item.type + '&id=' + info.id + '">\
        <img class="image" src="' + info.image + '" alt="' + info.name + '"/>\
        <p class="name">' + info.name + '</p>\
        <p class="price">￥' + info.price + '</p>\
        <button class="btnBuy">抢购</button>\
        </a></li>');

        goods.append(goods_item)
      });
    });
  }

  // 放大效果
  function Zoom(el){
    this.el = $(el||'');
    this.createView();
  }

  Zoom.prototype.createView=function(){
    // 创建用于存放另一张大图的DOM（容器）
    var scaleView=$('<div class="zoom"></div>')
    this.el.append(scaleView);

    // 设置放大镜所显示的大图
    scaleView.css('background-image', this.el.css('background-image'));

    this.el.mouseenter(function(){
      scaleView.css('display', 'block');      
    }).mousemove(function(e){
      // console.log(e.offsetX);
      scaleView.css({"background-position":(-e.offsetX +200)+'px'+(-e.offsetY +200)+'px'});
    }).mouseleave(function(){
      scaleView.css('display', 'none');
    })

  }

  window.pageTools = {
    Login,
    Nav,
    Category,
    Goods,
    Zoom
  }
})();