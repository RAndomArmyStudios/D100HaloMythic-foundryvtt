import { SPECIALIZATION_PACKS } from "../character-creator-data.mjs";

function cloneData(data) {
  if (data === undefined) return undefined;
  return JSON.parse(JSON.stringify(data));
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createWeapon({
  id,
  name,
  folder,
  img,
  attackType = "ranged",
  weight = 0,
  rateOfFireMode = "",
  rateOfFireValue = 0,
  damageDice = 0,
  damageBase = 0,
  pierce = 0,
  rangeMin = 0,
  rangeMax = 0,
  magazine = 0,
  reload = "",
  ammoType = "",
  special = "",
  summary = "",
  details = "",
  description = "",
  quantityMode = "single"
}) {
  return {
    id,
    name,
    type: "weapon",
    pack: "starter-weapons",
    folder,
    img,
    summary,
    details,
    quantityMode,
    system: {
      attackType,
      training: attackType === "melee" ? "Warfare Melee" : "Warfare Range",
      equipped: false,
      weight,
      attackBonus: 0,
      rateOfFire: {
        mode: rateOfFireMode,
        value: rateOfFireValue
      },
      damage: {
        dice: damageDice,
        faces: 10,
        base: damageBase,
        pierce
      },
      range: {
        min: rangeMin,
        max: rangeMax
      },
      magazine: {
        value: magazine,
        max: magazine
      },
      reload,
      ammoType,
      special,
      description
    }
  };
}

function createArmor({
  id,
  name,
  folder,
  img,
  weight = 0,
  powered = false,
  head = 0,
  arms = 0,
  chest = 0,
  legs = 0,
  shieldMax = 0,
  shieldRecharge = 0,
  shieldDelay = 0,
  summary = "",
  details = "",
  description = ""
}) {
  return {
    id,
    name,
    type: "armor",
    pack: "starter-armor",
    folder,
    img,
    summary,
    details,
    quantityMode: "single",
    system: {
      equipped: false,
      powered,
      weight,
      rating: {
        head,
        arms,
        chest,
        legs
      },
      shield: {
        max: shieldMax,
        recharge: shieldRecharge,
        delay: shieldDelay
      },
      description
    }
  };
}

function createGear({
  id,
  name,
  folder,
  img,
  weight = 0,
  summary = "",
  details = "",
  description = ""
}) {
  return {
    id,
    name,
    type: "gear",
    pack: "starter-gear",
    folder,
    img,
    summary,
    details,
    quantityMode: "gear",
    system: {
      carried: true,
      quantity: 1,
      weight,
      description
    }
  };
}

function createAbility({
  id,
  name,
  summary = "",
  details = "",
  description = ""
}) {
  return {
    id,
    name,
    type: "ability",
    pack: "starter-abilities",
    folder: "Specialization Abilities",
    img: "icons/magic/control/buff-flight-wings-runes-blue.webp",
    summary,
    details,
    quantityMode: "single",
    system: {
      cost: 0,
      prerequisites: "Starter specialization package",
      summary,
      description
    }
  };
}

function createTrait({
  id,
  name,
  source = "Mythic 7.0 CU1",
  summary = "",
  details = "",
  description = ""
}) {
  return {
    id,
    name,
    type: "trait",
    pack: "starter-traits",
    folder: "Soldier Traits",
    img: "icons/skills/social/diplomacy-unity-alliance.webp",
    summary,
    details,
    quantityMode: "single",
    system: {
      source,
      summary,
      description
    }
  };
}

const WEAPON_ITEMS = [
  createWeapon({
    id: "ma3a-assault-rifle",
    name: "MA3A Assault Rifle",
    folder: "Assault Rifles",
    img: "icons/weapons/guns/rifle-assault.webp",
    weight: 4.2,
    rateOfFireMode: "Auto (8), Burst (3)",
    rateOfFireValue: 8,
    damageDice: 3,
    damageBase: 6,
    pierce: 12,
    rangeMin: 55,
    rangeMax: 300,
    magazine: 32,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +6 | Pierce 12 | 55m-300m | Mag 32",
    details: "4.2 kg | 48 cR",
    description: "MA3A Assault Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 4.2 kg\nCost: 48 cR",
    special: "Comes with ammo counter and flashlight."
  }),
  createWeapon({
    id: "ma37-assault-rifle",
    name: "MA37 Assault Rifle",
    folder: "Assault Rifles",
    img: "icons/weapons/guns/rifle-assault.webp",
    weight: 3.8,
    rateOfFireMode: "Semi-Auto (3), Auto (8)",
    rateOfFireValue: 8,
    damageDice: 3,
    damageBase: 6,
    pierce: 12,
    rangeMin: 50,
    rangeMax: 325,
    magazine: 32,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +6 | Pierce 12 | 50m-325m | Mag 32",
    details: "3.8 kg | 47 cR",
    description: "MA37 Assault Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.8 kg\nCost: 47 cR",
    special: "Comes with ammo counter and flashlight."
  }),
  createWeapon({
    id: "ma40-assault-rifle",
    name: "MA40 Assault Rifle",
    folder: "Assault Rifles",
    img: "icons/weapons/guns/rifle-assault.webp",
    weight: 3.8,
    rateOfFireMode: "Semi-Auto (3), Auto (8)",
    rateOfFireValue: 8,
    damageDice: 3,
    damageBase: 6,
    pierce: 12,
    rangeMin: 50,
    rangeMax: 375,
    magazine: 32,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +6 | Pierce 12 | 50m-375m | Mag 32",
    details: "3.8 kg | 47 cR",
    description: "MA40 Assault Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.8 kg\nCost: 47 cR",
    special: "Comes with ammo counter and flashlight."
  }),
  createWeapon({
    id: "ma5b-assault-rifle",
    name: "MA5B Assault Rifle",
    folder: "Assault Rifles",
    img: "icons/weapons/guns/rifle-assault.webp",
    weight: 4.2,
    rateOfFireMode: "Semi-Auto (3), Auto (9), Burst (3)",
    rateOfFireValue: 9,
    damageDice: 3,
    damageBase: 6,
    pierce: 12,
    rangeMin: 60,
    rangeMax: 375,
    magazine: 60,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +6 | Pierce 12 | 60m-375m | Mag 60",
    details: "4.2 kg | 52 cR",
    description: "MA5B Individual Combat Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 4.2 kg\nCost: 52 cR",
    special: "-5 to hit. Comes with ammo counter and flashlight. Firing prone gives an additional -10 to hit."
  }),
  createWeapon({
    id: "ma5c-assault-rifle",
    name: "MA5C Assault Rifle",
    folder: "Assault Rifles",
    img: "icons/weapons/guns/rifle-assault.webp",
    weight: 3.8,
    rateOfFireMode: "Semi-Auto (3), Auto (9), Burst (3)",
    rateOfFireValue: 9,
    damageDice: 3,
    damageBase: 6,
    pierce: 12,
    rangeMin: 65,
    rangeMax: 390,
    magazine: 32,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +6 | Pierce 12 | 65m-390m | Mag 32",
    details: "3.8 kg | 55 cR",
    description: "MA5C Individual Combat Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.8 kg\nCost: 55 cR",
    special: "Comes with ammo counter and flashlight."
  }),
  createWeapon({
    id: "ma5d-assault-rifle",
    name: "MA5D Assault Rifle",
    folder: "Assault Rifles",
    img: "icons/weapons/guns/rifle-assault.webp",
    weight: 3.5,
    rateOfFireMode: "Semi-Auto (3), Auto (9), Burst (3)",
    rateOfFireValue: 9,
    damageDice: 3,
    damageBase: 6,
    pierce: 12,
    rangeMin: 70,
    rangeMax: 400,
    magazine: 36,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +6 | Pierce 12 | 70m-400m | Mag 36",
    details: "3.5 kg | 56 cR",
    description: "MA5D Individual Combat Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.5 kg\nCost: 56 cR",
    special: "Comes with ammo counter and flashlight."
  }),
  createWeapon({
    id: "br55-battle-rifle",
    name: "BR55 Battle Rifle",
    folder: "Battle Rifles",
    img: "icons/weapons/guns/rifle.webp",
    weight: 3.8,
    rateOfFireMode: "Semi-Auto (2), Burst (3)",
    rateOfFireValue: 3,
    damageDice: 3,
    damageBase: 9,
    pierce: 10,
    rangeMin: 45,
    rangeMax: 950,
    magazine: 36,
    reload: "6 Half Actions",
    ammoType: "9.5x40mm",
    summary: "3d10 +9 | Pierce 10 | 45m-950m | Mag 36",
    details: "3.8 kg | 46 cR",
    description: "BR55 Service Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.8 kg\nCost: 46 cR",
    special: "Headshot special rule. Comes with 2x scope and built-in ammo counter."
  }),
  createWeapon({
    id: "br75-battle-rifle",
    name: "BR75 Battle Rifle",
    folder: "Battle Rifles",
    img: "icons/weapons/guns/rifle.webp",
    weight: 3.8,
    rateOfFireMode: "Semi-Auto (2), Burst (3)",
    rateOfFireValue: 3,
    damageDice: 3,
    damageBase: 9,
    pierce: 10,
    rangeMin: 50,
    rangeMax: 975,
    magazine: 36,
    reload: "6 Half Actions",
    ammoType: "9.5x40mm",
    summary: "3d10 +9 | Pierce 10 | 50m-975m | Mag 36",
    details: "3.8 kg | 47 cR",
    description: "BR75 Service Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.8 kg\nCost: 47 cR",
    special: "Headshot special rule. Comes with 2x scope and built-in ammo counter."
  }),
  createWeapon({
    id: "br85-battle-rifle",
    name: "BR85 Battle Rifle",
    folder: "Battle Rifles",
    img: "icons/weapons/guns/rifle.webp",
    weight: 3.7,
    rateOfFireMode: "Semi-Auto (2), Burst (3)",
    rateOfFireValue: 3,
    damageDice: 3,
    damageBase: 9,
    pierce: 10,
    rangeMin: 50,
    rangeMax: 1000,
    magazine: 36,
    reload: "6 Half Actions",
    ammoType: "9.5x40mm",
    summary: "3d10 +9 | Pierce 10 | 50m-1000m | Mag 36",
    details: "3.7 kg | 47 cR",
    description: "BR85 Service Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.7 kg\nCost: 47 cR",
    special: "Headshot special rule. Comes with 2x scope and built-in ammo counter."
  }),
  createWeapon({
    id: "m392-dmr",
    name: "M392 DMR",
    folder: "Designated Marksman Rifles",
    img: "icons/weapons/guns/rifle-sniper.webp",
    weight: 5.6,
    rateOfFireMode: "Semi-Auto (2), Auto (6), Burst (2)",
    rateOfFireValue: 6,
    damageDice: 3,
    damageBase: 8,
    pierce: 13,
    rangeMin: 30,
    rangeMax: 1400,
    magazine: 15,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +8 | Pierce 13 | 30m-1400m | Mag 15",
    details: "5.6 kg | 55 cR",
    description: "M392 Designated Marksman Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 5.6 kg\nCost: 55 cR",
    special: "Headshot special rule. Comes with EVOS-D 3x and built-in ammo counter."
  }),
  createWeapon({
    id: "m395-dmr",
    name: "M395 DMR",
    folder: "Designated Marksman Rifles",
    img: "icons/weapons/guns/rifle-sniper.webp",
    weight: 6.1,
    rateOfFireMode: "Semi-Auto (2), Auto (6), Burst (2)",
    rateOfFireValue: 6,
    damageDice: 3,
    damageBase: 8,
    pierce: 13,
    rangeMin: 35,
    rangeMax: 1550,
    magazine: 14,
    reload: "6 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +8 | Pierce 13 | 35m-1550m | Mag 14",
    details: "6.1 kg | 56 cR",
    description: "M395 Designated Marksman Rifle profile from the Mythic 7.0 CU1 core armory.\nWeight: 6.1 kg\nCost: 56 cR",
    special: "Headshot special rule. Comes with EVOS-D 3x and built-in ammo counter."
  }),
  createWeapon({
    id: "m6b-pistol",
    name: "M6B Pistol",
    folder: "Pistols and Carbines",
    img: "icons/weapons/guns/gun-pistol-flintlock-metal.webp",
    weight: 1.6,
    rateOfFireMode: "Semi-Auto (2)",
    rateOfFireValue: 2,
    damageDice: 3,
    damageBase: 10,
    pierce: 4,
    rangeMin: 30,
    rangeMax: 100,
    magazine: 8,
    reload: "4 Half Actions",
    ammoType: "12.7x40mm",
    summary: "3d10 +10 | Pierce 4 | 30m-100m | Mag 8",
    details: "1.6 kg | 36 cR",
    description: "M6B Personal Defense Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 1.6 kg\nCost: 36 cR",
    special: "Headshot special rule. Comes with built-in KFA-2 2x."
  }),
  createWeapon({
    id: "m6c-pistol",
    name: "M6C Pistol",
    folder: "Pistols and Carbines",
    img: "icons/weapons/guns/gun-pistol-semi.webp",
    weight: 1.8,
    rateOfFireMode: "Semi-Auto (2), Auto (6)",
    rateOfFireValue: 6,
    damageDice: 3,
    damageBase: 10,
    pierce: 4,
    rangeMin: 30,
    rangeMax: 100,
    magazine: 12,
    reload: "4 Half Actions",
    ammoType: "12.7x40mm",
    summary: "3d10 +10 | Pierce 4 | 30m-100m | Mag 12",
    details: "1.8 kg | 31 cR",
    description: "M6C Personal Defense Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 1.8 kg\nCost: 31 cR",
    special: "Headshot special rule. Firing on automatic applies an additional -5 to hit."
  }),
  createWeapon({
    id: "m6g-pistol",
    name: "M6G Pistol",
    folder: "Pistols and Carbines",
    img: "icons/weapons/guns/gun-pistol-brown.webp",
    weight: 1.8,
    rateOfFireMode: "Semi-Auto (2), Auto (5)",
    rateOfFireValue: 5,
    damageDice: 3,
    damageBase: 10,
    pierce: 4,
    rangeMin: 30,
    rangeMax: 150,
    magazine: 8,
    reload: "4 Half Actions",
    ammoType: "12.7x40mm",
    summary: "3d10 +10 | Pierce 4 | 30m-150m | Mag 8",
    details: "1.8 kg | 42 cR",
    description: "M6G Personal Defense Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 1.8 kg\nCost: 42 cR",
    special: "Headshot special rule. Comes with built-in KFA-2 2x."
  }),
  createWeapon({
    id: "m6i-carbine",
    name: "M6I Carbine",
    folder: "Pistols and Carbines",
    img: "icons/weapons/guns/gun-pistol-wood.webp",
    weight: 2,
    rateOfFireMode: "Semi-Auto (2), Auto (6), Burst (2)",
    rateOfFireValue: 6,
    damageDice: 3,
    damageBase: 10,
    pierce: 4,
    rangeMin: 35,
    rangeMax: 100,
    magazine: 12,
    reload: "4 Half Actions",
    ammoType: "12.7x40mm",
    summary: "3d10 +10 | Pierce 4 | 35m-100m | Mag 12",
    details: "2.0 kg | 46 cR",
    description: "M6I Adjustable Personal Defense Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 2.0 kg\nCost: 46 cR",
    special: "Headshot special rule. Firing on automatic applies an additional -10 to hit. Comes with collapsible folding stock."
  }),
  createWeapon({
    id: "m6j-carbine",
    name: "M6J Carbine",
    folder: "Pistols and Carbines",
    img: "icons/weapons/guns/gun-pistol-military.webp",
    weight: 2.2,
    rateOfFireMode: "Semi-Auto (2), Auto (6), Burst (2)",
    rateOfFireValue: 6,
    damageDice: 3,
    damageBase: 10,
    pierce: 4,
    rangeMin: 30,
    rangeMax: 110,
    magazine: 12,
    reload: "5 Half Actions",
    ammoType: "12.7x40mm",
    summary: "3d10 +10 | Pierce 4 | 30m-110m | Mag 12",
    details: "2.2 kg | 45 cR",
    description: "M6J Adjustable Personal Defense Carbine profile from the Mythic 7.0 CU1 core armory.\nWeight: 2.2 kg\nCost: 45 cR",
    special: "Headshot special rule. Firing on automatic applies an additional -10 to hit. Comes with collapsible folding stock."
  }),
  createWeapon({
    id: "m7-caseless-submachine-gun",
    name: "M7 Caseless Submachine Gun",
    folder: "Submachine Guns",
    img: "icons/weapons/guns/submachinegun.webp",
    weight: 1.3,
    rateOfFireMode: "Semi-Auto (3), Auto (10)",
    rateOfFireValue: 10,
    damageDice: 3,
    damageBase: 1,
    pierce: 11,
    rangeMin: 20,
    rangeMax: 75,
    magazine: 60,
    reload: "5 Half Actions",
    ammoType: "5x23mm",
    summary: "3d10 +1 | Pierce 11 | 20m-75m | Mag 60",
    details: "1.3 kg | 68 cR",
    description: "M7 Caseless Submachine Gun profile from the Mythic 7.0 CU1 core armory.\nWeight: 1.3 kg\nCost: 68 cR",
    special: "Comes with collapsible folding stock and angled grip."
  }),
  createWeapon({
    id: "m45-tactical-shotgun",
    name: "M45 Tactical Shotgun",
    folder: "Shotguns",
    img: "icons/weapons/guns/shotgun-double.webp",
    weight: 3.6,
    rateOfFireMode: "Pump (2)",
    rateOfFireValue: 2,
    damageDice: 4,
    damageBase: 10,
    pierce: 6,
    rangeMin: 10,
    rangeMax: 90,
    magazine: 6,
    reload: "Single Loading",
    ammoType: "8 Gauge Shell",
    summary: "4d10 +10 | Pierce 6 | 10m-90m | Tube 6",
    details: "3.6 kg | 55 cR",
    description: "M45 Tactical Shotgun profile from the Mythic 7.0 CU1 core armory.\nWeight: 3.6 kg\nCost: 55 cR",
    special: "Spread special rule. Comes with collapsible folding stock."
  }),
  createWeapon({
    id: "m90-close-assault-shotgun",
    name: "M90 Close Assault Weapon System",
    folder: "Shotguns",
    img: "icons/weapons/guns/shotgun-white.webp",
    weight: 6,
    rateOfFireMode: "Pump (2)",
    rateOfFireValue: 2,
    damageDice: 4,
    damageBase: 10,
    pierce: 6,
    rangeMin: 10,
    rangeMax: 80,
    magazine: 12,
    reload: "Single Loading",
    ammoType: "8 Gauge Shell",
    summary: "4d10 +10 | Pierce 6 | 10m-80m | Tube 12",
    details: "6.0 kg | 55 cR",
    description: "M90 Series Close Assault Weapon System profile from the Mythic 7.0 CU1 core armory.\nWeight: 6.0 kg\nCost: 55 cR",
    special: "Spread special rule. Comes with collapsible folding stock."
  }),
  createWeapon({
    id: "m90-scaws-shotgun",
    name: "M90 SCAWS Shotgun",
    folder: "Shotguns",
    img: "icons/weapons/guns/shotgun-white.webp",
    weight: 6,
    rateOfFireMode: "Pump (2)",
    rateOfFireValue: 2,
    damageDice: 4,
    damageBase: 10,
    pierce: 6,
    rangeMin: 10,
    rangeMax: 80,
    magazine: 12,
    reload: "Single Loading",
    ammoType: "8 Gauge Shell",
    summary: "4d10 +10 | Pierce 6 | 10m-80m | Tube 12",
    details: "6.0 kg | 55 cR",
    description: "Uses the baseline M90 Series Close Assault Weapon System profile for SCAWS-era loadouts.\nWeight: 6.0 kg\nCost: 55 cR",
    special: "Spread special rule. Comes with collapsible folding stock."
  }),
  createWeapon({
    id: "m247-machine-gun",
    name: "M247 Machine Gun",
    folder: "Machine Guns",
    img: "icons/weapons/guns/machinegun.webp",
    attackType: "heavy",
    weight: 10.4,
    rateOfFireMode: "Auto (10)",
    rateOfFireValue: 10,
    damageDice: 3,
    damageBase: 9,
    pierce: 14,
    rangeMin: 40,
    rangeMax: 1100,
    magazine: 100,
    reload: "15 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +9 | Pierce 14 | 40m-1100m | Belt 100",
    details: "10.4 kg | 76 cR",
    description: "M247 General Purpose Machine Gun profile from the Mythic 7.0 CU1 core armory.\nWeight: 10.4 kg\nCost: 76 cR",
    special: "Long barrel special rule. Comes with tripod. Range is halved when a tripod or bipod is not used."
  }),
  createWeapon({
    id: "aie-486h-heavy-machine-gun",
    name: "AIE-486H Heavy Machine Gun",
    folder: "Machine Guns",
    img: "icons/weapons/guns/machinegun.webp",
    attackType: "heavy",
    weight: 14.1,
    rateOfFireMode: "Auto (10)",
    rateOfFireValue: 10,
    damageDice: 3,
    damageBase: 9,
    pierce: 14,
    rangeMin: 40,
    rangeMax: 1200,
    magazine: 200,
    reload: "15 Half Actions",
    ammoType: "7.62x51mm",
    summary: "3d10 +9 | Pierce 14 | 40m-1200m | Belt 200",
    details: "14.1 kg | 88 cR",
    description: "AIE-486H Heavy Machine Gun profile from the Mythic 7.0 CU1 core armory.\nWeight: 14.1 kg\nCost: 88 cR",
    special: "Long barrel special rule. Comes with tripod and heavy weapon shield. Range is halved when a tripod or bipod is not used."
  }),
  createWeapon({
    id: "srs99-sniper-rifle",
    name: "SRS99 Sniper Rifle System",
    folder: "Sniper Rifles",
    img: "icons/weapons/guns/rifle-sniper-black.webp",
    attackType: "heavy",
    weight: 16,
    rateOfFireMode: "Semi-Auto (1)",
    rateOfFireValue: 1,
    damageDice: 4,
    damageBase: 21,
    pierce: 13,
    rangeMin: 50,
    rangeMax: 1900,
    magazine: 4,
    reload: "8 Half Actions",
    ammoType: "14.5x114mm",
    summary: "4d10 +21 | Pierce 13 | 50m-1900m | Mag 4",
    details: "16.0 kg | 145 cR",
    description: "Sniper Rifle System 99 Anti-Materiel profile from the Mythic 7.0 CU1 core armory.\nWeight: 16.0 kg\nCost: 145 cR",
    special: "Penetrating, kinetic, headshot, and long barrel special rules. Comes with Oracle N-Variant scope and bipod."
  }),
  createWeapon({
    id: "m41-rocket-launcher",
    name: "M41 Rocket Launcher",
    folder: "Rocket Launchers",
    img: "icons/weapons/guns/rocket-launcher.webp",
    attackType: "explosive",
    weight: 10.8,
    rateOfFireMode: "Semi-Auto (1)",
    rateOfFireValue: 1,
    damageDice: 4,
    damageBase: 16,
    pierce: 12,
    rangeMin: 20,
    rangeMax: 400,
    magazine: 2,
    reload: "13 Half Actions",
    ammoType: "M19 102mm",
    summary: "4d10 +16 | Pierce 12 | 20m-400m | Tube 2",
    details: "10.8 kg | 100 cR",
    description: "M41 Surface-to-Surface Rocket Launcher profile from the Mythic 7.0 CU1 core armory.\nWeight: 10.8 kg\nCost: 100 cR",
    special: "Blast (9), Kill (3), homing, and vehicle lock special rules. Comes with built-in KFA-2 2x."
  }),
  createWeapon({
    id: "m9-dual-purpose-grenade",
    name: "M9 Dual-Purpose Grenade",
    folder: "Grenades and Throwables",
    img: "icons/weapons/thrown/grenade-frag.webp",
    attackType: "explosive",
    weight: 0.4,
    rateOfFireMode: "Thrown",
    rateOfFireValue: 1,
    damageDice: 3,
    damageBase: 9,
    pierce: 12,
    reload: "Ready next grenade",
    ammoType: "Thrown Explosive",
    summary: "3d10 +9 | Pierce 12 | Blast (8) | Kill (2)",
    details: "0.4 kg | 10 cR",
    description: "M9 High-Explosive Dual-Purpose Grenade profile from the Mythic 7.0 CU1 core armory.\nWeight: 0.4 kg\nCost: 10 cR",
    special: "Blast (8) and Kill (2). Uses grenade count as magazine value on actor loadouts.",
    quantityMode: "magazine"
  }),
  createWeapon({
    id: "flashbang-grenade",
    name: "Flashbang Grenade",
    folder: "Grenades and Throwables",
    img: "icons/weapons/thrown/grenade-smoke.webp",
    attackType: "explosive",
    weight: 0.3,
    rateOfFireMode: "Thrown",
    rateOfFireValue: 1,
    damageDice: 1,
    damageBase: 0,
    pierce: 0,
    reload: "Ready next grenade",
    ammoType: "Thrown Explosive",
    summary: "1d10 stun payload | Blast (8)",
    details: "0.3 kg | 6 cR",
    description: "Flashbang Grenade profile from the Mythic 7.0 CU1 core armory.\nWeight: 0.3 kg\nCost: 6 cR",
    special: "Stun (1d5+4) and flashbang special rules. Uses grenade count as magazine value on actor loadouts.",
    quantityMode: "magazine"
  }),
  createWeapon({
    id: "m1-combat-knife",
    name: "M1 Combat Knife",
    folder: "Knives",
    img: "icons/weapons/daggers/dagger-straight-steel.webp",
    attackType: "melee",
    weight: 0.4,
    rateOfFireMode: "Melee",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 4,
    pierce: 5,
    reload: "N/A",
    ammoType: "",
    summary: "2d10 +4 | Pierce 5 | Adds STR to damage",
    details: "0.4 kg | 15 cR",
    description: "M1 Combat Knife profile from the Mythic 7.0 CU1 core armory.\nWeight: 0.4 kg\nCost: 15 cR",
    special: "Add full Strength modifier to base damage and half Strength modifier to thrown range."
  }),
  createWeapon({
    id: "model-52-knife",
    name: "Model 52 Knife",
    folder: "Knives",
    img: "icons/weapons/daggers/dagger-curved-steel.webp",
    attackType: "melee",
    weight: 0.9,
    rateOfFireMode: "Melee",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 6,
    pierce: 7,
    reload: "N/A",
    ammoType: "",
    summary: "2d10 +6 | Pierce 7 | Adds STR to damage",
    details: "0.9 kg | 17 cR",
    description: "Model 52 Navy Knife profile from the Mythic 7.0 CU1 core armory.\nWeight: 0.9 kg\nCost: 17 cR",
    special: "Add full Strength modifier to base damage and half Strength modifier to thrown range."
  }),
  createWeapon({
    id: "mk-88-ratio",
    name: "MK 88 Ratio",
    folder: "Knives",
    img: "icons/weapons/daggers/dagger-double-blue.webp",
    attackType: "melee",
    weight: 0.3,
    rateOfFireMode: "Melee",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 2,
    pierce: 11,
    reload: "N/A",
    ammoType: "",
    summary: "2d10 +2 | Pierce 11 | Concealable combat knife",
    details: "0.3 kg | 23 cR",
    description: "MK 88 Ratio Combat Knife profile from the Mythic 7.0 CU1 core armory.\nWeight: 0.3 kg\nCost: 23 cR",
    special: "+20 to concealing and camouflage. Add half Strength modifier to base damage and half Strength modifier to thrown range."
  }),
  createWeapon({
    id: "plasma-pistol",
    name: "Plasma Pistol",
    folder: "Covenant Weapons",
    img: "icons/weapons/guns/gun-pistol-energy-blue.webp",
    weight: 3.5,
    rateOfFireMode: "Semi-Auto (3), Charge (X)",
    rateOfFireValue: 3,
    damageDice: 2,
    damageBase: 10,
    pierce: 12,
    rangeMin: 5,
    rangeMax: 40,
    magazine: 100,
    reload: "4 Half Actions",
    ammoType: "Plasma Battery",
    summary: "2d10 +10 | Pierce 12 | 5m-40m | Battery 100",
    details: "3.5 kg | 35 cR",
    description: "Eos'Mak Plasma Pistol Type-25 directed-energy pistol from the Covenant armory.\nWeight: 3.5 kg\nCost: 35 cR",
    special: "Cauterize. Charged shots add +5 base damage per half action spent charging, up to 3; a fully charged shot gains EMP (4), Homing, and Overheat (2)."
  }),
  createWeapon({
    id: "plasma-rifle",
    name: "Plasma Rifle",
    folder: "Covenant Weapons",
    img: "icons/weapons/guns/rifle-angled-blue.webp",
    weight: 5.9,
    rateOfFireMode: "Semi-Auto (3), Auto (8)",
    rateOfFireValue: 8,
    damageDice: 3,
    damageBase: 10,
    pierce: 19,
    rangeMin: 25,
    rangeMax: 130,
    magazine: 250,
    reload: "6 Half Actions",
    ammoType: "Plasma Battery",
    summary: "3d10 +10 | Pierce 19 | 25m-130m | Battery 250",
    details: "5.9 kg | 46 cR",
    description: "Okarda'phaa Plasma Rifle Type-25 directed-energy rifle from the Covenant armory.\nWeight: 5.9 kg\nCost: 46 cR",
    special: "Cauterize. Built-in Covenant 2x smartlink scope. Gains Overheat (2) after firing 16 shots within two rounds."
  }),
  createWeapon({
    id: "needler",
    name: "Needler",
    folder: "Covenant Weapons",
    img: "icons/weapons/guns/gun-topbarbs-purple.webp",
    weight: 3.7,
    rateOfFireMode: "Auto (6)",
    rateOfFireValue: 6,
    damageDice: 1,
    damageBase: 5,
    pierce: 22,
    rangeMin: 5,
    rangeMax: 65,
    magazine: 30,
    reload: "5 Half Actions",
    ammoType: "Blamite Needle",
    summary: "1d10 +5 | Pierce 22 | 5m-65m | Mag 30",
    details: "3.7 kg | 56 cR",
    description: "Nahle'Hax Needler Type-33 guided-munitions launcher from the Covenant armory.\nWeight: 3.7 kg\nCost: 56 cR",
    special: "Needle (5), Homing. Built-in Covenant 2x smartlink scope."
  }),
  createWeapon({
    id: "energy-sword",
    name: "Energy Sword",
    folder: "Covenant Melee",
    img: "icons/weapons/swords/sword-winged-blue.webp",
    attackType: "melee",
    weight: 2.3,
    rateOfFireMode: "Melee",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 20,
    pierce: 30,
    reload: "N/A",
    ammoType: "",
    summary: "2d10 +20 | Pierce 30 | Reach +1",
    details: "2.3 kg | 105 cR",
    description: "Domotos Pattern Energy Sword from the Covenant armory.\nWeight: 2.3 kg\nCost: 105 cR",
    special: "Cauterize. Deactivates when not held. When parried, this blade damages the opposing weapon's breakpoints unless that weapon shares the rule."
  }),
  createWeapon({
    id: "standard-curveblade",
    name: "Curveblade",
    folder: "Covenant Melee",
    img: "icons/weapons/daggers/dagger-curved-blue.webp",
    attackType: "melee",
    weight: 0.6,
    rateOfFireMode: "Melee",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 6,
    pierce: 6,
    reload: "N/A",
    ammoType: "",
    summary: "2d10 +6 | Pierce 6 | Adds STR to damage",
    details: "0.6 kg | 19 cR",
    description: "Standard Curveblade from the Covenant melee section.\nWeight: 0.6 kg\nCost: 19 cR",
    special: "Add half Strength modifier to base damage and thrown range. Hand guard grants +4 armor to the wielding hand against melee attacks."
  }),
  createWeapon({
    id: "sangheili-curveblade",
    name: "Sangheili Curveblade",
    folder: "Covenant Melee",
    img: "icons/weapons/daggers/dagger-curved-blue.webp",
    attackType: "melee",
    weight: 0.9,
    rateOfFireMode: "Melee",
    rateOfFireValue: 1,
    damageDice: 3,
    damageBase: 5,
    pierce: 6,
    reload: "N/A",
    ammoType: "",
    summary: "3d10 +5 | Pierce 6 | Adds STR to damage",
    details: "0.9 kg | 22 cR",
    description: "Sangheili Curveblade from the Covenant melee section.\nWeight: 0.9 kg\nCost: 22 cR",
    special: "Add half Strength modifier to base damage and thrown range. Enlarged 45cm curveblade with a defensive hand guard."
  }),
  createWeapon({
    id: "disruptor-pistol",
    name: "Disruptor Pistol",
    folder: "Banished Weapons",
    img: "icons/weapons/guns/gun-pistol-energy-blue.webp",
    weight: 3.4,
    rateOfFireMode: "Semi-Auto (3)",
    rateOfFireValue: 3,
    damageDice: 2,
    damageBase: 3,
    pierce: 25,
    rangeMin: 20,
    rangeMax: 115,
    magazine: 10,
    reload: "4 Half Actions",
    ammoType: "Plasma Battery",
    summary: "2d10 +3 | Pierce 25 | 20m-115m | Battery 10",
    details: "3.4 kg | 73 cR",
    description: "Sicatt Workshop Disruptor Pistol from the Banished armory.\nWeight: 3.4 kg\nCost: 73 cR",
    special: "On the fourth hit landed in the same round, the target suffers EMP (3). The weapon also builds Electrified (X), where X increases by +2 per shot landed that round."
  }),
  createWeapon({
    id: "mangler-spike-revolver",
    name: "Mangler Spike Revolver",
    folder: "Banished Weapons",
    img: "icons/weapons/guns/revolver.webp",
    weight: 8.5,
    rateOfFireMode: "Semi-Auto (2)",
    rateOfFireValue: 2,
    damageDice: 2,
    damageBase: 18,
    pierce: 10,
    rangeMin: 30,
    rangeMax: 145,
    magazine: 8,
    reload: "4 Half Actions",
    ammoType: "Tungsten Spike",
    summary: "2d10 +18 | Pierce 10 | 30m-145m | Mag 8",
    details: "8.5 kg | 58 cR",
    description: "Ukala Workshop Mangler Spike Revolver from the Banished armory.\nWeight: 8.5 kg\nCost: 58 cR",
    special: "Cauterize and Headshot. Built-in Covenant 2x smartlink scope and Jiralhanae bayonet."
  }),
  createWeapon({
    id: "shock-rifle",
    name: "Shock Rifle",
    folder: "Banished Weapons",
    img: "icons/weapons/guns/rifle-sniper-blue.webp",
    attackType: "heavy",
    weight: 7.1,
    rateOfFireMode: "Sustained (5)",
    rateOfFireValue: 5,
    damageDice: 3,
    damageBase: 15,
    pierce: 4,
    rangeMin: 40,
    rangeMax: 600,
    magazine: 20,
    reload: "6 Half Actions",
    ammoType: "Plasma Battery",
    summary: "3d10 +15 | Pierce 4 | 40m-600m | Battery 20",
    details: "7.1 kg | 75 cR",
    description: "Sicatt Workshop Shock Rifle from the Banished armory.\nWeight: 7.1 kg\nCost: 75 cR",
    special: "Electrified (1d10), Headshot, EMP (2). Arcs 3d10 +4 to targets within 3 meters of a struck metallic object. Every shot must consume the full Sustained (5) burst."
  }),
  createWeapon({
    id: "ravager",
    name: "Ravager",
    folder: "Banished Weapons",
    img: "icons/weapons/guns/launcher-grenade.webp",
    attackType: "explosive",
    weight: 18.3,
    rateOfFireMode: "Burst (3), Charge",
    rateOfFireValue: 3,
    damageDice: 2,
    damageBase: 10,
    pierce: 15,
    rangeMin: 10,
    rangeMax: 60,
    magazine: 5,
    reload: "8 Half Actions",
    ammoType: "Plasma Battery",
    summary: "2d10 +10 | Pierce 15 | 10m-60m | Battery 5",
    details: "18.3 kg | 72 cR",
    description: "Veporakk Workshop Ravager from the Banished armory.\nWeight: 18.3 kg\nCost: 72 cR",
    special: "Burst fire has Blast (2), Kill (1). Charged fire becomes 4d10 +15 with Blast (10), Kill (2), leaves incendiary plasma, and pushes the weapon toward Overheat."
  }),
  createWeapon({
    id: "boltshot",
    name: "Boltshot",
    folder: "Forerunner Weapons",
    img: "icons/weapons/guns/gun-pistol-energy-blue.webp",
    weight: 1.9,
    rateOfFireMode: "Semi-Auto (4), Auto (1)",
    rateOfFireValue: 4,
    damageDice: 2,
    damageBase: 14,
    pierce: 3,
    rangeMin: 15,
    rangeMax: 175,
    magazine: 10,
    reload: "4 Half Actions",
    ammoType: "Ionized Particle",
    summary: "2d10 +14 | Pierce 3 | 15m-175m | Mag 10",
    details: "1.9 kg | 56 cR",
    description: "Boltshot Variation 1 Z-110 directed-energy pistol from the Forerunner armory.\nWeight: 1.9 kg\nCost: 56 cR",
    special: "Hardlight. Alternate shotgun mode fires Auto (1) at 10m-20m for 1d10 +20 damage with Pierce 3."
  }),
  createWeapon({
    id: "suppressor",
    name: "Suppressor",
    folder: "Forerunner Weapons",
    img: "icons/weapons/guns/rifle-assault-blue.webp",
    weight: 4,
    rateOfFireMode: "Auto (10)",
    rateOfFireValue: 10,
    damageDice: 3,
    damageBase: 15,
    pierce: 8,
    rangeMin: 25,
    rangeMax: 500,
    magazine: 48,
    reload: "6 Half Actions",
    ammoType: "Light Mass",
    summary: "3d10 +15 | Pierce 8 | 25m-500m | Mag 48",
    details: "4.0 kg | 80 cR",
    description: "Suppressor Variation 1 Z-130 directed-energy automatic weapon from the Forerunner armory.\nWeight: 4.0 kg\nCost: 80 cR",
    special: "Hardlight. Built-in Forerunner red-dot targeting."
  }),
  createWeapon({
    id: "light-rifle",
    name: "Light Rifle",
    folder: "Forerunner Weapons",
    img: "icons/weapons/guns/rifle-blue.webp",
    weight: 13.2,
    rateOfFireMode: "Semi-Auto (2), Burst (3)",
    rateOfFireValue: 3,
    damageDice: 3,
    damageBase: 21,
    pierce: 5,
    rangeMin: 50,
    rangeMax: 975,
    magazine: 36,
    reload: "6 Half Actions",
    ammoType: "Light Mass",
    summary: "3d10 +21 | Pierce 5 | 50m-975m | Mag 36",
    details: "13.2 kg | 59 cR",
    description: "Light Rifle Variation 1 Z-250 directed-energy rifle from the Forerunner armory.\nWeight: 13.2 kg\nCost: 59 cR",
    special: "Hardlight and Headshot. Alternate burst mode fires 3d10 +17 with Pierce 7 at 30m-1,400m. Semi-auto shots consume 3 rounds each."
  }),
  createWeapon({
    id: "binary-rifle",
    name: "Binary Rifle",
    folder: "Forerunner Weapons",
    img: "icons/weapons/guns/rifle-sniper-blue.webp",
    attackType: "heavy",
    weight: 16.1,
    rateOfFireMode: "Auto (1)",
    rateOfFireValue: 1,
    damageDice: 8,
    damageBase: 22,
    pierce: 18,
    rangeMin: 50,
    rangeMax: 3000,
    magazine: 2,
    reload: "8 Half Actions",
    ammoType: "Ionized Particle",
    summary: "8d10 +22 | Pierce 18 | 50m-3000m | Mag 2",
    details: "16.1 kg | 110 cR",
    description: "Binary Rifle Variation 1 Z-750 special-application sniper rifle from the Forerunner armory.\nWeight: 16.1 kg\nCost: 110 cR",
    special: "Hardlight, Kinetic, Headshot, Long Barrel. Built-in 5x-10x smartlink scope."
  }),
  createWeapon({
    id: "hardlight-blade",
    name: "Hardlight Blade",
    folder: "Forerunner Melee",
    img: "icons/weapons/swords/sword-great-blue.webp",
    attackType: "melee",
    weight: 3,
    rateOfFireMode: "Melee",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 23,
    pierce: 20,
    reload: "N/A",
    ammoType: "",
    summary: "2d10 +23 | Pierce 20 | Reach +1",
    details: "3.0 kg | 129 cR",
    description: "Hardlight Blade from the Forerunner melee section.\nWeight: 3.0 kg\nCost: 129 cR",
    special: "Hardlight. Activates or deactivates as a half action. When parried, it damages the opposing weapon's breakpoints unless that weapon shares the rule."
  }),
  createWeapon({
    id: "plasma-grenade",
    name: "Plasma Grenade",
    folder: "Covenant Explosives",
    img: "icons/weapons/thrown/grenade-blue.webp",
    attackType: "explosive",
    weight: 0.9,
    rateOfFireMode: "Thrown",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 10,
    pierce: 20,
    reload: "Ready next grenade",
    ammoType: "Thrown Explosive",
    summary: "2d10 +10 | Pierce 20 | Blast (7) | Kill (2)",
    details: "0.9 kg | 12 cR",
    description: "Anskum Plasma Grenade Type-1 antipersonnel grenade from the Covenant explosives section.\nWeight: 0.9 kg\nCost: 12 cR",
    special: "Sticky, Cauterize, Blast (7), Kill (2). The grenade distinguishes targets by heat signature and detonates at the beginning of the target's next turn once stuck.",
    quantityMode: "magazine"
  }),
  createWeapon({
    id: "dynamo-grenade",
    name: "Dynamo Grenade",
    folder: "Banished Explosives",
    img: "icons/weapons/thrown/grenade-electric.webp",
    attackType: "explosive",
    weight: 1.1,
    rateOfFireMode: "Thrown",
    rateOfFireValue: 1,
    damageDice: 1,
    damageBase: 0,
    pierce: 30,
    reload: "Ready next grenade",
    ammoType: "Thrown Explosive",
    summary: "1d10 | Pierce 30 | Blast (4)",
    details: "1.1 kg | 12 cR",
    description: "Sicatt Workshop Dynamo Grenade from the Banished explosives section.\nWeight: 1.1 kg\nCost: 12 cR",
    special: "Electrified (1d10), EMP (2), Blast (4). Remains active for 3 turns and scatters 1d5 meters in a random direction each turn.",
    quantityMode: "magazine"
  }),
  createWeapon({
    id: "pulse-grenade",
    name: "Pulse Grenade",
    folder: "Forerunner Explosives",
    img: "icons/weapons/thrown/grenade-grey.webp",
    attackType: "explosive",
    weight: 0.3,
    rateOfFireMode: "Thrown",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 14,
    pierce: 6,
    reload: "Ready next grenade",
    ammoType: "Thrown Explosive",
    summary: "2d10 +14 | Pierce 6 | Blast (5) | Kill (1)",
    details: "0.3 kg | 12 cR",
    description: "Pulse Grenade Z-040 attenuation-field generator from the Forerunner armory.\nWeight: 0.3 kg\nCost: 12 cR",
    special: "Hardlight, Kinetic, Blast (5), Kill (1). Remains active for 4 rounds and damages targets that enter the field each round.",
    quantityMode: "magazine"
  }),
  createWeapon({
    id: "splinter-grenade",
    name: "Splinter Grenade",
    folder: "Forerunner Explosives",
    img: "icons/weapons/thrown/grenade-frag.webp",
    attackType: "explosive",
    weight: 0.4,
    rateOfFireMode: "Thrown",
    rateOfFireValue: 1,
    damageDice: 2,
    damageBase: 13,
    pierce: 5,
    reload: "Ready next grenade",
    ammoType: "Thrown Explosive",
    summary: "2d10 +13 | Pierce 5 | Blast (8)",
    details: "0.4 kg | 14 cR",
    description: "Splinter Grenade Z-400 pursuit-disruption grid generator from the Forerunner armory.\nWeight: 0.4 kg\nCost: 14 cR",
    special: "Hardlight. Spawns 25 splinter shards in an 8-meter sphere; each shard deals 1d5 damage that ignores damage resistance.",
    quantityMode: "magazine"
  })
];

const ARMOR_ITEMS = [
  createArmor({
    id: "m50b-standard-bdu",
    name: "M50B Standard BDU",
    folder: "Battle Dress Uniforms",
    img: "icons/equipment/chest/breastplate-layered-green.webp",
    weight: 11.9,
    head: 17,
    arms: 18,
    chest: 19,
    legs: 18,
    summary: "H 17 / A 18 / C 19 / L 18",
    details: "11.9 kg | 36 cR",
    description: "M50B Standard battle dress uniform profile from the Mythic 7.0 CU1 core armory.\nWeight: 11.9 kg\nCost: 36 cR"
  }),
  createArmor({
    id: "m52b-standard-bdu",
    name: "M52B Standard BDU",
    folder: "Battle Dress Uniforms",
    img: "icons/equipment/chest/breastplate-layered-green.webp",
    weight: 11.9,
    head: 18,
    arms: 19,
    chest: 20,
    legs: 19,
    summary: "H 18 / A 19 / C 20 / L 19",
    details: "11.9 kg | 38 cR",
    description: "M52B Standard battle dress uniform profile from the Mythic 7.0 CU1 core armory.\nWeight: 11.9 kg\nCost: 38 cR"
  }),
  createArmor({
    id: "m53-standard-bdu",
    name: "M53 Standard BDU",
    folder: "Battle Dress Uniforms",
    img: "icons/equipment/chest/breastplate-layered-green.webp",
    weight: 12.2,
    head: 19,
    arms: 19,
    chest: 20,
    legs: 20,
    summary: "H 19 / A 19 / C 20 / L 20",
    details: "12.2 kg | 39 cR",
    description: "M53 Standard battle dress uniform profile from the Mythic 7.0 CU1 core armory.\nWeight: 12.2 kg\nCost: 39 cR"
  }),
  createArmor({
    id: "standard-odst-bdu",
    name: "Standard ODST Battle Dress Uniform",
    folder: "Battle Dress Uniforms",
    img: "icons/equipment/chest/breastplate-metal-scaled-grey.webp",
    weight: 26,
    head: 20,
    arms: 19,
    chest: 20,
    legs: 19,
    summary: "H 20 / A 19 / C 20 / L 19",
    details: "26.0 kg | 139 cR",
    description: "Standard ODST battle dress uniform profile from the Mythic 7.0 CU1 core armory.\nWeight: 26.0 kg\nCost: 139 cR\nIncludes VISR, Kevlar undersuit, temperature regulator, VR/oxygen recycler, rucksack, thermal cooling, and timeline special rule."
  }),
  createArmor({
    id: "unggoy-combat-harness",
    name: "Unggoy Combat Harness",
    folder: "Covenant Armor",
    img: "icons/equipment/chest/breastplate-scale-blue.webp",
    weight: 10,
    head: 19,
    arms: 19,
    chest: 20,
    legs: 19,
    summary: "H 19 / A 19 / C 20 / L 19",
    details: "10.0 kg | 39 cR",
    description: "Unggoy Combat Harness based on the Major harness profile in the Covenant armory.\nWeight: 10.0 kg\nCost: 39 cR"
  }),
  createArmor({
    id: "sangheili-combat-harness",
    name: "Sangheili Combat Harness",
    folder: "Covenant Armor",
    img: "icons/equipment/chest/breastplate-layered-blue.webp",
    weight: 22.5,
    powered: true,
    head: 20,
    arms: 21,
    chest: 22,
    legs: 21,
    shieldMax: 100,
    shieldRecharge: 50,
    shieldDelay: 3,
    summary: "H 20 / A 21 / C 22 / L 21 | Shields 100",
    details: "22.5 kg | 94 cR",
    description: "Sangheili Combat Harness based on the Minor powered harness profile in the Covenant armory.\nWeight: 22.5 kg\nCost: 94 cR"
  }),
  createArmor({
    id: "jiralhanae-combat-harness",
    name: "Jiralhanae Combat Harness",
    folder: "Covenant Armor",
    img: "icons/equipment/chest/breastplate-scale-grey.webp",
    weight: 70,
    powered: true,
    head: 15,
    arms: 16,
    chest: 17,
    legs: 16,
    shieldMax: 50,
    shieldRecharge: 25,
    shieldDelay: 3,
    summary: "H 15 / A 16 / C 17 / L 16 | Shields 50",
    details: "70.0 kg | 52 cR",
    description: "Jiralhanae Combat Harness based on the Minor schism combat power armor profile in the Covenant armory.\nWeight: 70.0 kg\nCost: 52 cR"
  }),
  createArmor({
    id: "banished-medium-harness",
    name: "Banished Medium Harness",
    folder: "Banished Armor",
    img: "icons/equipment/chest/breastplate-layered-red.webp",
    weight: 14,
    head: 19,
    arms: 18,
    chest: 20,
    legs: 19,
    summary: "H 19 / A 18 / C 20 / L 19",
    details: "14.0 kg | 38 cR",
    description: "Banished Medium Harness from the Banished armor-creation table.\nWeight: 14.0 kg\nCost: 38 cR"
  }),
  createArmor({
    id: "banished-heavy-harness",
    name: "Banished Heavy Harness",
    folder: "Banished Armor",
    img: "icons/equipment/chest/breastplate-layered-red.webp",
    weight: 26,
    head: 20,
    arms: 20,
    chest: 22,
    legs: 21,
    summary: "H 20 / A 20 / C 22 / L 21",
    details: "26.0 kg | 41 cR",
    description: "Banished Heavy Harness from the Banished armor-creation table.\nWeight: 26.0 kg\nCost: 41 cR"
  }),
  createArmor({
    id: "gasgira-armor",
    name: "Gasgira Armor",
    folder: "Banished Armor",
    img: "icons/equipment/chest/breastplate-layered-red.webp",
    weight: 12,
    head: 19,
    arms: 20,
    chest: 22,
    legs: 19,
    summary: "H 19 / A 20 / C 22 / L 19",
    details: "Flight-tuned Banished harness",
    description: "Gasgira Armor using the Major Endless Gasgira bestiary profile, represented as a Banished harness with the free flight modification noted in the species rules."
  }),
  createArmor({
    id: "promethean-soldier-armor",
    name: "Promethean Soldier Armor",
    folder: "Forerunner Armor",
    img: "icons/equipment/chest/breastplate-metal-blue.webp",
    weight: 0,
    head: 25,
    arms: 25,
    chest: 35,
    legs: 25,
    summary: "H 25 / A 25 / C 35 / L 25",
    details: "Standard Promethean Soldier shell",
    description: "Promethean Soldier Armor using the standard bestiary profile. Promethean armor has exposed neck, limb-joint, and rear-chest sublocations that reduce armor when struck."
  })
];

const GEAR_ITEMS = [
  createGear({
    id: "ammunition-pouch",
    name: "Ammunition Pouch",
    folder: "Field Gear",
    img: "icons/containers/bags/pouch-leather-green.webp",
    weight: 0.5,
    summary: "0.5 kg | 2 cR",
    details: "Carries 3 units. Mount to utility or magnetic webbing.",
    description: "UNSC ammunition pouch from the Mythic 7.0 CU1 core equipment section.\nWeight: 0.5 kg\nCost: 2 cR\nCarries 3 units and mounts to utility or magnetic webbing."
  }),
  createGear({
    id: "flashlight",
    name: "Flashlight",
    folder: "Field Gear",
    img: "icons/sundries/lights/flashlight-black.webp",
    weight: 0.1,
    summary: "0.1 kg | 25 cR",
    details: "Lowers darkness penalties by +40 and low-light penalties by +10.",
    description: "Tactical flashlight entry based on the FSL armor attachment text in Mythic 7.0 CU1.\nWeight: 0.1 kg\nCost: 25 cR\nLowers darkness penalties by +40 and low-light penalties by +10."
  }),
  createGear({
    id: "holographic-tactical-eyepiece",
    name: "Holographic Tactical Eyepiece",
    folder: "Field Gear",
    img: "icons/commodities/tech/visor-head-blue.webp",
    weight: 0.2,
    summary: "0.2 kg | 12 cR",
    details: "HUD, IFF tracking, Smartlink, B-Net, and radar over one eye.",
    description: "Holographic Tactical Eyepiece profile from the Mythic 7.0 CU1 core equipment section.\nWeight: 0.2 kg\nCost: 12 cR\nAllows HUD, maps, IFF tag tracking, Smartlink, B-Net, and radar display over one eye."
  }),
  createGear({
    id: "tactical-hard-case",
    name: "Tactical Hard Case",
    folder: "Field Gear",
    img: "icons/containers/chest/chest-reinforced-steel-brown.webp",
    weight: 1.3,
    summary: "1.3 kg | 10 cR",
    details: "Armored carrying device with armor 11. Carries up to 6 units.",
    description: "Tactical Hard Case profile from the Mythic 7.0 CU1 core equipment section.\nWeight: 1.3 kg\nCost: 10 cR\nArmor 11 carrying device capable of holding up to 6 units."
  }),
  createGear({
    id: "tactical-softcase",
    name: "Tactical Softcase",
    folder: "Field Gear",
    img: "icons/containers/bags/case-simple-canvas-green.webp",
    weight: 0.3,
    summary: "0.3 kg | 3 cR",
    details: "Soft carrying pouch. Carries 7 units.",
    description: "Tactical Softcase profile from the Mythic 7.0 CU1 core equipment section.\nWeight: 0.3 kg\nCost: 3 cR\nSoft carrying pouch capable of holding up to 7 units."
  }),
  createGear({
    id: "utility-webbing",
    name: "Utility Webbing",
    folder: "Field Gear",
    img: "icons/equipment/back/cloak-collared-leather.webp",
    weight: 0.4,
    summary: "0.4 kg | 5 cR",
    details: "Mount hard cases, softcases, holsters, pouches, and cases to a body location.",
    description: "Utility Webbing profile from the Mythic 7.0 CU1 equipment and permutation sections.\nWeight: 0.4 kg\nCost: 5 cR\nLets a wearer mount hard cases, tactical holsters, pouches, and cases to a body location."
  }),
  createGear({
    id: "equipment-pouch",
    name: "Equipment Pouch",
    folder: "Faction Field Gear",
    img: "icons/containers/bags/pouch-simple-blue.webp",
    weight: 0.5,
    summary: "0.5 kg | faction issue",
    details: "Generic starter pouch used across Covenant, Banished, and Forerunner loadouts.",
    description: "Generic equipment pouch used to round out faction starter packages while the remaining utility-equipment tables are transcribed into individual entries."
  }),
  createGear({
    id: "methane-tank",
    name: "Methane Tank",
    folder: "Faction Field Gear",
    img: "icons/sundries/containers/cylinder.webp",
    weight: 9,
    summary: "9.0 kg | 10 cR",
    details: "Holds 120 hours of breathable methane and can act as an Unggoy jump-pack.",
    description: "Methane Tank from the Covenant equipment section.\nWeight: 9.0 kg\nCost: 10 cR\nHolds 120 hours of breathable methane. An Unggoy can vent it as a jump-pack to multiply jump and leap distances from 2x to 5x."
  })
];

const TRAIT_ITEMS = [
  createTrait({
    id: "skill-training",
    name: "Skill Training",
    summary: "Grant free skill ranks during character creation.",
    details: "Starter soldier trait",
    description: "A starting soldier-type benefit that grants additional free skill ranks during character creation. Exact quantity and rank depend on the selected soldier type."
  }),
  createTrait({
    id: "squad-up",
    name: "Squad Up",
    summary: "+5 Courage and +10 combined-action Warfare with allied UNSC soldier types.",
    details: "Mythic 7.0 CU1 core soldier trait",
    description: "When with allied UNSC military soldier types, the character gains +5 to Courage tests and +10 to Warfare Melee and Warfare Range tests when taking Combined Actions."
  }),
  createTrait({
    id: "natural-weapon",
    name: "Natural Weapon",
    summary: "This species begins play with an innate melee attack.",
    details: "Covenant and Banished species trait",
    description: "Species such as Unggoy, Kig-Yar, and Gasgira start with the Natural Weapon trait at character creation."
  }),
  createTrait({
    id: "language-expert",
    name: "Language Expert",
    summary: "Learn languages at half the normal experience cost.",
    details: "Unggoy cultural trait",
    description: "Unggoy can learn all languages at half the experience cost listed in the handbook."
  }),
  createTrait({
    id: "almost-smart",
    name: "Almost Smart",
    summary: "Educations cost double, but intellect-based learning limits are doubled.",
    details: "Unggoy cognitive trait",
    description: "Unggoy must pay double the experience to learn educations, but also double their Intellect modifier when figuring how many educations and languages they may learn."
  }),
  createTrait({
    id: "sangheili-leaping",
    name: "Sangheili Leaping",
    summary: "-20 to climbing and swimming, but +2 agility modifier when figuring leap distance.",
    details: "Sangheili physical trait",
    description: "Digitigrade Sangheili take penalties to climbing and swimming, but gain superior leaping distance from their anatomy."
  }),
  createTrait({
    id: "ancestral-honor",
    name: "Ancestral Honor",
    summary: "Sangheili can deepen mythic characteristics through legacy and bloodline advancement.",
    details: "Sangheili heritage trait",
    description: "Ancestral Honor allows a Sangheili to increase mythic Strength, Toughness, and Agility in ordered tiers through experience and bloodline."
  }),
  createTrait({
    id: "berserker",
    name: "Berserker",
    summary: "Begins with the Berserker ability and heightened scent-based perception.",
    details: "Jiralhanae trait",
    description: "Jiralhanae begin with the Berserker ability and gain +10 to smell-based Perception tests."
  }),
  createTrait({
    id: "crawler",
    name: "Crawler",
    summary: "Ignore difficult-terrain penalties and gain a major climbing bonus.",
    details: "Promethean and Gasgira mobility trait",
    description: "The character can cling to walls and surfaces, takes no penalties for difficult terrain, and gains a +40 bonus to climbing actions."
  }),
  createTrait({
    id: "flight",
    name: "Flight",
    summary: "This character can move through the air when the proper armor system is active.",
    details: "Gasgira mobility trait",
    description: "Gasgira flight systems can be activated or deactivated as a half action and are granted for free through the species' armor modification."
  }),
  createTrait({
    id: "four-arms",
    name: "Four Arms",
    summary: "This species can manipulate and threaten with four limbs at once.",
    details: "Gasgira physiology trait",
    description: "Gasgira physiology includes four arms, allowing them to handle equipment and attack angles beyond most humanoid species."
  }),
  createTrait({
    id: "promethean-vision",
    name: "Promethean Vision",
    summary: "See through non-biological obstacles and counter active camouflage.",
    details: "Promethean sensor trait",
    description: "Promethean Vision can see through around 20 meters of wall, floor, and non-biological material, and grants +30 when spotting characters using Active Camouflage."
  }),
  createTrait({
    id: "translocation",
    name: "Translocation",
    summary: "Teleport up to run speed as a full action and charge the distance over multiple actions.",
    details: "Promethean mobility trait",
    description: "Prometheans can teleport up to their Run movement speed as a full action, optionally carrying allies or gear, and can charge the effect to multiply the distance."
  }),
  createTrait({
    id: "glowing",
    name: "Glowing",
    summary: "Orange-yellow hardlight glow imposes a penalty to camouflage.",
    details: "Promethean visibility trait",
    description: "Prometheans emit a constant glow that applies a -20 penalty to Camouflage tests."
  }),
  createTrait({
    id: "slipspace-storage",
    name: "Slipspace Storage",
    summary: "Carry equipment in extradimensional storage with no practical weight limit.",
    details: "Promethean utility trait",
    description: "Prometheans can store equipment in slipspace. Retrieving an item takes a half action, and the storage cannot hold characters, sentinels, or vehicles."
  })
];

function buildAbilityEntries() {
  const abilityMap = new Map();

  for (const [packKey, pack] of Object.entries(SPECIALIZATION_PACKS)) {
    if (packKey === "none") continue;

    for (const abilityName of pack.abilities) {
      const entry = abilityMap.get(abilityName) ?? {
        id: slugify(abilityName),
        name: abilityName,
        packs: []
      };

      entry.packs.push(pack.label);
      abilityMap.set(abilityName, entry);
    }
  }

  return Array.from(abilityMap.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => createAbility({
      id: entry.id,
      name: entry.name,
      summary: `Starter specialization ability used by ${entry.packs.join(", ")}.`,
      details: `${entry.packs.length} specialization package${entry.packs.length === 1 ? "" : "s"}`,
      description: `${entry.name} is referenced by the following starter specialization packages: ${entry.packs.join(", ")}.\nFull book text can be added into this compendium entry as we continue transcribing the source material.`
    }));
}

export const STARTER_LIBRARY_PACKS = [
  {
    name: "starter-weapons",
    label: "Starter Weapons",
    path: "packs/starter-weapons",
    type: "Item",
    system: "halo-mythic"
  },
  {
    name: "starter-armor",
    label: "Starter Armor",
    path: "packs/starter-armor",
    type: "Item",
    system: "halo-mythic"
  },
  {
    name: "starter-gear",
    label: "Starter Gear",
    path: "packs/starter-gear",
    type: "Item",
    system: "halo-mythic"
  },
  {
    name: "starter-abilities",
    label: "Starter Abilities",
    path: "packs/starter-abilities",
    type: "Item",
    system: "halo-mythic"
  },
  {
    name: "starter-traits",
    label: "Starter Traits",
    path: "packs/starter-traits",
    type: "Item",
    system: "halo-mythic"
  }
];

export const STARTER_LIBRARY_ITEMS = [
  ...WEAPON_ITEMS,
  ...ARMOR_ITEMS,
  ...GEAR_ITEMS,
  ...buildAbilityEntries(),
  ...TRAIT_ITEMS
];

const ENTRY_MAP = new Map(STARTER_LIBRARY_ITEMS.map((entry) => [entry.id, entry]));

const LOADOUT_RULES = {
  "MA3 or MA4 Series Assault Rifle": {
    key: "primary-ma3-ma4-series",
    label: "Primary Weapon Variant",
    options: ["ma3a-assault-rifle", "ma40-assault-rifle"]
  },
  "M392 or M395 DMR": {
    key: "primary-dmr-series",
    label: "Primary Weapon Variant",
    options: ["m392-dmr", "m395-dmr"]
  },
  "MA5 Series Assault Rifle": {
    key: "primary-ma5-series",
    label: "Primary Weapon Variant",
    options: ["ma5b-assault-rifle", "ma5c-assault-rifle", "ma5d-assault-rifle"]
  },
  "BR55 / BR75 / BR85 Battle Rifle": {
    key: "primary-br-series",
    label: "Primary Weapon Variant",
    options: ["br55-battle-rifle", "br75-battle-rifle", "br85-battle-rifle"]
  },
  "M6 Series Pistol": {
    key: "secondary-m6-series",
    label: "Sidearm Variant",
    options: ["m6b-pistol", "m6c-pistol", "m6g-pistol"]
  },
  "M6 Series Pistol of the time": {
    key: "secondary-m6-series-era",
    label: "Sidearm Variant",
    options: ["m6b-pistol", "m6c-pistol", "m6g-pistol"]
  },
  "M6 Series Pistol or M6I Carbine": {
    key: "secondary-m6-or-m6i",
    label: "Secondary Weapon Variant",
    options: ["m6b-pistol", "m6c-pistol", "m6g-pistol", "m6i-carbine"]
  },
  "M6 Series Pistol or M6J Carbine": {
    key: "secondary-m6-or-m6j",
    label: "Secondary Weapon Variant",
    options: ["m6b-pistol", "m6c-pistol", "m6g-pistol", "m6j-carbine"]
  },
  "M6 Series or M6I Carbine Variant": {
    key: "secondary-m6-variant-or-m6i",
    label: "Secondary Weapon Variant",
    options: ["m6b-pistol", "m6c-pistol", "m6g-pistol", "m6i-carbine"]
  },
  "M6I Carbine": {
    key: "secondary-m6i-only",
    label: "Secondary Weapon Variant",
    options: ["m6i-carbine"]
  },
  "M50B / M52B / M53 BDU": {
    key: "armor-line-bdu",
    label: "Armor Variant",
    options: ["m50b-standard-bdu", "m52b-standard-bdu", "m53-standard-bdu"]
  },
  "M1 Combat Knife or Model 52 Knife": {
    key: "support-knife-model-52",
    label: "Knife Variant",
    options: ["m1-combat-knife", "model-52-knife"]
  },
  "M1 Combat Knife or MK 88 Ratio": {
    key: "support-knife-mk88",
    label: "Knife Variant",
    options: ["m1-combat-knife", "mk-88-ratio"]
  },
  "MA37 Assault Rifle": { options: ["ma37-assault-rifle"] },
  "M45 Tactical Shotgun": { options: ["m45-tactical-shotgun"] },
  "AIE-486H Heavy Machine Gun": { options: ["aie-486h-heavy-machine-gun"] },
  "M90 SCAWS Shotgun": { options: ["m90-scaws-shotgun"] },
  "M90 Close Assault Weapon System Shotgun": { options: ["m90-close-assault-shotgun"] },
  "M7 Caseless SMG": { options: ["m7-caseless-submachine-gun"] },
  "M7 Caseless Submachine Gun": { options: ["m7-caseless-submachine-gun"] },
  "M247 Machine Gun": { options: ["m247-machine-gun"] },
  "SRS99 Sniper Rifle System": { options: ["srs99-sniper-rifle"] },
  "M41 Rocket Launcher": { options: ["m41-rocket-launcher"] },
  "Standard ODST Battle Dress Uniform": { options: ["standard-odst-bdu"] },
  "Holographic Tactical Eyepiece": { options: ["holographic-tactical-eyepiece"] },
  "Flashlight": { options: ["flashlight"] },
  "Utility Webbing": { options: ["utility-webbing"] },
  "Ammunition Pouch": { options: ["ammunition-pouch"] },
  "Ammunition Pouches": { options: ["ammunition-pouch"] },
  "Tactical Hard Case": { options: ["tactical-hard-case"] },
  "Tactical Hard Cases": { options: ["tactical-hard-case"] },
  "Tactical Softcase": { options: ["tactical-softcase"] },
  "Tactical Softcases": { options: ["tactical-softcase"] },
  "Flashbang Grenade": { options: ["flashbang-grenade"] },
  "Flashbang Grenades": { options: ["flashbang-grenade"] },
  "M9 Dual-Purpose Grenade": { options: ["m9-dual-purpose-grenade"] },
  "M9 Dual-Purpose Grenades": { options: ["m9-dual-purpose-grenade"] },
  "Plasma Pistol": { options: ["plasma-pistol"] },
  "Plasma Rifle": { options: ["plasma-rifle"] },
  "Needler": { options: ["needler"] },
  "Energy Sword": { options: ["energy-sword"] },
  "Curveblade": { options: ["standard-curveblade"] },
  "Sangheili Curveblade": { options: ["sangheili-curveblade"] },
  "Disruptor Pistol": { options: ["disruptor-pistol"] },
  "Disruptor Pistols": { options: ["disruptor-pistol"] },
  "Mangler Spike Revolver": { options: ["mangler-spike-revolver"] },
  "Shock Rifle": { options: ["shock-rifle"] },
  "Ravager": { options: ["ravager"] },
  "Boltshot": { options: ["boltshot"] },
  "Suppressor": { options: ["suppressor"] },
  "Light Rifle": { options: ["light-rifle"] },
  "Binary Rifle": { options: ["binary-rifle"] },
  "Hardlight Blade": { options: ["hardlight-blade"] },
  "Plasma Grenade": { options: ["plasma-grenade"] },
  "Plasma Grenades": { options: ["plasma-grenade"] },
  "Dynamo Grenade": { options: ["dynamo-grenade"] },
  "Dynamo Grenades": { options: ["dynamo-grenade"] },
  "Pulse Grenade": { options: ["pulse-grenade"] },
  "Pulse Grenades": { options: ["pulse-grenade"] },
  "Splinter Grenade": { options: ["splinter-grenade"] },
  "Splinter Grenades": { options: ["splinter-grenade"] },
  "Unggoy Combat Harness": { options: ["unggoy-combat-harness"] },
  "Sangheili Combat Harness": { options: ["sangheili-combat-harness"] },
  "Jiralhanae Combat Harness": { options: ["jiralhanae-combat-harness"] },
  "Banished Medium Harness": { options: ["banished-medium-harness"] },
  "Banished Heavy Harness": { options: ["banished-heavy-harness"] },
  "Gasgira Armor": { options: ["gasgira-armor"] },
  "Promethean Soldier Armor": { options: ["promethean-soldier-armor"] },
  "Equipment Pouch": { options: ["equipment-pouch"] },
  "Equipment Pouches": { options: ["equipment-pouch"] },
  "Methane Tank": { options: ["methane-tank"] }
};

export function getLibraryItem(entryId) {
  return ENTRY_MAP.get(entryId) ?? null;
}

export function findLibraryItemByName(name, { type } = {}) {
  const normalizedName = String(name ?? "").trim().toLowerCase();
  if (!normalizedName) return null;

  return STARTER_LIBRARY_ITEMS.find((entry) => {
    if (type && entry.type !== type) return false;
    return entry.name.toLowerCase() === normalizedName;
  }) ?? null;
}

export function getLibraryItems({ pack, type, search = "" } = {}) {
  const searchText = String(search ?? "").trim().toLowerCase();

  return STARTER_LIBRARY_ITEMS.filter((entry) => {
    if (pack && entry.pack !== pack) return false;
    if (type && entry.type !== type) return false;
    if (!searchText) return true;

    return [
      entry.name,
      entry.folder,
      entry.summary,
      entry.details,
      entry.system?.special,
      entry.system?.description
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchText));
  });
}

