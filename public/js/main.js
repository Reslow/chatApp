const chatForm = document.getElementById('chatForm')
const chatMessages = document.querySelector(".chatMessages")
const userList = document.getElementById('users')

// get username from URL
const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const socket = io()

socket.emit('joinRoom', {username})


// get users
socket.on('chatUsers', ({users}) =>{
    let names = {username}
    socket.emit('chatUsers',names )
    

    outputUsers(users)

})


socket.on('message', message => {
    outputMess(message)
    // scrolldown
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// listen on submit (message)
chatForm.addEventListener('submit',(e) => {
    e.preventDefault()

    // get msg
    const msg = e.target.elements.msg.value
    socket.emit("chat", msg)
    
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})
    
    
function outputMess(message){
    const div = document.createElement('div')
    div.classList.add('message')
div.innerHTML = 
`<p class="username">${message.username}<span> ${message.time} </span></p>
<p>${message.text}</p>`
    document.querySelector(".chatMessages").appendChild(div)
}


// addUsersToDOM

function outputUsers(users){

userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}

