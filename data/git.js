/* Manage the git page and encode the image */
var addon = self;

addon.port.on('get_pic', function(obj){
    importImage(obj.pic, function(){
        encode(obj.pub, function(pic, content, size){
            addon.port.emit('upload_pic', {pic: pic, size: size, content: content});
        });
    });
});

addon.port.on('get_token', function(html){
    temp = $(html);
    git_token = temp.find('[name="authenticity_token"]').val();
    addon.port.emit('get_token2', git_token);
});