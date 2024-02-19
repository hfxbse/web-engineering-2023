import router from "/router/Router.js";

export default class RouterLink extends HTMLElement {
    constructor() {
        super();
        this.href = ''
    }

    static get observedAttributes() {
        return ['href']
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue

        if (this.anchor) this.anchor.setAttribute('href', this.href)
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css"/>
            <a><slot></slot></a>
        `

        this.anchor = shadow.querySelector('a');
        this.anchor.setAttribute('href', this.href)
        this.anchor.addEventListener('click', (event) => {
            event.preventDefault();
            router.push(this.href)
        })
    }
}

customElements.define('router-link', RouterLink)
