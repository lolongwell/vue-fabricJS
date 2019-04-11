<template>
  <div class="container">
      <ul :class="value ? 'collapsed' : ''">
        <li class="pattern" draggable @mousedown="savePattern" v-for="(item, index) in tools" :key="index">
          <img :src="item.icon" alt="" :title="item.type" :data-type="item.type">
        </li>
      </ul>
      <canvas id="c"></canvas>
  </div>
</template>

<script>
  import {fabric} from 'fabric';
  import initAligningGuidelines from './aligning_guidelines.js'
  // import drawWall from './components/Wall.js'
  // import drawWallColumn from './components/WallColumn.js'
  export default {
    data () {
      return {
        tools: [
          {
            icon: 'palettes/chair1.png',
            type: 'chair1'
          },
          {
            icon: 'palettes/chair2.png',
            type: 'chair2'
          },
          {
            icon: 'palettes/chair3.png',
            type: 'chair3'
          },
        ],
        patternType: '',// 元素类型
        movingTarget: null,// 移动对象
        dragOffset: {
          offsetX: 0,
          offsetY: 0
        },
        _clipboard: null,
        state: null,
        redo: [],
        undo: [],
        scale: 0.2
      }
    },
    props: {
      value: Boolean
    },
    mounted () {
      var _this = this
      var canvas = (this.canvas = new fabric.Canvas('c', {
        backgroundColor: 'white'
      }))
      window.canvas = canvas;
      window.zoom = window.zoom ? window.zoom : 1;
      // initAligningGuidelines(canvas)
      // 背景图
      fabric.Image.fromURL('a1-10.png', img => {
        canvas.setHeight(img.height * 0.2 + 120)
        canvas.setWidth(img.width * 0.2 + 120)
        const oImg = img.set({
          width: img.width,
          height: img.height,
          scaleX: _this.scale,
          scaleY: _this.scale,
          originX: 'left',
          originY: 'top',
          left: 100,
          top: 50
        })
        canvas.setBackgroundImage(oImg).renderAll()
      })
      // 网格
      // this.drawGrid(canvas)
      // 快捷键设置
      var body = document.querySelector("body");
      var _this = this
      body.addEventListener("keydown", function(e) {
        // console.log(e)
        var keynum = e.which;
        if (e.ctrlKey) {
          e.preventDefault();
          switch (keynum) {
            case 90:
              _this.doUndo();
              break; // ctrl + z
            case 89:
              _this.doRedo();
              break; // ctrl + y
            case 67:
              _this.copy();
              break; // ctrl + c
            case 86:
              _this.paste();
              break; // ctrl + v
          }
        } else {
          switch (keynum) {
            case 46:
              e.preventDefault();
              _this.deteItem();
              break;
          }
        }
      });
      // 缩放
      canvas.on('mouse:wheel', (e) => {
        if (e.e.altKey) {
          const deltaY = e.e.deltaY
          const newZoom = deltaY / 1000
          const center = canvas.getCenter()
          this.setZoom(newZoom, { x: e.e.offsetX, y: e.e.offsetY })
        }
      })
      const moveCanvasInfo = {
        isDragging: false,
        lastX: 0,
        lastY: 0
      }
      canvas.on('mouse:down', (e) => {
        moveCanvasInfo.isDragging = true
        moveCanvasInfo.lastX = e.e.clientX
        moveCanvasInfo.lastY = e.e.clientY
        canvas.selection = false
      })
      // 移动
      canvas.on('mouse:move', function (e) {
        if (e.e.ctrlKey) {
          if (moveCanvasInfo.isDragging) {
            // 同 canvas transform method
            // 計算移動量
            canvas.viewportTransform[4] += e.e.clientX - moveCanvasInfo.lastX
            canvas.viewportTransform[5] += e.e.clientY - moveCanvasInfo.lastY
            canvas.requestRenderAll()
            moveCanvasInfo.lastX = e.e.clientX
            moveCanvasInfo.lastY = e.e.clientY
          }
        }
      })
      canvas.on('mouse:up', function (opt) {
          moveCanvasInfo.isDragging = false
          moveCanvasInfo.selection = true
      })
      canvas.on('drop', (e) => {
        this.drawPattern(e)
      })
      canvas.on("object:modified", e => {
        this.undo.push(this.state);
        this.state = JSON.stringify(canvas);
        this.redo.length = 0;
      });
    },
    methods: {
      drawGrid (canvas) {
        const longer = canvas.getWidth() > canvas.getHeight() ? canvas.getWidth() : canvas.getHeight()
        let vLine
        let hLine
        let distance = this.distance
        for (let i = 1; i * distance < longer; i++) {
            const lineDef = {
                fill: 'black',
                stroke: '#d3d3d3',
                strokeWidth: 1,
                selectable: false,
                opacity: 0.5
            }
            vLine = new fabric.Line([i * distance, 0, i * distance, canvas.height], lineDef)
            hLine = new fabric.Line([0, i * distance, canvas.width, i * distance], lineDef)
            // if (i % 5 === 0) {
            //     vLine.stroke = 'rgba(0, 0, 0, 0.2)'
            //     hLine.stroke = 'rgba(0, 0, 0, 0.2)'
            // }
            canvas.add(vLine, hLine)
        }
      },
      setZoom (zoom, point) {
        const newZoom = canvas.getZoom() + zoom
        canvas.zoomToPoint(point, newZoom)
      },
      savePattern (e) {
        var target = e.target;
        this.patternType = target.getAttribute("data-type");
        if (e.target.tagName.toLowerCase() === "img") {
          this.dragOffset.offsetX = e.clientX - e.target.offsetLeft;
          this.dragOffset.offsetY = e.clientY - e.target.offsetTop;
          this.movingTarget = e.target;
        }
      },
      drawPattern (e) {
        var _this = this
        const { offsetX, offsetY } = e.e;
        let {patternType, canvas, dragOffset, movingTarget} = this
        const image = new fabric.Image(movingTarget, {
          width: movingTarget.naturalWidth,
          height: movingTarget.naturalHeight,
          scaleX: _this.scale,
          scaleY: _this.scale,
          top: offsetY - dragOffset.offsetY + 114,
          left: offsetX - dragOffset.offsetX + 266
        })
        canvas.add(image)
        this.state = canvas.toJSON();
      },
      doUndo() {
        if (!this.undo.length) {
          alert("目前沒有操作可复原！");
          return;
        }
        let lastJSON = this.undo.pop();
        canvas.loadFromJSON(lastJSON);
        // 在做上一步時把目前狀態 push 到 redo 陣列
        this.redo.push(this.state);
        this.state = lastJSON;
      },
      doRedo() {
        if (!this.redo.length) {
          alert("目前沒有操作可复原！");
          return;
        }
        let lastJSON = this.redo.pop();
        canvas.loadFromJSON(lastJSON);
        // 在做下一步時把目前狀態 push 到 undo 陣列
        this.undo.push(this.state);
        this.state = lastJSON;
      },
      deteItem() {
        var item = canvas.getActiveObject();
        canvas.remove(item);
      },
      copy() {
        var _this = this
        if (!canvas.getActiveObject()) return;
        canvas.getActiveObject().clone(function(cloned) {
          _this._clipboard = cloned
        });
      },
      paste() {
        // clone again, so you can do multiple copies.
        var _this = this
        _this._clipboard.clone(function(clonedObj) {
          canvas.discardActiveObject();
          clonedObj.set({
            left: clonedObj.left + 20,
            top: clonedObj.top + 20,
            evented: true
          });
          if (clonedObj.type === "activeSelection") {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function(obj) {
              canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
          } else {
            canvas.add(clonedObj);
          }
          _this._clipboard.top += 20;
          _this._clipboard.left += 20;
          canvas.setActiveObject(clonedObj);
          // canvas.requestRenderAll();
        });
      },
    },
  }
</script>

<style scoped>
  .container {
    background-color:#E5E4E5;
    position: relative;
  }
  ul {
    position: fixed;
    left: 266px;
    top: 114px;
    list-style: none;
    margin: 0;
    padding: 0;
    margin-right: 10px;
    overflow: hidden;
    z-index: 9;
    background: #ccc;
    width: 115px;
    padding: 5px;
    transition: all 0.2s ease-in-out;
  }
  ul.collapsed {
    left: 74px;
  }
  li.pattern {
    float: left;
    width: 50px;
    height: 51px;
    margin-right: 5px;
    font-size: 0;
    border-top: #dad7d9 solid 1px;
    background: #fefefe;
    position: relative;
  }
  li:nth-child(2n) {
    margin-right: 0;
  }
  li:hover {
    background: #f2f1f2;
  }
  img {
    width: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
