var MediusElement = {
    create: function (config) {
        'use strict';
        var tag = config.tag;
        var attributes = attributes || {};
        var innerContent = config.innerContent;
        var newString = '';

        function addAttributes(attributes) {
            var attributeString = '';
            for (var property in attributes) {
                attributeString += ' ' + property + '=' + attributes[property] + ' ';
            }
            return attributeString;
        }

        function makeInnerContent(innerContent) {
            if (typeof innerContent === 'function') {
                return innerContent();
            } else {
                return innerContent;
            }
        }

        newString += '<' + tag + addAttributes(attributes) + '>';

        if (innerContent) {
            if (!innerContent.isArray()) {
                innerContent = [innerContent];
            }
            innerContent.forEach(function (content) {
                newString += makeInnerContent(content);
            });
        }

        newString += '</' + tag + '>';
        return newString;
    }
};
