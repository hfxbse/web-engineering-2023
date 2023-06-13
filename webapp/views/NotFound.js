class NotFound extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})

        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <h1>404 - Not found</h1>
            
            <style>
                :host {
                    display: grid;
                    width: 100vw;
                    height: 100vh;
                    
                    align-items: center;
                    justify-content: center;
                }
            </style>
        `
    }
}

customElements.define('not-found', NotFound)
