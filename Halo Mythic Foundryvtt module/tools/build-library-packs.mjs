import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { STARTER_LIBRARY_ITEMS, STARTER_LIBRARY_PACKS } from "../module/content/library.mjs";
import { STARTER_ACTORS, STARTER_ACTOR_PACKS } from "../module/content/actor-library.mjs";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLASSIC_LEVEL_PATH = pathToFileURL(
  "C:/Program Files/Foundry Virtual Tabletop/resources/app/node_modules/classic-level/index.js"
).href;
const { ClassicLevel } = await import(CLASSIC_LEVEL_PATH);

function stableId(value) {
  let hashA = 0;
  let hashB = 5381;

  for (const character of String(value)) {
    const code = character.charCodeAt(0);
    hashA = ((hashA << 5) - hashA) + code;
    hashA |= 0;
    hashB = ((hashB << 5) + hashB) ^ code;
    hashB |= 0;
  }

  const joined = `${Math.abs(hashA).toString(36)}${Math.abs(hashB).toString(36)}library`;
  return joined.slice(0, 16).padEnd(16, "0");
}

async function rebuildPack(pack) {
  const packPath = path.join(ROOT_DIR, pack.path);
  const entries = STARTER_LIBRARY_ITEMS
    .filter((entry) => entry.pack === pack.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  await fs.rm(packPath, { recursive: true, force: true });
  await fs.mkdir(packPath, { recursive: true });

  const db = new ClassicLevel(packPath, { valueEncoding: "utf8" });
  await db.open();

  const folderMap = new Map();
  for (const folderName of [...new Set(entries.map((entry) => entry.folder))].sort((a, b) => a.localeCompare(b))) {
    const folderId = stableId(`${pack.name}:${folderName}:folder`);
    folderMap.set(folderName, folderId);

    await db.put(`!folders!${folderId}`, JSON.stringify({
      _id: folderId,
      folder: null,
      name: folderName,
      sorting: "a",
      color: "#7cb342",
      description: "",
      type: "Item"
    }));
  }

  let sort = 0;
  for (const entry of entries) {
    sort += 10;
    const itemId = stableId(`${pack.name}:${entry.id}`);
    await db.put(`!items!${itemId}`, JSON.stringify({
      _id: itemId,
      name: entry.name,
      type: entry.type,
      img: entry.img,
      folder: folderMap.get(entry.folder) ?? null,
      sort,
      ownership: { default: 0 },
      flags: {
        "halo-mythic": {
          libraryEntryId: entry.id
        }
      },
      effects: [],
      system: entry.system
    }));
  }

  await db.close();
  return entries.length;
}

async function rebuildActorPack(pack) {
  const packPath = path.join(ROOT_DIR, pack.path);
  const entries = STARTER_ACTORS
    .filter((entry) => entry.pack === pack.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  await fs.rm(packPath, { recursive: true, force: true });
  await fs.mkdir(packPath, { recursive: true });

  const db = new ClassicLevel(packPath, { valueEncoding: "utf8" });
  await db.open();

  const folderMap = new Map();
  for (const folderName of [...new Set(entries.map((entry) => entry.folder))].sort((a, b) => a.localeCompare(b))) {
    const folderId = stableId(`${pack.name}:${folderName}:folder`);
    folderMap.set(folderName, folderId);

    await db.put(`!folders!${folderId}`, JSON.stringify({
      _id: folderId,
      folder: null,
      name: folderName,
      sorting: "a",
      color: "#f5c451",
      description: "",
      type: "Actor"
    }));
  }

  let sort = 0;
  for (const entry of entries) {
    sort += 10;
    const actorId = stableId(`${pack.name}:${entry.id}`);
    const embeddedItems = [];

    for (const [index, item] of (entry.items ?? []).entries()) {
      const itemSeed = item.flags?.["halo-mythic"]?.libraryEntryId ?? item.name ?? `${entry.id}-${index}`;
      const itemId = stableId(`${pack.name}:${entry.id}:${itemSeed}:${index}`);
      embeddedItems.push(itemId);

      await db.put(`!actors.items!${actorId}.${itemId}`, JSON.stringify({
        _id: itemId,
        name: item.name,
        type: item.type,
        img: item.img,
        folder: null,
        sort: (index + 1) * 10,
        ownership: { default: 0 },
        flags: item.flags ?? {},
        effects: item.effects ?? [],
        system: item.system
      }));
    }

    await db.put(`!actors!${actorId}`, JSON.stringify({
      _id: actorId,
      name: entry.name,
      type: entry.type,
      img: entry.img,
      folder: folderMap.get(entry.folder) ?? null,
      sort,
      ownership: { default: 0 },
      flags: {
        "halo-mythic": {
          libraryActorId: entry.id
        }
      },
      effects: [],
      items: embeddedItems,
      prototypeToken: {
        name: entry.name,
        actorLink: false,
        appendNumber: false,
        prependAdjective: false
      },
      system: entry.system
    }));
  }

  await db.close();
  return entries.length;
}

await fs.mkdir(path.join(ROOT_DIR, "packs"), { recursive: true });

let totalEntries = 0;
for (const pack of STARTER_LIBRARY_PACKS) {
  totalEntries += await rebuildPack(pack);
}

for (const pack of STARTER_ACTOR_PACKS) {
  totalEntries += await rebuildActorPack(pack);
}

console.log(`Rebuilt ${STARTER_LIBRARY_PACKS.length + STARTER_ACTOR_PACKS.length} pack(s) with ${totalEntries} entries.`);
