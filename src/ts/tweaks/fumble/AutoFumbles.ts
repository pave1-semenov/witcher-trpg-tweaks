import * as t from "./types";
import { translate } from "../../utils";
import MeleeWeaponFumbleResolver from "./resolver/MeleeWeaponFumbleResolver";
import AbstractFumbleResolver from "./resolver/AbstractFumbleResolver";

export default class AutoFumbles {
    static instance: AutoFumbles

    public static getInstance(): AutoFumbles {
        if (this.instance == null) {
            this.instance = new AutoFumbles()
        }

        return this.instance;
    }

    public init() {
        Hooks.on("renderChatMessage", (messageData: t.ChatMessageData, html: JQuery) => this.handleChatMessage(messageData, html))
    }

    public attachChatListeners(html: JQuery) {
        MeleeWeaponFumbleResolver.attachListener(html)
    }

    private async handleChatMessage(messageData: t.ChatMessageData, html: JQuery) {
        if (messageData.isAuthor && !messageData.flags?.stop) {
            const rollType = this.getRollType(messageData)
            if (rollType === t.RollType.UNKNOWN) {
                return
            }
            const roll = messageData.rolls[0]
            const isFumbleRoll = this.isFumble(roll)
            if (isFumbleRoll) {
                const fumbleValue = this.extractFumbleValue(roll)
                await this.renderFumble(messageData, html, fumbleValue, rollType)
            }
        }
    }

    private async renderFumble(messageData: t.ChatMessageData, html: JQuery, value: number, type: t.RollType) {
        const description = this.getFumbleDescription(value, type)
        let fumbleHtml = $(`<p class="fumble-details">${description}</p>`);

        const resolver = this.getFumbleResolver(messageData, value, type)
        resolver?.render(fumbleHtml)

        html.find('.dice-fail:first').append(fumbleHtml)

        const flavor = html.find('.flavor-text').html()
        const flags = messageData.flags
        flags.stop = true

        return await messageData.update({ flavor: flavor, flags: flags })
    }

    private getRollType(messageData: t.ChatMessageData): t.RollType {
        const flags = messageData.flags
        let rollType = t.RollType.UNKNOWN;
        if (this.hasAttackFlags(flags)) {
            const attack = flags as t.WitcherAttackFlags
            rollType = t.ATTACK_SKILLS_MAPPING[attack.attackSkill]
        } else if (this.hasDefenceFlags(flags)) {
            const defence = flags as t.WitcherDefenceFlags
            rollType = t.DEFENCE_SKILLS_MAPPING[defence.defenceSkill.label]
        }

        return rollType;
    }

    private hasAttackFlags(flags: t.WitcherAttackFlags | any): flags is t.WitcherAttackFlags {
        return (flags as t.WitcherAttackFlags).attackSkill !== undefined
    }

    private hasDefenceFlags(flags: t.WitcherDefenceFlags | any): flags is t.WitcherDefenceFlags {
        return (flags as t.WitcherDefenceFlags).defenceSkill !== undefined
    }

    private isFumble(roll: Roll | undefined): boolean {
        const fumbleText = translate('WITCHER.Fumble')

        return roll?.formula?.includes(fumbleText) || false
    }

    private extractFumbleValue(roll: Roll): number {
        const value = roll.terms.at(-1)?.total;
        return Number(value) || 0;
    }

    private getFumbleDescription(value: number, type: t.RollType) {
        let description = '';
        switch (type) {
            case t.RollType.ATTACK_WITH_MELEE_WEAPON:
            case t.RollType.ATTACK_UNARMED:
            case t.RollType.DEFENCE_WITH_WEAPON:
            case t.RollType.DEFENCE_UNARMED:
                const translationPath = t.FUMBLE_TRANSLATION_LABELS[type]
                description = this.lookupFumbleValue(translationPath, value);
                break;
        }

        return description;
    }

    private lookupFumbleValue(basePath: string, value: number) {
        let typeLabel = translate(`${basePath}.Title`)
        let fumbleLabel = ''

        if (value < 6) {
            fumbleLabel = `${basePath}.min`
        } else if (value > 9) {
            fumbleLabel = `${basePath}.max`
        } else {
            fumbleLabel = `${basePath}.r${value}`
        }
        const fumbleEffect = translate(fumbleLabel)

        return `<b>${typeLabel}</b>: ${fumbleEffect}`;
    }

    private getFumbleResolver(messageData: t.ChatMessageData, value: number, rollType: t.RollType): AbstractFumbleResolver | null {
        let resolver = null
        //@ts-expect-error
        let speaker = ChatMessage.getSpeaker(messageData)
        let actor = ChatMessage.getSpeakerActor(speaker)
        if (!actor) {
            return resolver
        }

        switch (rollType) {
            case t.RollType.ATTACK_WITH_MELEE_WEAPON:
                resolver = new MeleeWeaponFumbleResolver(actor, value, messageData.flags.item)
                break
        }

        return resolver
    }
}

