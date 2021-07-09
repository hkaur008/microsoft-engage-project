const socket = io('/');
const messageInput = document.getElementById('chat_message');
const all_messages = document.getElementById('all_messages');
const main__chat__window = document.getElementById('main__chat__window');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const ScreenVideo = document.createElement("video");
const photoFilter = document.getElementById('photo-filter');
const msg_send_btn = document.getElementById('msg_send_btn');
const wave_btn = document.getElementById('wave_btn');
const end_btn = document.getElementById('leave-meeting')
emojiPicker =document.getElementsByTagName("emoji-picker")[0];
const participants = document.getElementById("participants_list");
const recordStreamBtn = document.getElementById("recordStreamBtn");

let filter = 'none';
myVideo.muted = true;
var roomMates = new Set();
const state = "in-meet";
let myName;
let myScreenStream;

// sounds 
const wave_audio = new Audio('audio/wave.mp3');
const screen_record_start = new Audio('audio/recStart.mp3');
const screen_record_stop = new Audio('audio/recStop.mp3');

// messenger
let messageStatus = 0;
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


//firebase references
var messagesRef =firebase.database().ref(ROOM_ID).child("messages")
var currentParticipantsRef =firebase.database().ref(ROOM_ID).child("currentParticipants")

// Icons made by Freepik from www.flaticon.com
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";

const userName ='hargun';
let myId  ;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443',
});

let myVideoStream;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    myVideo.setAttribute("id", myId+"video");
    setVideoReversed(myVideo);
    addVideoStream(myVideo, stream);
    peer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      if(call.metadata){
        video.setAttribute("id", call.peer + 's');
        }
        else {
          video.setAttribute("id", call.peer+"video");
        }
        video.setAttribute("controls", "controls");

      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });


//user connected    
    socket.on('user-connected', (userId , state) => {
     if(state === "in-meet") {
        connectToNewUser(userId, stream);
         roomMates.add(userId); 
         console.log(roomMates);
         }
     else (console.log(userId+"connected without meet"));
    });

  
//enter key
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        msg_send_btn.click();
       }
     });
    
//send button    
    msg_send_btn.addEventListener("click", event => {
      event.preventDefault();
      const msgText = msgerInput.value;
      if (!msgText) return;
      sendMessage(msgText);
      console.log(userName);
      msgerInput.value = "";
    });

  // send message 
  const sendMessage = (msg) => {
      socket.emit('message', msg);
      messagesRef.push().set({
        "sender": myName,
        "message": msg,
        "createdAt": formatDate(new Date())
    });
  }

  //emoji picker 
  emojiPicker.addEventListener("emoji-click", (e) => {
    messageInput.value += e.detail.emoji.unicode;
  });

    socket.on('createMessage', (msg , userName , givenId) => {
      if(givenId===myId)
        appendMessage(userName, PERSON_IMG, "right", msg);
      else
      appendMessage(userName, PERSON_IMG, "left", msg);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;
    });
  });

peer.on('call', (call)=> {
  getUserMedia(
    { video: true, audio: true }, (stream) => {
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement('video');

      if(call.metadata){
        video.setAttribute("id", call.peer + 's');
        }
        else {
          video.setAttribute("id", call.peer+"video");
        }
    video.setAttribute("controls", "controls");
    call.on('stream', (remoteStream)=> {
        addVideoStream(video, remoteStream);
        roomMates.add(call.peer); 
      });
    }, (err)=> {
      console.log('Failed to get local stream', err);
    }
  );
});

peer.on('open', (id) => {
  nameInput(id);
  
});

//username input
const nameInput = (id)=> {
  myName = prompt('Please enter your name', 'Hargun');
  if (myName != null) {
     messagesRef.on('value', (snapshot) => {
      if(!messageStatus){
      snapshot.forEach( (element )=>{
          if(element.val().sender===myName)
        appendBeforeMessage(element.val().sender,PERSON_IMG,"right",element.val().message,element.val().createdAt)
        else{
        appendBeforeMessage(element.val().sender,PERSON_IMG,"left",element.val().message,element.val().createdAt)
        }
      })
    }
      messageStatus = 1;
    });
    
    socket.emit('join-room', ROOM_ID, id , myName , state);
    myId=id;
  }

}


// messenger code starts

