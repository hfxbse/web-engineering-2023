export default class FileList extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <ul>
                <slot></slot>
            </ul>
            <style>
                ul {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(11ch, 1fr));
                    
                    gap: var(--padding);
                    padding: var(--padding);
                }
            </style>
        `
    }
}

customElements.define('file-list', FileList)
