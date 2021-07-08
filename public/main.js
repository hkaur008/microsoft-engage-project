const socket = io('/');
const messageInput = document.getElementById('chat_message');
const all_messages = document.getElementById('all_messages');
const main__chat__window = document.getElementById('main__chat__window');
const photoFilter = document.getElementById('photo-filter');
const msg_send_btn = document.getElementById('msg_send_btn');
const members = document.getElementById("participants_list");
const userRooms = document.getElementsByClassName("chat_list")[0];
emojiPicker =document.getElementsByTagName("emoji-picker")[0];
// join meeting
const join_meet = document.getElementById("join-meet");

const state = "out-meet";
const peers = {}
let myName;
// messenger
let messageStatus = 0;
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

//firebase references
var messagesRef =firebase.database().ref(ROOM_ID).child("messages")
var meetParticipantsRef =firebase.database().ref(ROOM_ID).child("meetParticipants")

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
        messagesRef.push().set({
      "sender": myName,
      "message": msg,
      "createdAt": formatDate(new Date())
  });
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
   myName = prompt('Please enter your name', 'Hargun');
  if (myName != null) {
     
     messagesRef.on('value', (snapshot) => {
      snapshot.forEach( (element )=>{
        if(!messageStatus){
          if(element.val().sender===myName)
        appendBeforeMessage(element.val().sender,PERSON_IMG,"right",element.val().message,element.val().createdAt)
        else{
        appendBeforeMessage(element.val().sender,PERSON_IMG,"left",element.val().message,element.val().createdAt)
        }
      }
      })
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

// all meeting participants code ends 
meetParticipantsRef.on('value', (snapshot) => {
  var inpart ="";
  snapshot.forEach( (element )=>{
    if(!document.getElementById(`${element.key}member`))
    { inpart =`<div id ="${element.key}member" >${element.key}</div>`
      members.insertAdjacentHTML("beforeend",inpart);
      }
  })
});
let counter=0;
// all meeting participants code ends 
var userRoomsRef =firebase.database().ref("users")
userRoomsRef.on('value', (snapshot) => {
  var inpart ="";
  // if(snapshot.key === myName)
    snapshot.forEach((snap)=>{
      if(snap.key===myName)
      {
       snap.child("rooms").forEach( (element )=>{
    if(!document.getElementById(`${element.key}room`))
    { counter++;
      console.log(element.key);
      inpart =`<div id ="${element.key}room" class="border" ><h5>Meeting ${counter}</h5><a href="${window.location.origin}/main${element.key}">${element.key}</a></div>`
      userRooms.insertAdjacentHTML("beforeend",inpart);
      }
  })
      }
    })
  
});

join_meet.addEventListener('click',(event)=>{
  event.preventDefault();
  window.open(`${window.location.origin}/${ROOM_ID}`);
})


