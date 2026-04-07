import {
  ARMOR_KEYS,
  CHARACTERISTIC_KEYS,
  HALO_MYTHIC,
  SKILL_KEYS,
  VEHICLE_KEYS,
  getCharacteristicModifier,
  getDefaultSkillCharacteristic,
  getSkillRankBonus
} from "./config.mjs";

const fields = foundry.data.fields;

function integerField(initial = 0, options = {}) {
  return new fields.NumberField({
    required: true,
    integer: true,
    initial,
    ...options
  });
}

function numberField(initial = 0, options = {}) {
  return new fields.NumberField({
    required: true,
    initial,
    ...options
  });
}

function stringField(initial = "", options = {}) {
  return new fields.StringField({
    required: true,
    initial,
    blank: true,
    ...options
  });
}

function booleanField(initial = false) {
  return new fields.BooleanField({
    required: true,
    initial
  });
}

function resourceField(value = 0, max = 0, min = 0) {
  return new fields.SchemaField({
    value: integerField(value),
    min: integerField(min),
    max: integerField(max)
  });
}

function characteristicField(initial = 25) {
  return new fields.SchemaField({
    value: integerField(initial, { min: 0 }),
    mod: integerField(getCharacteristicModifier(initial), { min: 0 })
  });
}

function skillField(skillKey) {
  const meta = HALO_MYTHIC.skills[skillKey];
  return new fields.SchemaField({
    rank: stringField("untrained"),
    characteristic: stringField(getDefaultSkillCharacteristic(skillKey)),
    bonus: integerField(getSkillRankBonus("untrained", meta.difficulty))
  });
}

function buildCharacteristicSchema(initial = 25) {
  return CHARACTERISTIC_KEYS.reduce((schema, key) => {
    schema[key] = characteristicField(initial);
    return schema;
  }, {});
}

function buildSkillSchema() {
  return SKILL_KEYS.reduce((schema, key) => {
    schema[key] = skillField(key);
    return schema;
  }, {});
}

function buildArmorSchema() {
  return ARMOR_KEYS.reduce((schema, key) => {
    schema[key] = integerField(0, { min: 0 });
    return schema;
  }, {});
}

function buildVehicleArmorSchema() {
  return VEHICLE_KEYS.reduce((schema, key) => {
    schema[key] = integerField(0, { min: 0 });
    return schema;
  }, {});
}

export class HaloMythicCharacterModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      details: new fields.SchemaField({
        rank: stringField(),
        faction: stringField(),
        specialization: stringField(),
        soldierType: stringField(),
        race: stringField(),
        size: stringField("normal"),
        notes: stringField()
      }),
      characteristics: new fields.SchemaField(buildCharacteristicSchema(25)),
      mythic: new fields.SchemaField({
        str: integerField(0, { min: 0 }),
        tou: integerField(0, { min: 0 }),
        agi: integerField(0, { min: 0 })
      }),
      skills: new fields.SchemaField(buildSkillSchema()),
      resources: new fields.SchemaField({
        wounds: resourceField(40, 40, -40),
        fatigue: resourceField(0, 4, 0),
        shields: new fields.SchemaField({
          value: integerField(0, { min: 0 }),
          min: integerField(0),
          max: integerField(0, { min: 0 }),
          recharge: integerField(0, { min: 0 }),
          delay: integerField(0, { min: 0 }),
          currentDelay: integerField(0, { min: 0 })
        }),
        luck: resourceField(0, 0, 0),
        support: resourceField(0, 0, 0)
      }),
      economy: new fields.SchemaField({
        credits: integerField(0),
        experienceTotal: integerField(0),
        experienceCurrent: integerField(0),
        experienceSpent: integerField(0)
      }),
      movement: new fields.SchemaField({
        half: numberField(0),
        full: numberField(0),
        charge: numberField(0),
        run: numberField(0),
        sprint: numberField(0),
        initiative: numberField(0),
        perceptiveRange: numberField(0),
        jumpHeight: numberField(0),
        leapDistance: numberField(0),
        reach: integerField(1)
      }),
      carrying: new fields.SchemaField({
        carry: numberField(0),
        lift: numberField(0),
        push: numberField(0),
        current: numberField(0),
        loadPercent: integerField(0, { min: 0 }),
        status: stringField("Normal"),
        agilityPenalty: integerField(0, { min: 0 }),
        penalty: integerField(0),
        athleticsStealthPenalty: integerField(0),
        movementMultiplier: numberField(1)
      }),
      armor: new fields.SchemaField(buildArmorSchema()),
      biography: stringField()
    };
  }
}

