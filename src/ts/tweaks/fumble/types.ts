export enum RollType {
    ATTACK_WITH_MELEE_WEAPON,
    ATTACK_WITH_RANGED_WEAPON,
    ATTACK_UNARMED,
    DEFENCE_WITH_WEAPON,
    DEFENCE_UNARMED,
    ELEMENTAL_SPELL,
    HEX,
    UNKNOWN
}

export enum DefenceSkill {
    SWORSMANSHIP = "WITCHER.SkRefSwordsmanship",
    MELEE = "WITCHER.SkRefMelee",
    SMALL_BLADES = "WITCHER.SkRefSmall",
    STAFF = "WITCHER.SkRefStaff",
    BRAWLING = "WITCHER.SkRefBrawling",
    DODGE = "WITCHER.SkRefDodge",
    REPOSITION = "WITCHER.SkDexAthletics",
    RESIST_MAGIC = "WITCHER.SkWillResistMag"
}

export enum AttackSkill {
    SWORSMANSHIP = "Swordsmanship",
    MELEE = "Melee",
    SMALL_BLADES = "Small Blades",
    STAFF = "Staff/Spear",
    ARCHERY = "Archery",
    BRAWLING = "Brawling",
    ATHLETICS = "Athletics",
    CROSSBOW = "Crossbow"
}

export interface ChatMessageData {
    flags: WitcherDefenceFlags | WitcherAttackFlags | WitcherSpellFlags | any
    isAuthor: boolean
    rolls: [Roll]
    flavor: string
    update(props: any): Promise<any>
}

export interface WitcherDefenceFlags {
    defence: boolean
    defenceSkill: WitcherDefenceSkill
}

interface WitcherDefenceSkill {
    label: DefenceSkill
}

export interface WitcherAttackFlags {
    attackSkill: AttackSkill
    item: Weapon
}

export interface WitcherSpellFlags {
    spell: WitcherSpell
}

interface WitcherSpell {
    system: WitcherSpellParams
}

export enum SpellSource {
    MIXED = 'mixedElements',
    EARTH = 'earth',
    FIRE = 'fire',
    WATER = 'Water',
    AIR = 'air'
}

export enum SpellClass {
    SPELL = 'Spells',
    INVOCATION = 'Invocations',
    SIGN = 'Witcher',
    RITUAL = 'Rituals',
    HEX = 'Hexes',
    GIFT = 'MagicalGift'
}

interface WitcherSpellParams {
    source: SpellSource
    class: SpellClass
}

export const ATTACK_SKILLS_MAPPING: Record<AttackSkill, RollType> = {
    [AttackSkill.SWORSMANSHIP]: RollType.ATTACK_WITH_MELEE_WEAPON,
    [AttackSkill.SMALL_BLADES]: RollType.ATTACK_WITH_MELEE_WEAPON,
    [AttackSkill.MELEE]: RollType.ATTACK_WITH_MELEE_WEAPON,
    [AttackSkill.STAFF]: RollType.ATTACK_WITH_MELEE_WEAPON,
    [AttackSkill.ARCHERY]: RollType.ATTACK_WITH_RANGED_WEAPON,
    [AttackSkill.ATHLETICS]: RollType.ATTACK_WITH_RANGED_WEAPON,
    [AttackSkill.CROSSBOW]: RollType.ATTACK_WITH_RANGED_WEAPON,
    [AttackSkill.BRAWLING]: RollType.ATTACK_UNARMED,
} as const

export const DEFENCE_SKILLS_MAPPING: Record<DefenceSkill, RollType> = {
    [DefenceSkill.BRAWLING]: RollType.DEFENCE_UNARMED,
    [DefenceSkill.DODGE]: RollType.DEFENCE_UNARMED,
    [DefenceSkill.REPOSITION]: RollType.DEFENCE_UNARMED,
    [DefenceSkill.MELEE]: RollType.DEFENCE_WITH_WEAPON,
    [DefenceSkill.SWORSMANSHIP]: RollType.DEFENCE_WITH_WEAPON,
    [DefenceSkill.SMALL_BLADES]: RollType.DEFENCE_WITH_WEAPON,
    [DefenceSkill.STAFF]: RollType.DEFENCE_WITH_WEAPON,
    [DefenceSkill.RESIST_MAGIC]: RollType.UNKNOWN,
} as const

export const FUMBLE_TRANSLATION_LABELS: Record<RollType, string> = {
    [RollType.ATTACK_WITH_MELEE_WEAPON]: 'WITCHER_TWEAKS.Fumble.MeleeWeaponAttack',
    [RollType.ATTACK_WITH_RANGED_WEAPON]: 'WITCHER_TWEAKS.Fumble.RangedWeapon',
    [RollType.ATTACK_UNARMED]: 'WITCHER_TWEAKS.Fumble.AttackUnarmed',
    [RollType.DEFENCE_UNARMED]: 'WITCHER_TWEAKS.Fumble.UnarmedDefence',
    [RollType.DEFENCE_WITH_WEAPON]: 'WITCHER_TWEAKS.Fumble.WeaponDefence',
    [RollType.ELEMENTAL_SPELL]: 'WITCHER_TWEAKS.Fumble.ElementalSpell',
    [RollType.HEX]: 'WITCHER_TWEAKS.Fumble.HEX',
    [RollType.UNKNOWN]: '',
} as const

export interface FumbleResolver {
    shouldDisplayButton(): boolean
    getButton(): string
    resolve(event: JQuery.Event): void
}

export interface Weapon {
    _id: string
    name: string
    img: string
    system: WeaponParams
    update(params: any): Promise<any>
}

interface WeaponParams {
    equiped: string
    reliable: number
    maxReliability: number
}