<template>
    <div class="midea-form-item">
        <a-form-item :label="config.label">
            <div class="midea-form-item-content">
                <midea-upload v-if="itemType === 'upload'" v-bind="defaultConfig" v-decorator="[mapKey, decorator]">
                    <renderCell
                        v-if="config.render"
                        :render="config.render"
                        :mapKey="mapKey"
                        :value="value"/>
                </midea-upload>
                <name-input v-else-if="itemType === 'name-input'" v-bind="defaultConfig" v-decorator="[mapKey, decorator]"></name-input>
                <select-input-group v-else-if="itemType === 'select-input-group'" v-bind="defaultConfig" v-decorator="[mapKey, decorator]"></select-input-group>
                <address-form v-else-if="itemType === 'address-form'" v-bind="defaultConfig" v-decorator="[mapKey, decorator]"></address-form>
                <!-- antd 自定义表单组件校验不支持函数式组件，因此renderCeil在此处不适用需校验的表单项，仅用作占用渲染项 -->
                <renderCell
                    v-else-if="config.render"
                    v-bind="defaultConfig"
                    v-decorator="[mapKey, decorator]"
                    :render="config.render"
                    :mapKey="mapKey"
                    :value="value"/>
                <component
                    v-else
                    :is="`a-${itemType || 'input'}`"
                    v-decorator="[mapKey, decorator]"
                    :filterOption="filterOptionFn"
                    v-bind="defaultConfig"
                    v-on="listeners"
                    @keypress.native.enter="$emit('enter', $event)"
                    @blur="handleBlur">
                    <template v-if="itemType === 'select'">
                        <a-select-option v-for="(item, index) in config.dataSource"
                            :key="index"
                            :value="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </template>
                    <template v-else-if="itemType === 'radio-group'">
                        <a-radio v-for="(item, index) in config.dataSource"
                            :key="index"
                            :value="item.value">
                            {{ item.label }}
                        </a-radio>
                    </template>
                </component>
                <renderCell
                    v-if="config.operateRender"
                    :render="config.operateRender"
                    :mapKey="mapKey"
                    :value="value"/>
                <p v-if="itemType === 'textarea' && config.maxLength" class="midea-form-item-content-count">{{ (value[mapKey] || '').length }}/{{config.maxLength}}</p>
            </div>
        </a-form-item>
    </div>
</template>

