import {
  ARMOR_KEYS,
  HALO_MYTHIC,
  VEHICLE_KEYS,
  formatSigned,
  summarizeDamage,
  summarizeRange
} from "../config.mjs";
import { HaloMythicCharacterCreator } from "../apps/character-creator.mjs";
import { HaloMythicLibraryBrowser } from "../apps/library-browser.mjs";

function sortByName(documents) {
  return documents.sort((a, b) => a.name.localeCompare(b.name));
}

function buildSkillGroups(skills) {
  const groups = [
    {
      key: "movement",
      label: "Movement",
      keys: ["athletics", "evasion", "pilotGround", "pilotAir", "pilotSpace", "stunting"]
    },
    {
      key: "fieldcraft",
      label: "Fieldcraft",
      keys: [
        "camouflage",
        "cryptography",
        "demolition",
        "medicationHuman",
        "medicationCovenant",
        "medicationMgalekgolo",
        "navigationGroundAir",
        "navigationSpace",
        "navigationSlipspace",
        "security",
        "survival",
        "technologyHuman",
        "technologyCovenant",
        "technologyForerunner"
      ]
    },
    {
      key: "social",
      label: "Social",
      keys: [
        "appeal",
        "command",
        "deception",
        "gambling",
        "interrogation",
        "intimidation",
        "investigation",
        "negotiation"
      ]
    }
  ];

  return groups.map((group) => ({
    ...group,
    skills: group.keys.map((key) => skills.find((skill) => skill.key === key)).filter(Boolean)
  }));
}

function getShieldStatus(shields) {
  if (Number(shields.max ?? 0) <= 0) return "No Shields";
  if (Number(shields.currentDelay ?? 0) > 0) {
    return `Delay ${shields.currentDelay}/${shields.delay}`;
  }
  if (Number(shields.value ?? 0) < Number(shields.max ?? 0) && Number(shields.recharge ?? 0) > 0) {
    return `Recharging ${shields.recharge}/round`;
  }
  return "Fully Charged";
}

const BaseActorSheet = foundry.appv1.sheets.ActorSheet;

