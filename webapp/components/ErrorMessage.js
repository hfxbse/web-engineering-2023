export default class ErrorMessage extends HTMLElement {
    static get observedAttributes() {
        return ['message'];
    }

    attributeChangedCallback(key, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (key === "message") {
            if (this.text) this.text.innerText = newValue;
            else this.message = newValue
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <p></p>
            
            <style>
                p {
                    color: var(--error-color);
                    min-height: 1rem;
                }
            </style>
        `

        this.text = shadow.querySelector('p');
        this.text.innerText = this.message ?? "";
    }
}

customElements.define('error-message', ErrorMessage)
