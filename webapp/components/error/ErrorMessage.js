export default class ErrorMessage extends HTMLElement {


    static get observedAttributes() {
        return ['centered'];
    }

    attributeChangedCallback(key, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (key === "centered") {
            this.centered = newValue === 'centered' || newValue === 'true'
            this.applyStyle()
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0"
            />
            <div>
                <span class="material-symbols-outlined">
                    error
                </span>
                <div>
                    <slot></slot>            
                </div>
            </div>
            
            
            <style>
                * {
                    color: var(--error-color);
                }
                
                :host {
                    width: 100%;
                }
                
                :host > div  {
                    display: flex;
                    min-height: 1rem;
                    gap: calc(var(--padding) / 2);
                    align-items: center;
                    
                    container-type: inline-size;
                }
                
                .centered {
                    justify-content: center;
                }
            </style>
        `

        this.content = shadow.querySelector(':host > div');
        this.applyStyle()
    }

    applyStyle() {
        if (this.content) {
            if (this.centered) {
                this.content.setAttribute('class', 'centered')
            } else {
                this.content.removeAttribute('class')
            }
        }
    }
}

customElements.define('error-message', ErrorMessage)
