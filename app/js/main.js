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
