import { Validators } from '@angular/forms';


export const UNEDITABLE_FLD: string[] = ['id'];

export const TAX_TYPE = {
    0: '一般纳税人', 1: '小规模纳税人'
};

export const CORP_INPUT_TYPE_VAL = {
    text: 1, amount: 2, prop: 3, num: 4, date: 5
};

export const CORP_INPUT_TYPE = {
    1: 'text', 2: 'amount', 3: 'prop', 4: 'num', 5: 'date'
};

export const ANALYSIS_TYPE = {
    0: '不符合', 1: '符合', 2: '信息不全', 3: '无结果'
};

export const CORP_INPUT_PERMISSION = {
    0: 'read', 1: 'write'
};

export const FLD_CH_EN = {
    taxType: '纳税人类型'
};
