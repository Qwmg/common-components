/**
 * @todo Validate midea-form in vm.
 * @param {Array<String>} refs refs in vm.
 * @param {Vue} vm 
 */
export function validatorForms (refs = [], vm) {
    
    function validateForm (form) {
        return new Promise((resolve, reject) => {
            form.validate((err, values) => {
                if (!err) {
                    resolve(values);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    let promiseArr = [];
    
    refs.forEach(ref => {
        const refVm = vm.$refs[ref];
        const form = refVm instanceof Array ? refVm[0] : refVm
        form && promiseArr.push(validateForm(form));
    });

    return Promise.all(promiseArr);
};

/**
 * @todo getFormItemVm 获取midea-form的form-item vm 
 * @param {Object} formVm form vue component
 * @param {String} formItemKey map key
 */
export function getFormItemVm (formVm = {}, formItemKey = '') {

    return formVm.$refs.mideaForm.$refs[formItemKey][0];

};

export default {
    validatorForms,
    getFormItemVm
}