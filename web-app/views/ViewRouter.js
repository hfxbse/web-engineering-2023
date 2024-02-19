import router from "/router/Router.js";


export default class ViewRouter extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css"/>
        `

        router.pushCallback = () => this.applyView(shadow)
        window.addEventListener('popstate', () => this.applyView(shadow))
        this.applyView(shadow)
    }

    applyView(shadow) {
        Array.from(shadow.children).forEach(child => shadow.removeChild(child))
        shadow.appendChild(router.route())
    }
}

customElements.define('view-router', ViewRouter)
