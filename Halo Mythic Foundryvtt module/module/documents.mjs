import {
  ARMOR_KEYS,
  HALO_MYTHIC,
  SKILL_KEYS,
  VEHICLE_KEYS,
  clampNumber,
  formatSigned,
  getCharacteristicModifier,
  getDefaultSkillCharacteristic,
  getHitLocationFromRoll,
  getMythicInitiativeBonus,
  getSpeciesAutomation,
  getSkillRankBonus,
  roundDown,
  summarizeDamage,
  summarizeRange
} from "./config.mjs";
import { MythicRolls, promptForFields } from "./dice.mjs";

function armorLocationLabel(key) {
  return HALO_MYTHIC.armorLocations[key]?.label ?? key;
}

function vehicleLocationLabel(key) {
  return HALO_MYTHIC.vehicleLocations[key]?.label ?? key;
}

function getEquippedArmors(items) {
  return items.filter((item) => item.type === "armor" && item.system.equipped);
}

function sumArmorRatings(items) {
  const totals = { head: 0, arms: 0, chest: 0, legs: 0 };

  for (const item of getEquippedArmors(items)) {
    for (const key of ARMOR_KEYS) {
      totals[key] += Number(item.system.rating[key] ?? 0);
    }
  }

  return totals;
}

function getEquippedShieldProfile(items) {
  return getEquippedArmors(items).reduce(
    (totals, item) => {
      totals.max += Number(item.system.shield.max ?? 0);
      totals.recharge += Number(item.system.shield.recharge ?? 0);
      totals.delay = Math.max(totals.delay, Number(item.system.shield.delay ?? 0));
      return totals;
    },
    { max: 0, recharge: 0, delay: 0 }
  );
}

function getCarriedWeight(items) {
  return roundDown(
    items.reduce((total, item) => {
      if (item.type === "gear" && item.system.carried) {
        return total + (Number(item.system.quantity ?? 1) * Number(item.system.weight ?? 0));
      }

      if (item.type === "weapon" && item.system.equipped) {
        return total + Number(item.system.weight ?? 0);
      }

      if (item.type === "armor" && item.system.equipped) {
        const weight = Number(item.system.weight ?? 0);
        return total + (item.system.powered ? 0 : weight / 4);
      }

      return total;
    }, 0),
    2
  );
}

function getEncumbranceState(currentWeight, carryWeight) {
  const safeCarryWeight = Math.max(0, Number(carryWeight ?? 0));
  const ratio = safeCarryWeight > 0 ? Number(currentWeight ?? 0) / safeCarryWeight : 0;

  const state = {
    ratio,
    loadPercent: roundDown(ratio * 100, 0),
    status: "Normal",
    agilityPenalty: 0,
    penalty: 0,
    athleticsStealthPenalty: ratio > 0.5 ? -10 : 0,
    movementMultiplier: 1
  };

  if (ratio >= 0.5 && ratio <= 0.75) {
    state.status = "Loaded";
    state.agilityPenalty = 1;
  } else if (ratio > 0.75 && ratio <= 1) {
    state.status = "Burdened";
    state.agilityPenalty = 2;
  } else if (ratio > 1 && ratio < 2) {
    state.status = "Over-Encumbered";
    state.agilityPenalty = 2;
    state.penalty = -20;
  } else if (ratio >= 2) {
    state.status = "Heavily Encumbered";
    state.agilityPenalty = 2;
    state.penalty = -40;
    state.movementMultiplier = 0.5;
  }

  return state;
}

function getSelectedLocationOptions(actorType) {
  if (actorType === "vehicle") {
    return VEHICLE_KEYS.map((key) => ({ value: key, label: vehicleLocationLabel(key) }));
  }

  return ARMOR_KEYS.map((key) => ({ value: key, label: armorLocationLabel(key) }));
}