<script>
    import upload from '../upload';
    import nameInput from '../renderFormItem/nameInput';
    import selectInputGroup from '../renderFormItem/selectInputGroup';
    import tools from '../utils/tools.js';

    function getChild (name) {
        let child;
        this.$children.forEach((_child) => {
            const _name = _child.$options.name;
            if (_name === name) {
                child = _child;
            } else {
                child = getChild.call(_child, name);
            }
        });
        return child;
    }

    const debounceTime = 300;

    export default {
        components: {
            upload,
            nameInput,
            selectInputGroup
        },
        props: {
            value: {
                type: Object,
                default () {
                    return {};
                },
            },
            config: {
                type: Object,
                required: true,
                default () {
                    return {}
                },
            },
            mapKey: {
                type: String,
                required: true,
                default: '',
            },
            form: {
                type: Object,
                required: true,
                default () {
                    return {}
                },
            }
        },
        data() {
            return {
            };
        },
        computed: {
            defaultConfig () {
                let { itemType = 'input', config, filterOptionFn } = this;
                let defaultObj = {
                    itemType,
                    filterOption: filterOptionFn
                };
                if (itemType === 'select') {
                    defaultObj = {
                        ...defaultObj,
                        dropdownStyle: {
                            width: '100%',
                        }
                    }
                }
                else if (itemType === 'tree-select') {
                    defaultObj = {
                        ...defaultObj,
                        dropdownStyle: {
                            maxHeight: '400px',
                            maxWidth: '240px',
                            overflow: 'auto'
                        }
                    }
                }
                return {
                    ...defaultObj,
                    ...config,
                }
            },
            itemType () {
                return this.config.itemType || 'input';
            },
            searchOriginCondition () {
                return this.config.searchOriginCondition || {};
            },
            decorator () {
                const { decorator = {} } = this.config;
                const triggerBlurTypes = ['input', 'name-input', 'select-input-group'];
                if (!decorator.trigger) decorator.trigger = triggerBlurTypes.includes(this.itemType) ? 'blur' : 'change';
                return decorator;
            },
            listeners () {
                const _listeners = {};
                const { config, itemType } = this;
                const { showSearch, searchAsync } = config;
                Object.keys(config).map(key => {
                    const item = config[key];
                    if (item instanceof Function) _listeners[key] = item;
                });
                if (itemType === 'select') {
                    // TODO: 绑定异步查询
                    showSearch && searchAsync && (_listeners.search = tools.debounce(this.fetchSelectDataSource, debounceTime));
                    _listeners.change = (e) => {
                        this.form.setFieldsValue({
                            [this.mapKey]: e,
                        });
                        // 执行传入的回调
                        config.change && config.change(e);
                        (config.listeners || {}).change && (config.listeners || {}).change(e);
                    }
                }
                else if (itemType === 'auto-complete') {
                    // TODO: 绑定异步查询
                    searchAsync && (_listeners.search = tools.debounce(this.fetchAutoCompleteDataSource, debounceTime));
                }
                else if (itemType === 'input') {
                    _listeners.input = (e) => {
                        // TODO: 解决renderCell绑定页面data值发生变化时，input框默认值回滚问题
                        this.form.setFieldsValue({
                            [this.mapKey]: e.target.value,
                        });
                        // 执行传入的回调
                        config.input && config.input(e);
                        (config.listeners || {}).input && (config.listeners || {}).input(e);
                    }
                }
                return {
                    ..._listeners,
                    ...config.listeners,
                };
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        methods: {
            init () {
                const { itemType } = this;
                if (itemType === 'select') {
                    return this.fetchSelectDataSource();
                }
                else if (itemType === 'tree-select') {
                    return this.fetchTreeSelectDataSource();
                }
                else if (itemType === 'auto-complete') {
                    return this.fetchAutoCompleteDataSource();
                }
                else if (itemType === 'cascader') {
                    return this.fetchCascaderDataSource();
                }
            },
            handleBlur () {
                const { itemType, type, toFixed } = this.config;
                if (itemType === 'input' && type === 'number' && toFixed) {
                    const inputVm = getChild.call(this, 'AInput');
                    this.form.setFieldsValue({
                        [this.mapKey]: parseFloat(inputVm.value).toFixed(toFixed),
                    });
                }
            },
            // requestFn must resolve Array<Object>
            fetchSelectDataSource (value = '') {
                return new Promise((resolve, reject) => {
                    const { searchOriginCondition } = this;
                    const { requestFn, labelKey, valueKey } = searchOriginCondition;
                    const query = {};
                    value && (query.key = value);
                    if (requestFn) requestFn(query).then((data = []) => {
                        const { filter = () => true } = this.config;
                        const dataSource = (data || []).filter(filter).map(item => {
                            return {
                                label: item[labelKey],
                                value: valueKey === 'self' ? JSON.stringify(item) : item[valueKey],
                                ...item,
                            };
                        });
                        this.$set(this.config, 'dataSource', dataSource);
                        resolve(dataSource);
                    }).catch(reject);
                });
            },
            // requestFn must resolve Array<String>
            fetchAutoCompleteDataSource (value = '') {
                return new Promise((resolve, reject) => {
                    const { searchOriginCondition } = this;
                    const { requestFn } = searchOriginCondition;
                    const query = {};
                    value && (query.key = value);
                    if (requestFn) requestFn(query).then((data = []) => {
                        const { filter = () => true } = this.config;
                        const dataSource = (data || []).filter(filter).map(item => {
                            return item;
                        });
                        this.$set(this.config, 'dataSource', dataSource);
                        resolve(dataSource);
                    }).catch(reject);
                });
            },
            // requestFn must resolve Array<Object>
            fetchCascaderDataSource (value = '') {
                return new Promise((resolve, reject) => {
                    const { searchOriginCondition } = this;
                    const { lazyLoad, requestFn, searchKey, labelKey, valueKey } = searchOriginCondition;
                    // TODO: 逐层懒加载数据
                    if (lazyLoad) {
                        function getRemoteData (query = {}) {
                            return new Promise((_resolve, _reject) => {
                                value && (query.key = value);
                                requestFn(query).then((data = []) => {
                                    data.forEach(item => {
                                        !item.label && (item.label = item[labelKey]);
                                        !item.value && (item.value = item[valueKey]);
                                        item.isLeaf = false;
                                        item.loading = false;
                                        return item;
                                    });
                                    _resolve(data);
                                }).catch(_reject);
                            })
                        }
                        if (requestFn) {
                            // TODO: 绑定懒加载fn
                            this.$set(this.config, 'load-data', (selectedOptions) => {
                                const targetOption = selectedOptions[selectedOptions.length - 1];
                                targetOption.loading = true;
                                getRemoteData({
                                    parentId: targetOption[searchKey]
                                }).then(arr => {
                                    targetOption.loading = false;
                                    if (!arr.length) targetOption.isLeaf = true;
                                    else targetOption.children = arr;
                                    this.config.options = tools.deepClone(this.config.options);
                                });
                            });
                            // TODO: 加载首层数据
                            getRemoteData().then(arr => {
                                this.$set(this.config, 'options', arr);
                                resolve(arr);
                            });
                        }
                    }
                    // 一次性加载所有数据
                    else {
                        return this.fetchTreeSelectDataSource();
                    }
                });
            },
            // requestFn must resolve Array<Object>
            fetchTreeSelectDataSource (value = '') {
                return new Promise((resolve, reject) => {
                    const { searchOriginCondition } = this;
                    const { requestFn } = searchOriginCondition;
                    const query = {};
                    value && (query.key = value);
                    if (requestFn) requestFn(query).then((data = []) => {
                        const dataSource = this.formatTreeData(data);
                        this.$set(this.config, 'treeData', dataSource);
                        this.$set(this.config, 'options', dataSource);
                        resolve(dataSource);
                    }).catch(reject);
                });
            },
            // TODO: 将扁平化数组转换为树形结构数据
            formatTreeData (arr = []) {
                const { searchOriginCondition } = this;
                const { parentKey, childKey, labelKey, valueKey } = searchOriginCondition;
                const result = [];
                const map = {};
                (arr || []).forEach(item => {
                    map[item[childKey]] = item;
                });
                (arr || []).forEach((item, index) => {
                    !item.label && (item.label = item[labelKey]);
                    !item.value && (item.value = item[valueKey]);
                    const parent = map[item[parentKey]];
                    if (parent) {
                        !parent.children && (parent.children = []);
                        parent.children.push(item);
                        parent.selectable = false; // TODO: 有子集的节点不允许选择
                    }
                    else {
                        result.push(item);
                    }
                });
                return result;
            },
            filterOptionFn (input = '', option) {
                const { children } = option.componentOptions;
                const { text = '' } = children[0];
                return text.toLocaleUpperCase().includes(input.toLocaleUpperCase());
            }
        }
    };
</script>

<style lang="less" scoped>
.midea-form-item {
    &-content {
        display: flex;
        align-items: center;
        position: relative;

        &-count {
            font-size: 16px;
            color: #999;
            position: absolute;
            right: 10px;
            bottom: 10px;
        }
    }
}
</style>

