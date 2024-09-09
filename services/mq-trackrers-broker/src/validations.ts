/**
 *
 * @param hdop
 * @returns boolean
 */
export const isHdopValid = (hdop: number) => {
    console.log(`HDOP is ${hdop}`);
    return hdop >= 0 && hdop < 3;
};

/**
 *
 * @param dtd it is the moment the device collected this date
 * @returns boolean
 */
export const isDtsLessThanOneHour = (dtd: string) => {
    const now = new Date().getTime();
    const date = new Date(dtd).getTime();
    const difference = now - date;

    const hoursDifference = Math.floor(difference/1000/60/60);
    console.log(`Dtd difference is ${hoursDifference}`);
    return hoursDifference <= 1;
};
