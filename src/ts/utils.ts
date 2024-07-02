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
    return game.i18n.localize(label)
}

export function translateFormat(label: string, args: Record<string, any>) {
    return game.i18n.format(label, args)
}

export function getCurrentActor() {
    let controlledTokens = canvas.tokens?.controlled.slice() || []
    let actor: Actor | null;
    if (controlledTokens?.length == 0 && game.user?.character) {
        actor = game.user.character
    } else {
        actor = controlledTokens[0]?.actor
    }

    return actor
}