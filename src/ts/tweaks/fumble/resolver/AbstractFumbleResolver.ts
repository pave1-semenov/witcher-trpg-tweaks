import { getGame, translate } from "../../../utils"

export default abstract class AbstractFumbleResolver {
    constructor(readonly actor: Actor, readonly value: number) {

    }

    public render(html: JQuery): void {
        if (this.shouldRender()) {
            const attributes = mergeObject(this.defaultAttributes(), this.getButtonAttributes())
            const dataAttributes = Object.entries(attributes).map(([key, value]) => `data-${key}='${value}'`).join(' ')
            const button = $(`<button class="apply-fumble" data-actor='${this.actor.id}' ${dataAttributes}>${translate('WITCHER_TWEAKS.Fumble.Apply')}</button>`)
            html.append(button)
        }
    }

    defaultAttributes() {
        return {
            "actor": this.actor,
            "value": this.value
        }
    }

    public static restoreDefaultParams(event: Event): DefaultParams {
        event.preventDefault()
        //@ts-expect-error
        const target = $(event.target) as unknown as JQuery<HTMLElement>
        const actorId = target.data('actor')
        const value = target.data('value')
        const actor = getGame().actors?.get(actorId) as Actor
        const isValid = target && actor && value

        return {
            actor: actor,
            value: value,
            target: target,
            isValid: isValid
        }
    }

    shouldRender(): boolean {
        return this.value < 6
    }

    abstract getButtonAttributes(): Record<string, any>
}

interface DefaultParams {
    actor: Actor
    value: number
    target: JQuery<HTMLElement>
    isValid: boolean
}