function appendBeforeMessage(name, img, side, text, date) {  
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${date}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}


// CHAT
const connectToNewUser = (userId, streams) => {
  var call = peer.call(userId, streams);
  var video = document.createElement('video');
  video.setAttribute("controls", "controls");
  
  if(call.metadata){
    video.setAttribute("id", userId + 's');
    }
    else {
      video.setAttribute("id", userId+"video");
    }
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

};

const addVideoStream = (videoEl, stream) => {
  videoEl.srcObject = stream;
  videoEl.addEventListener('loadedmetadata', () => {
    videoEl.play();
  });
  videoGrid.append(videoEl);
  let totalUsers = document.getElementsByTagName('video').length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName('video')[index].style.width = (window.innerWidth*0.8 / Math.sqrt(totalUsers))+"px" ;
      document.getElementsByTagName('video')[index].style.height = (window.innerHeight*0.8 /Math.sqrt(totalUsers)) +"px"  ;
    }
  }
};



// video on off 
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
   
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};



const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class='unmute fas fa-pause-circle'></i>`;
  document.getElementById('playPauseVideo').innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=' fas fa-video'></i>`;
  document.getElementById('playPauseVideo').innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class='unmute fas fa-microphone-slash'></i>`;
  document.getElementById('muteButton').innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class='fas fa-microphone'></i>`;
  document.getElementById('muteButton').innerHTML = html;
};

const shareScreen =()=> {
  if(!myScreenStream){
    console.log('ajdfbjshdfbhjdsfbjhsfd');
   
    navigator.mediaDevices.getDisplayMedia().then(stream => {
      myScreenStream = stream;
      ScreenVideo.setAttribute("controls", "controls");
      ScreenVideo.setAttribute("id", myId+ 's');
      addVideoStream(ScreenVideo, stream);
      ScreenVideo.setAttribute("style", "display:normal");
      roomMates.forEach(users => {
        peer.call(users, stream, {
          metadata: { "type": "shareScreen" }
      });
      });    
      myScreenStream.getVideoTracks()[0].addEventListener('ended', () => 
      {    socket.emit("screen-closed",myId+'s'); // isScreenshot should be added s
      myScreenStream.getVideoTracks()[0].enabled = false;
      ScreenVideo.setAttribute("style", "display:none");
      myScreenStream = undefined;
        }
);
    })
  }

  else {
    myScreenStream.getVideoTracks()[0].enabled = false;
    ScreenVideo.setAttribute("style", "display:none");
    myScreenStream = undefined;
    socket.emit("screen-closed",myId+'s'); // isScreenshot should be added s
  }
}


// remove screen emission
socket.on('remove-screen',(screenId)=>{
  if(screenId && document.getElementById(screenId))
  document.getElementById(screenId).remove();
  let totalUsers = document.getElementsByTagName('video').length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName('video')[index].style.width = (window.innerWidth*0.8 / Math.sqrt(totalUsers))+"px" ;
      document.getElementsByTagName('video')[index].style.height = (window.innerHeight*0.8 /Math.sqrt(totalUsers)) +"px"  ;
    }
  }
})



//hand-wave 
wave_btn.addEventListener('click' , (e)=>{
  var color = e.target.style.color;
  if(color != "green")
   {
    e.target.style.color = "green";
   }
   else{
    e.target.style.color = null;
   }
   socket.emit('waved' , myName);
})

socket.on('toggleWave' , (userName)=>{
  wave_audio.play();
  console.log(userName);
  if(userName &&document.getElementById(userName+"wave")&& (document.getElementById(userName+"wave").style.color===""||document.getElementById(userName+"wave").style.color==="white"))
  document.getElementById(userName+"wave").style.color="black"; 
  else if(userName && document.getElementById(userName+"wave") && document.getElementById(userName+"wave").style.color==="black")
  document.getElementById(userName+"wave").style.color="white"; 
   
})
//photo filters 
photoFilter.addEventListener('change', (e)=> {
  // Set filter to chosen option
  filter = e.target.value;
  // Set filter to video
  myVideo.style.filter = filter;
  socket.emit('change-filter', myId+"video",filter);
  e.preventDefault(); 
});

socket.on('change-filter',(videoId,filter)=>{
  document.getElementById(videoId).style.filter = filter;
})

// messenger code starts

