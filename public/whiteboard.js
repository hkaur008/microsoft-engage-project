// whiteboard init
let whiteboardCont;
let whiteboardHeader;
let whiteboardColorPicker;
let whiteboardCloseBtn;
let whiteboardFsBtn;
let whiteboardCleanBtn;
let whiteboardSaveBtn;
let whiteboardEraserBtn;
let isWhiteboardVisible = false;
let canvas;
let ctx;
let isWhiteboardFs = false;

// whiteboard settings
let isDrawing = 0;
let x = 0;
let y = 0;
let color = "#000000";
let drawsize = 3;

whiteboardBtn = document.getElementById("whiteboardBtn");
  // my whiteboard
  whiteboardCont = document.getElementsByClassName("whiteboard-cont")[0];
     whiteboardHeader = document.getElementsByClassName("colors-cont")[0];
  whiteboardCloseBtn = document.getElementById("whiteboardCloseBtn");
  whiteboardFsBtn = document.getElementById("whiteboardFsBtn");
  whiteboardColorPicker = document.getElementById("whiteboardColorPicker");
  whiteboardSaveBtn = document.getElementById("whiteboardSaveBtn");
  whiteboardEraserBtn = document.getElementById("whiteboardEraserBtn");
  whiteboardCleanBtn = document.getElementById("whiteboardCleanBtn");
  canvas = document.getElementById("whiteboard");
  ctx = canvas.getContext("2d");

  setMyWhiteboardBtn();
  function setMyWhiteboardBtn() {
    setupCanvas();
  
    // open - close whiteboard
    whiteboardBtn.addEventListener("click", (e) => {
      if (isWhiteboardVisible) {
        whiteboardClose();
        remoteWbAction("close");
      } else {
        whiteboardOpen();
        remoteWbAction("open");
      }
    });
    // close whiteboard
    whiteboardCloseBtn.addEventListener("click", (e) => {
      whiteboardClose();
      remoteWbAction("close");
    });
    // view full screen
    whiteboardFsBtn.addEventListener("click", (e) => {
      whiteboardResize();
      remoteWbAction("resize");
    });
    // erase whiteboard
    whiteboardEraserBtn.addEventListener("click", (e) => {
      setEraser();
    });
    // save whitebaord content as img
    whiteboardSaveBtn.addEventListener("click", (e) => {
      saveWbCanvas();
    });
    // clean whiteboard
    whiteboardCleanBtn.addEventListener("click", (e) => {
        whiteboardClean();
        remoteWbAction("clean");
    });
  }

  
/**
 * Handle whiteboard events
 * @param {*} config
 */
function handleWhiteboard(config) {
    switch (config.act) {
      case "draw":
        drawRemote(config);
        break;
      case "clean":
        document.getElementById("info").innerHTML=`${config.peer_name} has cleaned the board`
        whiteboardClean();
        break;
      case "open":
        document.getElementById("info").innerHTML=`${config.peer_name} has opened the board`
        whiteboardOpen();
        break;
      case "close":
        document.getElementById("info").innerHTML=""
        break;
      case "resize":
        whiteboardResize();
        break;
    }
  }
  

  
  /**
   * Whiteboard Open
   */
  function whiteboardOpen() {
    if (!isWhiteboardVisible) {
      setColor("#ffffff"); // color picker
      whiteboardCont.style.top = "50%";
      whiteboardCont.style.left = "50%";
      whiteboardCont.style.display = "block";
      isWhiteboardVisible = true;
      drawsize = 3;
      fitToContainer(canvas);
    }
  }
  
  /**
   * Whiteboard close
   */
  function whiteboardClose() {
    if (isWhiteboardVisible) {
      whiteboardCont.style.display = "none";
      isWhiteboardVisible = false;
    
    }
  }
  
  /**
   * Whiteboard resize
   */
  function whiteboardResize() {
    let content;
    whiteboardCont.style.top = "50%";
    whiteboardCont.style.left = "50%";
    if (isWhiteboardFs) {
      document.documentElement.style.setProperty("--wb-width", "800px");
      document.documentElement.style.setProperty("--wb-height", "600px");
      fitToContainer(canvas);
      whiteboardFsBtn.className = "fas fa-expand-alt";
      content = "VIEW full screen";
      isWhiteboardFs = false;
    } else {
      document.documentElement.style.setProperty("--wb-width", "99%");
      document.documentElement.style.setProperty("--wb-height", "99%");
      fitToContainer(canvas);
      whiteboardFsBtn.className = "fas fa-compress-alt";
      content = "EXIT full screen";
      isWhiteboardFs = true;
    }
   
  }
  
  /**
   * Whiteboard clean
   */
  function whiteboardClean() {
    if (isWhiteboardVisible) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  /**
   * Set whiteboard color
   * @param {*} newcolor
   */
  function setColor(newcolor) {
    color = newcolor;
    drawsize = 3;
    whiteboardColorPicker.value = color;
  }
  
  /**
   * Whiteboard eraser
   */
  function setEraser() {
    color = "#000000";
    drawsize = 25;
    whiteboardColorPicker.value = color;
  }
  

  /**
   * Draw on whiteboard
   * @param {*} newx
   * @param {*} newy
   * @param {*} oldx
   * @param {*} oldy
   */
  function draw(newx, newy, oldx, oldy) {
    ctx.strokeStyle = color;
    ctx.lineWidth = drawsize;
    ctx.beginPath();
    ctx.moveTo(oldx, oldy);
    ctx.lineTo(newx, newy);
    ctx.stroke();
    ctx.closePath();
  }
  
  /**
   * Draw Remote whiteboard
   * @param {*} config draw coordinates, color and size
   */
  function drawRemote(config) {
    // draw on whiteboard
    if (isWhiteboardVisible) {
      ctx.strokeStyle = config.color;
      ctx.lineWidth = config.size;
      ctx.beginPath();
      ctx.moveTo(config.prevx, config.prevy);
      ctx.lineTo(config.newx, config.newy);
      ctx.stroke();
      ctx.closePath();
    }
  }
  
  /**
   * Resize canvas
   * @param {*} canvas
   */
  function fitToContainer(canvas) {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  
  /**
   * Handle whiteboard on windows resize
   * here i lose drawing, Todo fix it
   */
  function reportWindowSize() {
    fitToContainer(canvas);
  }
  /**
   * Whiteboard setup
   */
  function setupCanvas() {
    fitToContainer(canvas);
  
    canvas.addEventListener("mousedown", (e) => {
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = 1;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (isDrawing) {
        draw(e.offsetX, e.offsetY, x, y);
        // send draw to other peers in the room
            socket.emit("wb", {
            act: "draw",
            newx: e.offsetX,
            newy: e.offsetY,
            prevx: x,
            prevy: y,
            color: color,
            size: drawsize,
          });
        x = e.offsetX;
        y = e.offsetY;
      }
    });
    window.addEventListener("mouseup", (e) => {
      if (isDrawing) {
        isDrawing = 0;
      }
    });
  
    window.onresize = reportWindowSize;
  }
  
  /**
   * Save whiteboard canvas to file as png
   */
  function saveWbCanvas() {
    // Improve it if erase something...
    let link = document.createElement("a");
    link.download = getDataTimeString() + "WHITEBOARD.png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  }
  
  /**
   * Remote whiteboard actions
   * @param {*} action
   */
  function remoteWbAction(action) {
      socket.emit("wb", {
        peer_name: myName,
        act: action,
      });
  }
  
  socket.on("wb_draw",(config) =>{
    handleWhiteboard(config);
  })
  
