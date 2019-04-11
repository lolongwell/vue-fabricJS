// 会议桌
var makeMeetingTable = (canvas) => {
    let rectCenter = new fabric.Rect({
        width: 200,
        height: 60,
        hasBorders: true,
        fill: '#704332',
        left: 50,
        top: 50
    })
    let rectLeft = new fabric.Rect({
        width: 10,
        height: 30,
        fill: '#704332',
        left: 40,
        top: 65
    })
    let rectTop1 = new fabric.Rect({
        width: 40,
        height: 10,
        fill: '#704332',
        left: 80,
        top: 40
    })
    let rectTop2 = new fabric.Rect({
        width: 40,
        height: 10,
        fill: '#704332',
        left: 180,
        top: 40
    })
    let rectBottom1 = new fabric.Rect({
        width: 40,
        height: 10,
        fill: '#704332',
        left: 80,
        top: 110
    })
    let rectBottom2 = new fabric.Rect({
        width: 40,
        height: 10,
        fill: '#704332',
        left: 180,
        top: 110
    })
    let rectRight = new fabric.Rect({
        width: 10,
        height: 30,
        fill: '#704332',
        left: 250,
        top: 65
    })
    let mix = new fabric.Group([rectCenter, rectLeft, rectTop1, rectTop2, rectBottom1, rectBottom2, rectRight])
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

module.exports = makeMeetingTable