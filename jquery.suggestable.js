/**
 * Search suggester with cache and go-go-dancers.
 *
 * Usage:
 *     $('selector').suggestable({
 *         'data-url'        : 'object\'s data-property which contains url to suggests',
 *         'container-class' : 'css class name for drop-down div',
 *         'item-class'      : 'css class name for each suggest item',
 *         'term-class'      : 'css class name for term part of each suggest item',
 *         'suggest-class'   : 'css class name for suggest part of each suggest item'
 *     });
 */
(function ($) {
    'use strict';

    $.fn.suggestable = function () {
        var cache = {};

        $(this).on('keyup', function (parameters) {
            var self       = $(this),
                options    = $.extend({
                    'data-url'        : 'suggestable-url',
                    'container-class' : 'suggestable-container',
                    'item-class'      : 'suggestable-item',
                    'term-class'      : 'suggestable-term',
                    'suggest-class'   : 'suggestable-suggest'
                }, parameters),
                url        = self.data(options['data-url']),
                term       = self.val(),
                $container = (function () {
                    var
                        id          = self.attr('id') || ('sb' + Math.round(Math.random() * 9999) + 1),
                        containerId = id + '__container',
                        selector    = '#' + containerId,
                        $matches    = $(selector);

                    if ($matches.size() < 1) {
                        return $('div', {
                            'class' : options['container-class'],
                            'id'    : containerId
                        }).insertAfter(self);
                    }

                    return $matches.first();
                }()),
                successCb  = function (items) {
                    var i     = 0,
                        $item = $('div', {
                            'class' : options['item-class']
                        }).on('click', function () {
                            self.val($(this).data('suggest'));
                        }).hide();

                    if (items.length > 0) {
                        $container.empty();

                        /*jslint plusplus: true */
                        for (i = 0; i < items.length; i++) {
                            $item.empty();

                            // Divide string into two spans for design.
                            $item.append($('span', {
                                'class' : options['term-class']
                            }).text(term)).append($('span', {
                                'class' : options['suggest-class']
                            }).text(items[i].substr(term.length))).data('suggest', items[i]);

                            $container.append($item.clone());
                        }

                        $container.show();
                    }
                };

            if (term.length >= 3) {
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
            }
        });
    };
}(jQuery));
