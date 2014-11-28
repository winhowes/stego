/* Manage the git page and encode the image */
var addon = self;

var priv, pub, time;

function doSign() {
  var prvkey = priv;
  var curve = "secp256k1";
  var sigalg = "SHA256withECDSA";
  var msg1 = $('#item').val();

  var sig = new KJUR.crypto.Signature({"alg": sigalg, "prov": "cryptojs/jsrsa"});
  sig.initSign({'ecprvhex': prvkey, 'eccurvename': curve});
  sig.updateString(msg1);
  var sigValueHex = sig.sign();
  
  $('#sig').text(sigValueHex);
}

$(function(){
    $('#item').on('input', function(){
            doSign();
    });
});

addon.port.on('startup', function(keys){
   priv = keys.priv;
});