export class HaloMythicActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();

    if (this.type === "vehicle") {
      const system = this.system;
      system.resources.wounds.min = -system.resources.wounds.max;
      system.resources.wounds.value = clampNumber(system.resources.wounds.value, system.resources.wounds.min, system.resources.wounds.max);
      system.resources.shields.value = clampNumber(system.resources.shields.value, 0, system.resources.shields.max);
      system.resources.shields.currentDelay = clampNumber(system.resources.shields.currentDelay, 0, system.resources.shields.delay);
      return;
    }

    const system = this.system;

    for (const key of Object.keys(HALO_MYTHIC.characteristics)) {
      const characteristic = system.characteristics[key];
      characteristic.mod = getCharacteristicModifier(characteristic.value);
    }

    for (const key of SKILL_KEYS) {
      const meta = HALO_MYTHIC.skills[key];
      const skill = system.skills[key];
      if (!meta.characteristics.includes(skill.characteristic)) {
        skill.characteristic = getDefaultSkillCharacteristic(key);
      }
      skill.bonus = getSkillRankBonus(skill.rank, meta.difficulty);
    }

    const strength = Number(system.characteristics.str.value ?? 0);
    const toughness = Number(system.characteristics.tou.value ?? 0);
    const agilityMod = Number(system.characteristics.agi.mod ?? 0);
    const strengthMod = Number(system.characteristics.str.mod ?? 0);
    const toughnessMod = Number(system.characteristics.tou.mod ?? 0);
    const perception = Number(system.characteristics.per.value ?? 0);
    const mythicStrength = Number(system.mythic.str ?? 0);
    const mythicToughness = Number(system.mythic.tou ?? 0);
    const mythicAgility = Number(system.mythic.agi ?? 0);
    const species = getSpeciesAutomation(system.details);

    system.carrying.carry = Math.floor(((strength + (mythicStrength * 10) + toughness + (mythicToughness * 10)) / 2) * species.carryingMultiplier);
    system.carrying.lift = system.carrying.carry * 3;
    system.carrying.push = system.carrying.carry * 5;
    system.carrying.current = getCarriedWeight(this.items.contents);

    const encumbrance = getEncumbranceState(system.carrying.current, system.carrying.carry);
    system.carrying.loadPercent = encumbrance.loadPercent;
    system.carrying.status = encumbrance.status;
    system.carrying.agilityPenalty = encumbrance.agilityPenalty;
    system.carrying.penalty = encumbrance.penalty;
    system.carrying.athleticsStealthPenalty = encumbrance.athleticsStealthPenalty;
    system.carrying.movementMultiplier = encumbrance.movementMultiplier;

    const adjustedAgilityMod = Math.max(0, agilityMod - system.carrying.agilityPenalty);
    const effectiveAgility = adjustedAgilityMod + mythicAgility;
    const movementMultiplier = Number(system.carrying.movementMultiplier ?? 1);

    system.movement.half = roundDown(effectiveAgility * movementMultiplier, 2);
    system.movement.full = roundDown(system.movement.half * 2, 2);
    system.movement.charge = roundDown(system.movement.half * 3, 2);
    system.movement.run = roundDown(system.movement.half * 6, 2);
    system.movement.sprint = roundDown(system.movement.half * 8, 2);
    system.movement.initiative = agilityMod + getMythicInitiativeBonus(mythicAgility);
    system.movement.perceptiveRange = perception * 2;
    system.movement.jumpHeight = roundDown(strengthMod / 4, 2);
    system.movement.leapDistance = roundDown(
      Math.max((adjustedAgilityMod + species.leapAgilityBonus) / 2, strengthMod / 2),
      2
    );
    system.movement.reach = HALO_MYTHIC.sizeCategories[system.details.size]?.reach ?? 1;

    system.resources.wounds.max = (((toughnessMod * species.woundToughnessMultiplier) + mythicToughness) * 2) + 40;
    system.resources.wounds.min = -system.resources.wounds.max;
    system.resources.wounds.value = clampNumber(system.resources.wounds.value, system.resources.wounds.min, system.resources.wounds.max);

    system.resources.fatigue.max = toughnessMod * 2;
    system.resources.fatigue.value = clampNumber(system.resources.fatigue.value, 0, Math.max(system.resources.fatigue.max * 3, 0));

    const armorTotals = sumArmorRatings(this.items.contents);
    for (const key of ARMOR_KEYS) {
      system.armor[key] = armorTotals[key];
    }

    const shieldProfile = getEquippedShieldProfile(this.items.contents);
    system.resources.shields.max = shieldProfile.max;
    system.resources.shields.recharge = shieldProfile.recharge;
    system.resources.shields.delay = shieldProfile.delay;
    system.resources.shields.value = clampNumber(system.resources.shields.value, 0, system.resources.shields.max);
    system.resources.shields.currentDelay = clampNumber(system.resources.shields.currentDelay, 0, system.resources.shields.delay);
  }

  getRollData() {
    const data = super.getRollData();
    data.system = this.system;
    return data;
  }

  async rollCharacteristic(key) {
    const meta = HALO_MYTHIC.characteristics[key];
    const characteristic = this.system.characteristics[key];
    if (!meta || !characteristic) return null;

    const response = await promptForFields({
      title: `${meta.label} Test`,
      confirmLabel: "Roll",
      fields: [
        { name: "modifier", label: "Modifier", type: "number", value: 0 },
        { name: "note", label: "Situation", type: "text", value: "" }
      ]
    });

    if (!response) return null;

    const modifier = Number(response.modifier ?? 0);
    const note = String(response.note ?? "").trim();

    return MythicRolls.rollTest({
      actor: this,
      label: `${meta.label} Test`,
      target: characteristic.value,
      modifier,
      characteristicValue: characteristic.value,
      extraLines: note ? [{ label: "Situation", value: note }] : []
    });
  }

  async rollSkill(key) {
    const meta = HALO_MYTHIC.skills[key];
    const skill = this.system.skills[key];
    if (!meta || !skill) return null;

    const response = await promptForFields({
      title: `${meta.label} Test`,
      confirmLabel: "Roll",
      fields: [
        {
          name: "characteristic",
          label: "Characteristic",
          type: "select",
          value: skill.characteristic,
          options: meta.characteristics.map((characteristicKey) => ({
            value: characteristicKey,
            label: HALO_MYTHIC.characteristics[characteristicKey].label
          }))
        },
        { name: "modifier", label: "Modifier", type: "number", value: 0 },
        { name: "note", label: "Situation", type: "text", value: "" }
      ]
    });

    if (!response) return null;

    const selectedCharacteristic = response.characteristic || skill.characteristic;
    if (selectedCharacteristic !== skill.characteristic) {
      await this.update({ [`system.skills.${key}.characteristic`]: selectedCharacteristic });
    }

    const characteristic = this.system.characteristics[selectedCharacteristic];
    const modifier = Number(response.modifier ?? 0);
    const note = String(response.note ?? "").trim();
    const target = Number(characteristic.value ?? 0) + Number(skill.bonus ?? 0);

    return MythicRolls.rollTest({
      actor: this,
      label: `${meta.label} Test`,
      target,
      modifier,
      characteristicValue: characteristic.value,
      extraLines: [
        { label: "Characteristic", value: HALO_MYTHIC.characteristics[selectedCharacteristic].label },
        { label: "Skill Rank", value: HALO_MYTHIC.skillRanks[skill.rank]?.label ?? skill.rank },
        { label: "Skill Bonus", value: formatSigned(skill.bonus) },
        ...(note ? [{ label: "Situation", value: note }] : [])
      ]
    });
  }

  async rollInitiative() {
    return MythicRolls.rollInitiative(this);
  }

  async rollWeaponAttack(itemId, { defaultAutoDamage = false } = {}) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "weapon") return null;

    const isVehicle = this.type === "vehicle";
    const ranged = item.system.attackType !== "melee";
    const characteristicKey = isVehicle ? null : ranged ? "wfr" : "wfm";
    const baseCharacteristic = characteristicKey ? this.system.characteristics[characteristicKey] : null;

    const response = await promptForFields({
      title: `${item.name} Attack`,
      confirmLabel: "Roll Attack",
      fields: [
        ...(isVehicle
          ? [{ name: "baseTarget", label: "Base To Hit", type: "number", value: 50 }]
          : []),
        {
          name: "aim",
          label: "Aim Bonus",
          type: "select",
          value: 0,
          options: [
            { value: 0, label: "No Aim" },
            { value: 5, label: "Half Aim (+5)" },
            { value: 10, label: "Full Aim (+10)" }
          ]
        },
        {
          name: "calledShot",
          label: "Called Shot",
          type: "select",
          value: 0,
          options: [
            { value: 0, label: "No Called Shot" },
            { value: -30, label: "Body Location (-30)" },
            { value: -60, label: "Sublocation (-60)" },
            { value: -40, label: "Weapon / Gear (-40)" },
            { value: -20, label: "Large / Heavy Weapon (-20)" }
          ]
        },
        { name: "rangeModifier", label: "Range Modifier", type: "number", value: 0 },
        { name: "modifier", label: "Other Modifier", type: "number", value: item.system.attackBonus ?? 0 },
        { name: "ammoSpent", label: "Ammo / Shots Spent", type: "number", value: item.system.magazine.max > 0 ? 1 : 0 },
        { name: "autoDamage", label: "Auto-roll damage on hit", type: "checkbox", value: defaultAutoDamage },
        { name: "calledShotTarget", label: "Called Shot Target", type: "text", value: "" },
        { name: "note", label: "Notes", type: "text", value: "" }
      ]
    });

    if (!response) return null;

    const totalModifier =
      Number(response.aim ?? 0) +
      Number(response.calledShot ?? 0) +
      Number(response.rangeModifier ?? 0) +
      Number(response.modifier ?? 0);
    const baseTarget = isVehicle ? Number(response.baseTarget ?? 50) : Number(baseCharacteristic.value ?? 0);

    const spent = Number(response.ammoSpent ?? 0);
    if (spent > 0 && Number(item.system.magazine.max ?? 0) > 0) {
      await item.update({
        "system.magazine.value": clampNumber(item.system.magazine.value - spent, 0, item.system.magazine.max)
      });
    }

    const attack = await MythicRolls.rollTest({
      actor: this,
      label: `${item.name} Attack`,
      target: baseTarget,
      modifier: totalModifier,
      characteristicValue: baseTarget,
      extraLines: [
        { label: "Attack Basis", value: isVehicle ? "Manual gunner target" : HALO_MYTHIC.characteristics[characteristicKey].label },
        { label: "Attack Type", value: HALO_MYTHIC.weaponAttackTypes[item.system.attackType]?.label ?? item.system.attackType },
        { label: "Damage", value: summarizeDamage(item.system.damage) },
        { label: "Range", value: summarizeRange(item.system.range) },
        { label: "Pierce", value: `${item.system.damage.pierce}` },
        ...(response.note ? [{ label: "Notes", value: String(response.note).trim() }] : [])
      ]
    });

    if (attack?.success) {
      let location = String(response.calledShotTarget ?? "").trim();
      if (!location) {
        if (attack.criticalSuccess) location = "Player chooses";
        else location = getHitLocationFromRoll(attack.total, this.type === "vehicle")?.label ?? "Unknown";
      }

      await MythicRolls.postDamageApplication({
        actor: this,
        title: `${item.name} Hit`,
        lines: [
          { label: "Hit Location", value: location },
          { label: "Roll", value: `${attack.total}` },
          { label: "Degrees of Success", value: `${attack.degrees}` },
          { label: "Critical Damage", value: attack.criticalSuccess ? "Maximum damage" : "No" }
        ]
      });

      if (MythicRolls.coerceBoolean(response.autoDamage)) {
        await this.rollWeaponDamage(itemId, { critical: attack.criticalSuccess });
      }
    }

    return attack;
  }

  async fireWeapon(itemId) {
    return this.rollWeaponAttack(itemId, { defaultAutoDamage: true });
  }

  async rollWeaponDamage(itemId, { critical = false } = {}) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "weapon") return null;
    return MythicRolls.rollDamage({ actor: this, item, critical });
  }

  async reloadWeapon(itemId) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "weapon") return null;

    if (Number(item.system.magazine.max ?? 0) <= 0) {
      ui.notifications.info(`${item.name} does not track a magazine size.`);
      return null;
    }

    await item.update({
      "system.magazine.value": item.system.magazine.max
    });

    return MythicRolls.postReload({ actor: this, item });
  }

  async advanceShieldState(rounds = 1, { announce = true } = {}) {
    const shields = this.system.resources.shields;
    if (Number(shields.max ?? 0) <= 0) {
      if (announce) {
        ui.notifications.info(`${this.name} has no active energy shield profile.`);
      }
      return null;
    }

    let currentValue = Number(shields.value ?? 0);
    let currentDelay = Number(shields.currentDelay ?? 0);
    const max = Number(shields.max ?? 0);
    const recharge = Number(shields.recharge ?? 0);

    for (let step = 0; step < Number(rounds ?? 1); step += 1) {
      if (currentDelay > 0) {
        currentDelay -= 1;
        continue;
      }
      if (recharge > 0 && currentValue < max) {
        currentValue = Math.min(max, currentValue + recharge);
      }
    }

    await this.update({
      "system.resources.shields.value": currentValue,
      "system.resources.shields.currentDelay": currentDelay
    });

    if (!announce) return { value: currentValue, max, currentDelay, recharge };

    return MythicRolls.postDamageApplication({
      actor: this,
      title: "Shield State Advanced",
      lines: [
        { label: "Rounds Advanced", value: `${rounds}` },
        { label: "Shield Integrity", value: `${currentValue}/${max}` },
        { label: "Current Delay", value: `${currentDelay}` },
        { label: "Recharge Rate", value: `${recharge}` }
      ]
    });
  }

  async resetShieldDelay() {
    const shields = this.system.resources.shields;
    await this.update({
      "system.resources.shields.currentDelay": Number(shields.delay ?? 0)
    });

    return MythicRolls.postDamageApplication({
      actor: this,
      title: "Shield Delay Reset",
      lines: [
        { label: "Current Delay", value: `${Number(shields.delay ?? 0)}` }
      ]
    });
  }

  async applyDamageDialog() {
    const response = await promptForFields({
      title: "Apply Incoming Damage",
      confirmLabel: "Apply",
      fields: [
        { name: "amount", label: "Incoming Damage", type: "number", value: 0 },
        { name: "pierce", label: "Pierce vs target", type: "number", value: 0 },
        { name: "shieldPierce", label: "Bonus damage vs shields", type: "number", value: 0 },
        {
          name: "location",
          label: "Location",
          type: "select",
          value: this.type === "vehicle" ? "hull" : "chest",
          options: getSelectedLocationOptions(this.type)
        },
        { name: "bypassShield", label: "Bypass shields", type: "checkbox", value: false },
        { name: "note", label: "Notes", type: "text", value: "" }
      ]
    });

    if (!response) return null;

    return this.applyIncomingDamage({
      amount: Number(response.amount ?? 0),
      pierce: Number(response.pierce ?? 0),
      shieldPierce: Number(response.shieldPierce ?? 0),
      location: response.location,
      bypassShield: MythicRolls.coerceBoolean(response.bypassShield),
      note: String(response.note ?? "").trim()
    });
  }

  async applyIncomingDamage({ amount, pierce = 0, shieldPierce = 0, location, bypassShield = false, note = "" }) {
    const incomingDamage = Math.max(0, Number(amount ?? 0));
    if (incomingDamage <= 0) return null;

    const updates = {};
    const shields = this.system.resources.shields;
    let shieldAbsorbed = 0;
    let remainingDamage = incomingDamage;

    if (!bypassShield && Number(shields.value ?? 0) > 0) {
      const effectiveShield = Math.max(0, shields.value - Number(shieldPierce ?? 0));
      remainingDamage = Math.max(0, incomingDamage - effectiveShield);
      const newShieldValue = Math.max(0, shields.value - (incomingDamage + Number(shieldPierce ?? 0)));
      shieldAbsorbed = shields.value - newShieldValue;
      updates["system.resources.shields.value"] = newShieldValue;
    }

    if (Number(shields.max ?? 0) > 0 && incomingDamage >= 10) {
      updates["system.resources.shields.currentDelay"] = shields.delay;
    }

    let resistance = 0;
    let locationLabel = location;

    if (this.type === "vehicle") {
      const armor = Number(this.system.armor[location] ?? 0);
      resistance = Math.max(0, armor - Number(pierce ?? 0));
      locationLabel = vehicleLocationLabel(location);
    } else {
      const toughnessResistance =
        Number(this.system.characteristics.tou.mod ?? 0) +
        Number(this.system.mythic.tou ?? 0);
      const armor = Number(this.system.armor[location] ?? 0);
      resistance = Math.max(0, toughnessResistance + armor - Number(pierce ?? 0));
      locationLabel = armorLocationLabel(location);
    }

    const woundLoss = Math.max(0, remainingDamage - resistance);
    const newWounds = clampNumber(
      this.system.resources.wounds.value - woundLoss,
      -this.system.resources.wounds.max,
      this.system.resources.wounds.max
    );

    updates["system.resources.wounds.value"] = newWounds;

    await this.update(updates);

    return MythicRolls.postDamageApplication({
      actor: this,
      title: "Damage Applied",
      lines: [
        { label: "Location", value: locationLabel },
        { label: "Incoming Damage", value: `${incomingDamage}` },
        { label: "Shield Absorbed", value: `${shieldAbsorbed}` },
        { label: "Remaining Damage", value: `${remainingDamage}` },
        { label: "Damage Resistance", value: `${resistance}` },
        { label: "Wounds Lost", value: `${woundLoss}` },
        { label: "Current Wounds", value: `${newWounds}/${this.system.resources.wounds.max}` },
        ...(note ? [{ label: "Notes", value: note }] : [])
      ]
    });
  }
}

export class HaloMythicItem extends Item {
  get summary() {
    if (this.type === "weapon") {
      return `${summarizeDamage(this.system.damage)} | ${summarizeRange(this.system.range)}`;
    }
    if (this.type === "armor") {
      return `H ${this.system.rating.head} / A ${this.system.rating.arms} / C ${this.system.rating.chest} / L ${this.system.rating.legs}`;
    }
    return this.system.summary || this.system.description || "";
  }
}
