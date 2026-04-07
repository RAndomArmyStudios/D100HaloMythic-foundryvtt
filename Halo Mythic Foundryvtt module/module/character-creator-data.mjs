import { CHARACTERISTIC_KEYS } from "./config.mjs";

function createBaseCharacteristics(value = 25) {
  return Object.fromEntries(CHARACTERISTIC_KEYS.map((key) => [key, value]));
}

export const STARTING_XP_TIERS = [
  { tier: 0, min: 0, max: 500, credits: 50 },
  { tier: 1, min: 501, max: 1000, credits: 100 },
  { tier: 2, min: 1001, max: 2000, credits: 200 },
  { tier: 3, min: 2001, max: 4000, credits: 350 },
  { tier: 4, min: 4001, max: 8000, credits: 550 },
  { tier: 5, min: 8001, max: 16000, credits: 800 },
  { tier: 6, min: 16001, max: 32000, credits: 1100 },
  { tier: 7, min: 32001, max: 64000, credits: 1450 },
  { tier: 8, min: 64001, max: Number.POSITIVE_INFINITY, credits: 1450 }
];

export const SPECIALIZATION_PACKS = {
  none: {
    label: "No Specialization",
    abilities: [],
    skills: [],
    summary: "Leave specialization open and fill the rest manually."
  },
  battlefieldMedic: {
    label: "Battlefield Medic",
    abilities: ["Emergency Procedure", "Field Medic", "Under Control"],
    skills: [
      { key: "evasion", rank: "trained" },
      { key: "investigation", rank: "trained" },
      { key: "medicationHuman", rank: "trained" }
    ],
    summary: "Stabilizes allies and keeps the squad upright under pressure."
  },
  closeQuarters: {
    label: "Close Quarters",
    abilities: ["Disarm", "Evasive Maneuvers", "Hand-To-Hand"],
    skills: [
      { key: "athletics", rank: "plus10" },
      { key: "investigation", rank: "trained" },
      { key: "survival", rank: "trained" }
    ],
    summary: "Aggressive breaching and room-clearing profile."
  },
  demolitions: {
    label: "Demolitions",
    abilities: ["Gather Senses", "Mind Timer", "Under Control"],
    skills: [
      { key: "demolition", rank: "trained" },
      { key: "technologyHuman", rank: "trained" },
      { key: "investigation", rank: "trained" }
    ],
    summary: "Handles breaching charges, traps, and battlefield explosives."
  },
  duelist: {
    label: "Duelist",
    abilities: ["Akimbo", "Denial", "Quickdraw"],
    skills: [
      { key: "athletics", rank: "trained" },
      { key: "stunting", rank: "trained" },
      { key: "survival", rank: "trained" }
    ],
    summary: "Fast sidearm work and mobile close-range fighting."
  },
  heavyWeapons: {
    label: "Heavy Weapons",
    abilities: ["Gather Senses", "Mobile Fire", "Rapid Reload"],
    skills: [
      { key: "athletics", rank: "trained" },
      { key: "survival", rank: "trained" },
      { key: "intimidation", rank: "trained" }
    ],
    summary: "Built to carry the squad's largest guns."
  },
  logistics: {
    label: "Logistics",
    abilities: ["Eagle Eye", "Exceptional Hearing", "Triangulation"],
    skills: [
      { key: "cryptography", rank: "plus10" },
      { key: "security", rank: "trained" },
      { key: "technologyHuman", rank: "trained" }
    ],
    summary: "Signal, support, and battlefield information management."
  },
  marksman: {
    label: "Marksman",
    abilities: ["Adept Marksman", "Far-Sight", "Marksman"],
    skills: [
      { key: "athletics", rank: "trained" },
      { key: "camouflage", rank: "trained" },
      { key: "navigationGroundAir", rank: "trained" }
    ],
    summary: "Long-range accuracy and target acquisition."
  },
  pointman: {
    label: "Pointman",
    abilities: ["Fast Foot", "Gather Senses", "Snapshot"],
    skills: [
      { key: "athletics", rank: "trained" },
      { key: "investigation", rank: "trained" },
      { key: "survival", rank: "trained" }
    ],
    summary: "Lead-from-the-front movement and contact response."
  },
  reconInfiltration: {
    label: "Recon / Infiltration",
    abilities: ["Always Ready", "Eagle Eye", "Exceptional Hearing"],
    skills: [
      { key: "camouflage", rank: "plus10" },
      { key: "cryptography", rank: "trained" },
      { key: "investigation", rank: "trained" }
    ],
    summary: "Sneaking, scouting, and covert information gathering."
  },
  resourceSupport: {
    label: "Resource / Support",
    abilities: ["Ask Nicely", "Resourceful", "Triangulation"],
    skills: [
      { key: "investigation", rank: "trained" },
      { key: "security", rank: "trained" },
      { key: "technologyHuman", rank: "trained" }
    ],
    summary: "Acquisition, support, and technical coordination."
  },
  technicianComms: {
    label: "Technician / Comms",
    abilities: ["Alien Tech", "Handyman", "Smooth Talker"],
    skills: [
      { key: "command", rank: "trained" },
      { key: "investigation", rank: "trained" },
      { key: "technologyHuman", rank: "trained" }
    ],
    summary: "Comms, repair, and systems support specialist."
  },
  vehicleExpert: {
    label: "Vehicle Expert",
    abilities: ["Handyman", "Gather Senses", "Mobile Fire"],
    skills: [
      { key: "navigationGroundAir", rank: "trained" },
      { key: "pilotGround", rank: "trained" },
      { key: "technologyHuman", rank: "trained" }
    ],
    summary: "Ground mobility, maintenance, and weapons handling."
  }
};

