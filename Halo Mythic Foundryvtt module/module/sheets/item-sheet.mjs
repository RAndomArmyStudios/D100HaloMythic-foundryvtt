import { HALO_MYTHIC } from "../config.mjs";

const BaseItemSheet = foundry.appv1.sheets.ItemSheet;

export class HaloMythicItemSheet extends BaseItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["halo-mythic", "sheet", "item"],
      width: 620,
      height: 720,
      submitOnChange: true,
      submitOnClose: true,
      resizable: true
    });
  }

  get template() {
    return "systems/halo-mythic/templates/item/item-sheet.hbs";
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.system = this.item.system;
    context.item = this.item;
    context.typeLabel = HALO_MYTHIC.itemTypes[this.item.type]?.label ?? this.item.type;
    context.isWeapon = this.item.type === "weapon";
    context.isArmor = this.item.type === "armor";
    context.isGear = this.item.type === "gear";
    context.isAbility = this.item.type === "ability";
    context.isEducation = this.item.type === "education";
    context.isTrait = this.item.type === "trait";
    context.weaponTypeOptions = Object.entries(HALO_MYTHIC.weaponAttackTypes).map(([key, meta]) => ({
      key,
      label: meta.label
    }));
    return context;
  }
}
