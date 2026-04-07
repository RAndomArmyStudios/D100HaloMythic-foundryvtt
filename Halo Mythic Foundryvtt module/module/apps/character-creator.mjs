import {
  CHARACTERISTIC_KEYS,
  HALO_MYTHIC,
  SKILL_KEYS,
  getCharacteristicModifier,
  getDefaultSkillCharacteristic,
  getSpeciesAutomation
} from "../config.mjs";
import {
  LOADOUT_PRESETS,
  SOLDIER_TYPE_PRESETS,
  SPECIALIZATION_PACKS,
  getCharacteristicTotal,
  getLoadoutChoicesForPreset,
  getPresetChoices,
  getSpecializationChoices,
  getStartingCreditsForXp,
  getStartingTierForXp
} from "../character-creator-data.mjs";
import {
  buildLoadoutPreview,
  createLibraryItemSource,
  createLoadoutItemSources,
  findLibraryItemByName,
  getLoadoutChoiceSlots
} from "../content/library.mjs";

const MAX_FREE_SKILL_SLOTS = 6;
const MAX_FREE_EDUCATION_SLOTS = 3;
const MIN_RECOMMENDED_ALLOCATION = 4;
const MAX_RECOMMENDED_ALLOCATION = 20;
const SKILL_RANK_WEIGHT = {
  untrained: 0,
  trained: 1,
  plus10: 2,
  plus20: 3
};
const PRESET_CHARACTERISTIC_WEIGHTS = {
  custom: {},
  militiaman: { wfr: 3, per: 2, crg: 2, str: 1, tou: 1 },
  army: { wfr: 4, crg: 3, per: 2, str: 2, tou: 2 },
  marine: { wfr: 4, agi: 3, per: 3, str: 2, tou: 2, crg: 2 },
  odst: { wfr: 4, agi: 4, per: 3, crg: 3, str: 2, tou: 2, wfm: 1 },
  unggoy: { wfr: 2, wfm: 2, str: 2, tou: 1, crg: 1 },
  sangheili: { wfm: 4, agi: 4, str: 3, wfr: 2, per: 2, crg: 2 },
  jiralhanae: { str: 4, tou: 4, wfm: 3, agi: 2, per: 1, ldr: 1 },
  gasgira: { agi: 4, per: 3, wfr: 3, int: 2, crg: 1 },
  promethean: { wfr: 4, per: 4, agi: 3, tou: 2, str: 2, int: 1 }
};
const PRESET_FREE_SKILL_RECOMMENDATIONS = {
  custom: ["athletics", "evasion"],
  militiaman: ["athletics", "evasion", "survival", "investigation", "camouflage"],
  army: ["athletics", "evasion", "survival", "investigation", "intimidation"],
  marine: ["athletics", "evasion", "survival", "investigation", "command", "intimidation"],
  odst: ["athletics", "evasion", "camouflage", "investigation", "survival", "stunting"],
  unggoy: ["athletics", "evasion", "survival", "intimidation", "investigation"],
  sangheili: ["athletics", "evasion", "intimidation", "command", "camouflage"],
  jiralhanae: ["athletics", "intimidation", "survival", "investigation", "command"],
  gasgira: ["evasion", "athletics", "camouflage", "survival", "investigation", "stunting"],
  promethean: ["investigation", "athletics", "camouflage", "navigationGroundAir", "survival", "technologyForerunner"]
};

function inferPresetFromActor(actor) {
  const label = `${actor.system.details.soldierType ?? ""} ${actor.system.details.race ?? ""}`.toLowerCase();
  if (label.includes("odst")) return "odst";
  if (label.includes("marine")) return "marine";
  if (label.includes("army")) return "army";
  if (label.includes("militia")) return "militiaman";
  if (label.includes("unggoy") || label.includes("grunt")) return "unggoy";
  if (label.includes("sangheili") || label.includes("elite")) return "sangheili";
  if (label.includes("jiralhanae") || label.includes("brute")) return "jiralhanae";
  if (label.includes("gasgira") || label.includes("skimmer")) return "gasgira";
  if (label.includes("promethean")) return "promethean";
  return "custom";
}

