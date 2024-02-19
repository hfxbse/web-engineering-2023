import '/components/RouterLink.js'

const fileIcons = {
    'dir': 'folder',
    'image/png': 'image',
    'video/mp4': 'movie',
    'text/plain': 'article',
    'audio/mpeg': 'music_note',
}

export default class FileElement extends HTMLElement {
    static get observedAttributes() {
        return ['file']
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = JSON.parse(newValue);

        if (this.shadow) this.displayEntry(this.shadow)
    }

    connectedCallback() {
        this.shadow = this.attachShadow({mode: 'closed'})
        this.shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link 
                rel="stylesheet" 
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,1,200" 
            />
            <router-link>
                <li>
                    <div class="material-symbols-outlined"></div>
                    <p></p>
                </li>
            </router-link>
            
            <style>
                li {
                    background: white;
                
                    display: flex;
                    flex-direction: column;
                    
                    align-items: center;
                    gap: 2px;
                    
                    text-align: center;
                    
                    text-decoration: none;
                    color: black;
                }
                
                                
                li:hover p, li:focus p {
                    text-decoration: underline;
                }
                
                div {
                    width: 5rem;
                    height: fit-content;
                
                    font-size: 5rem !important;
                }
                
                p {
                    font-size: 0.8rem;
                    word-break: break-all;
                }
            </style>
        `

        this.displayEntry(this.shadow)
    }

    displayEntry(shadow) {
        const name = this.file?.Name ?? "";

        shadow.querySelector('div').innerText = fileIcons[this.file?.Type] ?? "unknown_document"
        shadow.querySelector('p').innerText = name
        shadow.querySelector('router-link').setAttribute('href', `${location.pathname}/${name}`)
    }
}

customElements.define('file-element', FileElement)
