/** An object to manage the user's pub and priv key */

var ss = require("sdk/simple-storage");
var Request = require("sdk/request").Request;
var base64 = require("./base64").B64;
var {Cc, Ci} = require('chrome');

if (!ss.storage.keys){
  ss.storage.keys = {};
}

function sendImage_twit(token, url, callback){
    // prepare the MIME POST data
    var boundaryString = '---------------------------131194143715851279101710142335';
    var boundary = '--' + boundaryString;
    var requestbody = boundary + '\r\n'
            + 'Content-Disposition: form-data; name="authenticity_token"\r\n'
            + '\r\n'
            + token + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="_method"' + '\r\n'
            + '\r\n'
            + 'PUT' + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="media_file_name"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="media_data[]"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="media_empty"; filename=""' + '\r\n'
            + 'Content-Type: application/octet-stream' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="media_file_name"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="media_data_empty"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="media_empty"; filename=""' + '\r\n'
            + 'Content-Type: application/octet-stream' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="user[profile_header_image_name]"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="user[profile_header_image]"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="user[profile_header_image]"' + 'filename=""\r\n'
            + 'Content-Type: application/octet-stream' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="user[name]"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="user[location]"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="user[url]"' + '\r\n'
            + '\r\n'
            + 'http://\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="user[description]"' + '\r\n'
            + '\r\n'
            + '\r\n'
            + boundary + '--\r\n';

    // Send
    var http_request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
            .createInstance(Ci.nsIXMLHttpRequest);

    http_request.onreadystatechange = function() {
        if (http_request.readyState == 4 && http_request.status == 200) {
            callback();
        }
    };

    http_request.open('POST', url, true);
    http_request.setRequestHeader("Referer", url);                  
    http_request.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundaryString);
    http_request.setRequestHeader("Connection", "keep-alive");
    http_request.setRequestHeader("Content-length", requestbody.length);
    http_request.sendAsBinary(requestbody);    

}

function sendImage_git(size, url, token, content, callback){
    // prepare the MIME POST data
    console.log("content size: "+content.length+", "+size);
    content = base64.decode(content);
    console.log("==================CONTENT============"+content);
    console.log("content size: "+content.length+", "+size);
    var boundaryString = '---------------------------5112284651347396081120827718';
    var boundary = '--' + boundaryString;
    var requestbody = boundary + '\r\n'
            + 'Content-Disposition: form-data; name="size"\r\n'
            + '\r\n'
            + (content.length) + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data;' + ' name="content_type"' + '\r\n'
            + '\r\n'
            + 'image/png' + '\r\n'
            + boundary + '\r\n'
            + 'Content-Disposition: form-data; name="file"; filename="old_prof.png"' + '\r\n'
            + 'Content-Type: image/png' + '\r\n'
            + '\r\n'
            + content
            + '\r\n'
            + boundary + '--\r\n';

    // Send
    var http_request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
            .createInstance(Ci.nsIXMLHttpRequest);

    http_request.onreadystatechange = function() {
        console.log(http_request.readyState+", "+http_request.status);
        if (http_request.readyState == 4 && http_request.status == 200) {
            console.log(http_request.responseText);
            var data = JSON.parse(http_request.responseText);
            callback(data.id);
        }
        else if(http_request.readyState==4){
            console.log(http_request.response);
            console.log(http_request.responseText);
            //console.log(requestbody);
        }
    };
    dataURI = content;
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs
    //dataURI = dataURI.replace("data:image/png;base64,", "");
    var binary = base64.decode(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    blob = content//new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    
    var formData = content;
    //formData.append("file", blob);
    
    http_request.open('POST', url, true);
    http_request.setRequestHeader("Origin", "https://github.com");
    http_request.setRequestHeader("X-CSRF-Token", token);
    http_request.setRequestHeader("Referer", "https://github.com/settings/profile");
    http_request.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundaryString);
    http_request.setRequestHeader("Connection", "keep-alive");
    http_request.setRequestHeader("Content-length", requestbody.length);
    console.log("SIZE:"+(requestbody).length+", "+size);
    http_request.send(requestbody);
}

function options_git(url, callback){
    // Send
    var http_request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
            .createInstance(Ci.nsIXMLHttpRequest);

    http_request.onreadystatechange = function() {
        if (http_request.readyState == 4 && http_request.status == 200) {
            callback();
        }
    };

    http_request.open('OPTIONS', url, true);
    http_request.setRequestHeader("Access-Control-Request-Headers", "x-csrf-token");
    http_request.setRequestHeader("Access-Control-Request-Method", "POST");
    http_request.setRequestHeader("Origin", "https://github.com");
    http_request.setRequestHeader("Connection", "keep-alive");
    http_request.send();    
}

