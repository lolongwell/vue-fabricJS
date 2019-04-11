// 转椅
var makeSwivelChair = (canvas) => {
    let rect = new fabric.Rect({
        width: 20,
        height: 20,
        stroke: '#999',
        strokeWidth: 1,
        fill: 'white'
    })
    let polyline1 = new fabric.Polyline([
        {x: 3, y: 0},
        {x: 3, y: 15},
    ],{
        fill: 'white',
        stroke: '#999',
    })
    let polyline2 = new fabric.Polyline([
        {x: 17, y: 0},
        {x: 17, y: 15},
    ],{
        fill: 'white',
        stroke: '#999',
    })
    let polylgon = new fabric.Polygon([
        {x: 0, y: 20},
        {x: 3, y: 15},
        {x: 17, y: 15},
        {x: 20, y: 20},
    ],{
        fill: 'blue',
        stroke: '#999',
    })

    let mix = new fabric.Group([rect, polyline1, polyline2, polylgon])
    canvas.add(mix)

    mix.setControlsVisibility({
        tl: true, 
        ml: false, 
        bl: true, 
        mb: false, 
        br: true,
        mr: false, 
        tr: true, 
        mt: false,
        mtr: true
    })

    // 控制项设置  插件：fabric-customise-controls
    // fabric.Object.prototype.setControlsVisibility({
    //     tl: true, 
    //     ml: false, 
    //     bl: true, 
    //     mb: false, 
    //     br: true,
    //     mr: false, 
    //     tr: true, 
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

module.exports = makeSwivelChair