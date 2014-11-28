var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var {Cc, Ci} = require("chrome");
var self = require('sdk/self');
var data = self.data;
var Toolbar = require("./toolbar").Toolbar;
var User = require("./user").User;
var workers = [];
var twit_url = "https://pbs.twimg.com/stego_page";
var git_url = "https://avatars0.githubusercontent.com/stego_page"+(Math.random()*99999);

exports.main = function(options){

    if(options.loadReason == "install" || options.loadReason == "startup"){
        Toolbar.addToolbarButton();
    }
    
    var cctPage = pageMod.PageMod({
        include: "https://connectcarolina2.com/crypto",
        attachTo: ["existing", "top"],
        contentScriptWhen: 'ready',
        contentScriptFile: [data.url('lib/jquery-1.10.1.min.js'),
                            data.url('lib/crypto/core.js'),
                        data.url('lib/crypto/cipher-core.js'),
                        data.url('lib/crypto/enc-base64.js'),
                        data.url('lib/crypto/sha256.js'),
                        data.url('lib/crypto/yahoo.min.js'),
                        data.url('lib/crypto/base64x-1.1.min.js'),
                        data.url('lib/crypto/ext/jsbn.js'),
                        data.url('lib/crypto/ext/jsbn2.js'),
                        data.url('lib/crypto/ext/prng4.js'),
                        data.url('lib/crypto/ext/rng.js'),
                        data.url('lib/crypto/ext/rsa.js'),
                        data.url('lib/crypto/ext/rsa2.js'),
                        data.url('lib/crypto/ext/base64.js'),
                        data.url('lib/crypto/asn1hex-1.1.min.js'),
                        data.url('lib/crypto/rsapem-1.1.min.js'),
                        data.url('lib/crypto/rsasign-1.2.js'),
                        data.url('lib/crypto/x509-1.1.min.js'),
                        data.url('lib/crypto/pkcs5pkey-1.0.min.js'),
                        data.url('lib/crypto/asn1-1.0.min.js'),
                        data.url('lib/crypto/asn1x509-1.0.min.js'),
                        data.url('lib/crypto/crypto-1.1.min.js'),
                        data.url('lib/crypto/ext/ec.js'),
                        data.url('lib/crypto/ext/ec-patch.js'),
                        data.url('lib/crypto/ecdsa-modified-1.0.js'),
                        data.url('lib/crypto/ecparam-1.0.js'),
                            data.url('crypto.js')],
        onAttach: function(worker) {
            workers.push(worker);
            worker.on('detach', function () {
                detachWorker(this, workers);
            });
            
            worker.port.emit('startup', User.getKeys());
        }
    });
    
    var TwitPage = pageMod.PageMod({
        include: twit_url,
        attachTo: ["existing", "top"],
        contentScriptWhen: 'ready',
        contentScriptFile: [data.url('lib/jquery-1.10.1.min.js'),
                            data.url('sjcl.js'),
                            data.url('stego.js'),
                        data.url('twit.js')],
        onAttach: function(worker) {
            workers.push(worker);
            worker.on('detach', function () {
                detachWorker(this, workers);
            });
            
            worker.port.emit('get_pic', {pic: User.twit_pic, pub: User.getKeys().pub});
            worker.port.on('upload_pic', function(obj){
                User.upload_twit(obj.pic, function(){
                    for(var i=0; i<workers.length; i++){
                        if(workers[i].url==Toolbar.main_tab.url){
                            workers[i].port.emit('pic_uploaded', 'twit');
                            User.get_twit_token(function(response){
                                for(var i=0; i<workers.length; i++){
                                    if(workers[i].url==Toolbar.main_tab.url){
                                        workers[i].port.emit('twit_token', response);
                                    }
                                }
                            });
                        }
                    }
                });
                worker.tab.close();
            });
        }
    });
    
    var GitPage = pageMod.PageMod({
        include: git_url,
        attachTo: ["existing", "top"],
        contentScriptWhen: 'ready',
        contentScriptFile: [data.url('lib/jquery-1.10.1.min.js'),
                            data.url('sjcl.js'),
                            data.url('stego.js'),
                        data.url('git.js')],
        onAttach: function(worker) {
            workers.push(worker);
            worker.on('detach', function () {
                detachWorker(this, workers);
            });
            
            worker.port.emit('get_pic', {pic: User.git_pic, pub: User.getKeys().pub});
            worker.port.on('upload_pic', function(obj){
                User.obj = obj;
                User.get_git_token2(function(response){
                    worker.port.emit('get_token', response);
                });
                
            });
            worker.port.on('get_token2', function(token){
                User.git_token = token;
                User.upload_git(User.obj.pic, User.obj.size, JSON.stringify(User.obj.content), function(){
                    for(var i=0; i<workers.length; i++){
                        if(workers[i].url==Toolbar.main_tab.url){
                            workers[i].port.emit('pic_uploaded', 'git');
                            User.get_git_token(function(response){
                                for(var i=0; i<workers.length; i++){
                                    if(workers[i].url==Toolbar.main_tab.url){
                                        workers[i].port.emit('git_token', response);
                                    }
                                }
                            });
                        }
                    }
                });
                //worker.tab.close();
            });
        }
    });
    
    var StegoPage = pageMod.PageMod({
        include: data.url('prefs.html'),
        attachTo: ["existing", "top"],
        contentScriptWhen: 'ready',
        contentScriptFile: [data.url('lib/jquery-1.10.1.min.js'),
                        data.url('lib/crypto/core.js'),
                        data.url('lib/crypto/cipher-core.js'),
                        data.url('lib/crypto/enc-base64.js'),
                        data.url('lib/crypto/sha256.js'),
                        data.url('lib/crypto/yahoo.min.js'),
                        data.url('lib/crypto/base64x-1.1.min.js'),
                        data.url('lib/crypto/ext/jsbn.js'),
                        data.url('lib/crypto/ext/jsbn2.js'),
                        data.url('lib/crypto/ext/prng4.js'),
                        data.url('lib/crypto/ext/rng.js'),
                        data.url('lib/crypto/ext/rsa.js'),
                        data.url('lib/crypto/ext/rsa2.js'),
                        data.url('lib/crypto/ext/base64.js'),
                        data.url('lib/crypto/asn1hex-1.1.min.js'),
                        data.url('lib/crypto/rsapem-1.1.min.js'),
                        data.url('lib/crypto/rsasign-1.2.js'),
                        data.url('lib/crypto/x509-1.1.min.js'),
                        data.url('lib/crypto/pkcs5pkey-1.0.min.js'),
                        data.url('lib/crypto/asn1-1.0.min.js'),
                        data.url('lib/crypto/asn1x509-1.0.min.js'),
                        data.url('lib/crypto/crypto-1.1.min.js'),
                        data.url('lib/crypto/ext/ec.js'),
                        data.url('lib/crypto/ext/ec-patch.js'),
                        data.url('lib/crypto/ecdsa-modified-1.0.js'),
                        data.url('lib/crypto/ecparam-1.0.js'),
                        //data.url('sjcl.js'),
                        //data.url('stego.js'),
                        data.url('runway.js')],
        onAttach: function(worker) {
            workers.push(worker);
            worker.on('detach', function () {
                detachWorker(this, workers);
            });
            
            worker.port.emit('startup', User.getKeys());
            
            worker.port.on('keygen', function(message){
                User.storeKeys(message.pub, message.priv);
            });
            
            User.worker = worker;
            
            User.get_twit_token(function(response){
                worker.port.emit('twit_token', response);
            });
            
            User.get_git_token(function(response){
                worker.port.emit('git_token', response);
            });
            
            worker.port.on('twit_login', function(message){
                User.twit_login(message, function(response){
                    worker.port.emit('twit_response', response);
                });
            });
            
            worker.port.on('git_login', function(message){
                User.git_login(message, function(response){
                    worker.port.emit('git_response', response);
                });
            });
            
            worker.port.on('encode_profile_pic', function(message){
                // Open a new tab on active window in the background.
                if(message.id=="twit"){
                    User.twit_pic = message.pic;
                    tabs.open({
                        url: twit_url,
                        inBackground: true
                    });
                }
                else if(message.id=="git"){
                    User.git_pic = message.pic;
                    tabs.open({
                        url: git_url,
                        inBackground: true
                    });
                }
            });
        }
    });
}

exports.onUnload = function(reason) {
    Toolbar.removeToolbarButton();
};

function detachWorker(worker, workerArray) {
    var index = workerArray.indexOf(worker);
    if(index != -1) {
        workerArray.splice(index, 1);
    }
}