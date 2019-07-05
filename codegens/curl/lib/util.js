module.exports = {
    /**
     * sanitizes input string by handling escape characters eg: converts '''' to '\'\''
     * and trim input if required
     *
     * @param {String} inputString
     * @param {Boolean} [trim] - indicates whether to trim string or not
     * @returns {String}
     */
    sanitize: function (inputString, trim) {
        if (typeof inputString !== 'string') {
            return '';
        }
        inputString = inputString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return trim ? inputString.trim() : inputString;
    },
    form: function (option, format) {
        if (format) {
            switch (option) {
                case '-s':
                    return '--silent';
                case '-L':
                    return '--location';
                case '-m':
                    return '--max-time';
                case '-I':
                    return '--head';
                case '-X':
                    return '--request';
                case '-H':
                    return '--header';
                case '-d':
                    return '--data';
                case '-F':
                    return '--form';
                case '--data-binary':
                    return '--data-binary';
                default:
                    return '';
            }
        }
        else {
            return option;
        }
    },

    /**
    * sanitizes input options
    *
    * @param {Object} options - Options provided by the user
    * @param {Array} optionsArray - options array received from getOptions function
    *
    * @returns {Object} - Sanitized options object
    */
    sanitizeOptions: function (options, optionsArray) {
        var result = {},
            defaultOptions = {},
            id;
        optionsArray.forEach((option) => {
            defaultOptions[option.id] = {
                default: option.default,
                type: option.type
            };
            if (option.type === 'enum') {
                defaultOptions[option.id].availableOptions = option.availableOptions;
            }
        });

        for (id in options) {
            if (options.hasOwnProperty(id)) {
                if (defaultOptions[id] === undefined) {
                    continue;
                }
                switch (defaultOptions[id].type) {
                    case 'boolean':
                        if (typeof options[id] !== 'boolean') {
                            result[id] = defaultOptions[id].default;
                        }
                        else {
                            result[id] = options[id];
                        }
                        break;
                    case 'positiveInteger':
                        if (typeof options[id] !== 'number' || options[id] < 0) {
                            result[id] = defaultOptions[id].default;
                        }
                        else {
                            result[id] = options[id];
                        }
                        break;
                    case 'enum':
                        if (!defaultOptions[id].availableOptions.includes(options[id])) {
                            result[id] = defaultOptions[id].default;
                        }
                        else {
                            result[id] = options[id];
                        }
                        break;
                    default:
                        result[id] = options[id];
                }
            }
        }

        for (id in defaultOptions) {
            if (defaultOptions.hasOwnProperty(id)) {
                if (result[id] === undefined) {
                    result[id] = defaultOptions[id].default;
                }
            }
        }
        return result;
    }
};