function normalizeArray(source, length) {
  return Array.from({ length }, (_, index) => {
    const value = source?.[index];
    if (value && typeof value === "object") {
      return String(value.key ?? value.value ?? "").trim();
    }
    return String(value ?? "").trim();
  });
}

function normalizeAllocations(source) {
  return CHARACTERISTIC_KEYS.reduce((allocations, key) => {
    const value = Math.max(0, Math.min(20, Number(source?.[key] ?? 0)));
    allocations[key] = Number.isFinite(value) ? value : 0;
    return allocations;
  }, {});
}

function hasAssignedAllocations(source) {
  return CHARACTERISTIC_KEYS.some((key) => Number(source?.[key] ?? 0) > 0);
}

function hasAssignedFreeSkills(source) {
  return Array.isArray(source)
    ? source.some((value) => String(value ?? "").trim())
    : Object.values(source ?? {}).some((value) => String(value ?? "").trim());
}

function buildAllocationWeights(presetKey, specializationKey) {
  const preset = SOLDIER_TYPE_PRESETS[presetKey] ?? SOLDIER_TYPE_PRESETS.custom;
  const specialization = SPECIALIZATION_PACKS[specializationKey] ?? SPECIALIZATION_PACKS.none;
  const weights = Object.fromEntries(CHARACTERISTIC_KEYS.map((key) => [key, 1]));

  for (const [key, bonus] of Object.entries(PRESET_CHARACTERISTIC_WEIGHTS[presetKey] ?? {})) {
    weights[key] = (weights[key] ?? 1) + Number(bonus ?? 0);
  }

  for (const key of CHARACTERISTIC_KEYS) {
    weights[key] += Number(preset.advancements?.[key] ?? 0) / 5;
  }

  for (const skill of specialization.skills ?? []) {
    const characteristicKey = getDefaultSkillCharacteristic(skill.key);
    if (!characteristicKey) continue;

    const rankWeight = {
      trained: 1.5,
      plus10: 2.5,
      plus20: 4
    }[skill.rank] ?? 1;

    weights[characteristicKey] += rankWeight;
  }

  return weights;
}

function getRecommendedAllocations(presetKey, specializationKey) {
  const preset = SOLDIER_TYPE_PRESETS[presetKey] ?? SOLDIER_TYPE_PRESETS.custom;
  const weights = buildAllocationWeights(presetKey, specializationKey);
  const floor = Math.min(MIN_RECOMMENDED_ALLOCATION, Math.floor((preset.creationPoints ?? 0) / CHARACTERISTIC_KEYS.length));
  const allocations = Object.fromEntries(CHARACTERISTIC_KEYS.map((key) => [key, floor]));
  let remaining = Math.max(0, Number(preset.creationPoints ?? 0) - (floor * CHARACTERISTIC_KEYS.length));

  while (remaining > 0) {
    const candidates = CHARACTERISTIC_KEYS
      .filter((key) => allocations[key] < MAX_RECOMMENDED_ALLOCATION)
      .sort((left, right) => {
        const leftScore = (weights[left] ?? 1) - ((allocations[left] - floor) * 0.18);
        const rightScore = (weights[right] ?? 1) - ((allocations[right] - floor) * 0.18);
        if (rightScore !== leftScore) return rightScore - leftScore;

        const rightAdvancement = Number(preset.advancements?.[right] ?? 0);
        const leftAdvancement = Number(preset.advancements?.[left] ?? 0);
        if (rightAdvancement !== leftAdvancement) return rightAdvancement - leftAdvancement;

        if (allocations[left] !== allocations[right]) return allocations[left] - allocations[right];
        return left.localeCompare(right);
      });

    if (!candidates.length) break;
    allocations[candidates[0]] += 1;
    remaining -= 1;
  }

  return allocations;
}

