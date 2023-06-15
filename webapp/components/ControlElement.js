import '/components/SpinnerIndicator.js'

export default class ControlElement extends HTMLElement {
    constructor() {
        super();
        this.working = false
    }

    static get observedAttributes() {
        return ['working']
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue === "working" || newValue === "true";

        console.dir(this.working)

        if (this.content) this.displayContent()
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <div>
                <slot></slot>
            </div>
            
            <style>
                :host {
                    display: block;
                    height: fit-content;
                }
            
                div {
                    display: grid;
                    place-items: center;
                    
                    border: 1px solid black;
                    border-radius: 25px;
                    padding: calc(var(--padding) / 2);
                }
                
                div:hover, div:focus, div:disabled, .working {
                    color: var(--highlight-color);
                    border-color: var(--highlight-color)
                }
                
                .working {
                    opacity: 0.6;
                }
            </style>
        `

        this.content = shadow.querySelector('div')
        this.displayContent()
    }

    displayContent() {
        Array.from(this.content.children).forEach(child => this.content.removeChild(child));

        let content;

        if (this.working) {
            content = document.createElement('spinning-indicator')
            this.content.setAttribute('class', 'working')
        } else {
            content = document.createElement('slot')
            this.content.removeAttribute('class')
        }

        this.content.appendChild(content)
    }
}

customElements.define('control-element', ControlElement)
