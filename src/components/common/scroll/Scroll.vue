<template>
  <!--绑定ref属性，可以通过 $refs 准确的获取到这个元素对象-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        scroll: null
      }
    },
    mounted(){
      //1、创建BScroll 对象
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: true,
        probeType: this.probeType,
        //判断是否需要上拉刷新功能，默认是false
        pullUpLoad: this.pullUpLoad
      })
      //2、监听滚动位置
      this.scroll.on('scroll',(position) => {
        // 发送事件，给需要监听滚动位置的组件用
        this.$emit('scroll',position)
        // 解决加载图片前后 better-scroll 存在卡顿问题
        // （原因：可滚动区域高度 scrollerHeight 的值，图片加载前后前后不一致）

      })
      //3、监听上拉事件
      this.scroll.on('pullingUp',() => {
        this.$emit('pullingUp')
      })
    }
  }
</script>

<style scoped>

</style>