function mergeData(base, updates) {
  const result = cloneData(base);

  for (const [key, value] of Object.entries(updates ?? {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && (result[key] ?? null) && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = mergeData(result[key], value);
      continue;
    }

    result[key] = cloneData(value);
  }

  return result;
}

export function createLibraryItemSource(entryId, overrides = {}) {
  const entry = getLibraryItem(entryId);
  if (!entry) return null;

  const source = {
    name: entry.name,
    type: entry.type,
    img: entry.img,
    effects: [],
    folder: null,
    flags: {
      "halo-mythic": {
        libraryEntryId: entry.id,
        sourcePack: entry.pack
      }
    },
    system: cloneData(entry.system)
  };

  if (overrides.name) source.name = String(overrides.name);

  if ((entry.type === "gear") && Number.isFinite(Number(overrides.quantity))) {
    source.system.quantity = Math.max(1, Number(overrides.quantity));
  }

  if ((entry.type === "weapon") && (entry.quantityMode === "magazine") && Number.isFinite(Number(overrides.quantity))) {
    const quantity = Math.max(1, Number(overrides.quantity));
    source.system.magazine.value = quantity;
    source.system.magazine.max = quantity;
  }

  if ((entry.type === "weapon") && (overrides.equipped !== undefined)) {
    source.system.equipped = Boolean(overrides.equipped);
  }

  if ((entry.type === "armor") && (overrides.equipped !== undefined)) {
    source.system.equipped = Boolean(overrides.equipped);
  }

  if (overrides.system && typeof overrides.system === "object") {
    source.system = mergeData(source.system, overrides.system);
  }

  if (overrides.flags && typeof overrides.flags === "object") {
    source.flags = mergeData(source.flags, overrides.flags);
  }

  return source;
}

function parseQuantityLabel(label) {
  const match = String(label ?? "").trim().match(/^(\d+)x\s+(.+)$/i);
  if (!match) {
    return {
      quantity: 1,
      baseLabel: String(label ?? "").trim()
    };
  }

  return {
    quantity: Number(match[1]),
    baseLabel: String(match[2] ?? "").trim()
  };
}

function getChoiceRule(baseLabel) {
  return LOADOUT_RULES[baseLabel] ?? null;
}

function getChoiceSelection(rule, choiceState = {}) {
  const selected = String(choiceState?.[rule.key] ?? "").trim();
  return rule.options.includes(selected) ? selected : rule.options[0];
}

export function getLoadoutChoiceSlots(loadout, choiceState = {}) {
  if (!loadout) return [];

  const slots = [];
  const addSlot = (label, sourceLabel) => {
    const { baseLabel } = parseQuantityLabel(sourceLabel);
    const rule = getChoiceRule(baseLabel);
    if (!rule || rule.options.length <= 1 || !rule.key) return;

    const selected = getChoiceSelection(rule, choiceState);
    slots.push({
      key: rule.key,
      label,
      sourceLabel: baseLabel,
      selected,
      options: rule.options
        .map((entryId) => getLibraryItem(entryId))
        .filter(Boolean)
        .map((entry) => ({
          key: entry.id,
          label: entry.name
        }))
    });
  };

  addSlot("Primary Weapon Variant", loadout.primaryWeapon);
  addSlot("Secondary Weapon Variant", loadout.secondaryWeapon);
  addSlot("Armor Variant", loadout.armor);

  for (const supportLabel of loadout.supportGear ?? []) {
    const { baseLabel } = parseQuantityLabel(supportLabel);
    const rule = getChoiceRule(baseLabel);
    if (!rule || rule.options.length <= 1 || !rule.key) continue;
    addSlot(`Support Choice: ${baseLabel}`, supportLabel);
  }

  return slots;
}

function buildResolvedLoadoutEntry({ category, sourceLabel, choiceState }) {
  const { quantity, baseLabel } = parseQuantityLabel(sourceLabel);
  const rule = getChoiceRule(baseLabel);
  if (!rule) {
    return {
      category,
      quantity,
      sourceLabel: baseLabel,
      entry: null
    };
  }

  const entryId = rule.options.length > 1 ? getChoiceSelection(rule, choiceState) : rule.options[0];
  return {
    category,
    quantity,
    sourceLabel: baseLabel,
    entry: getLibraryItem(entryId)
  };
}

export function resolveLoadoutEntries(loadout, choiceState = {}) {
  if (!loadout || loadout.label === "Manual / None") return [];

  const entries = [];

  if (loadout.primaryWeapon) {
    entries.push(buildResolvedLoadoutEntry({
      category: "primary",
      sourceLabel: loadout.primaryWeapon,
      choiceState
    }));
  }

  if (loadout.secondaryWeapon) {
    entries.push(buildResolvedLoadoutEntry({
      category: "secondary",
      sourceLabel: loadout.secondaryWeapon,
      choiceState
    }));
  }

  if (loadout.armor) {
    entries.push(buildResolvedLoadoutEntry({
      category: "armor",
      sourceLabel: loadout.armor,
      choiceState
    }));
  }

  for (const supportLabel of loadout.supportGear ?? []) {
    entries.push(buildResolvedLoadoutEntry({
      category: "support",
      sourceLabel: supportLabel,
      choiceState
    }));
  }

  return entries;
}

export function buildLoadoutPreview(loadout, choiceState = {}) {
  const labels = {
    primary: "Primary",
    secondary: "Secondary",
    armor: "Armor",
    support: "Support"
  };

  return resolveLoadoutEntries(loadout, choiceState)
    .filter((entry) => entry.entry)
    .map((entry) => ({
      label: labels[entry.category] ?? entry.category,
      text: `${entry.quantity > 1 ? `${entry.quantity}x ` : ""}${entry.entry.name}`
    }));
}

export function createLoadoutItemSources(loadout, choiceState = {}, flags = {}) {
  const items = [];

  for (const resolved of resolveLoadoutEntries(loadout, choiceState)) {
    if (!resolved.entry) continue;

    const equipped =
      (resolved.category === "primary") ||
      (resolved.category === "secondary") ||
      (resolved.category === "armor") ||
      ((resolved.category === "support") && (resolved.entry.type === "weapon") && (resolved.entry.system.attackType === "melee"));

    if ((resolved.entry.type === "gear") || (resolved.entry.quantityMode === "magazine")) {
      const source = createLibraryItemSource(resolved.entry.id, {
        quantity: resolved.quantity,
        equipped,
        flags
      });
      if (source) items.push({ ...resolved, source });
      continue;
    }

    for (let index = 0; index < resolved.quantity; index += 1) {
      const source = createLibraryItemSource(resolved.entry.id, {
        equipped,
        flags
      });
      if (source) items.push({ ...resolved, source });
    }
  }

  return items;
}

export function getStarterLibraryPackTree(search = "") {
  return STARTER_LIBRARY_PACKS.map((pack) => {
    const items = getLibraryItems({ pack: pack.name, search });
    const folders = Array.from(new Set(items.map((entry) => entry.folder)))
      .sort((a, b) => a.localeCompare(b))
      .map((folderName) => ({
        name: folderName,
        items: items
          .filter((entry) => entry.folder === folderName)
          .sort((a, b) => a.name.localeCompare(b.name))
      }))
      .filter((folder) => folder.items.length);

    return {
      ...pack,
      folders
    };
  }).filter((pack) => pack.folders.length);
}