export class HaloMythicActorSheet extends BaseActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["halo-mythic", "sheet", "actor"],
      width: 1040,
      height: 880,
      submitOnChange: true,
      submitOnClose: true,
      resizable: true,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "record"
        }
      ]
    });
  }

  get template() {
    return this.actor.type === "vehicle"
      ? "systems/halo-mythic/templates/actor/vehicle-sheet.hbs"
      : "systems/halo-mythic/templates/actor/character-sheet.hbs";
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    const actor = this.actor;
    const isVehicle = actor.type === "vehicle";

    context.system = actor.system;
    context.actor = actor;
    context.isVehicle = isVehicle;
    context.canUseCreator = actor.type === "character";
    context.canUseLibrary = actor.type !== "vehicle";
    context.cssClass = this.options.classes.join(" ");
    context.characteristics = isVehicle
      ? []
      : Object.entries(HALO_MYTHIC.characteristics).map(([key, meta]) => ({
          key,
          ...meta,
          value: actor.system.characteristics[key].value,
          mod: actor.system.characteristics[key].mod
        }));

    context.skills = isVehicle
      ? []
      : Object.entries(HALO_MYTHIC.skills).map(([key, meta]) => ({
          key,
          ...meta,
          rank: actor.system.skills[key].rank,
          characteristic: actor.system.skills[key].characteristic,
          bonus: actor.system.skills[key].bonus,
          characteristicOptions: meta.characteristics.map((characteristicKey) => ({
            key: characteristicKey,
            label: HALO_MYTHIC.characteristics[characteristicKey].label
          }))
        }));
    context.skillGroups = isVehicle ? [] : buildSkillGroups(context.skills);

    context.skillRanks = Object.entries(HALO_MYTHIC.skillRanks).map(([key, meta]) => ({
      key,
      label: meta.label
    }));

    context.sizeOptions = Object.entries(HALO_MYTHIC.sizeCategories).map(([key, meta]) => ({
      key,
      label: meta.label
    }));

    const allItems = actor.items.contents.slice();
    context.weapons = sortByName(allItems.filter((item) => item.type === "weapon")).map((item) => ({
      id: item.id,
      name: item.name,
      equipped: item.system.equipped,
      typeLabel: HALO_MYTHIC.weaponAttackTypes[item.system.attackType]?.label ?? item.system.attackType,
      damage: summarizeDamage(item.system.damage),
      range: summarizeRange(item.system.range),
      magazine: item.system.magazine.max > 0 ? `${item.system.magazine.value}/${item.system.magazine.max}` : "N/A",
      summary: item.summary
    }));

    context.armors = sortByName(allItems.filter((item) => item.type === "armor")).map((item) => ({
      id: item.id,
      name: item.name,
      equipped: item.system.equipped,
      rating: `H ${item.system.rating.head} / A ${item.system.rating.arms} / C ${item.system.rating.chest} / L ${item.system.rating.legs}`,
      shield: item.system.shield.max > 0
        ? `${item.system.shield.max} | ${item.system.shield.recharge}/r | ${item.system.shield.delay} delay`
        : "None"
    }));

    context.gear = sortByName(allItems.filter((item) => item.type === "gear")).map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.system.quantity,
      weight: item.system.weight,
      carried: item.system.carried,
      summary: item.summary
    }));

    context.abilities = sortByName(allItems.filter((item) => item.type === "ability"));
    context.educations = sortByName(allItems.filter((item) => item.type === "education"));
    context.traits = sortByName(allItems.filter((item) => item.type === "trait"));

    context.armorTotals = isVehicle
      ? VEHICLE_KEYS.map((key) => ({
          key,
          label: HALO_MYTHIC.vehicleLocations[key].label,
          value: actor.system.armor[key]
        }))
      : ARMOR_KEYS.map((key) => ({
          key,
          label: HALO_MYTHIC.armorLocations[key].label,
          value: actor.system.armor[key]
        }));

    context.damageResistance = isVehicle
      ? context.armorTotals.map((entry) => ({
          ...entry,
          total: entry.value
        }))
      : context.armorTotals.map((entry) => ({
          ...entry,
          total: entry.value + actor.system.characteristics.tou.mod + actor.system.mythic.tou
        }));

    context.shieldStatus = getShieldStatus(actor.system.resources.shields);

    context.formatSigned = formatSigned;
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".rollable-characteristic").on("click", (event) => {
      this.actor.rollCharacteristic(event.currentTarget.dataset.key);
    });

    html.find(".rollable-skill").on("click", (event) => {
      this.actor.rollSkill(event.currentTarget.dataset.key);
    });

    html.find(".quick-roll-characteristic").on("click", (event) => {
      this.actor.rollCharacteristic(event.currentTarget.dataset.key);
    });

    html.find(".quick-roll-skill").on("click", (event) => {
      this.actor.rollSkill(event.currentTarget.dataset.key);
    });

    html.find(".rollable-initiative").on("click", () => {
      this.actor.rollInitiative();
    });

    html.find(".apply-damage").on("click", () => {
      this.actor.applyDamageDialog();
    });

    html.find(".item-create").on("click", (event) => this._onItemCreate(event));
    html.find(".item-edit").on("click", (event) => this._onItemEdit(event));
    html.find(".item-delete").on("click", (event) => this._onItemDelete(event));
    html.find(".item-toggle").on("click", (event) => this._onItemToggle(event));
    html.find(".weapon-attack").on("click", (event) => this.actor.rollWeaponAttack(event.currentTarget.dataset.itemId));
    html.find(".weapon-fire").on("click", (event) => this.actor.fireWeapon(event.currentTarget.dataset.itemId));
    html.find(".weapon-damage").on("click", (event) => this.actor.rollWeaponDamage(event.currentTarget.dataset.itemId));
    html.find(".weapon-reload").on("click", (event) => this.actor.reloadWeapon(event.currentTarget.dataset.itemId));
    html.find(".shield-advance").on("click", () => this.actor.advanceShieldState());
    html.find(".shield-reset").on("click", () => this.actor.resetShieldDelay());
    html.find(".open-character-creator").on("click", () => {
      if (this.actor.type !== "character") return;
      new HaloMythicCharacterCreator(this.actor).render(true);
    });
    html.find(".open-library-browser").on("click", () => {
      if (this.actor.type === "vehicle") return;
      new HaloMythicLibraryBrowser(this.actor).render(true);
    });
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    if (!type) return;

    const label = HALO_MYTHIC.itemTypes[type]?.label ?? type;
    const [item] = await this.actor.createEmbeddedDocuments("Item", [
      {
        name: `New ${label}`,
        type
      }
    ]);

    item.sheet.render(true);
  }

  _getItemFromEvent(event) {
    const itemId = event.currentTarget.dataset.itemId || event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    return itemId ? this.actor.items.get(itemId) : null;
  }

  _onItemEdit(event) {
    const item = this._getItemFromEvent(event);
    item?.sheet.render(true);
  }

  async _onItemDelete(event) {
    const item = this._getItemFromEvent(event);
    if (!item) return;
    await item.delete();
  }

  async _onItemToggle(event) {
    const item = this._getItemFromEvent(event);
    if (!item || !("equipped" in item.system)) return;
    await item.update({ "system.equipped": !item.system.equipped });
  }
}