export class HaloMythicNpcModel extends HaloMythicCharacterModel {}

export class HaloMythicVehicleModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      details: new fields.SchemaField({
        faction: stringField(),
        role: stringField(),
        classification: stringField(),
        size: stringField("large"),
        crewRequired: integerField(1, { min: 0 }),
        crewCurrent: integerField(1, { min: 0 }),
        notes: stringField()
      }),
      resources: new fields.SchemaField({
        wounds: resourceField(40, 40, -40),
        shields: new fields.SchemaField({
          value: integerField(0, { min: 0 }),
          min: integerField(0),
          max: integerField(0, { min: 0 }),
          recharge: integerField(0, { min: 0 }),
          delay: integerField(0, { min: 0 }),
          currentDelay: integerField(0, { min: 0 })
        }),
        support: resourceField(0, 0, 0)
      }),
      movement: new fields.SchemaField({
        cruise: numberField(0),
        flank: numberField(0),
        top: numberField(0),
        initiative: numberField(0),
        maneuver: numberField(0),
        targetRange: numberField(0)
      }),
      armor: new fields.SchemaField(buildVehicleArmorSchema()),
      biography: stringField()
    };
  }
}

export class HaloMythicWeaponModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      attackType: stringField("ranged"),
      training: stringField(),
      equipped: booleanField(false),
      weight: numberField(0, { min: 0 }),
      attackBonus: integerField(0),
      rateOfFire: new fields.SchemaField({
        mode: stringField(),
        value: integerField(0, { min: 0 })
      }),
      damage: new fields.SchemaField({
        dice: integerField(0, { min: 0 }),
        faces: integerField(10, { min: 2 }),
        base: integerField(0),
        pierce: integerField(0)
      }),
      range: new fields.SchemaField({
        min: numberField(0, { min: 0 }),
        max: numberField(0, { min: 0 })
      }),
      magazine: new fields.SchemaField({
        value: integerField(0, { min: 0 }),
        max: integerField(0, { min: 0 })
      }),
      reload: stringField(),
      ammoType: stringField(),
      special: stringField(),
      description: stringField()
    };
  }
}

export class HaloMythicArmorModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      equipped: booleanField(false),
      powered: booleanField(false),
      weight: numberField(0, { min: 0 }),
      rating: new fields.SchemaField({
        head: integerField(0, { min: 0 }),
        arms: integerField(0, { min: 0 }),
        chest: integerField(0, { min: 0 }),
        legs: integerField(0, { min: 0 })
      }),
      shield: new fields.SchemaField({
        max: integerField(0, { min: 0 }),
        recharge: integerField(0, { min: 0 }),
        delay: integerField(0, { min: 0 })
      }),
      description: stringField()
    };
  }
}

export class HaloMythicGearModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      carried: booleanField(true),
      quantity: integerField(1, { min: 0 }),
      weight: numberField(0, { min: 0 }),
      description: stringField()
    };
  }
}

export class HaloMythicAbilityModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      cost: integerField(0, { min: 0 }),
      prerequisites: stringField(),
      summary: stringField(),
      description: stringField()
    };
  }
}

export class HaloMythicEducationModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      difficulty: stringField("basic"),
      bonus: integerField(5),
      appliesTo: stringField(),
      description: stringField()
    };
  }
}

export class HaloMythicTraitModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      source: stringField(),
      summary: stringField(),
      description: stringField()
    };
  }
}
