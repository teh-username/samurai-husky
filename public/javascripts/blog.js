(function(){
    var parts = window.location.href.split('/');
    var blogName = parts[parts.length-1];
    $('li#'+blogName).addClass('active');
})();

$(function(){
    $('#comment-submit').on('click', function(event){
        event.preventDefault();
        var url = window.location.href + '/comment';
        $.post(url, $('#comment-form').serialize(), function(response){
            if(!response.isSuccessful){
                grecaptcha.reset();
                $('#'+response.error).addClass('has-error');
                return;
            }
            location.reload();
        });
    });

    $('[name]').on('change', function(){
        $(this).parent().removeClass('has-error');
    });
});
