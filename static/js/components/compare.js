Array.from(document.getElementsByClassName("compare-container")).forEach(compare => {
    const after = compare.querySelector('.compare-after');
    const before = compare.querySelector('.compare-before');
    const handle = compare.querySelector('.compare-handle');

    after.setAttribute('style', "width: 50%;");
    handle.setAttribute('style', "left: 50%;");

    function update(posX){
        posX = posX / before.offsetWidth * 100
        after.setAttribute('style', "width:" + posX + "%;");
        handle.setAttribute('style', "left:" + posX + "%;");
    }
    
    compare.addEventListener('mousemove', (e) => {
        let posX = Math.max(0, e.layerX);     
        touchStartX = posX
        update(posX)
    })

    let touchStartX, baseWidth, touchPreviousX
    compare.addEventListener('touchmove', (e) => {
        let touchMoveX = e.changedTouches[0].clientX
        if (touchPreviousX && Math.abs(touchMoveX - touchPreviousX) > 50){
            touchPreviousX = touchMoveX
            return
        }
        
        posX = Math.max(baseWidth + touchMoveX - touchStartX, 0)
        touchPreviousX = touchMoveX
        update(posX)
    })

    compare.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX
        baseWidth = after.offsetWidth
    })
})