<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true"
            @pullingUp="loadMore" @scroll="contentScroll">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature />
      <tab-control class="tab-control"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!--组件想要监听原生点击事件，需要添加修饰符.native-->
    <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import Feature from './childComps/featureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import {getHomeMultidata, getHomeGoods } from "network/home";
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  export default {
    name: "Home",
    data(){
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        //用于记录 商品 当前类型
        currentType: 'pop',
        isShowBackTop: false,  //回到顶部按钮状态
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      Feature,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    //应留意 created下只写主要逻辑。可以封装到methods
    created(){
      //  调用请求轮播图等多个数据
      this.getMultiData()
      //  调用请求商品数据的方法
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      // 监听item 中图片加载完成
      this.$bus.$on('itemImageLoad',() => {
        // console.log("item-image-load");
        this.$refs.scroll.scroll.refresh()
      })

    },
    methods: {
      /**
       * 网络请求相关
       */
      //请求轮播图等多个数据
      getMultiData(){
        getHomeMultidata().then(res =>{
          this.banners =  res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      // 请求“流行最新精选”下的数据
      getHomeGoods(type){
        // 请求下一页（更多）数据，第一次拿到第一页数据
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          // ...为展开符，实际上是运用了push可以接收可变参数(...item)的特性
          this.goods[type].list.push(...res.data.list)
        //  goods[type] 当前页码加 1
          this.goods[type].page += 1;
        //  一次上拉结束必须调用一次finishPullUp
          this.$refs.scroll.scroll.finishPullUp()
        })
      },
      /**
       * 事件监听相关
       */
      // 监听 ”流行最新精选” 栏的点击，接受别的组件发送过来的事件
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },

     // 监听返回顶部按钮
      backTopClick(){
        //scrollTo()可以接受三个参数，分别表示x, y, 秒数(多少秒内回到顶部)
        this.$refs.scroll.scroll.scrollTo(0,0,500)
      },
      // 监听滚动
      contentScroll(position){
        //当滚动到一定位置时，显示回到顶部组件
        this.isShowBackTop = (-position.y > 1000)
      },
      // 上拉加载更多
      loadMore(){
        this.getHomeGoods(this.currentType)
      }
    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    /*vh为视口高度，100vh表示100%视口宽度*/
    height: 100vh;
  }
  .home-nav {
    background: var(--color-tint);
    color: #f7f7f7;

    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 100;
  }
  /*feature栏 随滑动到达顶部时，悬停；向下时正常移动*/
  /*很方便很好用的新属性，但要考虑兼容性*/
  .tab-control {
    position: sticky;
    top: 40px;
    z-index: 10;
    background-color: #fff;
  }
  .content {
    /*css3 方法 动态计算滚动内容高度*/
    /*100% - （44+49）+padding-top 44px*/
    height: calc(100% - 49px);
    overflow: hidden;
  }
  /*也可以通过绝对定位，设置top和bottom 拉伸内容*/
  /*.content {*/
    /*position: absolute;*/
    /*top: 44px;*/
    /*bottom: 49px;*/
  /*}*/
</style>
