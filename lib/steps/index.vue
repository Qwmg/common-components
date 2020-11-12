<template>
    <div class="midea-steps" :class="{ 'midea-steps-active': allActive }">
        <div
            class="midea-steps-item"
            :class="{
                'midea-steps-item-active': current > index,
                'midea-steps-item-current': current === index
            }" 
            v-for="(item, index) in options" :key="index">
            <div class="midea-steps-item-info">

                <slot v-if="$scopedSlots.icon" name="icon" v-bind="item" :allActive="allActive" :current="current" :$index="index"/>
                <p v-else class="midea-steps-item-info-index">{{ index + 1 }}</p>
                <p v-if="item.title" class="midea-steps-item-info-title">{{ item.title }}</p>
                <p v-if="item.description" class="midea-steps-item-info-description">{{ item.description }}</p>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            options: {
                type: Array,
                required: true,
                default () {
                    return [];
                }
            },
            allActive: {
                type: Boolean,
                default: false
            },
            current: {
                type: Number,
                default: 1
            }
        },
    };
</script>

<style lang="less">
@import '~@/static/css/base/variables.less';

@stepItemMargin: 40px;

.midea-steps {
    display: flex;
    overflow: hidden;
    width: max-content;
    max-width: fit-content;

    &-item {
        text-align: center;
        font-size: 16px;
        padding: 0 25px;
        margin: 0 @stepItemMargin;
        background: #fff;
        position: relative;

        &:first-child {
            padding-left: 0;
            margin-left: 0;
        }

        &:last-child {
            padding-right: 0;
            margin-right: 0;
        }
        
        &-info {
            opacity: .3;
        }

        &.midea-steps-item-active, &.midea-steps-item-current {
            .midea-steps-item-info {
                opacity: 1;
            }
        }
        
        &.midea-steps-item-active::after {
            opacity: 1;
        }
    
        &.midea-steps-item-current::after {
            opacity: .3;
        }
    
        &::after {
            position: absolute;
            top: 26px;
            left: 100%;
            display: block;
            width: 9999px;
            height: 1px;
            width: calc(@stepItemMargin * 2);
            background: @mideaBlue;
            content: "";
            opacity: .3;
        }

        &-info {
            &-index {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: @mideaBlue;
                line-height: 32px;
                text-align: center;
                font-size: 18px;
                color: #fff;
                margin: 10px auto;
            }

            &-title {
                color: #000;
                font-weight: bold;
                font-size: 16px;
                line-height: 19px;
                word-break: break-all;
            }

            &-descrition {
                color: #999;
                font-size: 16px;
                line-height: 19px;
            }
        }
    }
}
    
.midea-steps.midea-steps-active {
    .midea-steps-item {
        &::after, &-info{
            opacity: 1;
        }
    
    }
}

@media screen and (max-width: @screenMobileWidth) {
    
@stepItemMarginMin: calc(100% / 3 / 2 / 5);

.midea-steps {
    width: initial;
    max-width: initial;

    &-item {
        font-size: 12px;
        padding: 0;
        margin: 0 @stepItemMarginMin;
        flex: 1;
        
        &::after {
            top: 20px;
            width: 100%;
        }

        &-info {
            &-index {
                width: 24px;
                height: 24px;
                line-height: 24px;
                font-size: 14px;
                margin: 8px auto;
            }

            &-title {
                font-size: 12px;
                line-height: 14px;
            }

            &-descrition {
                font-size: 12px;
                line-height: 14px;
            }
        }
    }
}

}
</style>
