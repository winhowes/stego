/* This script controls all of the other content scripts and global variables */

var addon = self;

var twit_token = "";
var git_token = "";
$('.twit_error, .twit_success, .git_error, .git_success').hide();
$(function(){
    $('#twit_user').focus();
    
    $('.twitter').on('submit', function(e){
        e.preventDefault();
        $('.twit_error, .twit_success').hide();
        if($.trim($('#twit_user').val())==""||$.trim($('#twit_pass').val())==""){
            $('.twit_error').text("Please enter a username and password").fadeIn();
            return;
        }
        addon.port.emit('twit_login', {user: $.trim($('#twit_user').val()), pass: $.trim($('#twit_pass').val()), token: twit_token});
    });
    
    $('.git').on('submit', function(e){
        e.preventDefault();
        $('.git_error, .git_success').hide();
        if($.trim($('#git_user').val())==""||$.trim($('#git_pass').val())==""){
            $('.git_error').text("Please enter a username and password").fadeIn();
            return;
        }
        addon.port.emit('git_login', {user: $.trim($('#git_user').val()), pass: $.trim($('#git_pass').val()), token: git_token});
    });
});

function doGenerate() {
  var curve = "secp256k1";
  var ec = new KJUR.crypto.ECDSA({"curve": curve});
  var keypair = ec.generateKeyPairHex();

  $('#priv_key').text("Private Key: "+keypair.ecprvhex);
  $('#pub_key').text("Public Key: "+keypair.ecpubhex);
  addon.port.emit('keygen', {pub: keypair.ecpubhex, priv: keypair.ecprvhex});
}

function doSign() {
  var f1 = document.form1;
  var prvkey = f1.prvkey1.value;
  var curve = f1.curve1.value;
  var sigalg = f1.sigalg1.value;
  var msg1 = f1.msg1.value;

  var sig = new KJUR.crypto.Signature({"alg": sigalg, "prov": "cryptojs/jsrsa"});
  sig.initSign({'ecprvhex': prvkey, 'eccurvename': curve});
  sig.updateString(msg1);
  var sigValueHex = sig.sign();
  
  f1.sigval1.value = sigValueHex;
}

function doVerify() {
  var f1 = document.form1;
  var pubkey = f1.pubkey1.value;
  var curve = f1.curve1.value;
  var sigalg = f1.sigalg1.value;
  var msg1 = f1.msg1.value;
  var sigval = f1.sigval1.value;

  var sig = new KJUR.crypto.Signature({"alg": sigalg, "prov": "cryptojs/jsrsa"});
  sig.initVerifyByPublicKey({'ecpubhex': pubkey, 'eccurvename': curve});
  sig.updateString(msg1);
  var result = sig.verify(sigval);
  if (result) {
    alert("valid ECDSA signature");
  } else {
    alert("invalid ECDSA signature");
  }
}

self.port.on('startup', function(message){
    if(message.pub){
        $('#pub_key').text("Public Key: "+message.pub);
        $('#priv_key').text("Private Key: "+message.priv);
    }
    else{
        doGenerate();
    }
});

$('#keygen').on('click', function(){
    doGenerate();
});

self.port.on('twit_token', function(html){
    var temp = $(html);
    twit_token = temp.find('[name="authenticity_token"]').val();
});

self.port.on('git_token', function(html){
    var temp = $(html);
    git_token = temp.find('[name="authenticity_token"]').val();
});

self.port.on('twit_response', function(html){
    var temp = $(html);
    if(temp.find('[name="redirect_after_login"]').length){
        $('.twit_error').text("Invalid Username or Password").fadeIn();
    }
    else{
        var profile_pic = temp.find('.account-summary.account-summary-small.js-nav').find('.avatar.size32').attr('src');
        profile_pic = profile_pic.replace("normal", "bigger");
        addon.port.emit("encode_profile_pic", {id: "twit", pic: profile_pic});
        if($('.twitter').find('img').length){
            $('.twitter').find('img').remove(function(){
                $('.twitter').append('<img src="'+profile_pic+'">');
                $('.twit_success').text("Embedding Public Key...").fadeIn();
            });
        }
        else{
            $('.twitter').append('<img src="'+profile_pic+'">');
            $('.twit_success').text("Embedding Public Key...").fadeIn();
        }
    }
});

self.port.on('git_response', function(html){
    var temp = $(html);
    if(temp.find('#password[type="password"]').length){
        $('.git_error').text("Invalid Username or Password").fadeIn();
    }
    else{
        var profile_pic = temp.find('.js-avatar').attr('src');
        addon.port.emit("encode_profile_pic", { id: "git", pic: profile_pic});
        if($('.git').find('img').length){
            $('.git').find('img').remove(function(){
                $('.git').append('<img src="'+profile_pic+'">');
                $('.git_success').text("Embedding Public Key...").fadeIn();
            });
        }
        else{
            $('.git').append('<img src="'+profile_pic+'">');
            $('.git_success').text("Embedding Public Key...").fadeIn();
        }
    }
});

self.port.on('pic_uploaded', function(who){
    $('.'+who+'_success').hide().text("Public Key Embeded!").fadeIn();
})

//Print a debugging message
self.port.on('debug', function(message){
   alert(JSON.stringify(message)+", "+message); 
});