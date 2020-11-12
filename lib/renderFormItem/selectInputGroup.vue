<template>
    <div class="select-input-group">
        <a-input-group compact>
            <a-select v-model="arr[0]" @change="handleChange(0, $event)">
                <a-select-option
                    v-for="(item, index) in dataSource"
                    :key="index"
                    :value="item.value">
                {{ item.label }}
                </a-select-option>
            </a-select>
            <a-input v-model="arr[1]" @change="handleChange(1, $event)" @blur="$emit('blur', arr)"/>
        </a-input-group>
    </div>
</template>

<script>
    import tools from '../utils/tools.js';
    export default {
        name: 'selectInputGroup',
        props: {
            value: {
                type: Array,
            },
            dataSource: {
                type: Array,
                default () {
                    return  [];
                },
            }
        },
        data() {
            return {
                arr: [null, null],
            };
        },
        watch: {
            value: {
                immediate: true,
                handler (val) {
                    this.arr = val || [null, null]
                }
            },
        },
        methods: {
            handleChange (index, e) {
                if (index === 0) this.arr[index] = e;
                else this.arr[index] = e.target.value;
                this.$emit('change', tools.deepClone(this.arr));
                // const length = this.arr.filter(item => item).length;
                // if (length === this.arr.length) {
                //     this.$emit('change', tools.deepClone(this.arr));
                // }
            },
        }
    };
</script>

<style lang="less">
.select-input-group {
    width: 100%;

    .ant-input-group {
        display: flex !important;
    }

    .ant-select-selection {
        width: 80px;
    }

}
</style>