function getRecommendedFreeSkills(presetKey, specializationKey) {
  const preset = SOLDIER_TYPE_PRESETS[presetKey] ?? SOLDIER_TYPE_PRESETS.custom;
  const specialization = SPECIALIZATION_PACKS[specializationKey] ?? SPECIALIZATION_PACKS.none;
  const requiredCount = Number(preset.freeSkillChoices?.count ?? 0);
  if (!requiredCount) return normalizeArray([], MAX_FREE_SKILL_SLOTS);

  const specializationKeys = new Set((specialization.skills ?? []).map((entry) => entry.key));
  const recommendations = [];
  const basePool = PRESET_FREE_SKILL_RECOMMENDATIONS[presetKey] ?? PRESET_FREE_SKILL_RECOMMENDATIONS.custom;
  const fallbackPool = SKILL_KEYS.filter((key) => !specializationKeys.has(key));

  for (const key of [...basePool, ...fallbackPool]) {
    if (!SKILL_KEYS.includes(key)) continue;
    if (specializationKeys.has(key)) continue;
    if (recommendations.includes(key)) continue;
    recommendations.push(key);
    if (recommendations.length >= requiredCount) break;
  }

  return normalizeArray(recommendations, MAX_FREE_SKILL_SLOTS);
}

function normalizeChoiceMap(source) {
  return Object.entries(source ?? {}).reduce((choices, [key, value]) => {
    choices[String(key)] = String(value ?? "").trim();
    return choices;
  }, {});
}

function normalizeState(actor, source = {}) {
  const presetKey = source.soldierType && SOLDIER_TYPE_PRESETS[source.soldierType]
    ? source.soldierType
    : inferPresetFromActor(actor);
  const preset = SOLDIER_TYPE_PRESETS[presetKey] ?? SOLDIER_TYPE_PRESETS.custom;
  const specializationKey = source.specialization && SPECIALIZATION_PACKS[source.specialization]
    ? source.specialization
    : (preset.defaultSpecialization ?? "pointman");
  const startingXp = Math.max(Number(source.startingXp ?? actor.system.economy.experienceTotal ?? 2000), preset.experienceCost);
  const loadoutChoices = getLoadoutChoicesForPreset(presetKey);
  const defaultLoadout = loadoutChoices[0]?.key ?? "manual";
  const allocations = hasAssignedAllocations(source.allocations)
    ? normalizeAllocations(source.allocations)
    : getRecommendedAllocations(presetKey, specializationKey);
  const freeSkills = hasAssignedFreeSkills(source.freeSkills)
    ? normalizeArray(source.freeSkills, MAX_FREE_SKILL_SLOTS)
    : getRecommendedFreeSkills(presetKey, specializationKey);

  return {
    name: String(source.name ?? actor.name ?? "").trim(),
    soldierType: presetKey,
    faction: String(source.faction ?? actor.system.details.faction ?? preset.faction).trim() || preset.faction,
    race: String(source.race ?? actor.system.details.race ?? preset.race).trim() || preset.race,
    rank: String(source.rank ?? actor.system.details.rank ?? preset.rank).trim() || preset.rank,
    size: String(source.size ?? actor.system.details.size ?? preset.size).trim() || preset.size,
    startingXp,
    specialization: specializationKey,
    loadout: loadoutChoices.some((choice) => choice.key === source.loadout) ? source.loadout : defaultLoadout,
    allocations,
    freeSkills,
    freeEducations: normalizeArray(source.freeEducations, MAX_FREE_EDUCATION_SLOTS),
    itemChoices: normalizeChoiceMap(source.itemChoices)
  };
}

function stateFromForm(actor, form) {
  const expanded = foundry.utils.expandObject(Object.fromEntries(new FormData(form).entries()));
  return normalizeState(actor, expanded.builder ?? {});
}

function rankLabel(rank) {
  return HALO_MYTHIC.skillRanks[rank]?.label ?? rank;
}

