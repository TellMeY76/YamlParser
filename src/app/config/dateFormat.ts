export const SPECIAL_DATES = [{
    title: '今天/今日', val: '今日'
},
{
    title: '在当前日期n年前', val: 'n年前'
},
{
    title: '在当前日期n年后', val: 'n年后'
}, {
    title: '空', val: 'NULL'
}];

export const SPECIAL_VAL_ZH = {
    today: '今日',
    yearsAgo: '年前',
    yearsLater: '年后'
};

export const SPECIAL_VAL_EN = {
    today: 'DATE_FORMAT(NOW(), \'%Y-%m-%d\')',
    yearsAgo: 'YEAR(NOW())-',
    yearsLater: 'YEAR(NOW())+'
};
