export const HALO_MYTHIC = {
  id: "halo-mythic",
  title: "Halo Mythic",
  characteristics: {
    str: { label: "Strength", abbreviation: "STR" },
    tou: { label: "Toughness", abbreviation: "TOU" },
    agi: { label: "Agility", abbreviation: "AGI" },
    wfm: { label: "Warfare Melee", abbreviation: "WFM" },
    wfr: { label: "Warfare Range", abbreviation: "WFR" },
    int: { label: "Intellect", abbreviation: "INT" },
    per: { label: "Perception", abbreviation: "PER" },
    crg: { label: "Courage", abbreviation: "CRG" },
    cha: { label: "Charisma", abbreviation: "CHA" },
    ldr: { label: "Leadership", abbreviation: "LDR" }
  },
  armorLocations: {
    head: { label: "Head" },
    arms: { label: "Arms" },
    chest: { label: "Chest" },
    legs: { label: "Legs" }
  },
  vehicleLocations: {
    weapon: { label: "Weapon" },
    mobility: { label: "Mobility" },
    engine: { label: "Engine" },
    optics: { label: "Optics" },
    hull: { label: "Hull" }
  },
  sizeCategories: {
    mini: { label: "Mini", reach: 0 },
    small: { label: "Small", reach: 1 },
    normal: { label: "Normal", reach: 1 },
    large: { label: "Large", reach: 2 },
    huge: { label: "Huge", reach: 3 },
    hulking: { label: "Hulking", reach: 3 },
    giant: { label: "Giant", reach: 4 },
    immense: { label: "Immense", reach: 4 },
    massive: { label: "Massive", reach: 5 },
    great: { label: "Great", reach: 6 },
    monumental: { label: "Monumental", reach: 7 },
    colossal: { label: "Colossal", reach: 10 },
    vast: { label: "Vast", reach: 25 },
    unscalable: { label: "Unscalable", reach: 0 }
  },
  skillRanks: {
    untrained: { label: "Untrained" },
    trained: { label: "Trained" },
    plus10: { label: "+10" },
    plus20: { label: "+20" }
  },
  itemTypes: {
    weapon: { label: "Weapon" },
    armor: { label: "Armor" },
    gear: { label: "Gear" },
    ability: { label: "Ability" },
    education: { label: "Education" },
    trait: { label: "Trait" }
  },
  weaponAttackTypes: {
    ranged: { label: "Ranged" },
    melee: { label: "Melee" },
    explosive: { label: "Explosive" },
    heavy: { label: "Heavy" }
  },
  skills: {
    appeal: { label: "Appeal", difficulty: "basic", characteristics: ["cha"], group: "Social" },
    athletics: { label: "Athletics", difficulty: "basic", characteristics: ["agi", "str"], group: "Movement" },
    camouflage: { label: "Camouflage", difficulty: "basic", characteristics: ["int", "per"], group: "Fieldcraft" },
    command: { label: "Command", difficulty: "basic", characteristics: ["ldr"], group: "Social" },
    cryptography: { label: "Cryptography", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    deception: { label: "Deception", difficulty: "basic", characteristics: ["cha", "ldr"], group: "Social" },
    demolition: { label: "Demolition", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    evasion: { label: "Evasion", difficulty: "basic", characteristics: ["agi"], group: "Movement" },
    gambling: { label: "Gambling", difficulty: "basic", characteristics: ["int", "cha"], group: "Social" },
    interrogation: { label: "Interrogation", difficulty: "basic", characteristics: ["cha", "ldr", "int"], group: "Social" },
    intimidation: { label: "Intimidation", difficulty: "basic", characteristics: ["str", "cha", "ldr", "int"], group: "Social" },
    investigation: { label: "Investigation", difficulty: "basic", characteristics: ["int", "per", "cha"], group: "Social / Fieldcraft" },
    medicationHuman: { label: "Medication: Human", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    medicationCovenant: { label: "Medication: Covenant", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    medicationMgalekgolo: { label: "Medication: Xenobiology", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    navigationGroundAir: { label: "Navigation: Ground / Air", difficulty: "basic", characteristics: ["int", "per"], group: "Fieldcraft" },
    navigationSpace: { label: "Navigation: Space", difficulty: "advanced", characteristics: ["int", "per"], group: "Fieldcraft" },
    navigationSlipspace: { label: "Navigation: Slipspace", difficulty: "advanced", characteristics: ["int", "per"], group: "Fieldcraft" },
    negotiation: { label: "Negotiation", difficulty: "basic", characteristics: ["int", "cha"], group: "Social" },
    pilotGround: { label: "Pilot: Ground", difficulty: "basic", characteristics: ["agi", "int"], group: "Movement" },
    pilotAir: { label: "Pilot: Air", difficulty: "advanced", characteristics: ["agi", "int"], group: "Movement" },
    pilotSpace: { label: "Pilot: Space", difficulty: "advanced", characteristics: ["agi", "int"], group: "Fieldcraft" },
    security: { label: "Security", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    stunting: { label: "Stunting", difficulty: "basic", characteristics: ["agi"], group: "Movement" },
    survival: { label: "Survival", difficulty: "basic", characteristics: ["int", "per"], group: "Fieldcraft" },
    technologyHuman: { label: "Technology: Human", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    technologyCovenant: { label: "Technology: Covenant", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" },
    technologyForerunner: { label: "Technology: Forerunner", difficulty: "advanced", characteristics: ["int"], group: "Fieldcraft" }
  },
  hitLocations: [
    { key: "head", label: "Head", min: 1, max: 10 },
    { key: "leftArm", label: "Left Arm", min: 11, max: 20 },
    { key: "rightArm", label: "Right Arm", min: 21, max: 30 },
    { key: "leftLeg", label: "Left Leg", min: 31, max: 45 },
    { key: "rightLeg", label: "Right Leg", min: 46, max: 60 },
    { key: "chest", label: "Chest", min: 61, max: 100 }
  ],
  vehicleHitLocations: [
    { key: "weapon", label: "Weapon", min: 1, max: 15 },
    { key: "mobility", label: "Mobility", min: 16, max: 30 },
    { key: "engine", label: "Engine", min: 31, max: 45 },
    { key: "optics", label: "Optics", min: 46, max: 60 },
    { key: "hull", label: "Hull", min: 61, max: 100 }
  ]
};

export const CHARACTERISTIC_KEYS = Object.keys(HALO_MYTHIC.characteristics);
export const SKILL_KEYS = Object.keys(HALO_MYTHIC.skills);
export const ARMOR_KEYS = Object.keys(HALO_MYTHIC.armorLocations);
export const VEHICLE_KEYS = Object.keys(HALO_MYTHIC.vehicleLocations);

function normalizeDescriptor(details = {}) {
  return [
    details?.race,
    details?.soldierType,
    details?.faction
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getSpeciesAutomation(details = {}) {
  const descriptor = normalizeDescriptor(details);
  const hasKeyword = (keyword) => descriptor.includes(keyword);

  return {
    descriptor,
    isUnggoy: hasKeyword("unggoy") || hasKeyword("grunt"),
    isSangheili: hasKeyword("sangheili") || hasKeyword("elite"),
    isJiralhanae: hasKeyword("jiralhanae") || hasKeyword("brute"),
    isGasgira: hasKeyword("gasgira") || hasKeyword("skimmer"),
    isPromethean: hasKeyword("promethean"),
    carryingMultiplier:
      (hasKeyword("sangheili") || hasKeyword("elite") || hasKeyword("jiralhanae") || hasKeyword("brute"))
        ? 2
        : 1,
    woundToughnessMultiplier:
      (hasKeyword("jiralhanae") || hasKeyword("brute"))
        ? 2
        : 1,
    leapAgilityBonus:
      (hasKeyword("sangheili") || hasKeyword("elite"))
        ? 2
        : 0
  };
}

export function clampNumber(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  return Math.min(Math.max(Number(value ?? 0), min), max);
}

export function roundDown(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.floor(Number(value ?? 0) * factor) / factor;
}

export function getCharacteristicModifier(value) {
  return Math.max(0, Math.floor(Number(value ?? 0) / 10));
}

export function getMythicInitiativeBonus(value) {
  const bonus = Number(value ?? 0);
  if (bonus <= 0) return 0;
  return Math.max(1, Math.floor(bonus / 2));
}

export function getSkillRankBonus(rank, difficulty) {
  switch (rank) {
    case "trained":
      return 0;
    case "plus10":
      return 10;
    case "plus20":
      return 20;
    default:
      return difficulty === "basic" ? -20 : -40;
  }
}

export function getDefaultSkillCharacteristic(skillKey) {
  return HALO_MYTHIC.skills[skillKey]?.characteristics?.[0] ?? "int";
}

export function reversePercentile(roll) {
  const numericRoll = Number(roll ?? 0);
  if (numericRoll >= 100) return 100;
  const padded = String(numericRoll).padStart(2, "0");
  return Number(padded.split("").reverse().join(""));
}

export function getHitLocationFromRoll(roll, vehicle = false) {
  const reversed = reversePercentile(roll);
  const source = vehicle ? HALO_MYTHIC.vehicleHitLocations : HALO_MYTHIC.hitLocations;
  return source.find((location) => reversed >= location.min && reversed <= location.max) ?? null;
}

export function formatSigned(value) {
  const numeric = Number(value ?? 0);
  return numeric >= 0 ? `+${numeric}` : `${numeric}`;
}

export function summarizeDamage(damage) {
  const dice = Number(damage?.dice ?? 0);
  const faces = Number(damage?.faces ?? 10);
  const base = Number(damage?.base ?? 0);
  if (dice > 0 && base !== 0) return `${dice}d${faces} ${formatSigned(base)}`;
  if (dice > 0) return `${dice}d${faces}`;
  return `${base}`;
}

export function summarizeRange(range) {
  const min = Number(range?.min ?? 0);
  const max = Number(range?.max ?? 0);
  if (!min && !max) return "Melee / Special";
  return `${min}m - ${max}m`;
}
