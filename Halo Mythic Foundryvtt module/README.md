# Halo Mythic Foundry System

This workspace now contains a playable first-pass Foundry VTT system package for Halo Mythic / 100DOS.

What is included:

- `system.json` manifest for a Foundry system package with actor and item types.
- Custom actor sheets for `character`, `npc`, and `vehicle`.
- Item sheets for `weapon`, `armor`, `gear`, `ability`, `education`, and `trait`.
- Starter compendium packs for weapons, armor, gear, specialization abilities, and common soldier traits.
- A sheet-side starter library browser for direct item import.
- A guided creator that now writes real starter equipment and compendium-backed starter traits/abilities instead of a single bundle placeholder.
- Derived calculations for characteristic modifiers, movement, perceptive range, carrying capacity, wounds, fatigue thresholds, and armor totals.
- D100 roll support for characteristic tests, skill tests, initiative, weapon attacks, damage rolls, reloads, and incoming damage application.

Current scope:

- The package is meant to get us to a solid first playable build for testing.
- The system now includes a source-backed UNSC starter library, but it still does not bundle the full armory, bestiary, or every ability/education entry from the PDFs yet.
- Abilities, educations, gear, armor, and weapons remain editable items so we can continue expanding the books without locking content behind hard-coded rules.

Install notes:

1. Foundry expects the folder name to match the system id, so place this package inside your Foundry `Data/systems/` directory under a folder named `halo-mythic`.
2. Launch Foundry and create a world using the `Halo Mythic` system.
3. Create a Character, NPC, or Vehicle actor and begin entering data from your sheets/books.

Reference files:

- `reference/mythic-main.txt`
- `reference/mythic-character-sheet.txt`
- `reference/extracted/*.txt`

Those were generated from the local PDFs to support rules extraction during development and are not required by Foundry itself.

Pack rebuild:

- `node tools/build-library-packs.mjs`

Run that command after changing `module/content/library.mjs` to rebuild the shipped starter compendium packs.

PDF extraction:

- `python tools/extract-reference-pdfs.py --force`

Run that command to regenerate the searchable text copies of the full local PDF library in `reference/extracted/`.
