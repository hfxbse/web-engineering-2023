import {authorizationHeader, validateSession} from "/Session.js";
import {currentEntryPath} from "/Path.js";
import '/components/controls/ControlElement.js'
import '/components/BaseDialog.js'

export default class CreateButton extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'closed'})
        shadow.innerHTML = `
            <link rel="stylesheet" href="/base.css">
            <link rel="stylesheet" href="/components/controls/controls.css">
            <link 
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" 
            />
            <button>
                <control-element class="control">
                    <link rel="stylesheet" href="/components/controls/controls.css">
                    <span class="material-symbols-outlined icon">add</span>
                </control-element>
            </button>
            
            <base-dialog>
                <link rel="stylesheet" href="/base.css">
                <link 
                    rel="stylesheet" 
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,1,200" 
                />
                <form>
                    <label for="entry-name" class="text-field-label">Entry name</label>
                    <input id="entry-name" placeholder="File or directory name">
                    <p class="text-field-label">Entry type</p>
                    <div class="type-selection">
                        <input type="radio" name="type" value="dir" id="directory" checked>
                        <label for="directory">
                            <span class="material-symbols-outlined icon">folder</span>
                            <span>Directory</span>
                        </label>
                        <input type="radio" name="type" value="text/plain;" id="text-file">
                        <label for="text-file">
                            <span class="material-symbols-outlined icon">article</span>
                            <span>Text file</span>
                        </label>
                    </div>
                    <div class="submit">
                        <button disabled>Save</button>
                        <button>Cancel</button>
                    </div>
                    <error-message></error-message>
                </form>
            </base-dialog>
            
            <style>
                button:not(form button){
                    padding: 0;
                }
                
                control-element * {
                    font-weight: bold !important;
                }
            
                form button, input[type="radio"] + label {
                    border: 1px solid !important;
                    border-color: black;
                    
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    
                    gap: calc(var(--padding) / 4);
                }
                
                input[type="radio"] + label  {
                    height: 1rem;
                }
                
                .submit > :first-child {
                    color: white;
                    background: var(--highlight-color);
                    
                    border: none;
                    margin-bottom: calc(var(--padding) / 4);
                }
                
                .submit button {
                    width: 100%;
                }
                
                form {
                    padding: calc(var(--padding) / 2) 0;
                }
                
                form > div > * {
                    flex: 1;
                    text-align: center;
                }
                
                form > div:not(.submit) {
                    display: flex;
                    justify-content: space-evenly;
                    
                    gap: calc(var(--padding) / 2);
                }
                
                form > div > input {
                    display: none;
                }
                
                .submit {
                    margin-top: var(--padding);
                }
                
                p {
                    margin-top: calc(var(--padding) / 2);
                    margin-bottom: calc(var(--padding) / 4);
                }
                
                input:checked + label, input:checked + label *  {
                    color: var(--highlight-color);
                }
                
                input:checked + label {
                    border-color: var(--highlight-color);
                }
                
                error-message {
                    display: block;
                    margin-top: calc(var(--padding) / 2);
                }
                
                error-message:empty {
                    display: none;
                }
            </style>
        `

        shadow.querySelectorAll('form button').forEach(button =>
            button.addEventListener('click', (e) => e.preventDefault())
        )

        const button = shadow.querySelector('button:not(form button)')
        const dialog = shadow.querySelector('base-dialog')
        button.addEventListener('click', () => dialog.showModal())

        const errorMessage = shadow.querySelector('error-message')
        const nameInput = shadow.querySelector('#entry-name')
        const submitButton = shadow.querySelector('.submit :first-child')
        const cancelButton = shadow.querySelector('.submit :last-child')

        cancelButton.addEventListener('click', () => this.closeDialog(dialog, errorMessage, nameInput))

        nameInput.addEventListener('input', () => {
            if(/\//.test(nameInput.value)) {
                errorMessage.innerText = 'Entry name cannot contain /'
                submitButton.setAttribute('disabled', 'disabled')
            }
            else if (nameInput.value.length < 1) {
                errorMessage.innerText = 'Entry name cannot be empty.'
                submitButton.setAttribute('disabled', 'disabled')
            } else {
                errorMessage.innerText = ''
                submitButton.removeAttribute('disabled')
            }
        })

        submitButton.addEventListener('click', async () => {
            submitButton.setAttribute('disabled', 'disabled')
            cancelButton.setAttribute('disabled', 'disabled')
            errorMessage.innerText = ""

            try {
                await this.createEntry(
                    nameInput.value,
                    shadow.querySelector('.type-selection > input:checked').value
                )

                this.closeDialog(dialog, errorMessage, nameInput)
            } catch (e) {
                errorMessage.innerText = e.message
            }

            submitButton.removeAttribute('disabled')
            cancelButton.removeAttribute('disabled')
        })
    }

    closeDialog(dialog, errorMessage, input) {
        input.value = ""
        errorMessage.innerText = ""
        dialog.close()
    }

    async createEntry(name, type) {
        const nameParts = name.split(/\/+/)

        const form = new FormData()
        form.append('type', type)
        if (type.startsWith('text/')) form.append('newFile', new File(
            ["Your new text file :)\n"],    // The file service won't recognise an empty text file as text file
            nameParts[nameParts.length - 1], {type: type})
        )

        let response
        try {
            response = await fetch(`http://localhost:8080/${currentEntryPath()}/${name}`, {
                method: 'POST',
                body: form,
                ...authorizationHeader()
            })
        } catch (e) {
            throw {message: `Could not create ${name}.`}
        }


        if (!validateSession(response)) return
        if (!response.ok) throw {message: `Failed to create ${name}.`}

        this.dispatchEvent(new CustomEvent('created'))
    }
}

customElements.define('create-button', CreateButton)