var User = {
    obj: {},
    twit_pic: "",
    git_pic: "",
    twit_token: false,
    git_token: false,
    exists: function(){
        return (ss.storage.keys.pub)||0;
    },
    getKeys: function(){
        return ss.storage.keys;
    },
    storeKeys: function(pub, priv){
        ss.storage.keys = {
            pub: pub,
            priv: priv
        };
    },
    twit_login: function(creds, callback){
        var self = this;
        self.twit_token = creds.token;
        Request({
            url: 'https://twitter.com/sessions',
            content: {
                "session[username_or_email]": creds.user,
                "session[password]": creds.pass,
                "authenticity_token": creds.token,
                "scribe_log": "",
                "redirect_after_login": "",
                "remember_me": "0"
            },
            headers: {
                Referer: "https://twitter.com/login/"
            },
            onComplete: function (response) {
                callback(response.text);
            }
        }).post();
    },
    get_twit_token: function(callback){
        Request({
            url: 'https://twitter.com/login',
            contentType: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            onComplete: function (response) {
                callback(response.text);
            }
        }).get();
    },
    upload_twit: function(pic, callback){
        var self = this;
        Request({
            url: 'https://twitter.com/settings/profile/profile_image_update',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            content: {
                "authenticity_token": self.twit_token,
                "fileData" : pic.replace("data:image/png;base64,", ""),
                "fileName" : 'old_prof',
                "height" : "240",
                "offsetLeft" : "0",
                "offsetTop": "0",
                "page_context": "settings",
                "scribeContext[component]": "profile_image_upload",
                "scribeElement": "upload",
                "section_context": "profile",
                "uploadType": "avatar",
                "width": "240"
            },
            onComplete: function (response) {
                sendImage_twit(self.twit_token, "https://twitter.com/settings/profile", function(){
                    Request({
                        url: 'https://twitter.com/logout',
                        content: {
                            "authenticity_token": self.twit_token,
                            "scribe_log": "",
                            "reliability_event": ""
                        },
                        onComplete: function (response) {
                            callback();
                        }
                    }).post();
                });
            }
        }).post();
    },
    get_git_token: function(callback){
        Request({
            url: 'https://github.com/login',
            contentType: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            onComplete: function (response) {
                callback(response.text);
            }
        }).get();
    },
    git_login: function(creds, callback){
        var self = this;
        self.git_token = creds.token;
        Request({
            url: 'https://github.com/session',
            content: {
                "login": creds.user,
                "password": creds.pass,
                "authenticity_token": creds.token,
                "commit": "Sign+in"
            },
            headers: {
                Referer: "https://github.com/login"
            },
            onComplete: function (response) {
                callback(response.text);
            }
        }).post();
    },
    get_git_token2: function(callback){
        Request({
            url: "https://github.com/settings/profile",
            onComplete: function(response){
                callback(response.text);
            }
        }).get();
    },
    upload_git: function(pic, size, content, callback){
        var self = this;
        size = content.length;
        Request({
            url: 'https://github.com/upload/policies/avatars',
            content: {
                "name" : "old_prof.png",
                "size" : size,
                "content_type": "image/png"
            },
            headers: {
                "Host": "github.com",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0",
                "Accept": "*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-CSRF-Token": self.git_token,
                "X-Requested-With": "XMLHttpRequest",
                "Referer": "https://github.com/settings/profile",
                "Cookie": "logged_in=yes; __utma=1.184505090.1393524606.1396171750.1396175815.29; __utmz=1.1396171750.28.21.utmcsr=developer.github.com|utmccn=(referral)|utmcmd=referral|utmcct=/libraries/; _ga=GA1.2.447301444.1396171737; __utmb=1.20.10.1396175815; user_session=e8hfi4lxPeHzbUomc7i8JDUUyWv5pN1BmXGIZrhm3vUea78V; dotcom_user=winhowes; tz=America%2FNew_York; __utmc=1; _gh_sess=BAh7CjoPbGFzdF93cml0ZWwrCHfC1hJFAToPc2Vzc2lvbl9pZEkiJWJmZGQwYzNhYmNkYTMwOWE4OWI3YzAxYjY0NDZkNTE4BjoGRUY6DGNvbnRleHRJIgYvBjsHVDoOcmV0dXJuX3RvIhUvc2V0dGluZ3MvZW1haWxzSSIKZmxhc2gGOwdUSUM6J0FjdGlvbkNvbnRyb2xsZXI6OkZsYXNoOjpGbGFzaEhhc2h7AAY6CkB1c2VkewA%3D--172577d4f074e2513111d533a26dc90366093024",
                "Connection": "keep-alive",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            //contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            onComplete: function (response) {
                var data = JSON.parse(response.text);
                //var size = data.asset.size;
                options_git(data.upload_url, function(){
                    sendImage_git(size, data.upload_url, self.git_token, content, function(id){
                         Request({
                            url: 'https://github.com/settings/avatars/'+id,
                            content: {
                                "authenticity_token": self.git_token,
                                "cropped_x" : '0',
                                "cropped_y" : "0",
                                "cropped_width" : "640",
                                "cropped_height": "640",
                                "op" : "save"
                            },
                            onComplete: function (response) {
                                console.log('we be here');
                                Request({
                                    url: 'https://github.com/logout',
                                    content: {
                                        "authenticity_token": self.git_token
                                    },
                                    onComplete: function (response) {
                                        callback();
                                    }
                                }).post();
                            }
                        }).post();
                    });
                });
            }
        }).post();
    }
}

exports.User = User;