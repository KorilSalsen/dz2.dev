'use strict';
function addPlaceholder() {
    if ($.fn.placeholder) {
        $('input, textarea').placeholder();
    }
}
addPlaceholder();

$('.info__wrapper').columnize({
    columns: 2,
    lastNeverTallest: true
});

$('.sort__link').on('click', function(e){
    e.preventDefault();

    var $this = $(this),
        view = $this.data('view'),
        sortItem = $this.closest('.sort__item');

    $('.goods').removeClass('goods_pic goods_table goods_list')
        .addClass('goods_' + view);

    sortItem.addClass('active')
        .siblings()
        .removeClass('active')
});

$('.sidebar-list-title').on('click', function(){
    var $this = $(this),
        className = 'sidebar-list-title_close';

    $this.siblings()
        .slideToggle(200);

    if($this.hasClass(className)){
        $this.removeClass(className)
    }else{
        $this.addClass(className)
    }
});

$('.sidebar-list__item-color').on('click', function(){
    var $this = $(this),
        className = 'sidebar-list__item-color_active';

    $this.addClass(className)
        .siblings()
        .removeClass(className);
});

$('.clear-filter').on('click', function(e){
    e.preventDefault();

    var $this = $(this);

    $this.siblings('.sidebar-list')
        .find('.sidebar-list__input[type="checkbox"]')
        .removeAttr('checked');
});