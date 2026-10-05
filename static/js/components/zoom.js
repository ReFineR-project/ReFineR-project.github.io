let triggerScroll = false
document.addEventListener("keydown", event => {
  triggerScroll = triggerScroll || event.ctrlKey
});

document.addEventListener("keyup", event => {
  triggerScroll = triggerScroll && event.ctrlKey
});

class VideoZoom extends HTMLElement{
  constructor(){
    super()
    this._scale = 5

  }

  _updateZoom(layerX, layerY){
    const zoomedVideo = this.querySelector(".zoom-video")
    const zoomTooltip = this.querySelector(".zoom-tooltip")
    const zoomCursor = this.querySelector(".zoom-cursor")

    const tooltip_size_x = zoomTooltip.parentNode.offsetWidth
    const tooltip_size_y = zoomTooltip.parentNode.offsetHeight
    
    const video_base_size_x = zoomedVideo.videoWidth
    const video_base_size_y = zoomedVideo.videoHeight

    const video_size_x = zoomedVideo.offsetWidth
    const video_size_y = zoomedVideo.offsetHeight

    let offsetTop = this._scale * layerY / video_size_x * video_base_size_x - Math.floor(tooltip_size_y / 2)
    let offsetLeft = this._scale * layerX / video_size_y * video_base_size_y - Math.floor(tooltip_size_x / 2)

    offsetLeft = Math.max(offsetLeft, 0)
    offsetLeft = Math.min(offsetLeft, video_base_size_x * this._scale - tooltip_size_x)
    offsetTop = Math.max(offsetTop, 0)
    offsetTop = Math.min(offsetTop, video_base_size_y * this._scale - tooltip_size_y)

    const clip = "rect("+ offsetTop.toString() + "px " + (offsetLeft + tooltip_size_x).toString() + "px " + (offsetTop + tooltip_size_y).toString() + "px " + offsetLeft.toString() + "px)"

    zoomTooltip.style.clipPath = clip
    zoomTooltip.style.marginLeft = (-offsetLeft).toString() + "px"
    zoomTooltip.style.marginTop = (-offsetTop).toString() + "px"
    zoomTooltip.width = this._scale * video_base_size_x

    zoomCursor.style.left = layerX + "px"
    zoomCursor.style.top =  layerY + "px"
    zoomCursor.style.width  = tooltip_size_x / this._scale * video_size_x / video_base_size_x + "px"
    zoomCursor.style.height  = tooltip_size_y / this._scale * video_size_y / video_base_size_y + "px"
  }

  connectedCallback(){
    this.innerHTML = `
    <div class="zoom-container">
      <div class="zoom-video-container">
        <div class="zoom-cursor"></div>
        <video aria-describedby="zoom_tooltip" class="zoom-video"  autoplay controls muted loop playsinline>
          <div class="zoom-cursor"></div>
          <source type="video/mp4"/> 
        </video>
      </div>
      <div role="tooltip" class = "zoom-tooltip-container">
        <video id = "zoom_tooltip" class="zoom-tooltip" muted loop playsinline>
        <source type="video/mp4"/>
        </video>
      </div>
    </div>
    `
    this.querySelectorAll("source").forEach(item => item.setAttribute("src", this.dataset.srcVideo))
    const link = document.createElement("link")
    link.setAttribute("rel", "stylesheet")
    const sheet = this.getAttribute("csssheet") ? this.getAttribute("csssheet") : "static/css/components/zoom.css"
    link.setAttribute("href", sheet)
    this.appendChild(link)

    const zoomedVideo = this.querySelector(".zoom-video")
    const zoomTooltip = this.querySelector(".zoom-tooltip")
    const zoomTooltipContainer = this.querySelector(".zoom-tooltip-container")
    const zoomCursor = this.querySelector(".zoom-cursor")
    const wheelFactor = 100
    const maxScale = 10
    const minScale = 1

    zoomedVideo.addEventListener("wheel", event => {
      if (!triggerScroll){
          return;
      }
      event.preventDefault();
      this._scale = this._scale + event.wheelDelta / wheelFactor
      this._scale = Math.min(this._scale, maxScale)
      this._scale = Math.max(this._scale, minScale)
      this._updateZoom(event.layerX, event.layerY)
    })

    zoomedVideo.addEventListener("mousemove", (event) => {
      this._updateZoom(event.layerX, event.layerY)
    })

    zoomedVideo.addEventListener("mouseenter", event => {
      zoomTooltipContainer.setAttribute("visible", "true")
      zoomCursor.style.visibility = "visible"
    })

    zoomedVideo.addEventListener("mouseleave", event => {
      zoomTooltipContainer.setAttribute("visible", "")
      zoomCursor.style.visibility = "hidden"
    })

    zoomedVideo.addEventListener("play", () => {
      zoomTooltip.play()
    })

    zoomedVideo.addEventListener("pause", () => {
      zoomTooltip.pause()
    })

    zoomedVideo.addEventListener("seeked", (event) => {
      zoomTooltip.currentTime = event.srcElement.currentTime
    })

    zoomedVideo.addEventListener("ratechange", (event) => {
      zoomTooltip.playbackRate = event.srcElement.playbackRate
    })
  }
}

customElements.define("video-zoom", VideoZoom)