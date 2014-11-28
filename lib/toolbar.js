/** An object to manage the user's salt and id */

var {Cc, Ci} = require('chrome');
var tabs = require("sdk/tabs");
var self = require('sdk/self');
var data = self.data;
var mediator = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
var main_tab = null;

var btn;
var added = false;

var Toolbar = {
    main_tab: null,
    addToolbarButton: function () {
        var self = this;
        if(added){
            return;
        }
        added = true;
        // this document is an XUL document
        var document = mediator.getMostRecentWindow('navigator:browser').document;		
        var navBar = document.getElementById('nav-bar');
        if(!navBar){
            return;
        }
        btn = document.createElement('toolbarbutton');	
        btn.setAttribute('id', 'stego_btn');
        btn.setAttribute('type', 'button');
        // the toolbarbutton-1 class makes it look like a traditional button
        btn.setAttribute('class', 'toolbarbutton-1');
        // the data.url is relative to the data folder
        btn.setAttribute('image', data.url('img/red.png'));
        btn.setAttribute('orient', 'horizontal');
        // this text will be shown when the toolbar is set to text or text and icons
        btn.setAttribute('label', 'Crypto Button');
        btn.addEventListener('click', function(){
            if(self.main_tab==null){
                tabs.open({
                    url: data.url('prefs.html'),
                    onOpen: function onOpen(tab) {
                        self.main_tab = tab;
                    },
                    onClose: function onClose(tab){
                        self.main_tab = null;
                    }
                });
            }
            else{
                self.main_tab.activate();
            }
        }, false);
        navBar.appendChild(btn);
    },
    removeToolbarButton: function removeToolbarButton() {
        // this document is an XUL document
        var document = mediator.getMostRecentWindow('navigator:browser').document;		
        var navBar = document.getElementById('nav-bar');
        var btn = document.getElementById('stego_btn');
        if(navBar && btn){
            navBar.removeChild(btn);
        }
    }
}

exports.Toolbar = Toolbar;