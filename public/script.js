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
let filter = 'none';
myVideo.muted = true;
var roomMates = new Set();
const state = "in-meet";
let myName;
let myScreenStream;

// sounds 
const wave_audio = new Audio('audio/wave.mp3');

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
let myId = null ;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030',
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
                setVideoReversed(video);
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
      document.getElementsByTagName('video')[index].style.width =
        100 / totalUsers + '%';
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
   socket.emit('waved' , myId);
})

socket.on('toggleWave' , (userId)=>{
  wave_audio.play();
  console.log(userId+ " waved");
})
//photo filters 
photoFilter.addEventListener('change', (e)=> {
  // Set filter to chosen option
  filter = e.target.value;
  // Set filter to video
  myVideo.style.filter = filter;
  e.preventDefault(); 
});


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
  window.location.href = '../'
})



//disconnected user
socket.on("user-disconnected", (userId)=>{
if(userId && document.getElementById(userId+"video"))
document.getElementById(userId+"video").remove();
  // if (peers[userId]) peers[userId].close()
});

// to reverse video for lateral inversion
const setVideoReversed =(element)=> {
  element.setAttribute("style", "transform: rotateY(180deg); -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg);");
}


//currentsparticpants

currentParticipantsRef.on('value', (snapshot) => {
  var inpart ="";
  snapshot.forEach( (element )=>{
     inpart =inpart +`<div id ="${element.key}participant" >${element.key}    <i class="fas fa-hand-paper " id="${element.key}wave"></i></div>`
    console.log(element.key);
  })
  document.getElementById("participants_list").innerHTML=inpart;
});