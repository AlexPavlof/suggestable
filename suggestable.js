/**
 * Search suggester with cache and go-go-dancers.
 *
 * Usage:
 *     $('selector').suggestable({
 *         'data-url'          : 'object\'s data-property which contains url to suggests',
 *         'container-class'   : 'css class name for drop-down ul',
 *         'item-class'        : 'css class name for each suggest item',
 *         'item-active-class' : 'css class name for active suggest item',
 *         'term-class'        : 'css class name for term part of each suggest item',
 *         'suggest-class'     : 'css class name for suggest part of each suggest item',
 *         'delimiter-text'    : 'text for delimiter between term and text parts',
 *         'delimiter-class'   : 'css class name for delimiter between term and text parts',
 *         'text-class'        : 'css class name for text part of each suggest item',
 *         'term-min-length'   : 'minimum length required to trigger request'
 *     });
 *
 * Provides events:
 *     $(document).trigger('suggestable-show', [$container]):     Suggestable container is shown
 *     $(document).trigger('suggestable-hide', [$container]):     Suggestable container is hidden
 *     $(document).trigger('suggestable-click', [$container]):    Suggestable item is clicked
 *     $(document).trigger('suggestable-item-select', [$item]):   Suggestable item is selected
 *     $(document).trigger('suggestable-item-unselect', [$item]): Suggestable item is unselected
 */
