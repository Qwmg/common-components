<template>
  <div class='midea-button-group'>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'mideaButtonGroup',
  }
</script>

<style scoped lang="less">
.midea-button-group{
  display: flex;
  justify-content: center;
  .midea-btn{
    margin-right:16px;
  }
  .midea-btn:last-child{
    margin-right:0;
  }
}
</style>