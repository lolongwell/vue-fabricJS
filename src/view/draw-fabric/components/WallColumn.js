// 墙柱
var drawWallColumn = (canvas, config) => {
  let rect = new fabric.Rect(config);
  // rect.on("moving", e => {
  //   const target = e.target;
  //   target.left = Math.round(target.left / distance) * distance;
  //   target.top = Math.round(target.top / distance) * distance;
  // });
  // rect.on("scaled", e => {
  //   const target = e.target;
  //   const newRect = target.getBoundingRect();
  //   for (let key in newRect) {
  //     newRect[key] = Math.round(newRect[key] / distance) * distance;
  //   }
  //   target.set({
  //     scaleX: 1,
  //     scaleY: 1,
  //     width: newRect.width,
  //     height: newRect.height,
  //     left: newRect.left,
  //     top: newRect.top
  //   });
  //   target.setCoords();
  // });
  canvas.add(rect);

  // fabric.Canvas.prototype.customiseControls({
  //     tl: {
  //         action: {
  //             'rotateByDegrees': 45
  //         }
  //     }
  // })
};

module.exports = drawWallColumn;