(function ($) {
    'use strict';

    // Keycode constants
    var
        KEY_UP       = 38,
        KEY_DOWN     = 40,
        KEY_ENTER    = 13,
        KEY_NUMENTER = 108,
        KEY_ESCAPE   = 27;

    $.fn.suggestable = function (parameters) {
        var
            options      = $.extend({
                'data-url'          : 'suggestable-url',
                'container-class'   : 'suggestable-container',
                'item-class'        : 'suggestable-item',
                'item-active-class' : 'suggestable-item-active',
                'term-class'        : 'suggestable-term',
                'suggest-class'     : 'suggestable-suggest',
                'delimiter-text'    : ' — ',
                'delimiter-class'   : 'suggestable-delimiter',
                'text-class'        : 'suggestable-text',
                'term-min-length'   : 3
            }, parameters),
            itemSelector = '.' + options['item-class'],
            hoverIndex   = -1,
            cache        = {},
            getContainer = function ($self) {
                var
                    id          = $self.attr('id') || ('sb' + Math.round(Math.random() * 9999) + 1),
                    containerId = id + '__container',
                    selector    = '#' + containerId,
                    $matches    = $(selector);

                if ($matches.length < 1) {
                    return $('<ul/>', {
                        'class' : options['container-class'],
                        'id'    : containerId
                    }).css({
                        'margin-top' : $self.outerHeight(true) + 'px',
                        'display'    : 'none'
                    }).insertAfter($self);
                }

                return $matches.first();
            };

        // Handle mouse over and out on item
        $(document).on('mouseover', itemSelector, function (event) {
            hoverIndex = $(event.currentTarget).data('suggest-index');
            $(document).trigger('suggestable-item-select', [$(event.currentTarget)]);
        }).on('mouseout', itemSelector, function (event) {
            hoverIndex = -1;
            $(document).trigger('suggestable-item-unselect', [$(event.currentTarget)]);
        }).on('mouseup', function (event) {
            // Hide all containers on click outside
            var $container = $('.' + options['container-class']);

            if (!$container.is(event.target) && $container.has(event.target).length === 0) {
                $(document).trigger('suggestable-hide', [$container]);
            }
        }).on('suggestable-hide', function (event, $container) {
            $container.hide();
        }).on('suggestable-show', function (event, $container) {
            hoverIndex = -1;
            $container.show();
        }).on('suggestable-item-select', function (event, $item) {
            $item.closest('.' + options['container-class']).children().removeClass(options['item-active-class']);
            $item.addClass(options['item-active-class']);
        }).on('suggestable-item-unselect', function (event, $item) {
            $item.removeClass(options['item-active-class']);
        });

        $(this).attr("autocomplete", "off").on('keydown', function (event) {
            var
                keyCode    = (event.keyCode || event.which),
                $self      = $(event.currentTarget),
                $container = getContainer($self),
                $suggestion;

            // Handle ENTER key press on text field
            if ($container.is(':visible')) {
                switch (keyCode) {
                    case (KEY_ENTER || KEY_NUMENTER):
                        $container.find('[data-suggest-index=' + hoverIndex + ']').trigger('click');
                        break;

                    case KEY_UP:
                        if (hoverIndex === -1 || hoverIndex <= $(itemSelector, $container).first().data('suggest-index')) {
                            hoverIndex = $(itemSelector, $container).last().data('suggest-index');
                        } else {
                            hoverIndex = $container.find('[data-suggest-index=' + (hoverIndex - 1) + ']').data('suggest-index');
                        }

                        $suggestion = $container.find('[data-suggest-index=' + hoverIndex + ']');
                        $suggestion.trigger('mouseover');
                        $self.val($suggestion.data('suggest-data'));
                        break;

                    case KEY_DOWN:
                        if (hoverIndex === -1 || hoverIndex >= $(itemSelector, $container).last().data('suggest-index')) {
                            hoverIndex = $(itemSelector, $container).first().data('suggest-index');
                        } else {
                            hoverIndex = $container.find('[data-suggest-index=' + (hoverIndex + 1) + ']').data('suggest-index');
                        }

                        $suggestion = $container.find('[data-suggest-index=' + hoverIndex + ']');
                        $suggestion.trigger('mouseover');
                        $self.val($suggestion.data('suggest-data'));
                        break;
                }

                if ([KEY_DOWN, KEY_UP, KEY_ENTER, KEY_NUMENTER].indexOf(keyCode) !== -1 && hoverIndex !== -1) {
                    return false;
                }
            }

            // Handle click on item
            $(document).on('click', itemSelector, function (event) {
                $self.val($(event.currentTarget).data('suggest-data'));

                $(document).trigger('suggestable-hide', [$container])
                    .trigger('suggestable-click', [$(event.currentTarget)]);
            });

            return true;
        }).on('keyup', function (event) {
            var
                $self      = $(event.currentTarget),
                keyCode    = (event.keyCode || event.which),
                $container = getContainer($self),
                url        = $self.data(options['data-url']),
                term       = $self.val(),
                successCb  = function (items) {
                    var
                        i     = 0,
                        $item = $('<li/>', {
                            'class' : options['item-class']
                        }).hide();

                    if (items.length > 0) {
                        $container.empty();

                        /*jslint plusplus: true */
                        for (i = 0; i < items.length; i++) {
                            $item.empty();

                            // Divide string into two spans for design.
                            $item.append($('<span/>', {
                                'class' : options['term-class']
                            }).text(term)).append($('<span/>', {
                                    'class' : options['suggest-class']
                                }).text(items[i]['query'].substr(term.length)))
                                .attr('data-suggest-data', items[i].query)
                                .attr('data-suggest-index', i)
                                .attr('data-suggest-url', items[i]['suggest-url']);

                            if (items[i]['suggest-text'] !== '') {
                                $item.append($('<span/>', {
                                    'class': options['delimiter-class']
                                }).text(options['delimiter-text'])).append($('<span/>', {
                                    'class': options['text-class']
                                }).text(items[i]['suggest-text']));
                            }

                            $container.append($item.show().clone());
                        }

                        $(document).trigger('suggestable-show', [$container]);
                    }
                };

            if ([KEY_DOWN, KEY_UP, KEY_ENTER, KEY_NUMENTER, KEY_ESCAPE].indexOf(keyCode) === -1) {
                if (term.length >= options['term-min-length']) {
                    if (!cache.hasOwnProperty(url + ':' + term)) {
                        $.get(
                            url,
                            {term : term},
                            function (data) {
                                cache[url + ':' + term] = data;
                                successCb(cache[url + ':' + term]);
                            },
                            'json'
                        );
                    } else {
                        successCb(cache[url + ':' + term]);
                    }
                } else {
                    $(document).trigger('suggestable-hide', [$container]);
                }
            }

            if ($container.is(':visible') && keyCode === KEY_ESCAPE) {
                $(document).trigger('suggestable-hide', [getContainer($self)]);

                return false;
            }

            return true;
        });
    };
}(jQuery));
