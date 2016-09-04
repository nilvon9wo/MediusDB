/* global DOMElement, DateTime, MediusDateTime */
function Note(config) {
    if (config.id) {
        this.id = config.id;
    }
    this.title = config.title;
    this.titleLowerCase = this.title.toLowerCase();
    this.body = config.body;

    if (config.tags) {
        this.tags = (config.tags.isArray()) ? config.tags : config.tags.split(',');
    }

    this.updated = config.updated || new Date();
}

Note.fromDatabaseCursor = function(cursor) {
    var note = new Note(cursor.value);
    note.key = cursor.key;
    return note;
};

Note.prototype.display = function(tagClickHandler) {
    var self = this;
    var tagContent = $('<div></div>');
    if (this.tags && this.tags.length > 0) {
        var tagList = $('<ol></ol>').addClass('tags');
        this.tags.forEach(function(tag) {
            var tagItem = $('<li></li>')
                .addClass('tag');

            var tagAnchor = $('<a>' + tag + '</a>')
                .addClass('tagLookup')
                .attr('title', 'Click for Related Notes')
                .data('noteid', self.id)
                .click(tagClickHandler);

            tagItem.append(tagAnchor);
            tagList.append(tagItem);
        });

        var relatedContent = $('<div></div>')
            .attr('id', 'relatedNotesDisplay');

        tagContent
            .append($('<strong>Tags:</strong>'))
            .append(tagList)
            .append($('<br/>'))
            .append(relatedContent);
    }

    $('#noteDetail').empty()
        .append($('<h2>' + this.title + '</h2>'))
        .append(tagContent)
        .append($('<p>' + this.body + '</p>'))
        .show();
};

Note.prototype.getLink = function(tagClickHandler) {
    'use strict';
    var self = this;
    return $('<a>' + this.title + '</a>')
        .addClass('loadNote')
        .data('noted', this.id)
        .click(function() {
            self.display(tagClickHandler);
        });
};

Note.prototype.toTableRow = function(anchorClickEvents) {
    var titleTd = $('<td>' + this.title + '</td>')
        .addClass('notetitle');

    var updatedTd = $('<td>' + MediusDateTime.format(this.updated) + '</td>');

    var actionsTd = $('<td></td>');

    for (var key in anchorClickEvents) {
        var buttonLabel = key.charAt(0).toUpperCase() + key.slice(1);
        var buttonClass = anchorClickEvents[key].buttonClass;
        var anchor = $('<a>' + buttonLabel + '</a>')
            .addClass('btn btn-' + buttonClass + ' ' + key)
            .on('click', anchorClickEvents[key]);
        actionsTd.append(anchor);
    }

    return $('<tr></tr>')
        .attr({'data-id': this.id})
        .attr({'data-key': this.key})
        .append(titleTd)
        .append(updatedTd)
        .append(actionsTd);
};

