const socket = io('/');
const messageInput = document.getElementById('chat_message');
const all_messages = document.getElementById('all_messages');
const main__chat__window = document.getElementById('main__chat__window');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const photoFilter = document.getElementById('photo-filter');
const msg_send_btn = document.getElementById('msg_send_btn');
const wave_btn = document.getElementById('wave_btn');
const end_btn = document.getElementById('leave-meeting')
emojiPicker =document.getElementsByTagName("emoji-picker")[0];
let filter = 'none';
myVideo.muted = true;
const peers = {}
const state = "in-meet";

// sounds 
const wave_audio = new Audio('audio/wave.mp3');

// messenger

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


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
    addVideoStream(myVideo, stream);

    peer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');

      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });


//user connected    
    socket.on('user-connected', (userId , state) => {
     
     if(state == "in-meet") connectToNewUser(userId, stream);
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
      
  }

  //emoji picker 
  emojiPicker.addEventListener("emoji-click", (e) => {
    //console.log(e.detail);
    //console.log(e.detail.emoji.unicode);
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
    video.setAttribute("id", call.peer+"video");
      call.on('stream', (remoteStream)=> {
        addVideoStream(video, remoteStream);
        peers[call.peer]=call;
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
  var userName = prompt('Please enter your name', 'Hargun');
  if (userName != null) {
    socket.emit('join-room', ROOM_ID, id , userName , state);
    myId=id;
  }
}


// CHAT
const connectToNewUser = (userId, streams) => {
  var call = peer.call(userId, streams);
  var video = document.createElement('video');
  video.setAttribute("id", userId+"video");

  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  peers[userId] = call
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
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: 'always'
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true
    }
  }).then(stream => {
      const screenTrack = stream;
      const myScreen = document.createElement('video');
      addVideoStream(myScreen, screenTrack );
      
      screenTrack.onended = ()=> {
          stopScreenShare();
      }
   }, (err)=> {
    console.log('Failed to get screen sharing', err);
  }
   )
}

const stopScreenShare=()=>{

}

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
  document.getElementById(userId+"video").remove();
  // if (peers[userId]) peers[userId].close()
});

