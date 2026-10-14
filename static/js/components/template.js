class ComponentTemplate extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.innerHTML = `
    <div></div>
    `
  }
}

customElements.define("template-component", ComponentTemplate)
