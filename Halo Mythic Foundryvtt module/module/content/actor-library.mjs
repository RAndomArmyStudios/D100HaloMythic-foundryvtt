import {
  ARMOR_KEYS,
  CHARACTERISTIC_KEYS,
  HALO_MYTHIC,
  SKILL_KEYS,
  getCharacteristicModifier,
  getDefaultSkillCharacteristic,
  getSkillRankBonus,
  getSpeciesAutomation
} from "../config.mjs";
import { createLibraryItemSource } from "./library.mjs";

function buildCharacteristicState(values = {}) {
  return Object.fromEntries(CHARACTERISTIC_KEYS.map((key) => {
    const value = Number(values[key] ?? 25);
    return [
      key,
      {
        value,
        mod: getCharacteristicModifier(value)
      }
    ];
  }));
}

function buildSkillState(ranks = {}, characteristics = {}) {
  return Object.fromEntries(SKILL_KEYS.map((key) => {
    const rank = String(ranks[key] ?? "untrained");
    const characteristic = String(characteristics[key] ?? getDefaultSkillCharacteristic(key));
    const difficulty = HALO_MYTHIC.skills[key]?.difficulty ?? "basic";

    return [
      key,
      {
        rank,
        characteristic,
        bonus: getSkillRankBonus(rank, difficulty)
      }
    ];
  }));
}

function buildArmorTotals(items = []) {
  const totals = Object.fromEntries(ARMOR_KEYS.map((key) => [key, 0]));
  const shields = {
    max: 0,
    recharge: 0,
    delay: 0
  };

  for (const item of items) {
    if (item?.type !== "armor" || !item.system?.equipped) continue;

    for (const key of ARMOR_KEYS) {
      totals[key] += Number(item.system?.rating?.[key] ?? 0);
    }

    shields.max += Number(item.system?.shield?.max ?? 0);
    shields.recharge += Number(item.system?.shield?.recharge ?? 0);
    shields.delay = Math.max(shields.delay, Number(item.system?.shield?.delay ?? 0));
  }

  return { totals, shields };
}

function createEmbeddedItems({
  weapons = [],
  armors = [],
  gear = [],
  traits = [],
  abilities = []
} = {}) {
  const items = [];

  for (const weapon of weapons) {
    const source = createLibraryItemSource(weapon.id, {
      equipped: weapon.equipped ?? true,
      quantity: weapon.quantity
    });
    if (source) items.push(source);
  }

  for (const armor of armors) {
    const source = createLibraryItemSource(armor.id, {
      equipped: armor.equipped ?? true
    });
    if (source) items.push(source);
  }

  for (const gearItem of gear) {
    const source = createLibraryItemSource(gearItem.id, {
      quantity: gearItem.quantity
    });
    if (source) items.push(source);
  }

  for (const traitId of traits) {
    const source = createLibraryItemSource(traitId);
    if (source) items.push(source);
  }

  for (const abilityId of abilities) {
    const source = createLibraryItemSource(abilityId);
    if (source) items.push(source);
  }

  return items;
}

