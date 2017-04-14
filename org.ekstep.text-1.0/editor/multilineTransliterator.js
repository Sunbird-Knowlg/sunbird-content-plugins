/**
 * @class  org.ekstep.plugins.text.MultilineTransliterator
 */
org.ekstep.plugins.text.MultilineTransliterator = Class.extend({

    init: function($q, transliterateService) {
        this.$q = $q;
        this.transliterateService = transliterateService;
    },
    /**
     * This method Takes an English string and a language code and returns a
     * transliterated text in the given language.
     * @param {string} text -  Orignial text in english. Can have line breaks.
     * @param {string} languageCode - language code
     * @param {function} callback - callback function to be called when API call returns
     * @returns {void}
     */
    transliterate: function(text, languageCode, callback) {
        var instance = this;
        var $q = this.$q;
        var texts = _.map(text.split('\n'), encodeURI);

        var promisify = function(method, data) {
            var deferer = $q.defer();
            method(data, function(err, data) {
                if (err) {
                    deferer.reject(err)
                } else {
                    deferer.resolve(data);
                }
            });
            return deferer.promise;
        }

        var promises = _.map(texts, function(text) {
            var data = {};
            data.text = text;
            data.languages = [languageCode];

            if (text == "") {
                data.text = " ";
            }

            return promisify(instance.transliterateService.getTransliteration.bind(instance.transliterateService), data);
        });

        var mapValues = function(obj, callback) {
            if (angular.isArray(obj))
                return obj.map(callback)

            var ret = {}
            Object.keys(obj).forEach(function(key, val) {
                ret[key] = callback(obj[key], key)
            })
            return ret
        };

        var allSettled = function(promises) {
            return $q.all(mapValues(promises, function(promiseOrValue) {
                if (!promiseOrValue.then)
                    return { state: 'fulfilled', value: promiseOrValue }

                return promiseOrValue.then(function(value) {
                    return { state: 'fulfilled', value: value }
                }, function(reason) {
                    return { state: 'rejected', reason: reason }
                })
            }))
        };

        allSettled(promises).then(function(result) {
            var transliteratedText = _.map(result, function(item, index) {
                if (item.state == 'fulfilled' && item.value.data.result.transliterations[languageCode] != undefined) {
                    var val = item['value']['data']['result']['transliterations'][languageCode]['output'];
                    if (val)
                        return val;
                    else
                        return texts[index];
                } else {
                    return texts[index];
                }
            }).join('\n');
            callback(transliteratedText);
        })


    }

})

org.ekstep.plugins.text.MultilineTransliterator.create = function($q, transliterateService) {
    return new org.ekstep.plugins.text.MultilineTransliterator($q, transliterateService)
}
