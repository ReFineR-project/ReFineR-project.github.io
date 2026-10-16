class VideoLazy extends HTMLElement{
	constructor(){
			super()
	}

	launchLoading(){
		const videoSrc = this.dataset.srcVideo
		const container = this.querySelector(".lazy-container")
		const thumb = this.querySelector(".lazy-content")
		const area = this.querySelector(".lazy-click-area")
		const loader = this.querySelector(".loader")
		const zoomVideo = this.hasAttribute("video-zoom")

		const slot = this.querySelector(".lazy-slot")
		let video
		if (!zoomVideo){
			slot.innerHTML = `
			<video autoplay muted controls loop playsinline class = "lazy-content">
				<source type = "video/mp4">
			</video>
			`
			video = slot.querySelector("video")
		}
		else{
			video = document.createElement("video-zoom")
			video.setAttribute("data-src-video", videoSrc)
			slot.appendChild(video)
		}

		loader.style.display = "block"
		video.style.opacity = 0

		video.addEventListener("loadeddata", () => {
			video.style.opacity = 1
			thumb.style.opacity = 0
			thumb.style.display = "none"
			loader.style.display = "none"
		})

		if (!zoomVideo){
			video.querySelector("source").setAttribute("src",videoSrc)
		}
		else{
			video.setAttribute("data-src-video", videoSrc)
		}

		area.style.display = "none"
	}
	
	connectedCallback(){
		const thumbSrc = this.dataset.srcThumb
		this.innerHTML = `
			<div class = "lazy-container">
				<div class = "lazy-slot"></div>
				<img src = ${thumbSrc} class = "lazy-content">
				<div class="loader" style = "display: none"></div>
				<div class = "lazy-click-area">
					<div class="lazy-button">
						<i class="fa fa-caret-right fa-lg lazy-arrow"></i>
					</div>
				</div>
			</div>
		`

		const autoplay = this.hasAttribute("autoplay")
		const area = this.querySelector(".lazy-click-area")

		if (autoplay){
			this.launchLoading()
		}
		else{
			area.addEventListener("click", () => {
				this.launchLoading()
			})
			area.addEventListener("touchstart", () => {
				this.launchLoading()
			})
		}

	}
}

customElements.define("video-lazy", VideoLazy)