function mergeSkillRanks(currentRank, incomingRank) {
  return (SKILL_RANK_WEIGHT[incomingRank] ?? 0) > (SKILL_RANK_WEIGHT[currentRank] ?? 0)
    ? incomingRank
    : currentRank;
}

function buildLoadoutDescription(loadout) {
  const lines = [
    `Package: ${loadout.bundleName}`,
    loadout.primaryWeapon ? `Primary Weapon: ${loadout.primaryWeapon}` : null,
    loadout.secondaryWeapon ? `Secondary Weapon: ${loadout.secondaryWeapon}` : null,
    loadout.armor ? `Armor: ${loadout.armor}` : null,
    loadout.supportGear.length ? `Support Gear: ${loadout.supportGear.join(", ")}` : null,
    loadout.summary ? `Notes: ${loadout.summary}` : null,
    "Generated by the Halo Mythic character creator. Convert this bundle into fully statted items as needed."
  ].filter(Boolean);

  return lines.join("\n");
}

function creatorFlag() {
  return {
    [HALO_MYTHIC.id]: {
      creatorGenerated: true
    }
  };
}

const BaseFormApplication = foundry.appv1.api.FormApplication;

function createLibrarySourceByName(name, type, flags) {
  const entry = findLibraryItemByName(name, { type });
  if (!entry) return null;
  return createLibraryItemSource(entry.id, { flags });
}

export class HaloMythicCharacterCreator extends BaseFormApplication {
  get actor() {
    return this.object;
  }

