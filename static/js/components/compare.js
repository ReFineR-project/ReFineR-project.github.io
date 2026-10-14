class ImageCompare extends HTMLElement{
  constructor(){
    super()
    this._touchStartX = null
    this._baseWidth = null
    this._touchPreviousX = null
  }

  _update(posX){
		const before = this.querySelector('.compare-before');
		const after = this.querySelector('.compare-after');
		const handle = this.querySelector('.compare-handle');

		posX = posX / before.offsetWidth * 100
		after.setAttribute('style', "width:" + posX + "%;");
		handle.setAttribute('style', "left:" + posX + "%;");
  }

  connectedCallback(){
    // const shadow = this.attachShadow({mode: "open"})
    this.innerHTML = `
    <div class="compare-container">
			<div class="compare-before">
					<img>
			</div>
			<div class="compare-after">
					<img>
			</div>
			<div class="compare-after-label compare-label">
			</div>
			<div class="compare-before-label compare-label">
			</div>

			<div class="compare-handle">
					<i class="fa fa-caret-left fa-lg compare-arrow"></i>
					<i class="fa fa-caret-right fa-lg compare-arrow"></i>
			</div>
    </div>
    `

    const compare = this.querySelector(".compare-container")
    const after = this.querySelector('.compare-after');
    const before = this.querySelector('.compare-before');
    const handle = this.querySelector('.compare-handle');

    before.querySelector("img").setAttribute("src", this.dataset.srcBefore)
    after.querySelector("img").setAttribute("src", this.dataset.srcAfter)
    this.querySelector(".compare-before-label").textContent = this.dataset.labelBefore
    this.querySelector(".compare-after-label").textContent = this.dataset.labelAfter
    after.setAttribute('style', "width: 50%;");
    handle.setAttribute('style', "left: 50%;");
    
    compare.addEventListener("dragstart", (event) => {
      event.preventDefault();
    })

    compare.addEventListener('mousemove', (e) => {
        const posX = Math.max(0, e.layerX);     
        this._touchStartX = posX
        this._update(posX)
    })

    compare.addEventListener('touchmove', (e) => {
        e.preventDefault()
        let touchMoveX = e.changedTouches[0].clientX
        if (this._touchPreviousX && Math.abs(touchMoveX - this._touchPreviousX) > 50){
            this._touchPreviousX = touchMoveX
            return
        }
        
        const posX = Math.max(this._baseWidth + touchMoveX - this._touchStartX, 0)
        this._touchPreviousX = touchMoveX
        this._update(posX)
    })

    compare.addEventListener("touchstart", (e) => {
        this._touchStartX = e.changedTouches[0].clientX
        this._baseWidth = after.offsetWidth
    })
  }
}

customElements.define("image-compare", ImageCompare)