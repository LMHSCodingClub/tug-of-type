/**
 * A. find suffixes[v%10] if >= 20 (20th...99th)
 * 
 * B. if not found, try suffixes[v] (0th..3rd), 
 * 
 * C. if still not found, use suffixes[0] (4th..19th)
 * @see https://stackoverflow.com/a/31615643
 * @param {number} num The number
 * @returns The number with the ordinal suffix
 */
export function getNumberWithOrdinal(num) {
    const suffixes = ["th", "st", "nd", "rd"],
        v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export function scrolledToBottom(element) {
    return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1
}