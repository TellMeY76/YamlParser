export const SPECIAL_DATES = [{
    title: '今日', val: "DATE_FORMAT(NOW(),'%Y-%m-%d')"
},
{
    title: 'n年前', val: 'YEAR(NOW())-n'
},
{
    title: 'n年后', val: 'YEAR(NOW())+n'
}]
