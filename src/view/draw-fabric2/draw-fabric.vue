<template>
  <div class="container">
    <ul :class="value ? 'collapsed' : ''">
      <li class="pattern" draggable @mousedown="savePattern" v-for="(item, index) in tools" :key="index">
        <img :src="item.icon" alt="" :title="item.type" :data-type="item.type">
      </li>
    </ul>

    <canvas id="c"></canvas>

    <i-button type="primary" shape="circle" class="btn-save" @click="saveC">保存</i-button>
    <div class="tip">
      <div class="scale">
        <span>{{size}}m</span>
        <img src="scale.svg" alt="">
      </div>
      <div class="compass"><img src="compass.svg" alt=""></div>
    </div>

    <Modal
      title="信息录入"
      v-model="showModal"
      :mask-closable="false"
      @on-ok="addNew"
      @on-cancel="cancelAdd">
      <i-input v-model="employeeID" placeholder="请输入员工号..." style="width: 100%"></i-input>
    </Modal>
  </div>
</template>

<script>
  import {fabric} from 'fabric';
  import 'fabric-customise-controls'
  export default {
    data () {
      return {
        showModal: false,
        employeeID: '',
        newObj: null,// 新增对象
        tools: [
          {
            icon: 'staff.jpg',
            type: 'staff'
          },
          {
            icon: 'leader.jpg',
            type: 'leader'
          },
          {
            icon: 'public-room.png',
            type: 'public-room'
          },
        ],
        movingTarget: null,// 移动对象
        _clipboard: null,
        state: null,
        redo: [],
        undo: [],
        scale: 0.2,
        size: 1000,
        moveDelta: {
          x: 0,
          y: 0
        },
        clickCnt: 1
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
      // 背景图
      fabric.Image.fromURL('a1-10.png', img => {
        canvas.setHeight(img.height * _this.scale + 120)
        canvas.setWidth(img.width * _this.scale + 120)
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
      // 自定义控制项
      fabric.Canvas.prototype.customiseControls({
        tl: {
          action: function (e, target) {
            canvas.getActiveObject().set('scaleX', -1).setCoords()
            canvas.renderAll();
          },
          cursor: 'pointer'
        },
        tr: {
          action: function (e, target) {
            target.rotate(90*_this.clickCnt)
            _this.clickCnt++
            canvas.renderAll();
          },
          cursor: 'pointer'
        },
        // bl: {
        //     action: 'remove',
        //     cursor: 'pointer'
        // },
        // br: {
        //     action: 'moveUp',
        //     cursor: 'pointer'
        // },
        // mb: {
        //     action: 'moveDown',
        //     cursor: 'pointer'
        // },
        // mt: {
        //     action: {
        //         'rotateByDegrees': 45
        //     }
        // },
        // mr: {
        //     action: function( e, target ) {
        //         target.set( {
        //             left: 200
        //         } );
        //         canvas.renderAll();
        //     }
        // },
        // mtr: {
        //     action: 'rotate',
        //     cursor: 'cow.png'
        // },
      }, function() {
        canvas.renderAll();
      })
      fabric.Object.prototype.customiseCornerIcons({
        settings: {
          borderColor: '#ffffff',
          cornerSize: 25,
          cornerShape: 'circle',
          cornerBackgroundColor: '#ffffff',
          cornerPadding: 10
        },
        tl: {
            icon: 'icons/reverse.svg'
        },
        tr: {
            icon: 'icons/rotate.svg'
        },
        // bl: {
        //     icon: 'icons/remove.svg'
        // },
        // br: {
        //     icon: 'icons/up.svg'
        // },
        // mb: {
        //     icon: 'icons/down.svg'
        // },
        // // only is hasRotatingPoint is not set to false
        // mtr: {
        //     icon: 'icons/rotate.svg'
        // },
      }, function() {
        canvas.renderAll();
      } );
      // 快捷键设置
      var body = document.querySelector("body");
      var _this = this
      body.addEventListener("keydown", function(e) {
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
        } else if (keynum == 46) {
           e.preventDefault();
            _this.deteItem();
        }
      });
      // 拖拽
      canvas.on('drop', (e) => {
        this.drawPattern(e)
      })
      // 缩放
      canvas.on('mouse:wheel', (e) => {
        // todo:画布大小随缩放增减
        if (e.e.ctrlKey) {
          e.e.preventDefault()
          const deltaY = e.e.deltaY
          const newZoom = deltaY > 0 ? 0.1 : -0.1
          this.setZoom(newZoom, { x: e.e.offsetX, y: e.e.offsetY })
        }
      })
      // 移动画布
      let isDragging = false
      canvas.on('mouse:down', (e) => {
        var selections = canvas.getActiveObjects()
        if (selections.length == 0 && !e.e.shiftKey) {
          isDragging = true
          canvas.selection = false
        }
      })
      canvas.on('mouse:move', (e) => {
        if (isDragging) {
          var delta = new fabric.Point(e.e.movementX, e.e.movementY);
          canvas.relativePan(delta);
        }
      })
      canvas.on('mouse:up', (e) => {
        isDragging = false
        canvas.selection = true
      })
      // redo/undo
      canvas.on("object:modified", e => {
        this.undo.push(this.state);
        this.state = JSON.stringify(canvas);
        this.redo.length = 0;
      })
      canvas.on("after:render", () => { 
        var points = canvas.calcViewportBoundaries()
        // console.log(points)
        this.moveDelta.x = points.tl.x
        this.moveDelta.y = points.tl.y
      })
      canvas.on('mouse:dblclick', e => {
        // console.log(e)
        if (e.target) {
          this.showModal = true
        }
      })
    },
    methods: {
      setZoom (zoom, point) {
        const newZoom = canvas.getZoom() + zoom
        if (newZoom < 0.1) return;//禁止无限缩小
        canvas.zoomToPoint(point, newZoom)
        this.size = Number.parseInt(1000/newZoom)
      },
      savePattern (e) {
        if (e.target.tagName.toLowerCase() === "img") {
          this.drawType = e.target.getAttribute("data-type")
          this.movingTarget = e.target;
        }
      },
      drawPattern (e) {
        let _this = this
        this.clickCnt = 1
        const { offsetX, offsetY } = e.e;
        let {drawType, movingTarget, moveDelta} = this
        let rate = 34 / movingTarget.naturalWidth
        let zoom = canvas.getZoom()
        let left = offsetX/zoom - movingTarget.naturalWidth * rate/2 + moveDelta.x
        let top = offsetY/zoom - movingTarget.naturalHeight * rate/2 + moveDelta.y
        switch (drawType) {
          case 'staff':
            let rect = new fabric.Rect({
              width: movingTarget.naturalWidth,
              height: movingTarget.naturalHeight,
              scaleX: _this.scale,
              scaleY: _this.scale,
              stroke: '#e4e4e4',
              strokeWidth: 2,
              fill: 'transparent',
            })
            let line = new fabric.Line([1,0,movingTarget.naturalWidth*_this.scale-1,0], {
              stroke: '#b3dba7',
              strokeWidth: 1,
            })
            _this.newObj = new fabric.Group([rect, line],{
              left,
              top
            })
            break;
          case 'leader':
            let rect1 = new fabric.Rect({
              width: 163,
              height: 76,
              scaleX: _this.scale,
              scaleY: _this.scale,
              stroke: '#e4e4e4',
              strokeWidth: 2,
              fill: 'transparent',
            })
            let rect2 = new fabric.Rect({
              width: 47,
              height: 43,
              scaleX: _this.scale,
              scaleY: _this.scale,
              stroke: '#e4e4e4',
              strokeWidth: 2,
              fill: 'transparent',
              left: 0,
              top: 76*_this.scale
            })
            let rect3 = new fabric.Rect({
              width: 47,
              height: 43,
              scaleX: _this.scale,
              scaleY: _this.scale,
              stroke: '#e4e4e4',
              strokeWidth: 2,
              fill: 'transparent',
              left: 0,
              top: 119*_this.scale
            })
            _this.newObj = new fabric.Group([rect1, rect2, rect3],{
              left,
              top
            })
            break;
          case 'public-room':
            _this.newObj = new fabric.Rect({
              width: 800,
              height: 400,
              scaleX: _this.scale,
              scaleY: _this.scale,
              stroke: '#848c90',
              strokeWidth: 2,
              fill: 'transparent',
              left: offsetX/zoom - movingTarget.naturalWidth * rate/2 + moveDelta.x,
              top: offsetY/zoom - movingTarget.naturalHeight * rate/2 + moveDelta.y
            })
            break;
        }
        canvas.add(this.newObj)
        this.state = JSON.stringify(canvas);
      },
      addNew () {
        this.newObj.on('mouseover', e => {
          // console.log(e)
          var objs = e.target.getObjects()
          objs.forEach((item, index) => {
            item.set('fill', 'red')
          })
          canvas.renderAll()
        })
        this.newObj.on('mouseout', e => {
          // console.log(e)
          var objs = e.target.getObjects()
          objs.forEach((item, index) => {
            item.set('fill', 'transparent')
          })
          canvas.renderAll()
        })
      },
      cancelAdd () {
        
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
        var items = canvas.getActiveObjects();
        items.forEach(item => {
          canvas.remove(item);
        })
        canvas.discardActiveObject();
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
            top: clonedObj.top,
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
      saveC () {
        var saveJSON = JSON.stringify(canvas)
        console.log(saveJSON)
      },
      loadC () {
        var saveJSON = '{"version":"2.7.0","objects":[{"type":"group","version":"2.7.0","originX":"left","originY":"top","left":300.37,"top":346.34,"width":25.8,"height":13.6,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"objects":[{"type":"rect","version":"2.7.0","originX":"left","originY":"top","left":-12.9,"top":-6.8,"width":127,"height":66,"fill":"transparent","stroke":"#e4e4e4","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.2,"scaleY":0.2,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"line","version":"2.7.0","originX":"left","originY":"top","left":-11.9,"top":-6.8,"width":23.4,"height":0,"fill":"transparent","stroke":"#b3dba7","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"x1":-11.700000000000001,"x2":11.700000000000001,"y1":0,"y2":0}]}],"background":"white","backgroundImage":{"type":"image","version":"2.7.0","originX":"left","originY":"top","left":100,"top":50,"width":6682,"height":4157,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.2,"scaleY":0.2,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"crossOrigin":"","cropX":0,"cropY":0,"src":"http://localhost:8080/a1-10.png","filters":[]}}'
        canvas.loadFromJSON(saveJSON)
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
  li.pattern:nth-child(2n) {
    margin-right: 0;
  }
  li.pattern:hover {
    background: #f2f1f2;
  }
  li.pattern img {
    width: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .tip {
    position: fixed;
    right: 20px;
    bottom: 20px
  }
  .tip>div {
    float: left;
    margin-right: 10px;
  }
  .scale {
    width: 50px;
    font-size: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .scale span {
    font-size: 13px;
    color: #1296db;
  }
  .scale img {
    width: 30px;
  }
  .compass {
    width: 50px;
  }
  .compass img {
    width: 100%;
  }
  .btn-save {
    position: fixed;
    top: 134px;
    right: 20px;
  }
</style>
