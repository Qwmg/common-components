<template>
    <div class="midea-upload">
        <a-upload
            name="file"
            v-bind="$attrs"
            :beforeUpload="handleBeforeUpload"
            :fileList="fileList"
            :remove="handleRemove"
            @preview="handlePreview"
        >
            <div>
                <slot />
            </div>
        </a-upload>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Array,
                default () {
                    return [];
                }
            },
            // 最大上传个数
            max: Number,
            // 格式限制
            formats: {
                type: Array,
                default () {
                    return [];
                }
            },
            // MB
            size: {
                type: Number,
                default: 5,
            },
            maxTips: String,
            sizeTips: String,
            formatsTips: String,
        },
        data () {
            return {
                fileList: [],
            }
        },
        watch: {
            value: {
                immediate: true,
                handler (arr = []) {
                    this.fileList = arr;
                }
            }
        },
        methods: {
            handleBeforeUpload (file) {
                const { max, formats = [], size, maxTips, sizeTips, formatsTips, fileList } = this;
                if (max && fileList.length >= max) {
                    return this.$message.warning(maxTips || `Upload ${max} file at most.`);
                }
                else if (file.size / 1024/ 1024 > size) {
                    return this.$message.warning(sizeTips || `The maximum file size is ${size}MB.`);
                }
                else if (!formats.includes(file.name.split('.')[1])) {
                    return this.$message.warning(formatsTips || `Can only upload ${formats.join(', ')} format.`);
                }
                this.fileList.push(file);
                this.$emit('change', this.fileList);
            },
            getBase64 (file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            },
            async handlePreview (file) {
                // const preview = await this.getBase64(file);
            },

            handleRemove (file) {
                this.fileList = this.fileList.filter(item => item.uid !== file.uid);
                this.$emit('change', this.fileList);
            }
        },
    };
</script>

<style lang="less">

.midea-upload {
}

</style>
