<template>
    <div class="midea-loading" :class="{ 'midea-loading-visible': !!loading }">
        <i class="iconfont-midea iconloading" v-bind="$attrs"></i>
    </div>
</template>

<script>
    export default {
        props: {
            loading: Boolean
        }
    }
</script>

<style lang="less">
.midea-loading {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, .5);
    opacity: 0;
    z-index: -1;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: all .3s ease-in-out;

    i {
        font-size: 60px;
        color: @mideaBlue;
        animation: loading 1.6s infinite ease-in-out;
    }

    @keyframes loading {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}

.midea-loading-visible {
    opacity: 1;
    z-index: 99999;
}

</style>
