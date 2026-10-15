class ImageCompare extends HTMLElement{
  constructor(){
    super()
    this._touchStartX = null
    this._baseWidth = null
    this._touchPreviousX = null
    this._flickerSpeed = 500
    this._afterFront = true

  }

  _update(posX){
		const before = this.querySelector('.compare-before');
		const after = this.querySelector('.compare-after');
		const handle = this.querySelector('.compare-handle');

		posX = posX / before.offsetWidth * 100
		after.style.width = posX.toString() + "%";
		handle.style.left = posX.toString() + "%";
  }


  _flicker(){
		const after = this.querySelector('.compare-after');
    if (this.afterFront){
      after.style.zIndex = 1
    }
    else{
      after.style.zIndex = -1
    }
    this.afterFront = !this.afterFront

  }
  connectedCallback(){
    // const shadow = this.attachShadow({mode: "open"})
    this.innerHTML = `
    <div class="compare-container">
      <div class = "compare-control">
        <label>
          <input type="checkbox" class = "check-regular"/>
          Activate flicker
        </label>
      </div>
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
    const check = this.querySelector("input")

    before.querySelector("img").setAttribute("src", this.dataset.srcBefore)
    after.querySelector("img").setAttribute("src", this.dataset.srcAfter)
    this.querySelector(".compare-before-label").textContent = this.dataset.labelBefore
    this.querySelector(".compare-after-label").textContent = this.dataset.labelAfter
    after.style.width = "50%"
    handle.style.left = "50%"
    
    let flickeringInterval
    check.addEventListener("change", (event) => {
      const value = event.target.checked
      if (value){
        handle.style.display = "none"
        this._update(before.offsetWidth)
        this._flicker()
        flickeringInterval = setInterval(() => {
          this._flicker()
        }, this._flickerSpeed)
      }
      else{
        if (flickeringInterval){
          clearInterval(flickeringInterval)
        }
        handle.style.display = ""
        after.style.zIndex = 1
        this._update(before.offsetWidth / 2)
        flickeringInterval = null
        this.afterFront = true
      }
    })
    compare.addEventListener("dragstart", (event) => {
      event.preventDefault();
    })

    compare.addEventListener('mousemove', (e) => {
      if (flickeringInterval){
        return
      }
      const posX = Math.max(0, e.layerX);     
      this._touchStartX = posX
      this._update(posX)
    })

    compare.addEventListener('touchmove', (e) => {
      if (flickeringInterval){
        return
      }
      let touchMoveX = e.changedTouches[0].clientX

      if (this._touchPreviousX && Math.abs(touchMoveX - this._touchPreviousX) > 100){
          this._touchPreviousX = touchMoveX
          return
      }        

      const posX = Math.max(this._baseWidth + touchMoveX - this._touchStartX, 0)
      this._touchPreviousX = touchMoveX
      this._update(posX)
    })

    compare.addEventListener("touchstart", (e) => {
      if (flickeringInterval){
        return
      }
      this._touchStartX = e.changedTouches[0].clientX
      this._baseWidth = after.offsetWidth
    })
  }
}

customElements.define("image-compare", ImageCompare)