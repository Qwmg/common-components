import validatorMap from './map/validatorMap';

export default {
    /**
     * @todo Get element dataset.
     * @param {String} selector dom选择器.
     * @returns {Object} dataset obj
     */
    getElDataset (selector) {
        return document.querySelector(selector).dataset;
    },

    /**
     * @todo Get isMobile.
     * @returns {Boolean} isMobile
     */
    isMobile () {
        return validatorMap.mobile.test(navigator.userAgent);
    },

    /**
     * @param {Function} cb callback
     * @param {Number} ms 毫秒
     * @returns {Function} debounce fn
     */
    debounce (cb, ms) {

        let timer = null;

        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => cb.apply(this, arguments), ms);
        };

    },

    /**
     * @todo deep clone param
     * @param {any} param
     * @returns {any} param
     */
    deepClone (param) {

        const typeStr = Object.prototype.toString.call(param);

        if (param && param._isAMomentObject) {
            return param;
        }
        else if (typeStr ===  '[object Array]') {

            const arr = [];

            param.forEach(item => {
                arr.push(this.deepClone(item));
            });
            
            return arr;

        }
        else if (typeStr ===  '[object Object]') {

            const obj = {};

            Object.keys(param).forEach(key => {
                obj[key] = this.deepClone(param[key]);
            });

            return obj;

        }
        else if (typeStr ===  '[object Date]') {
            
            return new Date(+param);

        }
        else return param;

    }
}