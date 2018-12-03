module.exports = {
    filter_keys : (object, keys) => {
        Object.keys(object).forEach(function(key) {
            if(keys.indexOf(key) == -1) {
                delete object[key];
            }
        });
    }
}