import { translate, translateFormat } from "../../../utils"
import { Weapon } from "../types"
import AbstractFumbleResolver from "./AbstractFumbleResolver"

export default class MeleeWeaponFumbleResolver extends AbstractFumbleResolver {
    constructor(actor: Actor, value: number, readonly weapon: Weapon) {
        super(actor, value)
    }

    override getButtonAttributes(): Record<string, any> {
        return {
            "weapon": this.weapon._id,
            "fumble": 'melee-wep'
        }
    }

    override shouldRender(): boolean {
        return this.value > 7
    }

    public async resolve() {
        switch(this.value) {
            case 8:
                await this.damageWeapon()
            default: console.log('plaki plaki')
        }
    }

    private async damageWeapon() {
        const roll = await new Roll('1d10').evaluate({async: true})
        const currentDurability = this.weapon.system.reliable
        const newDurability = Math.max(currentDurability - roll.total, 0)

        await this.weapon.update( { 'system.reliable': newDurability } )

        let message = `<div><h1><img src="${this.weapon.img}" class="item-img" />${translate('WITCHER.Fumble')}: ${this.weapon.name}</h1>
        <p>${translateFormat('WITCHER_TWEAKS.Fumble.MeleeWeaponAttack.Apply.Damage', {dmg: roll.total})}</p>`

        if (newDurability == 0) {
            message += `<p>${translate('WITCHER_TWEAKS.Fumble.MeleeWeaponAttack.Apply.Broken')}</p>`
        }
        message += '</div>'

        const messageData = {
            flavor: message
        }

        return await roll.toMessage(messageData)
    }

    static async restoreAndResolve(event: Event) {
        const params = super.restoreDefaultParams(event)
        if (params.isValid) {
            const weaponId = params.target.data('weapon')
            //@ts-ignore
            const weapon = params.actor.getList('weapon').find((w: Weapon) => w._id === weaponId)
            if (weapon) {
                const instance = new MeleeWeaponFumbleResolver(params.actor, params.value, weapon)
                await instance.resolve()
            }
        }
    }

    static attachListener(html: JQuery) {
        html.on('click', `[data-fumble='melee-wep']`, this.restoreAndResolve)
    }
}