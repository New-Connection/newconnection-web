export const stringIsEmpty = (str: string) => !str || str.length === 0;

export const objectIsEmpty = (obj: object) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

export const arrayIsEmpty = <T extends string>(array: T[]) => array.length === 0;

export const timestampToDate = (timestamp: number) => {
    const d = new Date(timestamp * 1000);
    return d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
};
