<template>
  <a-button 
    class="midea-btn"
    :class="{
      'midea-primary': type === 'primary',
      'midea-default': type === 'default'
    }"
    v-bind="$attrs"
    v-on="$listeners">
      <slot></slot>
    </a-button>
</template>

<script>
  export default {
    name: 'mideaButton',
    props: {
      type: {
        type: String,
        default () {
          return 'primary';
        },
      },
    }
  }
</script>

<style scoped lang="less">
.midea-primary{
  .btn-primary();
}
.midea-default{
  .btn-primary(@white,@mideaBlue);
}
</style>