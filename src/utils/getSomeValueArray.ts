/*
* origin 原数组
* target 要从原数组种拷贝的新数组key值
* key target包含的origin的元素的key值
*/

interface IParam {
    origin: object[],
    target: string[],
    key: string,
    targetKey?: string;
}

export const getSomeValue = (origin, target, key): IParam => {
    const arr = origin.map(item => {
        if (target.includes(item[key])) {
            return item
        }
    })
    return arr.filter(item => item)

}