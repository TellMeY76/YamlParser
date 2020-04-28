const formatNumber = (num: number) => {
    const newNum = num.toString();
    return newNum[1] ? newNum : '0' + newNum;
};

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

export const getCurrentDate = () => {
    return formatDate(new Date());
};
