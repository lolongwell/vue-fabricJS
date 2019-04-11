<template>
  <div style="background-color:#E5E4E5">
    <div style="margin-top: 10px">
      <div style="width: 50px;float: left;">
        <ul id="tools" class="tools">
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/wall.svg" alt="wall" title="wall" data-type="wall">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/wall-column.svg" alt="" title="wall-column" data-type="wall-column">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/long-table.svg" alt="" title="long-table" data-type="long-table">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/corner-table.svg" alt="" title="corner-table" data-type="corner-table">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/meeting-table.svg" alt="" title="meeting-table" data-type="meeting-table">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/swivel-chair.svg" alt="" title="swivel-chair" data-type="swivel-chair">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/text.svg" alt="" title="text" data-type="text">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/station.svg" alt="" title="station" data-type="station">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/door.svg" alt="" title="door" data-type="door">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/file-cabinets.svg" alt="" title="file-cabinets" data-type="file-cabinets">
          </li>
          <li draggable>
            <img class="palette" src="@/assets/images/palettes/line.svg" alt="" title="line" data-type="line">
          </li>
        </ul>
      </div>
      <div id="canvasDiv" class="canvasDiv">
        <canvas id="canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
// 控制项插件
import "fabric-customise-controls";
// 物件元素
import makeWall from "./palettes/Wall.js";
import makeSwivelChair from "./palettes/SwivelChair.js";
import makeLongTable from "./palettes/LongTable.js";
import makeCornerTable from "./palettes/CornerTable.js";
import makeWallColumn from "./palettes/WallColumn.js";
import makeMeetingTable from "./palettes/MeetingTable.js";
import makeText from "./palettes/Text.js";
import makeStation from "./palettes/Station.js";
import makeDoor from "./palettes/Door.js";
import makeFileCabinets from "./palettes/FileCabinets.js";
import makeLine from "./palettes/Line.js";

export default {
  name: "draw",
  mounted() {
    var canvas = (this.__canvas = new fabric.Canvas("canvas", {
      height: window.innerHeight,
      width: window.innerWidth
    }));
    window.canvas = canvas;
    window.zoom = window.zoom ? window.zoom : 1;

    let movingTarget = null; // 移动目标对象
    let dragOffset = {
      // 偏移量
      offsetX: 0,
      offsetY: 0
    };
    let drawType = null; // data-type类型
    // 儲存之前的步驟
    const undo = [];
    // 儲存之後的步驟
    const redo = [];
    let state = canvas.toJSON();
    let itemJSON = ""; // 存储对象
    let _clipboard = null

    // 画布事件
    canvas.on("drop", drop);
    canvas.on("object:modified", e => {
      undo.push(state);
      state = JSON.stringify(canvas);
      redo.length = 0;
    });

    // 快捷键设置
    var body = document.querySelector("body");
    body.addEventListener("keydown", function(e) {
      // console.log(e)
      var keynum = e.which;
      if (e.ctrlKey) {
        e.preventDefault();
        switch (keynum) {
          case 90:
            doUndo();
            break; // ctrl + z
          case 89:
            doRedo();
            break; // ctrl + y
          case 67:
            copy();
            break; // ctrl + c
          case 86:
            paste();
            break; // ctrl + v
        }
      } else {
        switch (keynum) {
          case 46:
            e.preventDefault();
            deteItem();
            break;
        }
      }
    });
    // 批量绑定事件
    var lis = document.querySelectorAll("li");
    for (let i = 0; i < lis.length; i++) {
      lis[i].addEventListener("mousedown", save);
    }

    function save(e) {
      var target = e.target;
      drawType = target.getAttribute("data-type");
      if (e.target.tagName.toLowerCase() === "img") {
        dragOffset.offsetX = e.clientX - e.target.offsetLeft;
        dragOffset.offsetY = e.clientY - e.target.offsetTop;
        movingTarget = e.target;
      }
    }

    function drop(e) {
      const { offsetX, offsetY } = e.e;
      // const image = new fabric.Image(movingTarget, {
      //     width: movingTarget.naturalWidth,
      //     height: movingTarget.naturalHeight,
      //     scaleX: 100 / movingTarget.naturalWidth,
      //     scaleY: 100 / movingTarget.naturalHeight,
      //     top: offsetY - dragOffset.offsetY,
      //     left: offsetX - dragOffset.offsetX
      // })
      // canvas.add(image)

      if (drawType == "wall") {
        makeWall(canvas);
      } else if (drawType == "long-table") {
        makeLongTable(canvas);
      } else if (drawType == "corner-table") {
        makeCornerTable(canvas);
      } else if (drawType == "swivel-chair") {
        makeSwivelChair(canvas);
      } else if (drawType == "wall-column") {
        makeWallColumn(canvas);
      } else if (drawType == "meeting-table") {
        makeMeetingTable(canvas);
      } else if (drawType == "text") {
        makeText(canvas);
      } else if (drawType == 'station') {
        makeStation(canvas)
      } else if (drawType == 'door') {
        makeDoor(canvas)
      } else if (drawType == 'file-cabinets') {
        makeFileCabinets(canvas)
      } else if (drawType == 'line') {
        makeLine(canvas)
      }
      canvas.renderAll();
      state = canvas.toJSON();
    }

    function doUndo() {
      if (!undo.length) {
        alert("目前沒有操作可复原！");
        return;
      }
      let lastJSON = undo.pop();
      canvas.loadFromJSON(lastJSON);
      // 在做上一步時把目前狀態 push 到 redo 陣列
      redo.push(state);
      state = lastJSON;
    }

    function doRedo() {
      if (!redo.length) {
        alert("目前沒有操作可复原！");
        return;
      }
      let lastJSON = redo.pop();
      canvas.loadFromJSON(lastJSON);
      // 在做下一步時把目前狀態 push 到 undo 陣列
      undo.push(state);
      state = lastJSON;
    }

    function deteItem() {
      var item = canvas.getActiveObject();
      canvas.remove(item);
    }

    function copy() {
      if (!canvas.getActiveObject()) return;
      canvas.getActiveObject().clone(function(cloned) {
        _clipboard = cloned
      });
    }

    function paste() {
      // clone again, so you can do multiple copies.
      _clipboard.clone(function(clonedObj) {
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
        _clipboard.top += 20;
        _clipboard.left += 20;
        canvas.setActiveObject(clonedObj);
        // canvas.requestRenderAll();
      });
    }


  }
};
</script>

<style scoped>
label {
  display: inline-block;
  width: 130px;
}

.tools {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tools li {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 28px;
  border-top: #dad7d9 solid 1px;
  background: #fefefe;
  position: relative;
}

.tools li:hover {
  background: #f2f1f2;
}

.canvasDiv {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../../assets/images/drawImage/canvas_bg.jpg) repeat;
  margin-left: 60px;
  box-sizing: border-box;
}

.palette {
  width: 100%;
  height: 100%;
  padding: 0 8px;
  box-sizing: border-box;
}
</style>
