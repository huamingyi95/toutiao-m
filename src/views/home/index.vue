<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <article-list :channel="channel" />
      </van-tab>
      <!-- 右侧自定义内容 -->
      <!-- 占位元素 -->
      <div class="placeholder"></div>
      <!-- 右侧按钮 -->
      <template #nav-right>
        <div class="hamburger-btn" @click="show = true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
      </template>
    </van-tabs>
    <!-- /频道列表 -->
    <!--弹出层 频道编辑 -->
    <van-popup
      class="edit-channel-popup"
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 频道编辑组件 -->
      <channel-edit
      :my-channels='channels'
      :active='active'
      @updata-active='onUpdataActive'
      />
    </van-popup>
    <!--/弹出层 频道编辑 -->
  </div>
</template>

<script>
// 导入封装方法
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  props: {},
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      show: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    // 定义获取自己的频道列表函数
    async loadChannels () {
      try {
        if (this.user) {
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            this.channels = localChannels
          } else {
            const { data } = await getUserChannels()
            this.channels = data.data.channels
          }
        }
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdataActive (index, show = true) {
      this.active = index
      this.show = show
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 88px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
  .edit-channel-popup {
    box-sizing: border-box;
  }
}
</style>
