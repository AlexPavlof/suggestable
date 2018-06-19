import Suggestable from './Suggestable';

$.fn.suggestable = function (parameters) {
    new Suggestable(this, parameters);
};
