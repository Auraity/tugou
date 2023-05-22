(function () {
  var dataUrl = null;
  // 判断当前是在index.html页面还是goods_details.html页面
  if (location.search) { // goods_details.html页面
    dataUrl = '../res/data/data.json'
  } else { //index.html页面
    dataUrl = './res/data/data.json'
  }

  // 封装一个Page类
  function Page(url) {
    // 在商品详情页获取首页传过来的数据
    // 模拟从服务端读取数据，创建存储数据的data对象，并初始化页面
    if (location.search) {
      var urlStr = location.search.replace('?', '');
      var temp = urlStr.split('&');
      var type = temp[0].replace('type=', '');
      var id = temp[1].replace('id=', '');
      // console.log(urlStr, temp, type, id,11);
      this.loadData(url).then(function (res) {
        // console.log(res);
        // 获取首页传过来的商品的具体数据
        var goodsDetails = res.goods[type].des[id];
        this.goodsInfo(goodsDetails);

        this.loginRegister();
        this.nav(res.nav);
        this.banner();
        this.categoryNav(res.category);
        this.addRightBar();
      }.bind(this))
    } else {
      this.loadData(url).then(function(res){
        this.init(res);
      }.bind(this));
    }
  }

  // 使用promise异步获取data.json中的数据
  Page.prototype.loadData = function (url) {
    return new Promise(function (resolve, reject) {
      $.get(url).then(function (res) {
        // console.log(res);
        resolve(res);
      }).catch(function (err) {
        reject(err);
      });
    });
  }

  // 初始化项目
  Page.prototype.init = function (data) {
    // 注册&登录
    this.loginRegister();
    // 导航栏
    this.nav(data.nav);
    // 轮播图
    this.banner();
    // 分类
    this.categoryNav(data.category);
    // 商品列表
    this.goodsList(data.goods);
    // 放大镜
    this.zoom();
    // 侧栏
    this.addLeftBar(data.goods);
    this.addRightBar();
  }

  var loginView = null;// 设置变量用于存放对话框DOM

  function loginRegisterAction(event) {
    // console.log(event, 11);
    event.preventDefault();//阻止a标签的默认行为
    if (!loginView) {
      var type = event.target.dataset.type;
      // console.log(type, event);
      loginView = new pageTools.Login(type == 'login', 'body', function () {
        loginView = null;
      })
    }

  }
  // 注册/登录
  Page.prototype.loginRegister = function () {
    $('.login').click(loginRegisterAction);
    $('.register').click(loginRegisterAction);
  }

  // 导航栏实例化处理
  Page.prototype.nav = function (navList) {
    new pageTools.Nav('.nav_container', navList, function (text) {
      // console.log(text);
      // console.log(navList);
    })
  }

  // 轮播图
  Page.prototype.banner = function () {
    new Swiper('.swiper-container', {
      loop: true,
      // 自动播放
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: true
      },
      //分离器
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      // 前进和后退
      navigator: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next'
      }
    })
  }

  // 分类导航
  Page.prototype.categoryNav = function (category) {
    new pageTools.Category('.category-nav', category, function (res) {
      // console.log(res);
    })
  }

  // 实例化商品
  Page.prototype.goodsList = function (goods) {
    new pageTools.Goods('.main-container', goods, function () {
      // console.log(goods);
    })
  }

  // 商品详情页
  Page.prototype.goodsInfo = function (data) {
    $('.goods-img').css('background-image', 'url(' + data.image + ')');
    $('.title').html(data.title);
    $('.price').html(data.price);
  }

  // 放大镜
  Page.prototype.zoom= function (){
    new pageTools.Zoom('.goods');
  }

  // 左侧栏快速定位
  Page.prototype.addLeftBar = function(classic){
    console.log(classic);
    // 创建DOM用于存放分类
    var leftBar = $('<ul class="left-bar"></ul>');
    
    classic.forEach(function(item){
      var clsLi = $('<li><a href="#' + item.id + '">' + item.title + '</a></li>')// 页内跳转（需要设置锚点#，锚点关联的是id值）写法：#id值
      leftBar.append(clsLi);
    })
    $(document.body).append(leftBar);
  }

  // 右侧栏QQ客服&快速回到顶端
  Page.prototype.addRightBar = function(){
    var rightBar = $('<ul class="right-bar"></ul>');
    var data = ['客服','回到顶部'];

    data.forEach(function(item){
      if(item === '客服'){
        rightBar.append($('<li><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1977489017&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:1977489017:52" alt="请问您需要什么帮助？" title="请问您需要什么帮助？"/></a></li>'))
      } else {
        var toTop = $('<li><a href="">' + item + '</a></li>');
        // 回到顶部
        toTop.click(function(e){
          e.preventDefault();
          $('html,body').animate({
            scrollTop: 0
          },'slow');
        })
        rightBar.append(toTop);
      }
    })

    $(document.body).append(rightBar);
  }

  // 主函数
  function main() {
    new Page(dataUrl)
  }
  main();
})();
