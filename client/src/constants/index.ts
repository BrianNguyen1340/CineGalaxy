export const convertCamelToSnake = (str: string) =>
    str.replace(/([A-Z])/g, '_$1').toLowerCase();

export const getUrlParams = () =>
    Object.fromEntries(new URLSearchParams(window.location.search));

export const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toLocaleUpperCase());

export const isEmptyObject = (obj: Record<string, any>) =>
    Object.keys(obj).length === 0;

export const isPalindrome = (str: string) => {
    const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleaned === cleaned.split('').reverse().join('');
};

export const fetchJSON = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const generateRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const convertStringToTitleCase = (str: string) =>
    str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const getCurrentDateTime = () => new Date().toLocaleString();

export const flattenNestedArrays = (array: Array<any>) => array.flat(Infinity);

export const sortAnArrayOfObjects = (
    array: Array<Record<string, any>>,
    key: string,
) =>
    array.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });

export const numberEvenOrOdd = (num: number): boolean => num % 2 === 0;

export const generateUUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const randomHex = (Math.random() * 16) | 0;
        const result = c === 'x' ? randomHex : (randomHex & 0x3) | 0x8;
        return result.toString(16);
    });

export const getRandomElementFromArray = (array: Array<any>) => {
    if (array.length === 0) {
        throw new Error('Array cannot be empty');
    }
    return array[Math.floor(Math.random() * array.length)];
};

export const celsiusToFahrenheit = (celsius: number): number =>
    (celsius * 9) / 5 + 32;

export const getUniqueValuesFromArray = (array: Array<any>): Array<any> => {
    if (!Array.isArray(array)) {
        throw new Error('Input must be an array');
    }
    return [...new Set(array)];
};

export const sumOfArrayElements = (array: Array<number>): number => {
    if (!Array.isArray(array)) {
        throw new Error('Input must be an array');
    }

    return array.reduce((accumulator, currentValue) => {
        if (typeof currentValue !== 'number') {
            throw new Error('All elements in the array must be numbers');
        }
        return accumulator + currentValue;
    }, 0);
};

export const getDistinctCharactersInString = (str: string): string => {
    return [...new Set(str)].join('');
};

export const convertArrayToObject = (
    array: Array<Record<string, any>>,
    key: string,
) =>
    array.reduce((accumulator, item) => {
        const itemKey = item[key];
        accumulator[itemKey] = (accumulator[itemKey] || 0) + 1;
        return accumulator;
    }, {});

export const countOccurencesInArray = (
    array: Array<string | number>,
): Record<string | number, number> => {
    return array.reduce<Record<string | number, number>>(
        (acc, item) => {
            if (typeof item === 'string' || typeof item === 'number') {
                acc[item] = (acc[item] || 0) + 1;
            }
            return acc;
        },
        {} as Record<string | number, number>,
    );
};

export const removeSpecificItemFromArray = <T>(
    array: Array<T>,
    item: T,
): Array<T> => array.filter((i) => i !== item);

export const checkForAnagram = (str1: string, str2: string) => {
    const normalize = (str: string) =>
        str
            .toLowerCase()
            .replace(/[^a-z]/g, '')
            .split('')
            .sort()
            .join('');

    return normalize(str1) === normalize(str2);
};

export const convertObjectToQueryString = (
    obj: Record<string, any>,
): string => {
    return Object.keys(obj)
        .map((key) => {
            const value = obj[key];
            return value !== undefined
                ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                : null;
        })
        .filter(Boolean)
        .join('&');
};

export const delayExecution = (
    func: () => void,
    ms: number,
): NodeJS.Timeout => {
    return setTimeout(func, ms);
};

export const deepCloneObject = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

export const randomNumberGenerator = (min: number, max: number) => {
    return Math.floor(Math.random() + (max - min + 1) + min);
};

export const isEmptyArray = (arr: any): boolean =>
    Array.isArray(arr) && arr.length === 0;

export const uniqueArray = <T>(arr: T[]): T[] => [...new Set(arr)];
