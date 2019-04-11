// 转角桌
var makeCornerTable = (canvas) => {
    let polygon = new fabric.Polygon([
        {x: 0, y: 0},
        {x: 80, y: 0},
        {x: 80, y: 80},
        {x: 50, y: 80},
        {x: 51, y: 75},
        {x: 52, y: 70},
        {x: 53, y: 65},
        {x: 54, y: 60},
        {x: 55, y: 55},
        {x: 53, y: 50},
        {x: 52, y: 45},
        {x: 51, y: 40},
        {x: 50, y: 30},
        {x: 45, y: 28},
        {x: 40, y: 26},
        {x: 35, y: 24},
        {x: 30, y: 22},
        {x: 25, y: 24},
        {x: 20, y: 26},
        {x: 15, y: 28},
        {x: 10, y: 30},
        {x: 5, y: 30},
        {x: 0, y: 30}
    ],{
        fill: 'white',
        hasBorders: true,
        stroke: '#999',
        strokeWidth: 1,
    })
    
    canvas.add(polygon)

    // 控制项设置  插件：fabric-customise-controls
    polygon.setControlsVisibility({
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

module.exports = makeCornerTable