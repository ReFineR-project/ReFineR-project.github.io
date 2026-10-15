class DropContent extends HTMLElement{
  static observedAttributes = ["open"]
  constructor(){
		super()
		this._internals = this.attachInternals()
		this._bindUpdateStyle = this._updateStyle.bind(this)
		this.toggle = this._toggle.bind(this)
  }
  
  _toggle(){
		this._bindUpdateStyle(this.open ? null : "")
  }

  _updateStyle(value){
		this.open = value == ""
		const bottom = this.querySelector(".dropdown-bottom")
		if (!bottom){
			return
		}

		this.open ? bottom.setAttribute("open", "") : bottom.removeAttribute("open")
  }

  attributeChangedCallback(name, old, value){
		if (name == "open"){
			this._bindUpdateStyle(value)
		}
  } 

  get open() {
		return this._internals.states.has("open")
  }

  set open(flag) {
		flag ? this._internals.states.add("open") : this._internals.states.delete("open")
  }

  connectedCallback(){
		const children = this.children
		const top = children[0].cloneNode(true)
		top.classList.add("dropdown-top")

		const bottom = children[1].cloneNode(true)
		bottom.classList.add("dropdown-bottom")
		this.innerHTML = `
		<div class = "dropdown-container">
			<div class = "dropdown-clip">
				<div class = "dropdown-padding">
				</div>
			</div>
		</div>
		`

		const container = this.querySelector(".dropdown-container")
		const padding = this.querySelector(".dropdown-padding")
	
		container.appendChild(top)
		padding.appendChild(bottom)

		const toggles = this.querySelectorAll(".dropdown-toggle")
		Array.from(toggles).forEach(toggle => {
			toggle.addEventListener("click", (event) => {
				event.stopPropagation()
				this.toggle()
				this.open ? toggle.setAttribute("open", "") : toggle.removeAttribute("open")
			})
		});

		document.addEventListener("click", () => {
			if (this.open){
				this.toggle()
				Array.from(toggles).forEach(toggle => { 
					this.open ? toggle.setAttribute("open", "") : toggle.removeAttribute("open")
				})
			}
		})
		this._bindUpdateStyle(this.getAttribute("open"))
  }
}

customElements.define("drop-content", DropContent)