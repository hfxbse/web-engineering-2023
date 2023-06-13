export default class SpinnerIndicator extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <div></div>
            <style>
                div {
                    width: 1rem;
                    height: 1rem;
                    
                    border-radius: 50%;
                    border: calc(var(--padding) / 6) solid var(--highlight-color);
                    border-right-color: transparent;
                    animation: spin 600ms infinite linear;
                }
                
                @keyframes spin {
                    0% {
                        transform: rotate(0);
                    }
                    
                    100% {
                        transform: rotate(360deg);
                    }
                }
            </style>
        `
    }
}

customElements.define('spinning-indicator', SpinnerIndicator)
