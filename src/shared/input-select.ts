import { SelectBase } from "@material/mwc-select/mwc-select-base";
import { styles } from "@material/mwc-select/mwc-select.css";

import { css, CSSResultGroup, html, nothing, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { conditionalClamp, debounce, formatNumber, FrontendLocaleData, round } from "../ha";

// const DEFAULT_STEP = 1;
const DEFAULT_DEBOUCE_TIME = 2000;

const getInputSelectDebounceTime = (element: any): number => {
    const debounceTimeValue = window
        .getComputedStyle(element)
        .getPropertyValue("--input-select-debounce");
    const debounceTime = parseFloat(debounceTimeValue);
    return isNaN(debounceTime) ? DEFAULT_DEBOUCE_TIME : debounceTime;
};

@customElement("mushroom-input-select")
export class InputSelect extends SelectBase {
  // @ts-ignore
  @property({ type: Boolean }) public icon?: boolean;

  protected override renderLeadingIcon() {
    if (!this.icon) {
      return nothing;
    }

    return html`<span class="mdc-select__icon"
      ><slot name="icon"></slot
    ></span>`;
  }

  /*connectedCallback() {
    super.connectedCallback();
    window.addEventListener("translations-updated", this._translationsUpdated);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      "translations-updated",
      this._translationsUpdated
    );
  }

  private _translationsUpdated = debounce(async () => {
    await nextRender();
    this.layoutOptions();
  }, 500);*/

  static override styles = [
    styles,
    css`
      .mdc-select:not(.mdc-select--disabled) .mdc-select__icon {
        color: var(--secondary-text-color);
      }
      .mdc-select__anchor {
        width: var(--ha-select-min-width, 200px);
      }
      .mdc-select--filled .mdc-floating-label {
        inset-inline-start: 12px;
        inset-inline-end: initial;
        direction: var(--direction);
      }
      .mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label {
        inset-inline-start: 48px;
        inset-inline-end: initial;
        direction: var(--direction);
      }
      .mdc-select .mdc-select__anchor {
        padding-inline-start: 12px;
        padding-inline-end: 0px;
        direction: var(--direction);
      }
      .mdc-select__anchor .mdc-floating-label--float-above {
        transform-origin: var(--float-start);
      }

      .mdc-select--filled .mdc-select__anchor {
        border-radius: var(--control-border-radius);
        border-bottom: none;
        height: 42px;
        width: 75px;
      }

      .mdc-select--filled .mdc-select__anchor .mdc-line-ripple {
        display: none;
      }
    `,
  ];
}
 /* 
    @property({ attribute: false }) public locale!: FrontendLocaleData;

    @property({ type: Boolean }) public disabled: boolean = false;

    @property({ attribute: false, type: Number, reflect: true })
    public value?: number;

    @property({ attribute: false, type: Boolean, reflect: true })
    public show?: boolean = false;

    @property({ attribute: "false" })
    public formatOptions: Intl.NumberFormatOptions = {};

    @state() pending = false;

    private _toggle(e: MouseEvent) {
        e.stopPropagation();
        if (!this.value) return;
    }

    private _select(e: MouseEvent) {
        e.stopPropagation();
        if (!this.value) return;
        const value = round(this.value - 1, 1);
        this._processNewValue(value);
    }

    @query("#container")
    private container;

    private dispatchValue = (value: number) => {
        this.pending = false;
        this.dispatchEvent(
            new CustomEvent("change", {
                detail: {
                    value,
                },
            })
        );
    };

    private debounceDispatchValue = this.dispatchValue;

    protected firstUpdated(changedProperties: PropertyValues): void {
        super.firstUpdated(changedProperties);
        const debounceTime = getInputSelectDebounceTime(this.container);
        if (debounceTime) {
            this.debounceDispatchValue = debounce(this.dispatchValue, debounceTime);
        }
    }

    private _processNewValue(value) {
        const newValue = conditionalClamp(value, 0, 100);
        if (this.value !== newValue) {
            this.value = newValue;
            this.pending = true;
        }
        this.debounceDispatchValue(newValue);
    }

    protected render(): TemplateResult {
        const value =
            this.value != null ? formatNumber(this.value, this.locale, this.formatOptions) : "unkown";

        return html`
            <div class="container" id="container" @click=${this._toggle} disabled="${this.disabled}">
                <span
                    class=${classMap({
                        pending: this.pending,
                        disabled: this.disabled,
                    })}
                >
                    ${value}
                </span>
                <button class="button" >
                    <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
            </div>
            <div class="selectoptions">
              <div><span>Option 1</span><ha-icon icon="mdi:check-circle-outline"></div>
              <div><span>Option 2</span><ha-icon icon="mdi:check-circle-outline"></div>
              <div><span>Option 3</span><ha-icon icon="mdi:check-circle-outline"></div>
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            :host {
                --text-color: var(--primary-text-color);
                --text-color-disabled: rgb(var(--rgb-disabled));
                --icon-color: var(--primary-text-color);
                --icon-color-disabled: rgb(var(--rgb-disabled));
                --bg-color: rgba(var(--rgb-primary-text-color), 0.05);
                --bg-color-disabled: rgba(var(--rgb-disabled), 0.2);
                height: var(--control-height);
                min-width: calc(var(--control-height) * var(--control-button-ratio) * 3);
                flex: 1 0 auto;
            }
            .container {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                padding: 6px;
                display: flex;
                flex-direction: row;
                align-items: center;
                cursor: pointer;
                justify-content: space-between;
                border-radius: var(--control-border-radius);
                border: none;
                background-color: var(--bg-color);
                transition: background-color 280ms ease-in-out;
            }
            .button {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                padding: 6px;
                border: none;
                background: none;
                cursor: pointer;
                border-radius: var(--control-border-radius);
                line-height: 0;
            }
            .container:disabled {
                cursor: not-allowed;
            }
            .button ha-icon {
                font-size: var(--control-height);
                --mdc-icon-size: var(--control-icon-size);
                color: var(--icon-color);
                pointer-events: none;
            }
            .button:disabled ha-icon {
                color: var(--icon-color-disabled);
            }
            span {
                font-weight: bold;
                color: var(--text-color);
                margin: auto;
            }
            span.disabled {
                color: var(--text-color-disabled);
            }
            .selectoptions {
              position: relative;
              top: 0px;
              left: 0px;
              overflow: hidden;
              box-sizing: border-box;
              border-radius: 0 0 var(--control-border-radius);
              // background-color: var(--bg-color);
              background-color: darkgrey;
              transition: background-color 280ms ease-in-out;
              z-index: 1;
            }
            .selectoptions div {
              height: var(--control-height);
              display: flex;
              align-items: center;
              justify-content: space-around;
              padding: 0 calc(0.5 * var(--control-height)) 0 calc(0.5 * var(--control-height));
              cursor: pointer;
            }

            .selectoptions div:hover {
              background-color: lightgrey;
            }
        `;
    }
}

*/


