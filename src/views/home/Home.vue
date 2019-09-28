<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!--<home-swiper :banners="banners"/>-->
    <swiper>
      <swiper-item v-for="item in banners">
        <a :href="item.link">
          <img :src="item.image" alt="">
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  // import HomeSwiper from './childComps/HomeSwiper'
  import {Swiper, SwiperItem} from 'components/common/swiper'


  import {getHomeMultidata} from "network/home";
  export default {
    name: "Home",
    data(){
      return {
        banners: [],
        recommends: []
      }
    },
    components: {
      NavBar,
      // HomeSwiper
      Swiper,
      SwiperItem
    },
    created(){
    //  请求多个数据
      getHomeMultidata().then(res =>{
        // console.log(res);
        this.banners =  res.data.banner.list
        this.recommends = res.data.recommend.list

      })
    }
  }
</script>

<style scoped>
  .home-nav {
    background: var(--color-tint);
    color: #f7f7f7;
  }

</style>
