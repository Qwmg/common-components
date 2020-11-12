<template>
    <div class="midea-form">
        <a-form :form="form" layout="inline">
            <a-row v-bind="_renderConfig.row">
                <template v-for="(item, key) of map">
                    <a-col v-bind="item.col ? item.col : _renderConfig.col" :key="key" v-show="!item.hidden">
                        <midea-form-item
                            :ref="key"
                            :config="item"
                            :mapKey="key"
                            :value="value"
                            :form="form"
                            @enter="$emit('enter', $event)"></midea-form-item>
                    </a-col>
                </template>
            </a-row>
        </a-form>
    </div>
</template>

<script>
    import FormItem from './FormItem.vue';
    export default {
        components: {
            'midea-form-item': FormItem,
        },
        props: {
            value: {
                type: Object,
                default () {
                    return {};
                },
            },
            map: {
                type: Object,
                default () {
                    return {};
                },
            },
            renderConfig: {
                type: Object,
                default () {
                    return {
                    };
                },
            },
        },
        data() {
            return {
                form: this.$form.createForm(this, {
                    onValuesChange: (_, values) => {
                        const key = Object.keys(values)[0];
                        this.value[key] = values[key];
                    },
                 }),
            };
        },
        computed: {
            _renderConfig () {
                const defaultRenderConfig =  {
                    row: {
                        gutter: 24,
                    },
                    col: {
                        xl: 8,
                        lg: 12,
                        md: 24,
                    },
                };
                return {
                    ...defaultRenderConfig,
                    ...this.renderConfig,
                }
            },
        },
        watch: {
            value: {
                immediate: true,
                // deep: true,
                handler (obj = {}, oldObj = {}) {
                    // TODO: 设置默认值
                    this.$nextTick(() => {
                        Object.keys(this.map).forEach(key => {
                            this.form.setFieldsValue({
                                [key]: obj[key],
                            });
                        });
                    });
                }
            }
        },
    };
</script>

<style lang="less">
.midea-form {
  margin-bottom: 10px;
}

</style>
