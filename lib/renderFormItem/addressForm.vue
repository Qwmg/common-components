<template>
    <div class="address-form">
        <div class="address-form-content">
            <a-input v-bind="$attrs" :value="viewAddress"/>
            <div class="address-form-content-button" @click="handleClick"></div>
        </div>
        <a-modal
            :title="labelConfig.Title_address.label"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            :okText="labelConfig.Title_confirm.label"
            :cancelText="labelConfig.BTN_cancel.label"
            >
            <midea-edit-form
                v-if="addressFormMap"
                ref="addressForm"
                :value="addressFormValue"
                :map="addressFormMap"
                :renderConfig="renderConfig"></midea-edit-form>
        </a-modal>
    </div>
</template>

<script>
    import { validatorForms, getFormItemVm } from '../../utils/common';

    let vm;

    const addressFormMap = {
        // 邮编
        zipcode: {
            itemType: 'input',
            input (e) {
                vm.$nextTick(() => {
                    vm.restDetailsAddress();
                });
            },
            change (e) {
                vm.$nextTick(() => {
                    vm.restDetailsAddress();
                });
            },
        },
        // 街道
        address1: {
            itemType: 'input',
            input (e) {
                vm.$nextTick(() => {
                    vm.restDetailsAddress();
                });
            },
            change (e) {
                vm.$nextTick(() => {
                    vm.restDetailsAddress();
                });
            },
        },
        // 省
        state: {
            itemType: 'select',
            showSearch: true,
            searchOriginCondition: {
                labelKey: 'nameLoc',
                valueKey: 'self',
                requestFn (query = {}) {
                    if (!vm.addressFormValue.countryCode) return Promise.resolve([]);
                    return new Promise((resolve, reject) => {
                        vm.$request.iService.post(`/${vm.interfaceParams.site}/region`, {
                            parentCode: vm.addressFormValue.countryCode || vm.interfaceParams.countryCode || 'TH',
                        }).then(({ data = [] }) => resolve(data)).catch(reject);
                    });
                },
            },
            change (e) {
                vm.$nextTick(() => {
                    if (vm.addressFormMap.city) {
                        // TODO: 重置city
                        vm.$delete(vm.addressFormValue, 'city');
                        getFormItemVm(vm.$refs.addressForm, 'city').init();
                        // TODO: 重置district
                        vm.$delete(vm.addressFormValue, 'district');
                        getFormItemVm(vm.$refs.addressForm, 'district').init();
                    }
                    vm.restDetailsAddress();
                });
            },
        },
        // 市
        city: {
            itemType: 'select',
            showSearch: true,
            searchOriginCondition: {
                labelKey: 'nameLoc',
                valueKey: 'self',
                requestFn (query = {}) {
                    if (!vm.addressFormValue.state) return Promise.resolve([]);
                    return new Promise((resolve, reject) => {
                        vm.$request.iService.post(`/${vm.interfaceParams.site}/region`, {
                            parentCode: JSON.parse(vm.addressFormValue.state).code,
                        }).then(({ data = [] }) => resolve(data)).catch(reject);
                    });
                },
            },
            change (e) {
                vm.$nextTick(() => {
                    // TODO: 重置district
                    if (vm.addressFormMap.district) {
                        vm.$delete(vm.addressFormValue, 'district');
                        getFormItemVm(vm.$refs.addressForm, 'district').init();
                    }
                    vm.restDetailsAddress();
                });
            },
        },
        // 区
        district: {
            itemType: 'select',
            showSearch: true,
            searchOriginCondition: {
                labelKey: 'nameLoc',
                valueKey: 'self',
                requestFn (query = {}) {
                    if (!vm.addressFormValue.city) return Promise.resolve([]);
                    return new Promise((resolve, reject) => {
                        vm.$request.iService.post(`/${vm.interfaceParams.site}/region`, {
                            parentCode: JSON.parse(vm.addressFormValue.city).code,
                        }).then(({ data = [] }) => resolve(data)).catch(reject);
                    });
                },
            },
            change (e) {
                vm.$nextTick(() => {
                    vm.restDetailsAddress();
                });
            },
        },
    };

    export default {
        props: {
            value: {
                type: Array,
                default () {
                    return ['', '', ''];
                }
            },
            needMiddleName: Boolean,
            placeholderList: {
                type: Array,
                default () {
                    return ['', '', ''];
                }
            },
            labelConfig: {
                type: Object,
                default () {
                    return {};
                }
            },
            interfaceParams: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data() {
            return {
                visible: false,
                viewAddress: '',
                addressFormValue: {
                    fullAddress: ''
                },
                addressFormMap: null,
                renderConfig: {
                    col: {
                        xl: 24,
                        lg: 24,
                        md: 24,
                    },
                },

                addressConfig: null,
                arr: ['', '', ''],
                defaultFormValue: {}
            };
        },
        watch: {
        },
        created () {
            vm = this;
        },
        methods: {
            async getDynamicFormMap () {
                const { site, language, divisionCode, countryCode } = this.interfaceParams || {};
                let addressConfig = {}
                if (!this.addressConfig) {
                    addressConfig = (await this.$request.iService.post(`/${site}/address/getAddressConfig`, {
                        language,
                        countryCode,
                    })).data;
                    this.addressConfig = addressConfig;
                }
                
                const obj = {
                    fullAddress: {
                        label: this.labelConfig.PR_street.label,
                        disabled: true
                    },
                    countryCode: {
                        itemType: 'select',
                        label: this.labelConfig['PR_country/region'].label,
                        searchOriginCondition: {
                            labelKey: 'country',
                            valueKey: 'countryCode',
                            requestFn: (query = {}) => {
                                return new Promise((resolve, reject) => {
                                    this.$request.iService.post(`/${site}/service/queryCountryByDivisionCode`, {
                                        divisionCode,
                                    }).then(({ data = [] }) => {
                                        resolve(data);
                                        if (data.length === 1) {
                                            this.addressFormValue = {
                                                ...this.addressFormValue,
                                                countryCode: data[0].countryCode
                                            };
                                            this.defaultFormValue.countryCode = data[0].countryCode;
                                            getFormItemVm(this.$refs.addressForm, 'state').init();
                                        }
                                    }).catch(reject);
                                });
                            },
                        },
                        change (e) {
                            this.$nextTick(() => {
                                // TODO: 重置state
                                this.$delete(this.addressFormValue, 'state');
                                getFormItemVm(this.$refs.addressForm, 'state').init();
                                // TODO: 重置city
                                this.$delete(this.addressFormValue, 'city');
                                getFormItemVm(this.$refs.addressForm, 'city').init();
                                // TODO: 重置district
                                this.$delete(this.addressFormValue, 'district');
                                getFormItemVm(this.$refs.addressForm, 'district').init();
                                this.restDetailsAddress();
                            });
                        },
                    },
                };
                // TODO: 匹配接口返回的表单配置
                addressConfig.itemList.forEach(item => {
                    const { fieldName, displayname, requiredFlag } = item;
                    obj[fieldName] = addressFormMap[fieldName];
                    obj[fieldName].label = displayname;
                    // 是否必填
                    if (requiredFlag === 'Y') {
                        obj[fieldName].decorator = {
                            trigger: 'blur',
                            ...(addressFormMap[fieldName].decorator || {}),
                            rules: [{
                                required: requiredFlag === 'Y' ? true : false,
                                message: ' '
                            }]
                        };
                    }
                });
                return obj;
            },
            async handleClick () {
                if (!this.addressConfig) {
                  await this.getDynamicFormMap().then(res => this.addressFormMap = res);
                }
                this.visible = true;
            },
            restDetailsAddress () {
                const { zipcode = '', address1 = '', state, city, district } = this.addressFormValue;
                let fullAddress = '';
                const districtName = district ? JSON.parse(district).nameLoc : '';
                const cityName = city ? JSON.parse(city).nameLoc : '';
                const stateName = state ? JSON.parse(state).nameLoc : '';
                fullAddress += address1 ? `${address1} ` : '';
                fullAddress += districtName ? `${districtName} ` : '';
                fullAddress += cityName ? `${cityName} ` : '';
                fullAddress += stateName ? `${stateName} ` : '';
                fullAddress += zipcode ? `${zipcode} ` : '';
                this.addressFormValue.fullAddress = fullAddress.trim();
                this.addressFormValue = this.$tools.deepClone(this.addressFormValue);
            },
            handleOk () {
                validatorForms(Object.keys(this.$refs), this).then(res => {
                    const data = {
                        ...res[0]
                    };
                    this.viewAddress = this.addressFormValue.fullAddress;
                    this.$emit('change', this.addressFormValue);
                    this.visible = false;
                    this.defaultFormValue = this.$tools.deepClone(this.addressFormValue);
                }).catch(err => {
                    console.log(err)
                });
            },
            handleCancel () {
                this.visible = false;
                this.$refs.addressForm.reset(this.defaultFormValue);
            },
        }
    };
</script>

<style lang="less" scoped>
.address-form {
    width: 100%;
    position: relative;

    &-content {
        &-button {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
            z-index: 1;
        }
    }
}
</style>