function createNpcSystem({ details, characteristics, mythic = {}, items = [], notes = "", biography = "" }) {
  const species = getSpeciesAutomation(details);
  const characteristicState = buildCharacteristicState(characteristics);
  const skillState = buildSkillState();
  const toughnessMod = Number(characteristicState.tou.mod ?? 0);
  const agilityMod = Number(characteristicState.agi.mod ?? 0);
  const strengthMod = Number(characteristicState.str.mod ?? 0);
  const mythicAgi = Number(mythic.agi ?? 0);
  const mythicTou = Number(mythic.tou ?? 0);
  const mythicStr = Number(mythic.str ?? 0);
  const woundsMax = (((toughnessMod * species.woundToughnessMultiplier) + mythicTou) * 2) + 40;
  const carry = Math.floor((((Number(characteristics.str ?? 25) + (mythicStr * 10)) + (Number(characteristics.tou ?? 25) + (mythicTou * 10))) / 2) * species.carryingMultiplier);
  const { totals, shields } = buildArmorTotals(items);

  return {
    details: {
      rank: details.rank ?? "",
      faction: details.faction ?? "",
      specialization: details.specialization ?? "",
      soldierType: details.soldierType ?? "",
      race: details.race ?? "",
      size: details.size ?? "normal",
      notes
    },
    characteristics: characteristicState,
    mythic: {
      str: Number(mythic.str ?? 0),
      tou: Number(mythic.tou ?? 0),
      agi: Number(mythic.agi ?? 0)
    },
    skills: skillState,
    resources: {
      wounds: {
        value: woundsMax,
        min: -woundsMax,
        max: woundsMax
      },
      fatigue: {
        value: 0,
        min: 0,
        max: toughnessMod * 2
      },
      shields: {
        value: shields.max,
        min: 0,
        max: shields.max,
        recharge: shields.recharge,
        delay: shields.delay,
        currentDelay: 0
      },
      luck: {
        value: 0,
        min: 0,
        max: 0
      },
      support: {
        value: 0,
        min: 0,
        max: 0
      }
    },
    economy: {
      credits: 0,
      experienceTotal: 0,
      experienceCurrent: 0,
      experienceSpent: 0
    },
    movement: {
      half: agilityMod + mythicAgi,
      full: (agilityMod + mythicAgi) * 2,
      charge: (agilityMod + mythicAgi) * 3,
      run: (agilityMod + mythicAgi) * 6,
      sprint: (agilityMod + mythicAgi) * 8,
      initiative: agilityMod,
      perceptiveRange: Number(characteristics.per ?? 25) * 2,
      jumpHeight: strengthMod / 4,
      leapDistance: Math.max((agilityMod + species.leapAgilityBonus) / 2, strengthMod / 2),
      reach: HALO_MYTHIC.sizeCategories[details.size ?? "normal"]?.reach ?? 1
    },
    carrying: {
      carry,
      lift: carry * 3,
      push: carry * 5,
      current: 0,
      loadPercent: 0,
      status: "Normal",
      agilityPenalty: 0,
      penalty: 0,
      athleticsStealthPenalty: 0,
      movementMultiplier: 1
    },
    armor: totals,
    biography
  };
}

function createNpcTemplate({
  id,
  name,
  folder,
  img,
  details,
  characteristics,
  mythic,
  weapons,
  armors,
  gear,
  traits,
  abilities,
  notes,
  biography
}) {
  const items = createEmbeddedItems({ weapons, armors, gear, traits, abilities });

  return {
    id,
    name,
    type: "npc",
    pack: "starter-actors",
    folder,
    img,
    items,
    system: createNpcSystem({
      details,
      characteristics,
      mythic,
      items,
      notes,
      biography
    })
  };
}

export const STARTER_ACTOR_PACKS = [
  {
    name: "starter-actors",
    label: "Starter Actors",
    path: "packs/starter-actors",
    type: "Actor",
    system: "halo-mythic"
  }
];

