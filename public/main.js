const socket = io('/');
const messageInput = document.getElementById('chat_message');
const all_messages = document.getElementById('all_messages');
const main__chat__window = document.getElementById('main__chat__window');
const photoFilter = document.getElementById('photo-filter');
const msg_send_btn = document.getElementById('msg_send_btn');
const members = document.getElementById("participants_list");
const reportGenerate = document.getElementById('generate_report');
const userRooms = document.getElementsByClassName("chat_list")[0];
emojiPicker =document.getElementsByTagName("emoji-picker")[0];
// join meeting
const join_meet = document.getElementById("join-meet");

const state = "out-meet";
const peers = {}
let myName  = prompt('Please enter your name', '');;



// messenger
let messageStatus = 0;
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

//firebase references
var messagesRef =firebase.database().ref(ROOM_ID).child("messages")

// Icons made by Freepik from www.flaticon.com
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const userName ='hargun';
let myId = null ;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443',
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

console.log(myName + " first");
//username input
const nameInput = (id)=> {

  

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
  console.log(myName + " inside");
}

console.log(myName + " outside");



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



if((ROOM_ID+"").length===36)
{var meetParticipantsRef =firebase.database().ref(ROOM_ID).child("meetParticipants")
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
}


let counter=0;
// all meeting participants code ends 
console.log("reached here"+myName + " counter")
var userRoomsRef =firebase.database().ref("users")
userRoomsRef.on('value', (snapshot) => {
console.log("went-inside");
  var inpart ="";
  // if(snapshot.key === myName)
    snapshot.forEach((snap)=>{
      if((snap.key)===myName)
      {
       snap.child("rooms").forEach( (element )=>{
    if(!document.getElementById(`${element.key}room`) && element.key!="00000000-0000-0000-0000-000000000000")
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
  if((ROOM_ID+"").toLowerCase()!= myName.toLowerCase())
  window.open(`${window.location.origin}/${ROOM_ID}`);
  else{
    window.open(`${window.location.origin}/teams-webrtc`);

  }
})

var dataJSON;
var jsonDL;



reportGenerate.addEventListener('click', ()=>{
// all meeting participants code ends 
var recordHTML = start_template;
if((ROOM_ID+"").length===36)
{meetParticipantsRef.on('value', (snapshot) => {
  var inpart ="";
    snapshot.forEach((element)=>{
      recordHTML = recordHTML + ` <div class="accordion" id="accordionExample">
      <div class="accordion-item">
      <h2 class="accordion-header" id="heading${element.key}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${element.key}" aria-expanded="false" aria-controls="collapse${element.key}">
        ${element.key}</button></h2>
           <div id="collapse${element.key}" class="accordion-collapse collapse" aria-labelledby="heading${element.key}" data-bs-parent="#accordionExample">
            <div class="accordion-body">
<div><table class="table">
<thead><tr><th scope="col"> Arrived at </th><th> Departed at </th></tr>
</thead>
<tbody>`;
       
      var record = [];
      element.forEach((el)=>{
        element.forEach((x)=>{
        
          recordHTML = recordHTML + `<tr>
          <td>${new Date(x.val().arrival_time).toLocaleString()}</td>
          <td>${new Date(x.val().disconnected_time).toLocaleString()}</td>
          </tr>`

        })
      })
      recordHTML = recordHTML + `</tbody></table></div>
      </div>   
      </div></div></div>      
      `

    })
    
});

recordHTML = recordHTML + `
</div></div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>
</html>
`;
download( `${ROOM_ID}_${new Date().toLocaleString()}.html`,recordHTML);
}

})


function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// boilerplates for download template 

var start_template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Record</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>    
<div class ="container">
    <div class="bg-dark text-light p-4">List of partcipants</div>
   `
