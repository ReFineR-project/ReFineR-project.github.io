class Caroussel extends HTMLElement{
  constructor(){
    super()
    this.animationTime = 200
    this.scrollSpeed = 1.5
    this._options = 
    this._currentIdx = 0
    this._currentOffset = 0
    this._targetOffset = 0
    this._nitems = null
    this._animation = null
    this._touchStartX = null
    this._touchPreviousX = null
    this._internals = this.attachInternals()
  }

  get _itemContainer(){
    return this.querySelector(".caroussel-items")
  }

  get _selects(){
    return Array.from(this.querySelector(".caroussel-selects").children)
  }

  get animationOptions(){
    return {
        duration: this.animationTime,
        iterations: 1,
        fill: "forwards"
    }
  }

  get scrolling() {
      return this._internals.states.has("scrolling")
  }

  set scrolling(flag) {
      flag ? this._internals.states.add("scrolling") : this._internals.states.delete("scrolling")
  }

  move(amount, direction){
    if (this._animation){
        this._currentOffset = this._animation.currentTime / this.animationTime * (this._targetOffset - this._currentOffset) + this._currentOffset
        this._animation.cancel()
    }

    if ((direction > 0) && (this._currentIdx >= this._nitems)){
        this._currentOffset += this._nitems * this._off
        this._currentIdx -= this._nitems
    }
    else if ((direction < 0) && (this._currentIdx <= 0)){
        this._currentOffset -= this._nitems * this._off
        this._currentIdx += this._nitems
    }
    this._currentIdx += direction * amount
    this._targetOffset = -this._currentIdx * this._off
    const translate = [
        { transform: "translateX(" + this._currentOffset + "%)" }, 
        { transform: "translateX(" + this._targetOffset + "%)" },
    ];
    this._animation = this._itemContainer.animate(translate, this.animationOptions)

  }

  _updateSelect(idx){
    this._selects.forEach(select => {
        select.removeAttribute("caroussel-selected")
    })
    this._selects[(idx + this._nitems) % this._nitems].setAttribute("caroussel-selected", "")
  }
      
  _selectCallback(idx){
    if (idx > this._currentIdx){
        this.move(idx - this._currentIdx, 1)
    }
    else{
        this.move(this._currentIdx - idx, -1)
    }
    this._updateSelect(this._currentIdx)
  }

  _clipOffset(offset){
    if (offset > 0){
        offset -= this._nitems * this._off
    }
    else if (offset < -this._nitems * this._off){
        offset += this._nitems * this._off
    }
    return offset
  }

  _enterScroll(touchX){
    if (this._animation){
      this._currentOffset = this._animation.currentTime / this.animationTime * (this._targetOffset - this._currentOffset) + this._currentOffset
      this._animation.cancel()
      this._animation = null
    }
    this.scrolling = true
    this._touchStartX = touchX
    this._touchPreviousX = touchX
    this._itemContainer.setAttribute("caroussel-scrolling", "")
    this._itemContainer.style.transform = "translateX(" + this._currentOffset + "%)" 
    Array.from(this._itemContainer.children).forEach(child => child.style.pointerEvents = "none")
  }

  _scroll(touchMoveX){
    if (this._animation){
      this._currentOffset = this._animation.currentTime / this.animationTime * (this._targetOffset - this._currentOffset) + this._currentOffset
      this._animation.cancel()
      this._animation = null
    }

    let offset = this.scrollSpeed * (touchMoveX - this._touchStartX) / this._itemContainer.offsetWidth * 100 + this._currentOffset
    offset = this._clipOffset(offset)
    let idx = -Math.round(offset / this._off)
    this._updateSelect(idx)
    this._itemContainer.style.transform = "translateX(" + offset + "%)" 

  }

  _exitScroll(touchMoveX){
    this.scrolling = false
    let offset = this.scrollSpeed * (touchMoveX - this._touchStartX) / this._itemContainer.offsetWidth * 100 + this._currentOffset
    offset = this._clipOffset(offset)

    let idx = -Math.round(offset / this._off)
    this._currentOffset = offset
    this._itemContainer.removeAttribute("caroussel-scrolling")
    this._selectCallback(idx)
    Array.from(this._itemContainer.children).forEach(child => child.style.pointerEvents = "")
  }

  _get_nshow(){
    if (this._min_width < 0){
      return this._max_nshow
    }
    let nshow = Math.floor((this.offsetWidth + this._gap) / (this._min_width + this._gap))
    nshow = Math.max(nshow, 1)
    if (this._max_nshow > 0){
      return Math.min(nshow, this._max_nshow)
    }
    return nshow
  }

  _update_show(nshow){
    this._nshow = nshow
    this._itemContainer.style.width = "calc(" + (2 * this._nitems / this._nshow ) + " * (100% + " + this._gap + "px))"
  }

  connectedCallback(){

    // Initialize template
    const container = document.createElement("div")
    container.classList.add("caroussel-container")
    container.innerHTML = `
    <div class = "caroussel-left">
        <i class="fa fa-caret-left fa-lg caroussel-arrow"></i>
      </div>
      <div class="caroussel-slider">
          <div class="caroussel-items">
          </div>
      </div>
      <div class = "caroussel-right">
        <i class="fa fa-caret-right fa-lg caroussel-arrow"></i>
      </div>
      <div class="caroussel-selects">
    </div>
    `

    const children = this.children
    const containerItems = container.querySelector(".caroussel-items")
    this._nitems = children.length
    
    for (let i = 0; i < this._nitems; i++) {
      this.appendChild(children[i].cloneNode(true))
    }

    for (let i = 0; i < 2 * this._nitems; i++) {
      const item = document.createElement("div")
      item.classList.add("caroussel-item")
      item.appendChild(children[0])
      containerItems.appendChild(item)
    }

    this.replaceChildren(container)

    // Initialize caroussel
    const sliderContainer = this.querySelector(".caroussel-slider")
    const selectsContainer = this.querySelector(".caroussel-selects")
    const btnLeft = this.querySelector(".caroussel-left")
    const btnRight = this.querySelector(".caroussel-right")
    const caroussel = this.querySelector(".caroussel-container")

    this._gap = 10
    this._min_width = this.getAttribute("elements-min-width")
    this._min_width ??= -1
    this._min_width = parseInt(this._min_width)
    this._max_nshow = this.getAttribute("max-show-items")
    this._max_nshow ??= -1
    this._max_nshow = parseInt(this._max_nshow)
    if (this._max_nshow < 0 && this._min_width < 0){
      this._max_nshow = 3
    }
    this._nshow = this._get_nshow()

    this._itemContainer.style.width = "calc(" + (2 * this._nitems / this._nshow ) + " * (100% + " + this._gap + "px))"
    this._off = 1 / (2 * this._nitems) * 100
    for (let i = 0; i < this._nitems; i++) {
      let select = document.createElement("div")
      select.classList.add("caroussel-select")
      if (i == 0){
          select.setAttribute("caroussel-selected", "")
      }
      select.addEventListener("click", () => this._selectCallback(i))
      selectsContainer.appendChild(select)
    }

    // Register events
    this.addEventListener("dragstart", (event) => {
      event.preventDefault();
    })

    btnLeft.addEventListener("click", () =>{
      this._selectCallback(this._currentIdx - 1)
    })

    btnRight.addEventListener("click", () =>{
      this._selectCallback(this._currentIdx + 1)
    })
    
    let touching = false
    let clicking = false
    this._itemContainer.addEventListener("touchstart", (event) => {
      if (this.scrolling || clicking){
        return
      }
      touching = true
      this._enterScroll(event.changedTouches[0].clientX)
    })

    this._itemContainer.addEventListener("touchmove", (event) => {
      if (clicking){
        return
      }
      let touchMoveX = event.changedTouches[0].clientX
      if (this._touchPreviousX && Math.abs(touchMoveX - this._touchPreviousX) < 5){
        this._touchPreviousX = touchMoveX
        return
      }
      event.preventDefault()
      this._scroll(touchMoveX)
    })

    this._itemContainer.addEventListener("touchend", (event) => {
      if (event.changedTouches.length > 1 || clicking){
        return
      }
      this._exitScroll(event.changedTouches[0].clientX)
      touching = false
    })

    this._itemContainer.addEventListener("mousedown", (event) => {
      if (this.scrolling || touching){
        return
      }
      clicking = true
      this._enterScroll(event.x)
      event.stopPropagation()
    }, true)

    this._itemContainer.addEventListener("mousemove", (event) => {
      if (!this.scrolling || touching){
        return
      }
      this._scroll(event.x)
    })

    this._itemContainer.addEventListener("mouseup", (event) => {
      if (!this.scrolling || touching){
        return
      }
      clicking = false
      this._exitScroll(event.x)
    })

    this._itemContainer.addEventListener("mouseleave", (event) => {
      if (!this.scrolling || touching){
        return
      }
      clicking = false
      this._exitScroll(event.x)
    })
  
    const resizeObserver = new ResizeObserver(() => {
      this._update_show(this._get_nshow())
    })
    resizeObserver.observe(this)

    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList){
        if (mutation.type === "attributes"){
          if(mutation.attributeName == "max-show-items"){
            const value = Math.max(parseInt(mutation.target.getAttribute(mutation.attributeName)), 1)
            this._max_nshow = value
          }
          else if (mutation.attributeName == "elements-min-width"){
            const value = Math.max(parseInt(mutation.target.getAttribute(mutation.attributeName)), 0)
            this._min_width = value
          }
          this._update_show(this._get_nshow())  
        }
      }
    });
    const options = {attributes: true, childList: false, subtree: false}
    observer.observe(this, options);
  }
}

customElements.define("scroll-caroussel", Caroussel)