export const STARTER_ACTORS = [
  createNpcTemplate({
    id: "covenant-unggoy-minor",
    name: "Unggoy Minor",
    folder: "Covenant",
    img: "icons/svg/mystery-man.svg",
    details: {
      faction: "Covenant",
      race: "Unggoy",
      soldierType: "Unggoy Minor",
      rank: "Minor",
      size: "normal"
    },
    characteristics: {
      str: 40,
      tou: 40,
      agi: 25,
      wfr: 35,
      wfm: 35,
      int: 25,
      per: 35,
      crg: 30,
      cha: 30,
      ldr: 30
    },
    mythic: {},
    weapons: [
      { id: "plasma-pistol" },
      { id: "standard-curveblade" },
      { id: "plasma-grenade", quantity: 2 }
    ],
    armors: [
      { id: "unggoy-combat-harness" }
    ],
    gear: [
      { id: "equipment-pouch" },
      { id: "flashlight" },
      { id: "methane-tank" }
    ],
    traits: ["natural-weapon", "language-expert", "almost-smart"],
    notes: "BR 1 Covenant Unggoy template with anti-infantry equipment and methane support.",
    biography: "Unggoy minor trooper drawn from the Covenant bestiary. Uses the anti-infantry equipment profile with a Type-25 plasma pistol, curveblade, plasma grenades, and combat harness."
  }),
  createNpcTemplate({
    id: "covenant-sangheili-minor",
    name: "Sangheili Minor",
    folder: "Covenant",
    img: "icons/svg/mystery-man.svg",
    details: {
      faction: "Covenant",
      race: "Sangheili",
      soldierType: "Sangheili Minor",
      rank: "Minor",
      size: "large"
    },
    characteristics: {
      str: 55,
      tou: 50,
      agi: 55,
      wfr: 45,
      wfm: 50,
      int: 30,
      per: 30,
      crg: 50,
      cha: 30,
      ldr: 35
    },
    mythic: {
      str: 5,
      tou: 2,
      agi: 4
    },
    weapons: [
      { id: "plasma-rifle" },
      { id: "plasma-pistol" },
      { id: "sangheili-curveblade" },
      { id: "plasma-grenade", quantity: 2 }
    ],
    armors: [
      { id: "sangheili-combat-harness" }
    ],
    gear: [
      { id: "equipment-pouch" },
      { id: "flashlight" }
    ],
    traits: ["sangheili-leaping", "ancestral-honor"],
    notes: "BR 1 Covenant Sangheili template with powered shields and standard plasma loadout.",
    biography: "Sangheili minor drawn from the Covenant bestiary. Equipped with a Type-25 plasma rifle, plasma pistol, curveblade, grenades, and a shielded combat harness."
  }),
  createNpcTemplate({
    id: "covenant-jiralhanae-minor",
    name: "Jiralhanae Minor",
    folder: "Covenant",
    img: "icons/svg/mystery-man.svg",
    details: {
      faction: "Covenant",
      race: "Jiralhanae",
      soldierType: "Jiralhanae Minor",
      rank: "Minor",
      size: "large"
    },
    characteristics: {
      str: 55,
      tou: 55,
      agi: 45,
      wfr: 30,
      wfm: 45,
      int: 25,
      per: 45,
      crg: 35,
      cha: 20,
      ldr: 30
    },
    mythic: {
      str: 8,
      tou: 4,
      agi: 5
    },
    weapons: [
      { id: "plasma-rifle" },
      { id: "plasma-pistol" },
      { id: "standard-curveblade" },
      { id: "plasma-grenade", quantity: 2 }
    ],
    armors: [
      { id: "jiralhanae-combat-harness" }
    ],
    gear: [
      { id: "equipment-pouch", quantity: 2 }
    ],
    traits: ["berserker"],
    notes: "BR 1 Covenant Jiralhanae template with doubled wound scaling and a heavy plasma loadout.",
    biography: "Jiralhanae minor drawn from the Covenant bestiary. This brute uses the plasma equipment package as a practical stand-in until the remaining Brute armory entries are fully entered."
  }),
  createNpcTemplate({
    id: "banished-gasgira-raider",
    name: "Gasgira Raider",
    folder: "Banished",
    img: "icons/svg/mystery-man.svg",
    details: {
      faction: "Banished",
      race: "Gasgira",
      soldierType: "Gasgira Raider",
      rank: "Minor",
      size: "normal"
    },
    characteristics: {
      str: 25,
      tou: 40,
      agi: 30,
      wfr: 35,
      wfm: 20,
      int: 35,
      per: 35,
      crg: 35,
      cha: 30,
      ldr: 35
    },
    mythic: {
      agi: 5
    },
    weapons: [
      { id: "shock-rifle" },
      { id: "standard-curveblade" },
      { id: "dynamo-grenade", quantity: 2 }
    ],
    armors: [
      { id: "gasgira-armor" }
    ],
    gear: [
      { id: "equipment-pouch" },
      { id: "flashlight" }
    ],
    traits: ["crawler", "flight", "four-arms", "natural-weapon"],
    notes: "BR 1 Banished/Endless Gasgira template with flight-capable armor and a Shock Rifle.",
    biography: "Gasgira raider drawn from the Endless / Banished bestiary. The template uses the ranged equipment package with flight-enabled armor, curveblade backup, and dynamo grenades."
  }),
  createNpcTemplate({
    id: "forerunner-promethean-soldier",
    name: "Promethean Soldier",
    folder: "Forerunner",
    img: "icons/svg/mystery-man.svg",
    details: {
      faction: "Forerunner",
      race: "Promethean",
      soldierType: "Promethean Soldier",
      rank: "Soldier",
      size: "large"
    },
    characteristics: {
      str: 50,
      tou: 50,
      agi: 45,
      wfr: 40,
      wfm: 40,
      int: 30,
      per: 40,
      crg: 40,
      cha: 30,
      ldr: 30
    },
    mythic: {
      str: 1,
      tou: 1
    },
    weapons: [
      { id: "suppressor" },
      { id: "boltshot" },
      { id: "splinter-grenade", quantity: 1 }
    ],
    armors: [
      { id: "promethean-soldier-armor" }
    ],
    traits: ["promethean-vision", "translocation", "crawler", "glowing", "slipspace-storage"],
    notes: "BR 1 Forerunner Promethean template with hardlight suppression gear.",
    biography: "Promethean Soldier drawn from the Forerunner bestiary. Equipped with a Suppressor, Boltshot, Splinter Grenade, and Soldier Armor alongside the expected translocation and vision traits."
  })
];
