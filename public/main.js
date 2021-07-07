const socket = io('/');
const messageInput = document.getElementById('chat_message');
const all_messages = document.getElementById('all_messages');
const main__chat__window = document.getElementById('main__chat__window');
const photoFilter = document.getElementById('photo-filter');
const msg_send_btn = document.getElementById('msg_send_btn');

emojiPicker =document.getElementsByTagName("emoji-picker")[0];
const state = "out-meet";
const peers = {}


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


//user connected    
    socket.on('user-connected', (userId , state) => {
      console.log("userconnected"+userId+" "+state);
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
    messageInput.value += e.detail.emoji.unicode;
  });

    socket.on('createMessage', (msg , userName , givenId) => {
      if(givenId===myId)
        appendMessage(userName, PERSON_IMG, "right", msg);
      else
      appendMessage(userName, PERSON_IMG, "left", msg);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;
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



