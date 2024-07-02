import { getCurrentActor, translate } from "../../../utils"

export default abstract class AbstractFumbleResolver {
    constructor(readonly actor: Actor, readonly value: number, readonly container: JQuery) {

    }

    public render(html: JQuery): void {
        if (this.shouldRender()) {
            const attributes = mergeObject(this.defaultAttributes(), this.getButtonAttributes())
            const dataAttributes = Object.entries(attributes).map(([key, value]) => `data-${key}='${value}'`).join(' ')
            const button = $(`<button class="apply-fumble" ${dataAttributes}>${this.getButtonLabel()}</button>`)
            html.append(button)
        }
    }

    getButtonLabel() {
        return translate('WITCHER_TWEAKS.Fumble.Apply');
    }

    defaultAttributes() {
        return {
            "value": this.value
        }
    }

    public static restoreDefaultParams(event: Event): DefaultParams|undefined {
        event.preventDefault()
        const actor = getCurrentActor()
        if (!actor) {
            ui.notifications.error(translate("WITCHER.Context.SelectActor"))
            return
        }
        //@ts-expect-error
        const target = $(event.target) as unknown as JQuery<HTMLElement>
        const container = target.closest('.chat-message')
        const value = target.data('value')

        if (actor && value && target && container) {
            return {
                actor: actor,
                value: value,
                target: target,
                container: container
            }
        }

        return
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
    container: JQuery<HTMLElement>
}