import { SPECIAL_VAL_ZH, SPECIAL_VAL_EN } from '../config/dateFormat';

export const isSpecialVal = (value: string, valType?: string) => {
    let specialVal;
    const specialValChart = valType === 'en' ? SPECIAL_VAL_EN : SPECIAL_VAL_ZH;
    for (const key of Object.keys(specialValChart)) {
        const val = specialValChart[key];
        if (value.indexOf(val) >= 0) {
            specialVal = { key, val };
            break;
        }
    }
    return specialVal;
};

export const setSpecialVal = (type: string, value: string, regWords: string, valType?: string) => {
    let specialVal = valType === 'en' ? SPECIAL_VAL_EN[type] : SPECIAL_VAL_ZH[type];
    switch (type) {
        case 'today':
            break;
        default:
            const param = value.split(regWords).join('');
            specialVal = valType === 'en' ? `${specialVal}${param}` : `${param}${specialVal}`;
            break;
    }
    return specialVal;
};
