export default class DownloadButton extends HTMLElement {
    constructor() {
        super();
        this.href = ""
    }

    static get observedAttributes() {
        return ['href']
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue

        if (this.link) this.displayDownload()
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link rel="stylesheet" href="/components/controls/controls.css">
            <link
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" 
            />
            <a>
                <control-element class="control">
                    <link rel="stylesheet" href="/components/controls/controls.css">
                    <span class="material-symbols-outlined icon">download</span>
                </control-element>
            </a>

        `

        this.link = shadow.querySelector('a')
        this.displayDownload()
    }

    displayDownload() {
        const pathPaths = location.pathname.split(/\/+/)

        this.link.setAttribute('download', pathPaths[pathPaths.length - 1])
        this.link.setAttribute('href', this.href)
    }
}

customElements.define('download-button', DownloadButton)
