// 线
var makeLine = canvas => {
    var line = new fabric.Line([10,10,50,10], {
        fill: '#999',
        stroke: '#999',
        strokeWidth: 1
    })

    line.on('scaling', e => {
        var o = e.target;
        if (!o.strokeWidthUnscaled && o.strokeWidth) {
            o.strokeWidthUnscaled = o.strokeWidth;
        }
        if (o.strokeWidthUnscaled) {
            o.strokeWidth = o.strokeWidthUnscaled / o.scaleX;
        }
    })

    canvas.add(line)
}

module.exports = makeLine