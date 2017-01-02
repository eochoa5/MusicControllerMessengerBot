$(function(){
		var socket = io.connect();
		var $container =  $('#container');
		
		socket.emit('new user', " ", function(data){

								
		});

		socket.on('new message', function(data){
			var source=data.msg + "?enablejsapi=1&autoplay=1";
			$container.html('<iframe width="100%" height="100%" src="'+source+'" frameborder="0"> </iframe>');
						
		});

});

function pause(){
	jQuery("iframe").each(function() {
  	jQuery(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
	});

}
