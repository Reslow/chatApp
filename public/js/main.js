const chatForm = document.getElementById('chatForm')
const chatMessages = document.querySelector(".chatMessages")
const userList = document.getElementById('users')

// get username from URL
const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  console.log(userList)

const socket = io()

socket.emit('joinRoom', {username})

// get users

socket.on('chatUsers', ({users}) =>{
    outputUsers(users)
    console.log(users)

})

console.log(username)

socket.on('message', message => {
    outputMess(message)
})

// listen on submit (message)
chatForm.addEventListener('submit',(e) => {
    e.preventDefault()

    // get msg
    const msg = e.target.elements.msg.value
    socket.emit("chat", msg)

    // scrolldown
    chatMessages.scrollTop = chatMessages.scrollHeight

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})
    
    
function outputMess(message){
    const div = document.createElement('div')
    div.classList.add('message')
div.innerHTML = 
`<p>${message.username}<span>${message.time}</span></p>
<p>${message.text}</p>`
    document.querySelector(".chatMessages").appendChild(div)
}

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
