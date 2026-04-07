import {
  HALO_MYTHIC,
  formatSigned,
  getCharacteristicModifier
} from "./config.mjs";

function escapeHtml(value) {
  return foundry.utils.escapeHTML(String(value ?? ""));
}

function coerceBoolean(value) {
  return value === true || value === "true" || value === "on" || value === 1 || value === "1";
}

export async function promptForFields({ title, fields = [], confirmLabel = "Confirm" }) {
  const content = `
    <form class="halo-mythic-dialog">
      ${fields
        .map((field) => {
          const value = field.value ?? "";
          if (field.type === "checkbox") {
            return `
              <label class="checkbox-row">
                <input type="checkbox" name="${field.name}" ${value ? "checked" : ""}/>
                <span>${escapeHtml(field.label)}</span>
              </label>
            `;
          }

          if (field.type === "select") {
            return `
              <label class="field-row">
                <span>${escapeHtml(field.label)}</span>
                <select name="${field.name}">
                  ${field.options
                    .map(
                      (option) => `
                    <option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? "selected" : ""}>
                      ${escapeHtml(option.label)}
                    </option>
                  `
                    )
                    .join("")}
                </select>
              </label>
            `;
          }

          return `
            <label class="field-row">
              <span>${escapeHtml(field.label)}</span>
              <input type="${field.type ?? "text"}" name="${field.name}" value="${escapeHtml(value)}"/>
            </label>
          `;
        })
        .join("")}
    </form>
  `;

  return new Promise((resolve) => {
    let settled = false;

    new Dialog({
      title,
      content,
      buttons: {
        confirm: {
          label: confirmLabel,
          callback: (html) => {
            settled = true;
            const form = html[0].querySelector("form");
            const data = new FormDataExtended(form).object;
            resolve(data);
          }
        },
        cancel: {
          label: "Cancel",
          callback: () => {
            settled = true;
            resolve(null);
          }
        }
      },
      default: "confirm",
      close: () => {
        if (!settled) resolve(null);
      }
    }).render(true);
  });
}

async function postRollMessage({ actor, title, subtitle = "", roll, lines = [] }) {
  const speaker = ChatMessage.getSpeaker({ actor });
  const content = `
    <div class="halo-mythic-chat-card">
      <h3>${escapeHtml(title)}</h3>
      ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ""}
      <div class="roll-display">${escapeHtml(roll.total)}</div>
      <div class="roll-breakdown">
        ${lines
          .map(
            (line) => `
          <div class="line">
            <span>${escapeHtml(line.label)}</span>
            <strong>${escapeHtml(line.value)}</strong>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  return ChatMessage.create({
    speaker,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rolls: [roll],
    content
  });
}

async function postInfoMessage({ actor, title, lines = [] }) {
  const speaker = ChatMessage.getSpeaker({ actor });
  const content = `
    <div class="halo-mythic-chat-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="roll-breakdown">
        ${lines
          .map(
            (line) => `
          <div class="line">
            <span>${escapeHtml(line.label)}</span>
            <strong>${escapeHtml(line.value)}</strong>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  return ChatMessage.create({
    speaker,
    content
  });
}

async function rollPercentile() {
  const roll = new Roll("1d100");
  await roll.evaluate({ async: true });
  return roll;
}

async function rollFormula(formula, data = {}) {
  const roll = new Roll(formula, data);
  await roll.evaluate({ async: true });
  return roll;
}

export const MythicRolls = {
  async rollTest({
    actor,
    label,
    target,
    modifier = 0,
    characteristicValue = 0,
    extraLines = []
  }) {
    const finalTarget = Number(target ?? 0) + Number(modifier ?? 0);
    const roll = await rollPercentile();
    const total = Number(roll.total ?? 0);
    const criticalSuccess = total === 1;
    const criticalFailure = total === 100;
    const success = !criticalFailure && (criticalSuccess || total <= finalTarget);

    let degrees = 0;
    if (criticalSuccess) {
      degrees = getCharacteristicModifier(characteristicValue);
    } else if (success) {
      degrees = Math.max(0, Math.floor((finalTarget - total) / 10));
    } else {
      degrees = Math.max(0, Math.floor((total - finalTarget) / 10));
    }

    const lines = [
      { label: "Target", value: `${finalTarget}` },
      { label: "Roll", value: `${total}` },
      { label: "Result", value: success ? "Success" : "Failure" },
      { label: success ? "Degrees of Success" : "Degrees of Failure", value: `${degrees}` }
    ];

    if (criticalSuccess) lines.push({ label: "Critical", value: "Natural 1" });
    if (criticalFailure) lines.push({ label: "Critical", value: "Natural 100" });
    if (modifier) lines.push({ label: "Modifier", value: formatSigned(modifier) });
    lines.push(...extraLines);

    await postRollMessage({
      actor,
      title: label,
      subtitle: "100DOS D100 Test",
      roll,
      lines
    });

    return {
      actor,
      roll,
      total,
      target: finalTarget,
      modifier,
      success,
      degrees,
      criticalSuccess,
      criticalFailure
    };
  },

  async rollInitiative(actor) {
    const roll = await rollFormula("1d10 + @system.movement.initiative", actor.getRollData());
    await postRollMessage({
      actor,
      title: "Initiative Test",
      subtitle: "1d10 + Agility modifier + Mythic Agility bonus",
      roll,
      lines: [
        { label: "Initiative Modifier", value: `${actor.system.movement.initiative}` },
        { label: "Result", value: `${roll.total}` }
      ]
    });

    return roll;
  },

  async rollDamage({ actor, item, critical = false }) {
    const damage = item.system.damage;
    const dice = Number(damage.dice ?? 0);
    const faces = Number(damage.faces ?? 10);
    const base = Number(damage.base ?? 0);
    const maxDamage = dice * faces + base;
    const formula = critical
      ? `${maxDamage}`
      : dice > 0
        ? `${dice}d${faces}${base ? ` + ${base}` : ""}`
        : `${base}`;
    const roll = await rollFormula(formula);
    const specialDamage = critical
      ? dice > 0
      : roll.dice.some((die) => die.results.some((result) => result.result === die.faces));

    await postRollMessage({
      actor,
      title: `${item.name} Damage`,
      subtitle: critical ? "Critical Success damage" : "Weapon damage roll",
      roll,
      lines: [
        { label: "Pierce", value: `${damage.pierce}` },
        { label: "Special Damage", value: specialDamage ? "Triggered" : "No" },
        { label: "Attack Type", value: HALO_MYTHIC.weaponAttackTypes[item.system.attackType]?.label ?? item.system.attackType }
      ]
    });

    return {
      roll,
      specialDamage
    };
  },

  async postReload({ actor, item }) {
    return postInfoMessage({
      actor,
      title: `${item.name} Reloaded`,
      lines: [
        { label: "Magazine", value: `${item.system.magazine.value}/${item.system.magazine.max}` },
        { label: "Reload Time", value: item.system.reload || "See weapon profile" }
      ]
    });
  },

  async postDamageApplication({ actor, title, lines }) {
    return postInfoMessage({ actor, title, lines });
  },

  coerceBoolean
};
