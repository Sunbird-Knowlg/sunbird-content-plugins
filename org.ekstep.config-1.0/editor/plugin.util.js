$(function() {
    $('body').on('mousedown', '#plugin-toolbar-container', function() {
        $(this).addClass('plugin-toolbar-draggable').on('mousemove', function(e) {
            $('.plugin-toolbar-draggable').offset({
                top: e.pageY - $('.plugin-toolbar-draggable').outerHeight() / 2,
                left: e.pageX - $('.plugin-toolbar-draggable').outerWidth() / 2
            }).on('mouseup', function() {
                $(this).removeClass('plugin-toolbar-draggable');
            });
        });

    }).on('mouseup', function() {
        $('#plugin-toolbar-container').removeClass('plugin-toolbar-draggable');
    });
});
