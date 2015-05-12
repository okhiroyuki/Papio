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

/**
 * 日付をフォーマットする
 * @param  {Date}   date     日付
 * @param  {String} [format] フォーマット
 * @return {String}          フォーマット済み日付
 */
var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

function sendMail(api,email){
  var txtVal = $('#message').val();
  if(txtVal.length == 0)  return;
  txtVal = txtVal.replace(/\r\n/g, "<br />");
  txtVal = txtVal.replace(/(\n|\r)/g, "<br />");
  var subject = txtVal.split( '<br />' );
  txtVal += '<br />---<br />Send from Papio at ' + formatDate(new Date(),'YYYY/MM/DD hh:mm:ss') + '<br />';
  console.log(txtVal);

  $.ajax({
    type: "POST",
    url: "https://mandrillapp.com/api/1.0/messages/send.json",
    data: {
      'key': api,
      'message': {
        'from_email': email,
        'to': [
          {
            'email': email,
            'type': 'to'
          }
        ],
        'subject': subject[0],
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
