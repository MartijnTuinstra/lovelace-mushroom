import { HomeAssistant } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";

import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { isActive } from "../../../ha/data/entity";
import "../../../shared/slider";
import "../../../shared/button";
import "../../../shared/input-select";

const stopPropagation = (ev) => ev.stopPropagation();

@customElement("mushroom-fan-presets-control")
export class FanPresetsControl extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;

    @property({ attribute: false }) public entity!: HassEntity;

    @property({ attribute: false }) public selected_preset!: number;

    private _onSelect(e): void {
        e.stopPropagation();

        if (this.entity.attributes.preset_modes.indexOf(e.target?.value) == -1)
          return;

        console.log("tap: " + e.target.value);

        this.hass.callService("fan", "set_preset_mode", {
            entity_id: this.entity.entity_id,
            preset_mode: e.target.value,
        });
    }

    protected render(): TemplateResult {
        const attributes = this.entity.attributes;

        const mode  = attributes.preset_mode == null ? "Unkown" : attributes.preset_mode;
        const modes = attributes.preset_modes;

        console.log("Preset: "+ mode);

        const fill = true;
        const rtl = false;

        return html`
          <mushroom-input-select
            .value=${mode}
            .disabled=${
              this.entity.state === "unavailable" /* UNKNWON state is allowed */
            }
            naturalMenuWidth
            @selected=${this._onSelect}
            @click=${stopPropagation}
            @closed=${stopPropagation}
          >
            ${modes
              ? modes.map(
                  (option) =>
                    html`<mwc-list-item .value=${option}
                      >${option}</mwc-list-item
                    >`
                )
              : ""}
          </mushroom-input-select>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            :host mushroom-input-select {
                display: flex;
                flex-direction: row;
                flex: 1 0 auto;
            }

            :host .mushroom-button-style button span:first-child {
              font-size: 12px;
            }

            :host .mushroom-button-style button span:last-child {
              font-size: 8px;
            }

            :host .mushroom-button-style button {
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              border: none;
              background-color: var(--bg-color);
              transition: background-color 280ms ease-in-out;
              font-size: var(--control-height);
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              line-height: 0;
            }

            :host .mushroom-button-style button {
              width: 42px;
            }
            :host .mushroom-button-style {
              flex: 0;
            }
        `;
    }
}


