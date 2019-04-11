// 文字
var makeText = canvas => {
    let itext = new fabric.IText('edit...', {
        fontSize: 15,
        fontStyle: 'italic',
        fill: '#999'
    })
    canvas.add(itext)
}
module.exports = makeText