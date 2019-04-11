// 文件柜
var makeFileCabinets = (canvas) => {
    let rect = new fabric.Rect({
        width: 30,
        height: 60,
        stroke: '#999',
        strokeWidth: 1,
        fill: 'white',
        left: 10,
        top: 50
    })
    let line1 = new fabric.Line([10,50,40,110],{
        fill: '#999',
        stroke: '#999',
        strokeWidth: 1
    })
    let line2 = new fabric.Line([10,110,40,50], {
        fill: '#999',
        stroke: '#999',
        strokeWidth: 1
    })
    let mix = new fabric.Group([rect, line1,line2])
    canvas.add(mix)

    // 控制项设置  插件：fabric-customise-controls
    // mix.setControlsVisibility({
    //     tl: false, 
    //     ml: false, 
    //     bl: false, 
    //     mb: false, 
    //     br: false,
    //     mr: false, 
    //     tr: false, 
    //     mt: false,
    //     mtr: true
    // })
    // fabric.Canvas.prototype.customiseControls({
    //     tl: {
    //         action: {
    //             'rotateByDegrees': 45
    //         }
    //     }
    // })
}

module.exports = makeFileCabinets