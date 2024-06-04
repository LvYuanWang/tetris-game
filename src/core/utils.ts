/**
 * 根据最大值和最小值获取随机数
 * @param max 最大数
 * @param min 最小数
 */
export function getRandom(max: number, min: number) {
    const don = max - min;
    return Math.floor(Math.random() * don + min);
}