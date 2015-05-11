function loadStorage(){
  var keys = [ 'api','email' ];
  var api = "";
  var email = "";
  // localStorageから読込
  chrome.storage.local.get(keys, function(item){
    if(item.api != null){
      api = item.api;
    }
    if(item.email != null){
      email = item.email;
    }
    if(email == "" || api.length == ""){
      console.log("null");
      Materialize.toast('Please Setting first!', 4000)
      return;
    }else{
      sendMail(api,email);
    }
  });

}
function sendMail(api,email){
  var txtVal = $('#message').val();
  if(txtVal.length == 0)  return;
  txtVal = txtVal.replace(/\r\n/g, "<br />");
  txtVal = txtVal.replace(/(\n|\r)/g, "<br />");
  var subject = txtVal.split( '<br />' );
  console.log(txtVal);

  $.ajax({
    type: "POST",
    url: "https://mandrillapp.com/api/1.0/messages/send.json",
    data: {
      'key': api,
      //      'key': 'sIe6PNJWJEH43nJbZhDGdw',
      'message': {
        //'from_email': 'ok.okada.hiroyuki@gmail.com',
        'from_email': email,
        'to': [
          {
            //'email': 'ok.okada.hiroyuki@gmail.com',
            'email': email,
            'type': 'to'
          }
        ],
        'subject': subject[0],
        //'html':$('#message').val()
        'html': txtVal
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var blocks = document.getElementById('send_mail');
  blocks.addEventListener('click', function() {
    loadStorage();
    console.log("send_mail");
  });

  document.querySelector('#setting').addEventListener("click",function(evt){
    var keys = [ 'api','email' ];
    // localStorageから読込
    chrome.storage.local.get(keys, function(item){
      if(item.api != null){
        $('#api').val(item.api);
      }
      if(item.email != null){
        $('#email').val(item.email);
      }
      $('#modal1').openModal();
    });
    //$('#modal1').openModal();
  });

  document.querySelector('#setting-ok').addEventListener("click", function (evt) {
    var api = $("#api").val();
    var email = $("#email").val();
    var new_item = {
      'api': api,
      'email': email
    };
    console.log(api);
    console.log(email);
    // localStorageへ保存
    chrome.storage.local.set(new_item, function(){
      console.log('item saved.');
    });
  });
});

$(".button-collapse").sideNav();

$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();
});
