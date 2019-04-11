// 墙
var makeWall = (canvas) => {
    let rect = new fabric.Rect({
        width: 200,
        height: 10,
        stroke: '#999',
        strokeWidth: 1,
        fill: 'white'
    })
    let line = new fabric.Line([10,4,190,4],{
        stroke: '#999',
        strokeWidth: 2,
        top: 4,
        left: 10
    })
    let mix = new fabric.Group([rect,line])
    canvas.add(mix)

    // 控制项设置  插件：fabric-customise-controls
    mix.setControlsVisibility({
        tl: false, 
        ml: true, 
        bl: false, 
        mb: false, 
        br: false,
        mr: true, 
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

module.exports = makeWall