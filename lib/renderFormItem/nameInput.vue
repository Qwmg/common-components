<template>
    <div class="name-input" :class="{ 'need-middle-name': needMiddleName }">
        <a-input
            :value="arr[0]"
            :placeholder="placeholderList[0]"
            @change="handleChange(0, $event)"
            @blur="$emit('blur', arr)"></a-input>
        <a-input
            v-if="needMiddleName"
            :value="arr[1]"
            :placeholder="placeholderList[1]"
            @change="handleChange(1, $event)"
            @blur="$emit('blur', arr)"></a-input>
        <a-input
            :value="arr[2]"
            :placeholder="placeholderList[2]"
            @change="handleChange(2, $event)"
            @blur="$emit('blur', arr)"></a-input>
    </div>
</template>

<script>
    import tools from '../utils/tools.js';
    export default {
        props: {
            value: {
                type: Array,
            },
            needMiddleName: Boolean,
            placeholderList: {
                type: Array,
                default () {
                    return ['', '', ''];
                }
            }
        },
        data() {
            return {
                arr: ['', '', ''],
            };
        },
        watch: {
            value: {
                immediate: true,
                handler (val) {
                    this.arr = val || ['', '', ''];
                }
            },
        },
        methods: {
            handleChange (index, e) {
                this.arr[index] = e.target.value;
                this.$emit('change', tools.deepClone(this.arr));
            },
        }
    };
</script>

<style lang="less" scoped>
.name-input {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .ant-input {
        width: 49%;
    }
}

.need-middle-name {
    .ant-input {
        width: 32%;
    }
}
</style>

