<template>
    <div class="edit-form">
        <midea-form ref="mideaForm" :value="value" :map="map" :renderConfig="_renderConfig"></midea-form>
    </div>
</template>

<script>
    import Form from '../form/index.vue';
    export default {
        name: 'mideaEditForm',
        components: {
            'midea-form': Form,
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
                    return {};
                },
            },
        },
        data() {
            return {
            };
        },
        computed: {
            _renderConfig () {
                const defaultRenderConfig =  {
                    row: {
                        gutter: 24,
                    },
                    col: {
                        xl: 12,
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
        },
        methods: {
            // 校验表单
            validate (...args) {
                this.$refs.mideaForm.form.validateFields(...args);
            },
            reset (defaultValue = {}) {
                this.$refs.mideaForm.form.resetFields();
                Object.keys(this.value).forEach(key => {
                    this.map[key] && delete this.value[key];
                    // TODO: 设置reset后的默认值
                    defaultValue[key] && this.$refs.mideaForm.form.setFieldsValue({
                        [key]: defaultValue[key],
                    });
                });
            }
        },
    };
</script>

<style lang="less" scoped>
.edit-form {
}
</style>

