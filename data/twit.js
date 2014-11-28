/* Manage the twitter page and encode the image */
var addon = self;

addon.port.on('get_pic', function(obj){
    importImage(obj.pic, function(){
        encode(obj.pub, function(pic, content){
            addon.port.emit('upload_pic', {pic: pic});
        });
    });
});