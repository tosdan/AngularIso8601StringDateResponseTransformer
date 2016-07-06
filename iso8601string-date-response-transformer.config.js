(function() {
    'use strict';

    var dependencyAvailable = 'traverse' in Object;
    
    var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
    
    
    angular
        .module("tsd.dates", [])
        .config(configFn);
    

    function configFn($httpProvider) {
        if (!dependencyAvailable) {
            console.warn("Libreria Object.traverse mancante!");
            console.warn("Libreria reperibile @URL:\n\t"+"https://github.com/nervgh/object-traverse");
        }
        $httpProvider.defaults.transformResponse.push(function(responseData) {
            iso8601StringDatesToDates(responseData);
            return responseData;
        });
    } // configFn
    

    function convertStringDateToDate(node, value, key, path, depth) {
        var match;
        if (typeof value === "string" && value.length > 19 && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0])
            if (!isNaN(milliseconds)) {
                node[key] = new Date(milliseconds);
            }
        }
    } // convertStringDateToDate

    window.convertStringDateToDate = convertStringDateToDate;
    function iso8601StringDatesToDates(input) {

        // Ignore things that aren't objects.
        if (angular.isObject(input) || angular.isArray(input)) {
            Object.traverse(input, convertStringDateToDate);
        }
        return input;

    } // iso8601StringDatesToDates
    
}()); // module