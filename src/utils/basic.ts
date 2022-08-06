export const stringIsEmpty = (str: string) => !str || str.length === 0;

export const objectIsEmpty = (obj: object) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

export const arrayIsEmpty = <T extends string>(array: T[]) => array.length === 0;

export const timestampToDate = (timestamp: number) => {
    const d = new Date(timestamp * 1000);
    // Mon Aug 08 2022 01:37:19 GMT+0300 (Eastern European Summer Time)
    const datatext = d.toTimeString()
    // ['01:37:19', 'GMT+0300', '(Eastern', 'European', 'Summer', 'Time)']
    return datatext.split(' ')[0] + ", " + d.toDateString();
};
