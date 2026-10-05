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
		const container = document.createElement("div")
		container.classList.add("dropdown-container")

		children[0].classList.add("dropdown-top")
		children[1].classList.add("dropdown-bottom")
		const clip = document.createElement("div")
		clip.classList.add("dropdown-clip")
		container.appendChild(children[0])
		clip.appendChild(children[0])
		container.appendChild(clip)

		this.replaceChildren(container)

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