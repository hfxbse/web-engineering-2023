export default class ErrorMessage extends HTMLElement {
    static get observedAttributes() {
        return ['message'];
    }

    attributeChangedCallback(key, oldValue, newValue) {
        if (oldValue === newValue) return;

        if(key === "message") {
            this.text.innerText = newValue;
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <!--suppress HtmlUnknownTarget -->
            <link rel="stylesheet" href="./base.css">
            <p></p>
            
            <style>
                p {
                    color: var(--error-color);
                    height: 1rem;
                }
            </style>
        `

        this.text = shadow.querySelector('p');
        this.text.innerText = this.message ?? "";
    }
}

customElements.define('error-message', ErrorMessage)
