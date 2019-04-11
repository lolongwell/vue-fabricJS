// 长桌
var makeStation = (canvas) => {
    let rect = new fabric.Rect({
        width: 60,
        height: 30,
        stroke: '#999',
        strokeWidth: 1,
        fill: 'white'
    })

    let rect2 = new fabric.Rect({
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
    let mix1 = new fabric.Group([rect2, polyline1, polyline2, polylgon])
    mix1.set({
        left: 20,
        top: 35
    })
    let mix = new fabric.Group([rect, mix1])
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

module.exports = makeStation