export const LOADOUT_PRESETS = {
  manual: {
    label: "Manual / None",
    bundleName: "Manual Loadout",
    primaryWeapon: "",
    secondaryWeapon: "",
    armor: "",
    supportGear: [],
    summary: "Choose gear manually after applying the builder."
  },
  armyPointMan: {
    label: "Army Point Man",
    bundleName: "Point Man Equipment",
    primaryWeapon: "MA3 or MA4 Series Assault Rifle",
    secondaryWeapon: "M6 Series Pistol or M6J Carbine",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Balanced rifleman package for line infantry work."
  },
  armyMarksman: {
    label: "Army Marksman",
    bundleName: "Marksman Equipment",
    primaryWeapon: "M392 or M395 DMR",
    secondaryWeapon: "M6 Series Pistol or M6J Carbine",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Long-range precision rifleman package."
  },
  armyCloseQuarters: {
    label: "Army Close Quarters",
    bundleName: "Close Quarters Equipment",
    primaryWeapon: "M45 Tactical Shotgun",
    secondaryWeapon: "M6 Series Pistol or M6J Carbine",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Breaching and close interior fighting package."
  },
  armyHeavySupport: {
    label: "Army Heavy Support",
    bundleName: "Heavy Support Equipment",
    primaryWeapon: "AIE-486H Heavy Machine Gun",
    secondaryWeapon: "M6 Series Pistol",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Suppressive-fire package built around a heavy weapon."
  },
  militiaPointMan: {
    label: "Militiaman Point Man",
    bundleName: "Point Man Equipment",
    primaryWeapon: "MA37 Assault Rifle",
    secondaryWeapon: "M6 Series Pistol",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or MK 88 Ratio",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Militia rifle package with general-purpose kit."
  },
  militiaMarksman: {
    label: "Militiaman Marksman",
    bundleName: "Marksman Equipment",
    primaryWeapon: "M392 DMR",
    secondaryWeapon: "M6 Series Pistol",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or MK 88 Ratio",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Militia sharpshooter package."
  },
  militiaCloseQuarters: {
    label: "Militiaman Close Quarters",
    bundleName: "Close Quarters Equipment",
    primaryWeapon: "M90 SCAWS Shotgun",
    secondaryWeapon: "M6 Series Pistol",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or MK 88 Ratio",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Militia breaching and close-defense package."
  },
  militiaAssault: {
    label: "Militiaman Assault",
    bundleName: "Assault Equipment",
    primaryWeapon: "M7 Caseless SMG",
    secondaryWeapon: "M6 Series Pistol",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or MK 88 Ratio",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Fast, compact weapon package for urban or irregular fighting."
  },
  marinePointMan: {
    label: "Marine Point Man",
    bundleName: "Point Man Equipment",
    primaryWeapon: "MA5 Series Assault Rifle",
    secondaryWeapon: "M6 Series Pistol",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Softcases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Classic marine rifleman field kit."
  },
  marineMarksman: {
    label: "Marine Marksman",
    bundleName: "Marksman Equipment",
    primaryWeapon: "BR55 / BR75 / BR85 Battle Rifle",
    secondaryWeapon: "M6 Series Pistol or M6I Carbine",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Marine battle-rifle package with flexible range coverage."
  },
  marineCloseQuarters: {
    label: "Marine Close Quarters",
    bundleName: "Close Quarters Equipment",
    primaryWeapon: "M90 Close Assault Weapon System Shotgun",
    secondaryWeapon: "M6 Series Pistol or M6I Carbine",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Boarding and confined-space marine loadout."
  },
  marineHeavySupport: {
    label: "Marine Heavy Support",
    bundleName: "Heavy Support Equipment",
    primaryWeapon: "AIE-486H Heavy Machine Gun",
    secondaryWeapon: "M6 Series Pistol",
    armor: "M50B / M52B / M53 BDU",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Marine support gunner field package."
  },
  odstPointMan: {
    label: "ODST Point Man",
    bundleName: "Point Man Equipment",
    primaryWeapon: "MA5 Series Assault Rifle",
    secondaryWeapon: "M6 Series or M6I Carbine Variant",
    armor: "Standard ODST Battle Dress Uniform",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Shock infantry package for orbital drop operations."
  },
  odstAssault: {
    label: "ODST Assault and Ambush",
    bundleName: "Assault and Ambush Equipment",
    primaryWeapon: "M7 Caseless Submachine Gun",
    secondaryWeapon: "M6I Carbine",
    armor: "Standard ODST Battle Dress Uniform",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Aggressive ambush kit built around compact firepower."
  },
  odstCloseQuarters: {
    label: "ODST Close Quarters",
    bundleName: "Close Quarters Equipment",
    primaryWeapon: "M45 Tactical Shotgun",
    secondaryWeapon: "M6 Series Pistol or M6I Carbine",
    armor: "Standard ODST Battle Dress Uniform",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Room-clearing and close assault drop package."
  },
  odstGunnery: {
    label: "ODST General Purpose Gunnery",
    bundleName: "General Purpose Gunnery Equipment",
    primaryWeapon: "M247 Machine Gun",
    secondaryWeapon: "M6 Series Pistol",
    armor: "Standard ODST Battle Dress Uniform",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "1x Flashbang Grenade",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "Tactical Softcase",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "ODST gunner package for suppressive fire."
  },
  odstLongRange: {
    label: "ODST Long Ranged Specialist",
    bundleName: "Long Ranged Specialist Equipment",
    primaryWeapon: "SRS99 Sniper Rifle System",
    secondaryWeapon: "M6 Series Pistol",
    armor: "Standard ODST Battle Dress Uniform",
    supportGear: [
      "1x M9 Dual-Purpose Grenade",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Softcases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "ODST designated marksman / sniper package."
  },
  odstAntiArmor: {
    label: "ODST Anti-Armor",
    bundleName: "Anti-Armor Equipment",
    primaryWeapon: "M41 Rocket Launcher",
    secondaryWeapon: "M6 Series Pistol",
    armor: "Standard ODST Battle Dress Uniform",
    supportGear: [
      "1x M9 Dual-Purpose Grenade",
      "1x Flashbang Grenade",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "Tactical Softcase",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Dedicated anti-vehicle and breach target package."
  },
  odstMarksman: {
    label: "ODST Marksman",
    bundleName: "Marksman Equipment",
    primaryWeapon: "BR55 / BR75 / BR85 Battle Rifle",
    secondaryWeapon: "M6I Carbine",
    armor: "Standard ODST Battle Dress Uniform",
    supportGear: [
      "2x M9 Dual-Purpose Grenades",
      "2x Flashbang Grenades",
      "3x Ammunition Pouches",
      "M1 Combat Knife or Model 52 Knife",
      "Holographic Tactical Eyepiece",
      "2x Tactical Hard Cases",
      "Utility Webbing",
      "Flashlight"
    ],
    summary: "Drop trooper battle-rifle package."
  },
  unggoyAntiInfantry: {
    label: "Unggoy Anti-Infantry",
    bundleName: "Anti-Infantry Equipment",
    primaryWeapon: "Plasma Pistol",
    secondaryWeapon: "Curveblade",
    armor: "Unggoy Combat Harness",
    supportGear: [
      "2x Plasma Grenade",
      "Equipment Pouch",
      "Flashlight",
      "Methane Tank"
    ],
    summary: "Close-support grunt package built around a plasma sidearm and grenades."
  },
  unggoyGuided: {
    label: "Unggoy Guided Munitions",
    bundleName: "Guided Munitions Equipment",
    primaryWeapon: "Needler",
    secondaryWeapon: "Curveblade",
    armor: "Unggoy Combat Harness",
    supportGear: [
      "Plasma Grenade",
      "Equipment Pouch",
      "Flashlight",
      "Methane Tank"
    ],
    summary: "Needler-equipped grunt loadout for guided shard volleys."
  },
  sangheiliStandard: {
    label: "Sangheili Standard",
    bundleName: "Standard Equipment",
    primaryWeapon: "Plasma Rifle",
    secondaryWeapon: "Plasma Pistol",
    armor: "Sangheili Combat Harness",
    supportGear: [
      "2x Plasma Grenade",
      "Sangheili Curveblade",
      "Equipment Pouch",
      "Flashlight"
    ],
    summary: "Classic Sangheili line-warrior kit with paired plasma weapons."
  },
  sangheiliGuided: {
    label: "Sangheili Guided Munitions",
    bundleName: "Guided Munitions Equipment",
    primaryWeapon: "Needler",
    secondaryWeapon: "Plasma Pistol",
    armor: "Sangheili Combat Harness",
    supportGear: [
      "2x Plasma Grenade",
      "Sangheili Curveblade",
      "Equipment Pouch",
      "Flashlight"
    ],
    summary: "Guided-munitions Sangheili package built around the Type-33 Needler."
  },
  sangheiliMarksman: {
    label: "Sangheili Marksman",
    bundleName: "Marksman Equipment",
    primaryWeapon: "Plasma Rifle",
    secondaryWeapon: "Plasma Pistol",
    armor: "Sangheili Combat Harness",
    supportGear: [
      "2x Plasma Grenade",
      "Sangheili Curveblade",
      "Equipment Pouch",
      "Flashlight"
    ],
    summary: "A denser approximation of the carbine marksman kit until the full Covenant armory is filled out."
  },
  jiralhanaePlasma: {
    label: "Jiralhanae Plasma",
    bundleName: "Plasma Equipment",
    primaryWeapon: "Plasma Rifle",
    secondaryWeapon: "Plasma Pistol",
    armor: "Jiralhanae Combat Harness",
    supportGear: [
      "2x Plasma Grenade",
      "Curveblade",
      "2x Equipment Pouch"
    ],
    summary: "Brute plasma package with extra carrying capacity for support gear."
  },
  jiralhanaeGuided: {
    label: "Jiralhanae Guided Munitions",
    bundleName: "Guided Munitions Equipment",
    primaryWeapon: "Needler",
    secondaryWeapon: "Plasma Pistol",
    armor: "Jiralhanae Combat Harness",
    supportGear: [
      "2x Plasma Grenade",
      "Curveblade",
      "2x Equipment Pouch"
    ],
    summary: "Banished-leaning guided-munitions kit for Jiralhanae hunters."
  },
  gasgiraRanged: {
    label: "Gasgira Ranged",
    bundleName: "Ranged Equipment",
    primaryWeapon: "Shock Rifle",
    secondaryWeapon: "Curveblade",
    armor: "Gasgira Armor",
    supportGear: [
      "2x Dynamo Grenade",
      "Equipment Pouch",
      "Flashlight"
    ],
    summary: "Flight-capable ranged package built around the Shock Rifle."
  },
  gasgiraDualWield: {
    label: "Gasgira Dual-Wield",
    bundleName: "Dual-Wield Equipment",
    primaryWeapon: "Disruptor Pistol",
    secondaryWeapon: "Disruptor Pistol",
    armor: "Gasgira Armor",
    supportGear: [
      "2x Dynamo Grenade",
      "Curveblade",
      "Equipment Pouch",
      "Flashlight"
    ],
    summary: "Four-armed skimmer loadout for dual-wield disruption fire."
  },
  prometheanSuppression: {
    label: "Promethean Suppression",
    bundleName: "Suppression Equipment",
    primaryWeapon: "Suppressor",
    secondaryWeapon: "Boltshot",
    armor: "Promethean Soldier Armor",
    supportGear: [
      "Splinter Grenade"
    ],
    summary: "Frontline suppressive-fire Promethean package."
  },
  prometheanCommando: {
    label: "Promethean Commando",
    bundleName: "Commando Equipment",
    primaryWeapon: "Light Rifle",
    secondaryWeapon: "Boltshot",
    armor: "Promethean Soldier Armor",
    supportGear: [
      "Pulse Grenade"
    ],
    summary: "Balanced ranged package for mobile Forerunner line troops."
  },
  prometheanDevastator: {
    label: "Promethean Devastator",
    bundleName: "Devastator Equipment",
    primaryWeapon: "Hardlight Blade",
    secondaryWeapon: "Boltshot",
    armor: "Promethean Soldier Armor",
    supportGear: [
      "Splinter Grenade"
    ],
    summary: "Close-assault Promethean template built around a hardlight blade."
  },
  prometheanRanger: {
    label: "Promethean Ranger",
    bundleName: "Ranger Equipment",
    primaryWeapon: "Binary Rifle",
    secondaryWeapon: "Boltshot",
    armor: "Promethean Soldier Armor",
    supportGear: [
      "Pulse Grenade"
    ],
    summary: "Long-range Forerunner ranger package with the Binary Rifle."
  }
};

export const SOLDIER_TYPE_PRESETS = {
  custom: {
    label: "Custom Operative",
    faction: "UNSC",
    race: "Human",
    soldierType: "Custom Operative",
    rank: "Operator",
    size: "normal",
    experienceCost: 0,
    baseCharacteristics: createBaseCharacteristics(25),
    advancements: {},
    creationPoints: 85,
    freeSkillChoices: { count: 2, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["manual"],
    traits: [],
    summary: "Blank human baseline for building outside the common presets."
  },
  militiaman: {
    label: "Militiaman",
    faction: "UNSC",
    race: "Human",
    soldierType: "Militiaman",
    rank: "Militia Trooper",
    size: "normal",
    experienceCost: 1400,
    baseCharacteristics: createBaseCharacteristics(25),
    advancements: { str: 5, tou: 5, wfr: 5 },
    creationPoints: 85,
    freeSkillChoices: { count: 2, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["militiaPointMan", "militiaMarksman", "militiaCloseQuarters", "militiaAssault"],
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 2 skills of your choosing at +10 during character creation."
      },
      {
        name: "Squad Up",
        summary: "Gain +5 to Courage tests and +10 to Warfare Melee / Warfare Range Combined Actions with allied UNSC military soldier types."
      }
    ],
    summary: "Light infantry baseline with flexible field loadouts."
  },
  army: {
    label: "Army Soldier",
    faction: "UNSC",
    race: "Human",
    soldierType: "Army",
    rank: "Trooper",
    size: "normal",
    experienceCost: 1800,
    baseCharacteristics: createBaseCharacteristics(25),
    advancements: { str: 5, wfr: 5, per: 5, crg: 10 },
    creationPoints: 85,
    freeSkillChoices: { count: 2, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["armyPointMan", "armyMarksman", "armyCloseQuarters", "armyHeavySupport"],
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 2 skills of your choosing at +10 during character creation."
      },
      {
        name: "Squad Up",
        summary: "Gain +5 to Courage tests and +10 to Warfare Melee / Warfare Range Combined Actions with allied UNSC military soldier types."
      }
    ],
    summary: "Standard line army profile with reliable ranged advancement."
  },
  marine: {
    label: "Marine",
    faction: "UNSC",
    race: "Human",
    soldierType: "Marine",
    rank: "Lance Corporal",
    size: "normal",
    experienceCost: 1800,
    baseCharacteristics: createBaseCharacteristics(25),
    advancements: { str: 5, agi: 5, wfr: 10, per: 5 },
    creationPoints: 85,
    freeSkillChoices: { count: 4, rank: "trained" },
    freeEducationChoices: 0,
    loadouts: ["marinePointMan", "marineMarksman", "marineCloseQuarters", "marineHeavySupport"],
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 4 skills of your choosing at Trained during character creation."
      },
      {
        name: "Squad Up",
        summary: "Gain +5 to Courage tests and +10 to Warfare Melee / Warfare Range Combined Actions with allied UNSC military soldier types."
      }
    ],
    summary: "Frontline marine profile with better battlefield breadth out of the gate."
  },
  odst: {
    label: "ODST",
    faction: "UNSC",
    race: "Human",
    soldierType: "ODST",
    rank: "Drop Trooper",
    size: "normal",
    experienceCost: 2600,
    baseCharacteristics: createBaseCharacteristics(25),
    advancements: { str: 5, tou: 5, agi: 5, wfr: 10, per: 5, crg: 10 },
    creationPoints: 85,
    freeSkillChoices: { count: 3, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["odstPointMan", "odstAssault", "odstCloseQuarters", "odstGunnery", "odstLongRange", "odstAntiArmor", "odstMarksman"],
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 3 skills of your choosing at +10 during character creation."
      },
      {
        name: "Squad Up",
        summary: "Gain +5 to Courage tests and +10 to Warfare Melee / Warfare Range Combined Actions with allied UNSC military soldier types."
      }
    ],
    summary: "Shock infantry preset for more elite UNSC drop troops."
  },
  unggoy: {
    label: "Unggoy",
    faction: "Covenant",
    race: "Unggoy",
    soldierType: "Combat-Trained Unggoy",
    rank: "Minor",
    size: "normal",
    experienceCost: 800,
    baseCharacteristics: {
      str: 30,
      tou: 30,
      agi: 15,
      wfr: 25,
      wfm: 25,
      int: 20,
      per: 25,
      crg: 20,
      cha: 25,
      ldr: 25
    },
    mythic: { str: 0, tou: 0, agi: 0 },
    advancements: { str: 5, tou: 5, wfm: 5, wfr: 5 },
    creationPoints: 85,
    freeSkillChoices: { count: 2, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["unggoyAntiInfantry", "unggoyGuided"],
    defaultSpecialization: "heavyWeapons",
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 2 skills of your choosing at +10 during character creation."
      },
      {
        name: "Natural Weapon",
        summary: "Unggoy begin with a natural weapon and close-quarter desperation tools."
      },
      {
        name: "Language Expert",
        summary: "Learns languages at half the usual experience cost."
      },
      {
        name: "Almost Smart",
        summary: "Pays extra for educations but doubles Intellect modifier when counting them."
      }
    ],
    summary: "Combat-trained Covenant Unggoy with methane support gear and light plasma loadouts."
  },
  sangheili: {
    label: "Sangheili",
    faction: "Covenant",
    race: "Sangheili",
    soldierType: "Combat-Trained Sangheili",
    rank: "Minor",
    size: "large",
    experienceCost: 8750,
    baseCharacteristics: {
      str: 45,
      tou: 45,
      agi: 45,
      wfr: 35,
      wfm: 35,
      int: 25,
      per: 25,
      crg: 35,
      cha: 25,
      ldr: 30
    },
    mythic: { str: 5, tou: 2, agi: 4 },
    advancements: { wfm: 10, wfr: 10, per: 5 },
    creationPoints: 85,
    freeSkillChoices: { count: 2, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["sangheiliStandard", "sangheiliGuided", "sangheiliMarksman"],
    defaultSpecialization: "duelist",
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 2 skills of your choosing at +10 during character creation."
      },
      {
        name: "Sangheili Leaping",
        summary: "Adds +2 to Agility modifier when figuring leap distance."
      },
      {
        name: "Ancestral Honor",
        summary: "Elite bloodlines can continue investing into mythic strength, toughness, and agility."
      }
    ],
    summary: "Elite Covenant warrior preset with mythic physical advantages and powered harness access."
  },
  jiralhanae: {
    label: "Jiralhanae",
    faction: "Covenant",
    race: "Jiralhanae",
    soldierType: "Combat-Trained Jiralhanae",
    rank: "Minor",
    size: "large",
    experienceCost: 8350,
    baseCharacteristics: {
      str: 40,
      tou: 45,
      agi: 35,
      wfr: 20,
      wfm: 35,
      int: 20,
      per: 35,
      crg: 30,
      cha: 15,
      ldr: 25
    },
    mythic: { str: 8, tou: 4, agi: 5 },
    advancements: { agi: 10, int: 5, per: 5, ldr: 5 },
    creationPoints: 85,
    freeSkillChoices: { count: 2, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["jiralhanaePlasma", "jiralhanaeGuided"],
    defaultSpecialization: "closeQuarters",
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 2 skills of your choosing at +10 during character creation."
      },
      {
        name: "Berserker",
        summary: "Begins with the Berserker ability and heightened smell-based perception."
      }
    ],
    summary: "Heavy Covenant brute preset with doubled wound scaling and massive carry capacity."
  },
  gasgira: {
    label: "Gasgira",
    faction: "Banished",
    race: "Gasgira",
    soldierType: "Combat-Trained Gasgira",
    rank: "Raider",
    size: "normal",
    experienceCost: 2250,
    baseCharacteristics: {
      str: 20,
      tou: 30,
      agi: 20,
      wfr: 25,
      wfm: 15,
      int: 25,
      per: 25,
      crg: 25,
      cha: 25,
      ldr: 25
    },
    mythic: { str: 0, tou: 0, agi: 5 },
    advancements: { str: 5, tou: 5, wfm: 5, wfr: 5 },
    creationPoints: 85,
    freeSkillChoices: { count: 2, rank: "plus10" },
    freeEducationChoices: 0,
    loadouts: ["gasgiraRanged", "gasgiraDualWield"],
    defaultSpecialization: "pointman",
    traits: [
      {
        name: "Skill Training",
        summary: "Begin with 2 skills of your choosing at +10 during character creation."
      },
      {
        name: "Crawler",
        summary: "Moves across difficult surfaces with enhanced climbing mobility."
      },
      {
        name: "Flight",
        summary: "Flight is active while wearing modified Gasgira armor."
      },
      {
        name: "Four Arms",
        summary: "Can support more weapons and gains a bonus to grappling."
      }
    ],
    summary: "Banished skimmer preset with flight-enabled armor and disruption weapon choices."
  },
  promethean: {
    label: "Promethean Soldier",
    faction: "Forerunner",
    race: "Promethean",
    soldierType: "Promethean Soldier",
    rank: "Soldier",
    size: "large",
    experienceCost: 5250,
    baseCharacteristics: {
      str: 35,
      tou: 35,
      agi: 35,
      wfr: 30,
      wfm: 30,
      int: 25,
      per: 35,
      crg: 35,
      cha: 25,
      ldr: 25
    },
    mythic: { str: 1, tou: 1, agi: 0 },
    advancements: {},
    creationPoints: 85,
    freeSkillChoices: { count: 0, rank: "trained" },
    freeEducationChoices: 0,
    loadouts: ["prometheanSuppression", "prometheanCommando", "prometheanDevastator", "prometheanRanger"],
    defaultSpecialization: "marksman",
    traits: [
      {
        name: "Promethean Vision",
        summary: "Sees through non-biological cover and spots cloaked targets more easily."
      },
      {
        name: "Translocation",
        summary: "Teleports up to run speed as a full action and can charge for longer hops."
      },
      {
        name: "Crawler",
        summary: "Promethean bodies can cling to surfaces and ignore most climbing penalties."
      },
      {
        name: "Glowing",
        summary: "Bright hardlight glow causes a penalty to Camouflage tests."
      },
      {
        name: "Slipspace Storage",
        summary: "Carries equipment in slipspace rather than by weight alone."
      }
    ],
    summary: "Forerunner combat construct preset with hardlight gear and translocation abilities."
  }
};

