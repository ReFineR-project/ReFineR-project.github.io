
let triggerScroll = false
document.addEventListener("keydown", event => {
    triggerScroll = triggerScroll || event.ctrlKey
});

document.addEventListener("keyup", event => {
    triggerScroll = triggerScroll && event.ctrlKey
});

Array.from(document.getElementsByClassName("zoom-container")).forEach(
    zooms => {
        let scale = 5
        const zoomedVideo = zooms.querySelector(".zoom-video")
        const zoomTooltip = zooms.querySelector(".zoom-tooltip")
        const zoomTooltipContainer = zooms.querySelector(".zoom-tooltip-container")
        const zoomCursor = zooms.querySelector(".zoom-cursor")
        const wheelFactor = 100
        const maxScale = 10
        const minScale = 1

        zoomedVideo.addEventListener("wheel", event => {
            if (!triggerScroll){
                return;
            }
			event.preventDefault();
            scale = scale + event.wheelDelta / wheelFactor
            scale = Math.min(scale, maxScale)
            scale = Math.max(scale, minScale)
            updateZoom(event.layerX, event.layerY)
        })

        function updateZoom(layerX, layerY){
            let tooltip_size_x = zoomTooltip.parentNode.offsetWidth
            let tooltip_size_y = zoomTooltip.parentNode.offsetHeight
            
            let video_base_size_x = zoomedVideo.videoWidth
            let video_base_size_y = zoomedVideo.videoHeight

            let video_size_x = zoomedVideo.offsetWidth
            let video_size_y = zoomedVideo.offsetHeight

            let offsetTop = scale * layerY / video_size_x * video_base_size_x - Math.floor(tooltip_size_y / 2)
            let offsetLeft = scale * layerX / video_size_y * video_base_size_y - Math.floor(tooltip_size_x / 2)

            offsetLeft = Math.max(offsetLeft, 0)
            offsetLeft = Math.min(offsetLeft, video_base_size_x * scale - tooltip_size_x)
            offsetTop = Math.max(offsetTop, 0)
            offsetTop = Math.min(offsetTop, video_base_size_y * scale - tooltip_size_y)

            let clip = "rect("+ offsetTop.toString() + "px " + (offsetLeft + tooltip_size_x).toString() + "px " + (offsetTop + tooltip_size_y).toString() + "px " + offsetLeft.toString() + "px)"

            zoomTooltip.style.clipPath = clip
            zoomTooltip.style.marginLeft = (-offsetLeft).toString() + "px"
            zoomTooltip.style.marginTop = (-offsetTop).toString() + "px"
            zoomTooltip.width = scale * video_base_size_x

            zoomCursor.style.left = event.layerX + "px"
            zoomCursor.style.top =  event.layerY + "px"
            zoomCursor.style.width  = tooltip_size_x / scale * video_size_x / video_base_size_x + "px"
            zoomCursor.style.height  = tooltip_size_y / scale * video_size_y / video_base_size_y + "px"
        }

        zoomedVideo.addEventListener("mousemove", (event) => {
            updateZoom(event.layerX, event.layerY)
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
)