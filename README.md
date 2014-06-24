jquery-suggestable
==================

Simple jQuery plugin implementing search suggests with local cache.

#### Usage
```
$('selector').suggestable({
    'data-url'          : 'object\'s data-property which contains url to suggests',
    'container-class'   : 'css class name for drop-down ul',
    'item-class'        : 'css class name for each suggest item',
    'item-active-class' : 'css class name for active suggest item',
    'term-class'        : 'css class name for term part of each suggest item',
    'suggest-class'     : 'css class name for suggest part of each suggest item',
    'term-min-length'   : 'minimum length required to trigger request'
});
```

#### Provides events
```
$(document).trigger('suggestable-show', [$container]);     // Suggestable container is shown
$(document).trigger('suggestable-hide', [$container]);     // Suggestable container is hidden
$(document).trigger('suggestable-click', [$container]);    // Suggestable item is clicked
$(document).trigger('suggestable-item-select', [$item]);   // Suggestable item is selected
$(document).trigger('suggestable-item-unselect', [$item]); // Suggestable item is unselected
```
