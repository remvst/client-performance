export function modulo(x: number, mod: number) {
    if (x >= 0) {
        return x % mod;
    }
    return x - mod * Math.floor(x / mod);
}
