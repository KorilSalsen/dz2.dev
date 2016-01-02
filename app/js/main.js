'use strict';

//Плейсхолдер
if ($.fn.placeholder) {
    $('input, textarea').placeholder();
}

//Колонки
(function(){
    $('.info__wrapper').columnize({
        columns: 2,
        lastNeverTallest: true
    });
})();

//Виды
(function(){
    $('.sort__link').on('click', function (e) {
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
})();


//Аккордеон
(function(){
    $('.sidebar-list-title').on('click', function (e) {
        e.preventDefault();

        var $this = $(this),
            className = 'sidebar-list-title_close';

        $this.siblings()
            .stop(true, true)
            .slideToggle(200);

        if ($this.hasClass(className)) {
            $this.removeClass(className)
        } else {
            $this.addClass(className)
        }
    });
})();

//Цвета

(function(){
    $('.sidebar-list__item-color').on('click', function () {
        var $this = $(this),
            className = 'sidebar-list__item-color_active';

        $this.addClass(className)
            .siblings()
            .removeClass(className);
    });
})();

//Очистка фильтров
(function(){
    $('.clear-filter').on('click', function (e) {
        e.preventDefault();

        var $this = $(this);

        $this.siblings('.sidebar-list')
            .find('.sidebar-list__input[type="checkbox"]')
            .removeAttr('checked');
    });
})();

//Слайдер
(function () {
    var sliderBlocks = $(".prise-slider");

    sliderBlocks.each(function() {
            var sliderBlock = $(this);

            var parentList = sliderBlock.closest('.sidebar-list'),
                fromPrice = parentList.find('.sidebar-list__input-text_from'),
                toPrice = parentList.find('.sidebar-list__input-text_to'),
                maxPrice = sliderBlock.data('max'),
                minPrice = sliderBlock.data('min');

            fromPrice.change(function () {
                var val = $(this).val();
                sliderBlock.slider("values", 0, val);
            });

            toPrice.change(function () {
                var val2 = $(this).val();
                sliderBlock.slider("values", 1, val2);
            });

            sliderBlock.slider({
                min: minPrice,
                max: maxPrice,
                values: [minPrice, maxPrice],
                range: true,
                step: 100,
                slide: function (event, ui) {
                    fromPrice.val(ui.values[0]);
                    toPrice.val(ui.values[1]);
                }
            });

            fromPrice.val(sliderBlock.slider("values", 0));
            toPrice.val(sliderBlock.slider("values", 1));
        }
    );
})();


//Слайдшоу
(function(){
    $('.product-slider__min-image').on('click', function () {
        var $this = $(this),
            imgPath = $this.attr('src'),
            mainImage = $this.closest('.product-slider').find('.product-slider__main-image');

        mainImage.attr('src', imgPath);
        $this.closest('.product-slider__min-image-item')
            .addClass('product-slider__min-image-item_active')
            .siblings()
            .removeClass('product-slider__min-image-item_active')
    });
})();

//Селект
$('.sort__select').select2();

//Рейтинг
(function(){
    $('.product-rating').each(function () {
        var $this = $(this),
            rating = $this.data('rating'),
            stars = $this.find('.product-rating__star'),
            count = $this.find('.product-rating__count');

        for (var i = 0; i < rating; i++) {
            stars.eq(i).addClass('product-rating__star_active');
        }

        count.text(rating);
    });
})();