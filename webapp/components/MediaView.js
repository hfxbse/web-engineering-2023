export default class MediaView extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'href']
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;

        if (this.container) this.displayMedia()
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <style>
                :host {
                    display: grid;
                    height: 100vh;
                    width: 100vw;
                    
                    place-items: center;
                    background: black;
                }
                
                img, video, audio {
                    max-height: 100vh;
                    max-width: 100vw;
                }
            </style>
        `

        this.container = shadow
        this.displayMedia()
    }

    displayMedia() {
        this.container.removeChild(this.container.lastChild)

        const element = this.mediaElement();
        element.setAttribute('src', this.href ?? '')
        element.setAttribute('controls', 'controls')

        this.container.appendChild(element)
    }

    mediaElement() {
        if (this.type?.startsWith('image/') ?? false) return document.createElement('img')
        else if (this.type?.startsWith('video/') ?? false) return document.createElement('video')
        else if (this.type?.startsWith('audio/') ?? false) return document.createElement('audio')
    }
}

customElements.define('media-view', MediaView)