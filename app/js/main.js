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

(function(){
    var sliderBlock = $(".prise-slider"),
        fromPrice= $('.sidebar-list__input-text_from'),
        toPrice= $('.sidebar-list__input-text_to');

    fromPrice.change(function () {
        var val = $(this).val();
        sliderBlock.slider("values",0,val);
    });

    toPrice.change( function() {
        var val2 = $(this).val();
        sliderBlock.slider("values",1,val2);
    });

    sliderBlock.slider({
        min: 100,
        max: 10000,
        values: [100, 10000],
        range: true,
        step: 100,
        slide: function( event, ui ) {
            fromPrice.val(ui.values[0]);
            toPrice.val(ui.values[1]);
        }
    });

    fromPrice.val(sliderBlock.slider("values",0));
    toPrice.val(sliderBlock.slider("values",1));
})();

$('.product-slider__min-image').on('click', function(){
    var $this = $(this),
        imgPath = $this.attr('src'),
        mainImage = $this.closest('.product-slider').find('.product-slider__main-image');

    mainImage.attr('src', imgPath);
    $this.closest('.product-slider__min-image-item')
        .addClass('product-slider__min-image-item_active')
        .siblings()
        .removeClass('product-slider__min-image-item_active')
});

$('.sort__select').select2();