const currentTimeZone = "America/Sao_Paulo";

document.addEventListener('DOMContentLoaded', function(){

  // Start Sidebar by the atual status
  if (localStorage.getItem('status') === 'closed'){
    document.querySelector('aside').classList.add('aside-close');
  }else{
    document.querySelector('aside').classList.add('aside-open');
  }
  
  // Change the status of the Sidebar
  document.getElementById('icon-more').onclick = function(){
    if (localStorage.getItem('status') === 'closed'){

      document.querySelector('aside').classList.remove('aside-close-animation');
      document.querySelector('aside').classList.add('aside-open-animation');
      document.querySelectorAll('.component-sidebar').forEach(function(component){
        component.classList.remove('component-close-animation');
        component.classList.add('component-open-animation');
      })

      document.querySelector('aside').classList.add('aside-open');
      document.querySelector('aside').classList.remove('aside-close');
      localStorage.setItem('status','opened');

    }else{
      document.querySelector('aside').classList.remove('aside-open-animation');
      document.querySelector('aside').classList.add('aside-close-animation');

      document.querySelectorAll('.component-sidebar').forEach(function(component){
        component.classList.add('component-close-animation');
        component.classList.remove('component-open-animation');
      })
      
      document.querySelector('aside').classList.add('aside-close');
      document.querySelector('aside').classList.remove('aside-open');
      localStorage.setItem('status','closed');
    }
  }

  // Hit Point
  if(document.getElementById('entry') !=undefined){
    document.getElementById('entry').onclick = function(e){
      hitPoint(type='E',text='Entry');
    }
  }
  if(document.getElementById('pause') !=undefined){
    document.getElementById('pause').onclick = function(e){
      hitPoint(type='P',text='Pause');
    }
  }
  if(document.getElementById('return') !=undefined){
    document.getElementById('return').onclick = function(e){
      hitPoint(type='R',text='Return');
    }
  }
  if(document.getElementById('exit') !=undefined){
    document.getElementById('exit').onclick = function(e){
      hitPoint(type='Q',text='Exit');
    }
  }

  // Registers
  if(document.getElementById('registers') !=undefined){
    document.getElementById('registers').onclick = function(e){
      document.querySelector('.point-page ').style.display = 'none';
      document.getElementById('registers-points').style.display = 'flex';
    }
  }
  
  // Close Registers
  if(document.getElementById('close-registers') !=undefined){
    document.getElementById('close-registers').onclick = function(e){
      document.getElementById('registers-points').style.display = 'none';
      document.querySelector('.point-page ').style.display = 'flex';
      
    }
  }

  // Send Correction
  if(document.getElementById('send-correction') !=undefined){
    document.getElementById('send-correction').onclick = function(e){
      let date = document.getElementById('date-correction').value;
      let type = document.getElementById('types-correction').value;
      let time = document.getElementById('time-correction').value;
      let motive = document.getElementById('motives-correction').value;
      let department = document.getElementById('department-correction').value;
      if (date=="" || type =="0" || time =="" || motive =="0" || department == "0"){
        if (date ==""){
          fillInputAlert('date-correction');
        }
        if (type == 0){
          fillInputAlert('types-correction');
        }
        if (time ==""){
          fillInputAlert('time-correction');
        }
        if (motive == 0){
          fillInputAlert('motives-correction');
        }
        if (department == 0){
          fillInputAlert('department-correction');
        }
      }else{
        if (validDate(date, timeZone= currentTimeZone)){
          sendCorrection(date=date, type=type, correctTime=time, motive=motive, department=department);
        }else{
          fillInputAlert('date-correction');
        }

      }
      
    }
  }

  // Cancel Correction
  if(document.querySelector('.btn-cancel-correction') !=undefined){
    document.querySelectorAll('.btn-cancel-correction').forEach(function(component){
      component.onclick = function(e){
        const correction_id = e.currentTarget.dataset.id;
        Swal.fire({
          title: 'Are you sure?',
          text: `You're about to delete the correction`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, hit it!'
        }).then((result) => {
          if (result.isConfirmed) {
            cancelCorrection(correction_id);
          }
        })
      }
    })
  }

  document.querySelector('aside').dataset.status = localStorage.getItem('status');
});

function validDate(date, timeZone){
  const timeElapsed = new Date(Date.now());
  var today = timeElapsed.toLocaleString("en-US", {timeZone: `${timeZone}`});
  var selectDate = new Date(date);
  var selectDate = selectDate.toLocaleString("en-US", {timeZone: `${timeZone}`});
  if (selectDate > today){
    return false;
  }
  return true;
}

function hitPoint(type, text){
  Swal.fire({
    title: 'Are you sure?',
    text: `You're about to hit the ${text} point`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, hit it!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch('', {
        method: 'POST',
        body: JSON.stringify({ type: type }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data =>{
        if (data.status == 'successful'){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your hited the point!',
            showConfirmButton: false,
            timer: 2000
          })
          let timer = setTimeout(function(){
            window.open('/','_self')
          }, 1500)
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.msg,
          })
        }
      })
      .catch(error => console.error(error))
    }
  })
  
}

function fillInputAlert(element){
  
  document.getElementById(`${element}`).classList.add('fill-input');
  setTimeout(function(){
    document.getElementById(`${element}`).classList.remove('fill-input');
  },2500)
  
}

function sendCorrection(date, type, correctTime, motive, department){
  fetch('/correction', {
    method: 'POST',
    body: JSON.stringify({ date: date,type: type, correctTime: correctTime, motive: motive, department: department}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data =>{
    if (data.status == 'successful'){
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Correção enviada',
        showConfirmButton: false,
        timer: 2000
      })
      console.log(data)
      let timer = setTimeout(function(){
        window.open('/correction','_self')
      }, 2500)
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.msg,
      })
    }
  })
  .catch(error => console.error(error))
}

function cancelCorrection(correction_id){
  fetch('/correction', {
    method: 'PUT',
    body: JSON.stringify({ id: correction_id}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data =>{
    if (data.status == 'successful'){
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Apagado com sucesso!',
        showConfirmButton: false,
        timer: 1000
      })
      console.log(data)
      let timer = setTimeout(function(){
        window.open('/correction','_self')
      }, 1000)
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.msg,
      })
    }
  })
  .catch(error => console.error(error))
}

window.addEventListener('load', () =>{
  document.querySelector('body').style.display = 'block';
});