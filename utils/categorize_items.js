const _ = require('lodash');

module.exports = (items) => {
    var sorted_items = {};
    items.forEach(item => {
        if (!(item.category in sorted_items)){
            sorted_items[item.category] = [];
        }
        sorted_items[item.category].push(_.omit(item.toObject(), ['category']));
    });
    return sorted_items;
}