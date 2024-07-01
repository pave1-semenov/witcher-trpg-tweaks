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

export function translate(label: string) {
    return getGame().i18n.localize(label)
}

export function translateFormat(label: string, args: Record<string, any>) {
    return getGame().i18n.format(label, args)
}

export function getGame(): Game {
    return game as Game
}