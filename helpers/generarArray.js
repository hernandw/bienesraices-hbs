export const generarArray = (value) => {
    return Array.from({ length: value }, (v, k) => k + 1);
}