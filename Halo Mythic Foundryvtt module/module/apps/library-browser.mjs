import { createLibraryItemSource, getStarterLibraryPackTree } from "../content/library.mjs";

const BaseApplication = foundry.appv1.api.Application;

export class HaloMythicLibraryBrowser extends BaseApplication {
  constructor(actor = null, options = {}) {
    super(options);
    this.actor = actor;
    this.search = "";
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "halo-mythic-library-browser",
      classes: ["halo-mythic", "halo-mythic-library", "halo-mythic-library-browser"],
      template: "systems/halo-mythic/templates/apps/library-browser.hbs",
      width: 980,
      height: 860,
      resizable: true,
      tabs: [
        {
          navSelector: ".library-tabs",
          contentSelector: ".library-body",
          initial: "starter-weapons"
        }
      ]
    });
  }

  get title() {
    return this.actor ? `Halo Mythic Library: ${this.actor.name}` : "Halo Mythic Library";
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.actor = this.actor;
    context.canImport = Boolean(this.actor);
    context.search = this.search;
    context.packs = getStarterLibraryPackTree(this.search);
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("[name='search']").on("input", (event) => {
      this.search = String(event.currentTarget.value ?? "");
      this.render(false);
    });

    html.find(".library-import").on("click", (event) => this._onImport(event));
  }

  async _onImport(event) {
    event.preventDefault();

    if (!this.actor) {
      ui.notifications.warn("Open the library from an actor sheet to import directly.");
      return;
    }

    const entryId = String(event.currentTarget.dataset.entryId ?? "").trim();
    if (!entryId) return;

    const source = createLibraryItemSource(entryId);
    if (!source) {
      ui.notifications.warn("That library entry could not be resolved.");
      return;
    }

    await this.actor.createEmbeddedDocuments("Item", [source]);
    this.actor.sheet?.render(false);
    ui.notifications.info(`Imported ${source.name} to ${this.actor.name}.`);
  }
}
