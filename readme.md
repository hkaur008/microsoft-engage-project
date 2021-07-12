# Microsoft Engage Mentorship program'21 project   
## Microsoft Teams Clone
### 🚩 Overview 
In COVID 19 pandemic , it has become cruicial for many people to work remotely from their home.Mostly Schools, Colleges and Companies started operating their works through Video Conferencing and Business Communication platforms such as Microsoft Teams who play a vital role to empower communities and stay connected.
It is an integration of video calling and chat application with variety of features for developers, students, teams to work together in a collabrative environment.  
This is solely built during the period of **Microsoft Engage Mentorship program'21** conducted by Microsoft provide mentorship and to enrich freshmen with various software development techniques. 
#### Problem statement (as given)
To build a fully functional prototype with at least one mandatory functionality - a minimum of two participants should be able connect with each other using the product to have a video conversation.

##### Adopt feature:
Include a chat feature in your application where meeting participants can share info without disrupting the flow of the meeting. Through this feature the participants should be able have conversation befor joining, while in the meet and after leaving the meeting.

<img width=49% src="/readme_assets/homepage.gif"> <img width=49% src="/readme_assets/hoveroverhome.gif">


## 🔗 Links for project:
 Video link : [https://www.youtube.com/watch?v=jNZO4J5RIPI](https://www.youtube.com/watch?v=jNZO4J5RIPI)  
 Live demo : Azure : [http://microsoftengage.azurewebsites.net/](http://microsoftengage.azurewebsites.net/) Heroku :  [https://microsoft-demo.herokuapp.com/](https://microsoft-demo.herokuapp.com/)
## 🌐 Web flow
<img width=70% src="https://user-images.githubusercontent.com/56452820/125286530-86d9e500-e339-11eb-92d0-64fa09951138.png" >


## 🚩 Agile methology and workflow:
Agile methology was followed by implementation of sprint of 4 days in a week , continuous integration and developmet while hosting the app both on Azure and Heroku.
Work was proceeded in different branches using git version control and successfully developed patches were merged to ruling branch . Customer view points and Teams as an inspiration was taken in mind to develop this project. Bugs were solved according to priority scale
Priority scale : P5 (maximum) to P1 (Least)

| Week | Task |  Remarks |
|------|:----:|---------|
| 1    | **Design phase** P4: basic app built by exploring technologies  , P3: Setup server Peer.js , express , socket.io P2: Chatbox  |   Successfull setup implementation and chat box            |
| 2    | P4: Screen Sharing , P3: Filters , P2:Send messages button , P5: PeerId undefined(Bug)     |    All bugs resolved             |
| 3    | P4: List of Participants, P5: Firebase reference error , P3:Hand raise , P5: PeerId undefined(Bug) , P4: Video call connection     |     Problem statement tasking completed|
| 4    | **Desgin phase and build** P4: Chat Before and after with chat rooms , **Testing and review** P3:Hosting on Azure , P5: Service unavaible error 505 (Bug) , P4: Homepage , P3:Record of participants    |    Adopted task completed  , Branch changing resolved bug             |

## 🚩 Features:
Feature | Images
------------ | -------------
 **Hompage**  
 Mouse Interactive UI is motivation of connecting around the globe feature using particle.js . Options for users : **Profile Login** : To see all records of user ,access chatroom and meeting , **Join Meet**  , **Start new Meeting**  | <img width="750px" height="300px" src="/readme_assets/hoveroverhome.gif">
Meeting Screen![image](https://user-images.githubusercontent.com/56452820/125260357-e3c7a200-e31d-11eb-8c96-e70cfbe9a708.png) |White board ![image](https://user-images.githubusercontent.com/56452820/125260142-a82cd800-e31d-11eb-8718-c69fd8052f7b.png) | 
 Tool bar| ![Mute Unmute](https://user-images.githubusercontent.com/56452820/125264078-2c348f00-e321-11eb-981f-8b2c7f68fee9.png) 
Participant List , Hand Raise , Invite Participants ![image](https://user-images.githubusercontent.com/56452820/125260613-225d5c80-e31e-11eb-868b-623f90b9a1a5.png)|Screen Sharing ![image](https://user-images.githubusercontent.com/56452820/125260014-87fd1900-e31d-11eb-9839-72cf59a75020.png)
**Chat integration** : Chat during meeting | **Emojis integration**
Chat Screen | ![image](https://user-images.githubusercontent.com/56452820/125260478-fcd05300-e31d-11eb-9e67-ce8fa9ca6a42.png)
![Animated GIF-downsized](https://user-images.githubusercontent.com/56452820/125267964-e1b51180-e324-11eb-8f69-709d17aa3a5f.gif)| **Photo - filters** ![Animated GIF-downsized_large (1)](https://user-images.githubusercontent.com/56452820/125271930-e085e380-e328-11eb-943d-8f3ca64d5911.gif)
**Chat  After and Before meeting** : | 
![image](https://user-images.githubusercontent.com/56452820/125268645-83d4f980-e325-11eb-8c45-66e7edc36c99.png)|![image](https://user-images.githubusercontent.com/56452820/125270334-30fc4180-e327-11eb-89f2-0b3d54e04f2d.png)
List of participants in the room (On clicking on file button meeting record gets downloaded as right side) ![image](https://user-images.githubusercontent.com/56452820/125270284-22ae2580-e327-11eb-996c-322e90399aa9.png)| Meeting Record with timing ![image](https://user-images.githubusercontent.com/56452820/125270667-82a4cc00-e327-11eb-80fc-f9d947d2d049.png)  

**Other Features :**
Users can independently:
1. chose to stop or resume video of any particpants 
2. mute or unmute its audio and decrease f increase volume
3. view on fullscreen as well  

##  🚩 Technologies used:
#### Programming Languages : <img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white"/><img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/> <img alt="HTML5" src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"/> <img alt="CSS3" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"/><img alt="Bootstrap" src="https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white"/><img alt="jQuery" src="https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white"/>  
#### Version Control : <img alt="Git" src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white"/>  
#### Hosting : <img alt="Azure" src="https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=azure-devops&logoColor=white"/> <img alt="Heroku" src="https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white"/>
####  Frameworks/Libraries : Express , Ejs , Socket.io , Peerjs, UUID
###### You can also see the list of dependencies in the package.json file.
## 🚩Installation/Environment Setup 

  #### 1. Clone App
  
  * Make a new folder and open the terminal there.
  * Write the following command and press enter.
  
  ```
    $ git clone https://github.com/hkaur008/microsoft-engage-project.git
  ```
    
 #### 2. Install node packages
  * Write the following command and press enter to download all required node modules.
 
   ```
   $ npm install 
  ```
  
#### 3. Run Locally

 * While you are still inside the cloned folder, write the following command to run the website locally. 
 
 ```
   $ npm start
 ```
  
 ###### NOTE: The port by default will be ```http://localhost:443/```

## 🚩 Future Scopes:-
Feature | Explanation
------------ | -------------
Specific Team group Atmosphere manager| As Teams is a chat conversational platform as well, wanted to build a chat room positivity meter to analyse chat text to extract user sentiments and emotional state during the conversation using Microsoft Cognitive Services or ML APIs.    
Send Code integration | A microsoft teams inspired feature for developers to work in collabrative environment and code together.
Blind mode | Switching to this mode user will hear the tool description through audios ,and can video call their families as well.


