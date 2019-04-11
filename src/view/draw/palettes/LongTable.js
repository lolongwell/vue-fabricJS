// 长桌
var makeLongTable = (canvas) => {
    let rect = new fabric.Rect({
        width: 60,
        height: 30,
        stroke: '#999',
        strokeWidth: 1,
        fill: 'white',
        left: 10,
        top: 50
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

module.exports = makeLongTable