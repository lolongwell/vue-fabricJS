// 门
var makeDoor = (canvas) => {
    let rect = new fabric.Rect({
        width: 30,
        height: 50,
        stroke: '#999',
        strokeWidth: 1,
        fill: 'white',
        left: 10,
        top: 50
    })
    let rect1 = new fabric.Rect({
        width: 20,
        height: 40,
        stroke: '#999',
        strokeWidth: 1,
        fill: 'white',
        left: 15,
        top: 55
    })
    let rect2 = new fabric.Rect({
        width: 1,
        height: 6,
        stroke: '#999',
        strokeWidth: 1,
        fill: '#999',
        left: 30,
        top: 72
    })
    let mix = new fabric.Group([rect, rect1,rect2])
    canvas.add(mix)

    // 控制项设置  插件：fabric-customise-controls
    mix.setControlsVisibility({
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

module.exports = makeDoor