import { translate, translateFormat } from "../../../utils"
import { ATTACK_LOCATIONS_MAPPING, AttackLocationData, Weapon } from "../types"
import AbstractFumbleResolver from "./AbstractFumbleResolver"

export default class MeleeWeaponFumbleResolver extends AbstractFumbleResolver {
    constructor(actor: Actor, value: number, container: JQuery, readonly weapon: Weapon) {
        super(actor, value, container)
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
        switch (this.value) {
            case 8:
                await this.damageWeapon()
                break
            case 9:
            case 10:
                await this.doDamage()
                break
            default: console.log('plaki plaki')
        }
    }

    private async damageWeapon() {
        const roll = await new Roll('1d10').evaluate({ async: true })
        const currentDurability = this.weapon.system.reliable
        const newDurability = Math.max(currentDurability - roll.total, 0)

        await this.weapon.update({ 'system.reliable': newDurability })

        let message = `<div>${this.chatMessageHeader()}<p>${translateFormat('WITCHER_TWEAKS.Fumble.MeleeWeaponAttack.Apply.Damage', { dmg: roll.total })}</p>`

        if (newDurability == 0) {
            message += `<p>${translate('WITCHER_TWEAKS.Fumble.MeleeWeaponAttack.Apply.Broken')}</p>`
        }
        message += '</div>'

        const messageData = {
            flavor: message
        }

        return await roll.toMessage(messageData)
    }

    async doDamage() {
        //@ts-ignore
        const location = this.actor.getLocationObject("randomHuman") as AttackLocationData
        const damageButton = this.container.find('button.damage')
        if (location && damageButton) {
            const buttonClone = damageButton.clone().attr('data-location', JSON.stringify(location)).attr('data-location-formula', location.locationFormula)

            const value = ATTACK_LOCATIONS_MAPPING[location.name]
            const roll = await new Roll(`${value}[1d10]`).evaluate({async: true})

            let message = `<div><h1>${this.chatMessageHeader()}</h1>
                <p>${translateFormat('WITCHER_TWEAKS.Fumble.MeleeWeaponAttack.Apply.HitLocation', {'loc': location.alias})}</p>
                ${buttonClone.prop('outerHTML')}
            </div>`

            return await roll.toMessage({flavor: message})
        }

        return
    }

    private chatMessageHeader() {
        return `<h1><img src="${this.weapon.img}" class="item-img" />${translate('WITCHER.Fumble')}: ${this.weapon.name}</h1>`;
    }


    static async restoreAndResolve(event: Event) {
        const params = super.restoreDefaultParams(event)
        if (params) {
            const weaponId = params.target.data('weapon')
            //@ts-ignore
            const weapon = params.actor.getList('weapon').find((w: Weapon) => w._id === weaponId)
            if (weapon) {
                const instance = new MeleeWeaponFumbleResolver(params.actor, params.value, params.container, weapon)
                await instance.resolve()
            } else {
                ui.notifications.error(translate("WITCHER_TWEAKS.Context.ItemNotOwned"))
            }
        }
    }

    static attachListener(html: JQuery) {
        html.on('click', `[data-fumble='melee-wep']`, this.restoreAndResolve)
    }
}