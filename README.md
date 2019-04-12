## Install
```bush
// install dependencies
npm install
```
## Run
### Development
```bush
npm run dev
```
### Production(Build)
```bush
npm run build
```
## 实现功能： 
    复制/粘贴
    移动画布
    缩放
    undo/redo
    

# fabric.js使用笔记
### 对象
    fabric.Circle 圆
    fabric.Ellipse	椭圆
    fabric.Line 直线
    fabric.Polygon
    fabric.Polyline
    fabric.Rect 矩形
    fabric.Triangle 三角形

### 方法
    add(object) 添加
    insertAt(object,index) 添加
    remove(object) 移除
    forEachObject 循环遍历 
    getObjects() 获取所有对象
    item(int) 获取子项
    isEmpty() 判断是否空画板
    size() 画板元素个数
    contains(object) 查询是否包含某个元素
    fabric.util.cos
    fabric.util.sin
    fabric.util.drawDashedLine 绘制虚线
    getWidth() setWidth()
    getHeight()
    clear() 清空
    renderAll() 重绘
    requestRenderAll() 请求重新渲染
    rendercanvas() 重绘画板
    getCenter().top/left 获取中心坐标
    toDatalessJSON() 画板信息序列化成最小的json
    toJSON() 画板信息序列化成json
    moveTo(object,index) 移动
    dispose() 释放
    setCursor() 设置手势图标
    getSelectionContext()获取选中的context
    getSelectionElement()获取选中的元素
    getActiveObject() 获取选中的对象
    getActiveObjects() 获取选中的多个对象
    discardActiveObject()取消当前选中对象 
    isType() 图片的类型
    setColor(color) = canvas.set("full","");
    rotate() 设置旋转角度
    setCoords() 设置坐标
    canvas.calcViewportBoundaries() 计算画布4角的位置

### 事件
#### Events handled by canvas
    # General

    after:render — fired continuously after each frame is rendered
    before:render — fired before each frame is rendered
    canvas:cleared — fired after a call to canvas.clear()
    
    # Mouse related

    mouse:over
    mouse:out
    mouse:down — fired when mousedown event occurred on canvas
    mouse:up — fired when mouseup event occurred on canvas
    mouse:move — fired when the mouse is moving over the canvas
    mouse:wheel - fired when using the scroll wheel
    
    # Object related

    object:added — fired after object has been added
    object:modified — fired after object is modified (moved, scaled, rotated)
    object:moving — fired continuously during object movement
    object:over — fired when mouse is over object (see example below)
    object:out — fired when mouse is moved away from object (see example below)
    object:removed — fired when object has been removed
    object:rotating — fired continuously during object rotating
    object:scaling — fired continuously during object scaling
    object:selected — fired when object is selected
    
    # Path related

    path:created — fired when (free-drawn) path is created
    
    #Selection related

    before:selection:cleared — fired before selection is cleared (before active group is destroyed)
    selection:cleared — fired after selection is cleared (after active group is destroyed)
    selection:created — fired after selection is created (after active group is created)
    
    # Text related

    text:editing:entered
    text:editing:exited
    text:selection:changed
    text:changed

#### Events handled by objects
    # General

    added
    removed

    # Mouse related

    mousedown
    mouseup
    mouseover
    mouseout
    
    # Modification related

    modified
    rotating
    scaling
    moving
    skewing
    
    # Selection related

    deselected
    selected
    
    # Text related

    editing:entered
    editing:exited
    selection:changed — cursor selection in iText has changed
    changed
    dblclick
    tripleclick

#### Demos and Examples
    http://fabricjs.com/events
    http://fabricjs.com/hovering

### 常用属性
    canvas.isDrawingMode = true; 可以自由绘制
    canvas.selectable = false; 控件不能被选择，不会被操作
    canvas.selection = true; 画板显示选中
    canvas.skipTargetFind = true; 整个画板元素不能被选中
    canvas.freeDrawingBrush.color = "#E34F51" 设置自由绘画笔的颜色
    freeDrawingBrush.width 自由绘笔触宽度

### IText的方法
    selectAll() 选择全部
    getSelectedText() 获取选中的文本
    exitEditing() 退出编辑模式

### 绘制直线
```
var line = new fabric.Line([10, 10, 100, 100], {
　　fill: 'green',
　　stroke: 'green',    //笔触颜色
　　strokeWidth: 2,//笔触宽度
});
canvas.add(line);
```

### 绘制虚线
```
# 在绘制直线的基础上添加属性strokeDashArray:Array
# strokeDashArray[a,b] =》 每隔a个像素空b个像素。
var line = new fabric.Line([10, 10, 100, 100], {
    fill: 'green',
    stroke: 'green',
    strokeDashArray:[3,1] 
});
canvas.add(line);
```

### 图片去掉选中边框和旋转，且只能移动，不可操作
    oImg.hasControls = false; 只能移动不能（编辑）操作
    oImg.hasBorders = false; 去掉边框，可以正常操作
    hasRotatingPoint = false; 不能被旋转
    hasRotatingPoint 控制旋转点不可见

```
fabric.Image.fromURL("300.jpg", function (oImg) {
　　canvas.add(oImg);
　　oImg.hasControls = oImg.hasBorders = false;
});
```

