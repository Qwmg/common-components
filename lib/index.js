import "babel-polyfill";

// import {
//     Input,
//     Select,
//     Cascader,
//     DatePicker,
//     TimePicker,
//     AutoComplete,
//     Checkbox,
//     Form,
//     Row,
//     Col,
// } from "ant-design-vue";
// import 'ant-design-vue/dist/antd.css';

import "./static/css/global/index.less";
// import moment from 'moment';
// import 'moment/locale/zh-cn';
// moment.locale('zh-cn');

// 组件
import renderCell from './renderCell';
import mideaEditForm from './editForm/index.vue';

import common from './utils/common';

// const antdComponents = {
//     Input,
//     TextArea: Input.TextArea,
//     InputSearch: Input.Search,
//     InputPassword: Input.Password,
//     InputGroup: Input.Group,

//     Select,
//     SelectOption: Select.Option,
//     SelectOptGroup: Select.OptGroup,

//     DatePicker,
//     MonthPicker: DatePicker.MonthPicker,
//     RangePicker: DatePicker.RangePicker,
//     WeekPicker: DatePicker.WeekPicker,

//     TimePicker,
    
//     Checkbox,
//     CheckboxGroup: Checkbox.Group,
    
//     AutoComplete,
//     AutoCompleteOption: AutoComplete.Option,
//     AutoCompleteOptGroup: AutoComplete.OptGroup,

//     Form,
//     FormItem: Form.Item,

//     Cascader,
//     Row,
//     Col,
// };
// console.log(antdComponents, require("ant-design-vue"))

export const EditForm = mideaEditForm;

export default {
    install (Vue, options = {}) {
        const components = {
            renderCell,
            mideaEditForm,
        };

        // TODO: register antd components
        // Object.keys(antdComponents).forEach(key => {
        //     if (!antdComponents[key]) return console.error(`${key} components is ont definded`);
        //     Vue.component(tools.toLowerLine(antdComponents[key].name), antdComponents[key]);
        // });

        // TODO: register custom components
        Object.keys(components).forEach(key => {
            Vue.component(key, components[key]);
        });

        Vue.prototype.$formCommonFn = common;
    }
  };