  constructor(actor, options = {}) {
    super(actor, options);
    const storedState = actor.getFlag(HALO_MYTHIC.id, "creatorState") ?? {};
    this.state = normalizeState(actor, storedState);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "halo-mythic-character-creator",
      classes: ["halo-mythic", "halo-mythic-creator", "halo-mythic-character-creator"],
      template: "systems/halo-mythic/templates/apps/character-creator.hbs",
      width: 980,
      height: 860,
      resizable: true,
      submitOnChange: false,
      closeOnSubmit: false
    });
  }

  get title() {
    return `Character Creator: ${this.actor.name || "New Character"}`;
  }

  getData(options = {}) {
    const data = super.getData(options);
    const preset = SOLDIER_TYPE_PRESETS[this.state.soldierType] ?? SOLDIER_TYPE_PRESETS.custom;
    const specialization = SPECIALIZATION_PACKS[this.state.specialization] ?? SPECIALIZATION_PACKS.none;
    const tier = getStartingTierForXp(this.state.startingXp);
    const startingCredits = getStartingCreditsForXp(this.state.startingXp);
    const pointsSpent = CHARACTERISTIC_KEYS.reduce((total, key) => total + Number(this.state.allocations[key] ?? 0), 0);
    const pointsRemaining = preset.creationPoints - pointsSpent;
    const skillChoices = Object.entries(HALO_MYTHIC.skills)
      .map(([key, meta]) => ({ key, label: meta.label }))
      .sort((a, b) => a.label.localeCompare(b.label));
    const skillChoicesMap = Object.fromEntries(skillChoices.map((choice) => [choice.key, choice.label]));
    const loadoutChoices = getLoadoutChoicesForPreset(this.state.soldierType);
    const currentLoadout = LOADOUT_PRESETS[this.state.loadout] ?? LOADOUT_PRESETS.manual;
    const loadoutChoiceSlots = getLoadoutChoiceSlots(currentLoadout, this.state.itemChoices);
    const loadoutPreview = buildLoadoutPreview(currentLoadout, this.state.itemChoices);
    const skillChoiceCount = Number(preset.freeSkillChoices.count ?? 0);
    const educationChoiceCount = Number(preset.freeEducationChoices ?? 0);

    data.actor = this.actor;
    data.builder = this.state;
    data.preset = preset;
    data.specialization = specialization;
    data.currentLoadout = currentLoadout;
    data.presetChoices = getPresetChoices();
    data.specializationChoices = getSpecializationChoices();
    data.loadoutChoices = loadoutChoices;
    data.skillChoices = skillChoices;
    data.skillChoicesMap = skillChoicesMap;
    data.sizeOptions = Object.entries(HALO_MYTHIC.sizeCategories).map(([key, meta]) => ({
      key,
      label: meta.label
    }));
    data.startingTier = tier;
    data.startingCredits = startingCredits;
    data.pointsSpent = pointsSpent;
    data.pointsRemaining = pointsRemaining;
    data.characteristicRows = CHARACTERISTIC_KEYS.map((key) => ({
      key,
      label: HALO_MYTHIC.characteristics[key].label,
      abbreviation: HALO_MYTHIC.characteristics[key].abbreviation,
      base: Number(preset.baseCharacteristics[key] ?? 25),
      advancement: Number(preset.advancements[key] ?? 0),
      spent: Number(this.state.allocations[key] ?? 0),
      total: getCharacteristicTotal(this.state.soldierType, this.state.allocations, key)
    }));
    data.freeSkillSlots = Array.from({ length: skillChoiceCount }, (_, index) => ({
      index,
      selected: this.state.freeSkills[index] ?? "",
      label: `Free Skill ${index + 1}`
    }));
    data.freeEducationSlots = Array.from({ length: educationChoiceCount }, (_, index) => ({
      index,
      value: this.state.freeEducations[index] ?? "",
      label: `Free Education ${index + 1}`
    }));
    data.loadoutChoiceSlots = loadoutChoiceSlots;
    data.loadoutPreview = loadoutPreview;
    data.freeSkillRankLabel = rankLabel(preset.freeSkillChoices.rank);
    data.canApply = pointsRemaining === 0 && this.state.startingXp >= preset.experienceCost;

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("[name='builder.soldierType'], [name='builder.specialization']").on("change", (event) => {
      const liveState = stateFromForm(this.actor, this.form);
      const nextPreset = SOLDIER_TYPE_PRESETS[liveState.soldierType] ?? SOLDIER_TYPE_PRESETS.custom;
      const isSoldierTypeChange = event.currentTarget.name === "builder.soldierType";
      const nextSpecialization = isSoldierTypeChange
        ? (nextPreset.defaultSpecialization ?? liveState.specialization)
        : liveState.specialization;
      this.state = {
        ...liveState,
        faction: isSoldierTypeChange ? nextPreset.faction : liveState.faction,
        race: isSoldierTypeChange ? nextPreset.race : liveState.race,
        rank: isSoldierTypeChange ? nextPreset.rank : liveState.rank,
        size: isSoldierTypeChange ? nextPreset.size : liveState.size,
        specialization: nextSpecialization,
        allocations: getRecommendedAllocations(liveState.soldierType, nextSpecialization),
        freeSkills: getRecommendedFreeSkills(liveState.soldierType, nextSpecialization)
      };
      this.render();
    });

    html.find("[name='builder.startingXp'], [name='builder.loadout']").on("change", () => {
      this.state = stateFromForm(this.actor, this.form);
      this.render();
    });

    html.find("[name^='builder.itemChoices.']").on("change", () => {
      this.state = stateFromForm(this.actor, this.form);
      this.render();
    });

    html.find(".auto-allocate-builder").on("click", () => {
      const liveState = stateFromForm(this.actor, this.form);
      this.state = {
        ...liveState,
        allocations: getRecommendedAllocations(liveState.soldierType, liveState.specialization),
        freeSkills: hasAssignedFreeSkills(liveState.freeSkills)
          ? liveState.freeSkills
          : getRecommendedFreeSkills(liveState.soldierType, liveState.specialization)
      };
      this.render();
    });

    html.find(".allocation-input").on("input", () => this.#updatePointsPreview());
  }

  #updatePointsPreview() {
    if (!this.form) return;
    const liveState = stateFromForm(this.actor, this.form);
    const preset = SOLDIER_TYPE_PRESETS[liveState.soldierType] ?? SOLDIER_TYPE_PRESETS.custom;
    const spent = CHARACTERISTIC_KEYS.reduce((total, key) => total + Number(liveState.allocations[key] ?? 0), 0);
    const remaining = preset.creationPoints - spent;
    const target = this.form.querySelector("[data-points-remaining]");
    if (!target) return;
    target.textContent = `${remaining}`;
    target.classList.toggle("warning", remaining !== 0);
  }

  async _updateObject(_event, _formData) {
    this.state = stateFromForm(this.actor, this.form);

    const preset = SOLDIER_TYPE_PRESETS[this.state.soldierType] ?? SOLDIER_TYPE_PRESETS.custom;
    const specialization = SPECIALIZATION_PACKS[this.state.specialization] ?? SPECIALIZATION_PACKS.none;
    const loadout = LOADOUT_PRESETS[this.state.loadout] ?? LOADOUT_PRESETS.manual;
    const normalizedChoices = Object.fromEntries(
      getLoadoutChoiceSlots(loadout, this.state.itemChoices).map((slot) => [slot.key, slot.selected])
    );
    this.state.itemChoices = {
      ...this.state.itemChoices,
      ...normalizedChoices
    };
    const pointsSpent = CHARACTERISTIC_KEYS.reduce((total, key) => total + Number(this.state.allocations[key] ?? 0), 0);
    const pointsRemaining = preset.creationPoints - pointsSpent;

    if (this.state.startingXp < preset.experienceCost) {
      ui.notifications.warn(`${preset.label} requires at least ${preset.experienceCost} starting XP.`);
      return;
    }

    if (pointsRemaining !== 0) {
      ui.notifications.warn(`Spend exactly ${preset.creationPoints} creation points before applying the builder.`);
      return;
    }

    const chosenSkills = this.state.freeSkills
      .slice(0, Number(preset.freeSkillChoices.count ?? 0))
      .filter(Boolean);

    if (new Set(chosenSkills).size !== chosenSkills.length) {
      ui.notifications.warn("Choose unique free skills for the selected soldier type.");
      return;
    }

    const characteristicTotals = CHARACTERISTIC_KEYS.reduce((totals, key) => {
      totals[key] = getCharacteristicTotal(this.state.soldierType, this.state.allocations, key);
      return totals;
    }, {});

    const toughnessModifier = getCharacteristicModifier(characteristicTotals.tou);
    const presetMythic = preset.mythic ?? {};
    const species = getSpeciesAutomation({
      race: this.state.race,
      soldierType: preset.soldierType,
      faction: this.state.faction
    });
    const woundMax = (((toughnessModifier * species.woundToughnessMultiplier) + Number(presetMythic.tou ?? 0)) * 2) + 40;
    const skillRanks = Object.fromEntries(SKILL_KEYS.map((key) => [key, "untrained"]));

    for (const key of chosenSkills) {
      skillRanks[key] = mergeSkillRanks(skillRanks[key], preset.freeSkillChoices.rank);
    }

    for (const entry of specialization.skills) {
      skillRanks[entry.key] = mergeSkillRanks(skillRanks[entry.key], entry.rank);
    }

    const updates = {
      name: this.state.name || this.actor.name || preset.label,
      "system.details.rank": this.state.rank,
      "system.details.faction": this.state.faction,
      "system.details.specialization": specialization.label === "No Specialization" ? "" : specialization.label,
      "system.details.soldierType": preset.soldierType,
      "system.details.race": this.state.race,
      "system.details.size": this.state.size,
      "system.mythic.str": Number(presetMythic.str ?? 0),
      "system.mythic.tou": Number(presetMythic.tou ?? 0),
      "system.mythic.agi": Number(presetMythic.agi ?? 0),
      "system.economy.credits": getStartingCreditsForXp(this.state.startingXp),
      "system.economy.experienceTotal": this.state.startingXp,
      "system.economy.experienceSpent": preset.experienceCost,
      "system.economy.experienceCurrent": Math.max(0, this.state.startingXp - preset.experienceCost),
      "system.resources.luck.value": 6,
      "system.resources.luck.max": 6,
      "system.resources.fatigue.value": 0,
      "system.resources.support.value": this.actor.system.resources.support.value ?? 0,
      "system.resources.wounds.value": woundMax,
      "system.biography": this.actor.system.biography ?? ""
    };

    for (const key of CHARACTERISTIC_KEYS) {
      updates[`system.characteristics.${key}.value`] = characteristicTotals[key];
    }

    for (const key of SKILL_KEYS) {
      updates[`system.skills.${key}.rank`] = skillRanks[key];
      updates[`system.skills.${key}.characteristic`] = getDefaultSkillCharacteristic(key);
    }

    await this.actor.update(updates);
    await this.#replaceGeneratedItems(preset, specialization, loadout, this.state.itemChoices);
    await this.actor.setFlag(HALO_MYTHIC.id, "creatorState", this.state);
    this.actor.sheet?.render(false);
    ui.notifications.info(`Applied ${preset.label} build to ${this.actor.name}.`);
    this.render();
  }

  async #replaceGeneratedItems(preset, specialization, loadout, itemChoices = {}) {
    const generatedItemIds = this.actor.items
      .filter((item) => item.getFlag(HALO_MYTHIC.id, "creatorGenerated"))
      .map((item) => item.id);

    if (generatedItemIds.length) {
      await this.actor.deleteEmbeddedDocuments("Item", generatedItemIds);
    }

    const itemsToCreate = [
      {
        name: `Soldier Type: ${preset.label}`,
        type: "trait",
        system: {
          source: "Character Creator",
          summary: preset.summary,
          description: `Experience Cost: ${preset.experienceCost}\nCreation Points: ${preset.creationPoints}`
        },
        flags: creatorFlag()
      }
    ];

    for (const trait of preset.traits) {
      const source = createLibrarySourceByName(trait.name, "trait", creatorFlag());
      if (source) {
        source.system.summary = trait.summary || source.system.summary;
        if (preset.label) source.system.source = preset.label;
        itemsToCreate.push(source);
        continue;
      }

      itemsToCreate.push({
        name: trait.name,
        type: "trait",
        system: {
          source: preset.label,
          summary: trait.summary,
          description: trait.summary
        },
        flags: creatorFlag()
      });
    }

    for (const ability of specialization.abilities) {
      const source = createLibrarySourceByName(ability, "ability", creatorFlag());
      if (source) {
        source.system.prerequisites = specialization.label || source.system.prerequisites;
        itemsToCreate.push(source);
        continue;
      }

      itemsToCreate.push({
        name: ability,
        type: "ability",
        system: {
          cost: 0,
          prerequisites: specialization.label,
          summary: `Granted by ${specialization.label}.`,
          description: `Granted by the ${specialization.label} specialization pack during character creation.`
        },
        flags: creatorFlag()
      });
    }

    if (loadout.label !== "Manual / None") {
      const generatedLoadoutItems = createLoadoutItemSources(loadout, itemChoices, creatorFlag())
        .map((entry) => entry.source)
        .filter(Boolean);
      itemsToCreate.push(...generatedLoadoutItems);
    }

    for (const educationName of this.state.freeEducations
      .slice(0, Number(preset.freeEducationChoices ?? 0))
      .filter(Boolean)) {
      itemsToCreate.push({
        name: educationName,
        type: "education",
        system: {
          difficulty: "basic",
          bonus: 5,
          appliesTo: "Scenario-specific tests",
          description: "Granted by the character creator as a free education choice."
        },
        flags: creatorFlag()
      });
    }

    if (!itemsToCreate.length) return;
    await this.actor.createEmbeddedDocuments("Item", itemsToCreate);
  }
}
