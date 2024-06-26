function deepGet(obj: Object, keys: any[]): any {
    return keys.reduce((xs, x) => xs?.[x] ?? null, obj);
};

export function deepGetByPaths(obj: Object, path: string): any {
    return deepGet(
        obj,
        path
            .replace(/\[([^\[\]]*)\]/g, '.$1.')
            .split('.')
            .filter(t => t !== '')
    );
}