$(function(){

    if(location.pathname == '/register'){
		$('.box').removeClass('on');
		$('#register-container').addClass('on');
	}

	$('.login-link').click(function(e){
		e.preventDefault();
		$('#register-container').fadeOut('normal', function(){
			if($('ul#errors'))
				$('ul#errors').fadeOut('fast').remove();
			$('#login-container').fadeIn('normal');
		});
	});
	
	$('.register-link').click(function(e){
		e.preventDefault();
		$('#login-container').fadeOut('normal', function(){
			if($('ul#errors'))
				$('ul#errors').fadeOut('fast').remove();
			$('#register-container').fadeIn('normal');
		});
	});
	
	
});