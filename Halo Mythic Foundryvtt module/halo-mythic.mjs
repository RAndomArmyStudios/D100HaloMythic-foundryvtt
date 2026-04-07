import { HALO_MYTHIC, formatSigned } from "./module/config.mjs";
import {
  HaloMythicCharacterModel,
  HaloMythicNpcModel,
  HaloMythicVehicleModel,
  HaloMythicAbilityModel,
  HaloMythicArmorModel,
  HaloMythicEducationModel,
  HaloMythicGearModel,
  HaloMythicTraitModel,
  HaloMythicWeaponModel
} from "./module/data-models.mjs";
import { HaloMythicActor, HaloMythicItem } from "./module/documents.mjs";
import { HaloMythicActorSheet } from "./module/sheets/actor-sheet.mjs";
import { HaloMythicItemSheet } from "./module/sheets/item-sheet.mjs";
import { MythicRolls } from "./module/dice.mjs";
import * as Library from "./module/content/library.mjs";

const ActorsCollection = foundry.documents.collections.Actors;
const ItemsCollection = foundry.documents.collections.Items;
const BaseActorSheet = foundry.appv1.sheets.ActorSheet;
const BaseItemSheet = foundry.appv1.sheets.ItemSheet;

Hooks.once("init", () => {
  CONFIG.HALO_MYTHIC = HALO_MYTHIC;

  CONFIG.Actor.documentClass = HaloMythicActor;
  CONFIG.Item.documentClass = HaloMythicItem;

  CONFIG.Actor.dataModels = {
    character: HaloMythicCharacterModel,
    npc: HaloMythicNpcModel,
    vehicle: HaloMythicVehicleModel
  };

  CONFIG.Item.dataModels = {
    weapon: HaloMythicWeaponModel,
    armor: HaloMythicArmorModel,
    gear: HaloMythicGearModel,
    ability: HaloMythicAbilityModel,
    education: HaloMythicEducationModel,
    trait: HaloMythicTraitModel
  };

  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ["resources.wounds", "resources.shields", "resources.fatigue", "resources.luck", "resources.support"],
      value: ["economy.credits", "economy.experienceCurrent"]
    },
    npc: {
      bar: ["resources.wounds", "resources.shields", "resources.fatigue"],
      value: []
    },
    vehicle: {
      bar: ["resources.wounds", "resources.shields"],
      value: ["movement.initiative"]
    }
  };

  CONFIG.Combat.initiative = {
    formula: "1d10 + @system.movement.initiative",
    decimals: 0
  };

  game.settings.register(HALO_MYTHIC.id, "autoAdvanceShields", {
    name: "Auto-advance shields each combat round",
    hint: "When a combat round advances, recharge-delay and shield recharge update automatically for combatants with shields.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  ActorsCollection.unregisterSheet("core", BaseActorSheet);
  ActorsCollection.registerSheet(HALO_MYTHIC.id, HaloMythicActorSheet, {
    types: ["character", "npc", "vehicle"],
    makeDefault: true
  });

  ItemsCollection.unregisterSheet("core", BaseItemSheet);
  ItemsCollection.registerSheet(HALO_MYTHIC.id, HaloMythicItemSheet, {
    types: ["weapon", "armor", "gear", "ability", "education", "trait"],
    makeDefault: true
  });

  Handlebars.registerHelper("ifEq", function ifEq(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("signed", (value) => formatSigned(Number(value ?? 0)));

  game.haloMythic = {
    config: HALO_MYTHIC,
    rolls: MythicRolls,
    library: Library
  };
});

Hooks.on("updateCombat", async (combat, changed) => {
  if (!game.user.isGM) return;
  if (!("round" in changed)) return;
  if (combat.round <= 1) return;
  if (!game.settings.get(HALO_MYTHIC.id, "autoAdvanceShields")) return;

  const actors = [...new Set(combat.combatants.map((combatant) => combatant.actor).filter(Boolean))];
  if (!actors.length) return;

  await Promise.all(actors.map((actor) => actor.advanceShieldState(1, { announce: false })));
  ui.notifications.info(`Halo Mythic: advanced shield recharge for ${actors.length} combatant${actors.length === 1 ? "" : "s"}.`);
});
