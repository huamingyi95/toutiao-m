<template>
  <van-button
    :icon="attitudeNum  === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: attitudeNum  === 1 }"
    :loading="loading"
      @click="onLike"
  />
</template>
<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  props: {
    // 接收对文字的态度
    attitudeNum: {
      type: Number,
      required: true
    },
    // 文章id
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      // 加载中变量控制
      loading: false
    }
  },
  methods: {
    async onLike () {
      this.loading = true
      try {
        let status = -1
        if (this.attitudeNum === 1) {
          // 已点赞，要取消点赞
          await deleteLike(this.articleId)
        } else {
          // 没有点赞，要添加点赞
          await addLike(this.articleId)
          status = 1
        }

        // 更新视图
        // .sync 要使用，自定义事件名称必须符合规则==> this.$emit('update:自定义属性名', 实参数据)
        this.$emit('update:attitudeNum', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  },
  created () {}
}
</script>
<style scoped lang="less">
.liked {
  color: #e5645f;
}
</style>