function appendMessage(name, img, side, text) {  
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}


// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// messenger code ends 

end_btn.addEventListener('click' , (e)=>{
  window.location.href=(`${window.location.origin}/main${ROOM_ID}`);
})



//disconnected user
socket.on("user-disconnected", (userId ,userName)=>{
if(userId && document.getElementById(userId+"video"))
document.getElementById(userId+"video").remove();
  // if (peers[userId]) peers[userId].close()
  if(userName && document.getElementById(userName+"participant"))
  document.getElementById(userName+"participant").remove();  
});

// to reverse video for lateral inversion
const setVideoReversed =(element)=> {
  element.setAttribute("style", "transform: rotateY(180deg); -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg);");
}


//currentsparticpants

currentParticipantsRef.on('value', (snapshot) => {
  var inpart ="";
  snapshot.forEach( (element )=>{
    if(!document.getElementById(`${element.key}participant`))
    { inpart =`<div id ="${element.key}participant" >${element.key}    <i class="fas fa-hand-paper white " id="${element.key}wave"></i></div>`
    console.log(element.key);
      participants.insertAdjacentHTML("beforeend",inpart);
      }
  })
});



/**
 * Start - Stop Stream recording
 */
let isStreamRecording = false;
desktopStream = myVideoStream;
  recordStreamBtn.addEventListener("click", (e) => {

    if (isStreamRecording) {
      screen_record_stop.play();
      stopStreamRecording();
    } else {
      screen_record_stop.play();
      startStreamRecording();
    }
  });

function startStreamRecording() {
  recordedBlobs = [];
  let options = { mimeType: "video/webm;codecs=vp9,opus" };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = { mimeType: "video/webm;codecs=vp8,opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = { mimeType: "video/webm" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = { mimeType: "" };
      }
    }
  }

  try {
    // record only my local Media Stream
    mediaRecorder = new MediaRecorder(myVideoStream, options);
  } catch (err) {
    console.error("Exception while creating MediaRecorder:", err);
    alert("error", "Can't start stream recording: " + err);
    return;
  }

  console.log("Created MediaRecorder", mediaRecorder, "with options", options);
  mediaRecorder.onstop = (event) => {
    console.log("MediaRecorder stopped: ", event);
    console.log("MediaRecorder Blobs: ", recordedBlobs);
    document.getElementById("info").innerHTML = "";
    downloadRecordedStream();
  };

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log("MediaRecorder started", mediaRecorder);
  isStreamRecording = true;
  recordStreamBtn.style.setProperty("background-color", "red");
  startRecordingTime();
}

/**
 * Stop recording
 */
function stopStreamRecording() {
  mediaRecorder.stop();
  isStreamRecording = false;
  setRecordButtonUi();
}


/**
 * recordind stream data
 * @param {*} event
 */
function handleDataAvailable(event) {
  console.log("handleDataAvailable", event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

/**
 * Download recorded stream
 */
function downloadRecordedStream() {
  try {
    const blob = new Blob(recordedBlobs, { type: "video/webm" });
    const recFileName = getDataTimeString() + "-REC.webm";
    const blobFileSize = bytesToSize(blob.size);

    alert(
      ` Recording Info 
        FILE: ${recFileName} 
        SIZE: ${blobFileSize} 
        Please wait to be processed, then will be downloaded to your  device.
     `
    );

    // save the recorded file to device
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = recFileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    alert("Recording save failed: " + err);
  }
}




/**
 * Start recording time
 */
 function startRecordingTime() {
  recStartTime = Date.now();
  let rc = setInterval(function printTime() {
    if (isStreamRecording) {
      recElapsedTime = Date.now() - recStartTime;
     document.getElementById("info").innerHTML =
        myName + "&nbsp;&nbsp; 🔴 REC " + getTimeToString(recElapsedTime);
      return;
    }
    clearInterval(rc);
  }, 1000);
}

function getTimeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);
  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);
  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);
  let formattedHH = hh.toString().padStart(2, "0");
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

function setRecordButtonUi() {
    recordStreamBtn.style.setProperty("background-color", "transparent");
}

function getDataTimeString() {
  const d = new Date();
  const date = d.toISOString().split("T")[0];
  const time = d.toTimeString().split(" ")[0];
  return `${date}-${time}`;
}

function bytesToSize(bytes) {
  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}