export function getStartingTierForXp(xp) {
  const numericXp = Math.max(0, Number(xp ?? 0));
  return STARTING_XP_TIERS.find((tier) => numericXp >= tier.min && numericXp <= tier.max) ?? STARTING_XP_TIERS[0];
}

export function getStartingCreditsForXp(xp) {
  return getStartingTierForXp(xp).credits;
}

export function getPresetChoices() {
  return Object.entries(SOLDIER_TYPE_PRESETS).map(([key, preset]) => ({
    key,
    label: preset.label
  }));
}

export function getSpecializationChoices() {
  return Object.entries(SPECIALIZATION_PACKS).map(([key, pack]) => ({
    key,
    label: pack.label
  }));
}

export function getLoadoutChoicesForPreset(presetKey) {
  const preset = SOLDIER_TYPE_PRESETS[presetKey] ?? SOLDIER_TYPE_PRESETS.custom;
  return preset.loadouts.map((key) => ({
    key,
    label: LOADOUT_PRESETS[key]?.label ?? key
  }));
}

export function getCharacteristicTotal(presetKey, allocations, characteristicKey) {
  const preset = SOLDIER_TYPE_PRESETS[presetKey] ?? SOLDIER_TYPE_PRESETS.custom;
  const base = Number(preset.baseCharacteristics[characteristicKey] ?? 25);
  const advancement = Number(preset.advancements[characteristicKey] ?? 0);
  const spent = Number(allocations?.[characteristicKey] ?? 0);
  return base + advancement + spent;
}
