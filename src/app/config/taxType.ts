import { SelectItem } from 'primeng';

export const taxTypes = {
    all: 1,
    smScale: 2,
    general: 3
};

export const taxTypeNames = {
    1: '全部类型',
    2: '小规模纳税人',
    3: '一般纳税人'
};


export const SelectTaxTypes: SelectItem[] = [
    { label: '全部类型', value: 1 },
    { label: '小规模纳税人', value: 2 },
    { label: '一般纳税人', value: 3 },
];
