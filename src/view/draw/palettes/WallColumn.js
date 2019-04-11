// 墙柱
var makeWallColumn = (canvas) => {
    let rect = new fabric.Rect({
        width: 30,
        height: 30,
        fill: 'black'
    })
    canvas.add(rect)

    // 控制项设置  插件：fabric-customise-controls
    rect.setControlsVisibility({
        tl: false, 
        ml: false, 
        bl: false, 
        mb: false, 
        br: false,
        mr: false, 
        tr: false, 
        mt: false,
        mtr: true
    })
    // fabric.Canvas.prototype.customiseControls({
    //     tl: {
    //         action: {
    //             'rotateByDegrees': 45
    //         }
    //     }
    // })
}

module.exports = makeWallColumn