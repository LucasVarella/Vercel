document.addEventListener('DOMContentLoaded', function(){

  //Login
  document.getElementById('sign-in').onclick = function(e){
    let username = new String (document.getElementById('username').value).trim();
    let password = document.getElementById('password').value;

    if (username == '' || password == ''){
      msgLogin('Fill in the Username and Password.');
    }else{
      login(username=username, password=password);
    }
  }

  enterKeyLogin("username", "password", "focus");
  enterKeyLogin("password", "sign-in", "click");
  rememberLogin();
});

function login(username, password){
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data =>{
      if (data.msg == 'successful'){
        window.open('/','_self')
      }else{
        msgLogin(data.msg);
      }
    })
    .catch(error => console.error(error))
}

function msgLogin(msg){
  if (! document.querySelector('.toast')){
    toast = document.createElement('div');
      toast.classList.add('toast');
        toast_content = document.createElement('div');
        toast_content.classList.add('toast-content');
          i = document.createElement('i');
          i.setAttribute('class','fas fa-solid fa-xmark check material-symbols-outlined');
          i.innerHTML = 'priority_high';
          message = document.createElement('div');
          message.classList.add('message');
            sp1 = document.createElement('span');
            sp1.setAttribute('class','text text-1');
            sp1.innerHTML = 'Verify!';
            sp2 = document.createElement('span');
            sp2.setAttribute('class','text text-2');
            sp2.innerHTML = msg;
          message.append(sp1);
          message.append(sp2);
        toast_content.append(i);
        toast_content.append(message);
        i_x = document.createElement('i');
        i_x.setAttribute('class','fa-solid fa-xmark close material-symbols-outlined');
        i_x.innerHTML = 'close';
        progress = document.createElement('div');
        progress.classList.add('progress');
      toast.append(toast_content);
      toast.append(i_x);
      toast.append(progress);

    document.getElementById('main').append(toast);
    toast = document.querySelector(".toast");
    document.querySelector('.text-2').innerHTML = msg;
    (closeIcon = document.querySelector(".close")),
    (progress = document.querySelector(".progress"));
    toast.classList.add("active");
    progress.classList.add("active");
    let timer1, timer2;

    timer1 = setTimeout(() => {
      toast.remove();
      }, 3010); //1s = 1000 milliseconds
    

    closeIcon.addEventListener("click", () => {
      toast.classList.remove("active");

      setTimeout(() => {
          progress.classList.remove("active");
          toast.remove();
      }, 300);

      clearTimeout(timer1);
    });
  }
}

function enterKeyLogin(elementKey, elementEvent, command){
  document.getElementById(elementKey).addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === "Enter") {
      if(command === "focus"){
        document.getElementById(elementEvent).focus();
      }
      if(command === "click"){
        document.getElementById(elementEvent).click();
      }
      
    }
  });
}

function rememberLogin(){
  
  if (localStorage.getItem('remember') == undefined){
    localStorage.setItem('remember', false);
  }

  if (localStorage.getItem('remember') === 'true'){
    document.querySelector('#remember-checkbox').checked = true;
    document.querySelector('#username').value = localStorage.getItem('username');
  }
  
  document.querySelector('#remember-checkbox').onclick = function(){
    let checked =  document.querySelector('#remember-checkbox').checked;
    if (checked == false){
      localStorage.setItem('remember', false);
    }else{
      localStorage.setItem('remember', true);
    }
  }

  document.querySelector('#username').addEventListener('keyup', function(e){
    let user = document.querySelector('#username').value;
    localStorage.setItem('username', user);
  });
}