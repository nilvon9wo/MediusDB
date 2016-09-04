/* global MediusDB, DOMElement, DateTime, Note, MediusDB */
// See http://code.tutsplus.com/tutorials/working-with-indexeddb-part-2--net-35355
'use strict';

var DATABASE = {NAME: 'nettutorial_notes', VERSION: 1};
var DATABASE_STORE = 'note';

function withNoteDatabase(onSuccess) {
    'use strict';
    MediusDB.withDatabase({
        database: {
            name: DATABASE.NAME,
            version: DATABASE.VERSION
        },
        events: {
            upgradeneeded: MediusDB.defaultDatabaseUpgrade({
                note: {
                    keyDefinition: {keyPath: 'id', autoIncrement: true},
                    indexes: [
                        {propertyName: 'titleLowerCase', options: {unique: false}},
                        {propertyName: 'tags', options: {unique: false, multiEntry: true}}
                    ],
                    forceRecreate: true
                }

            }),
            success: function (event) {
                var database = event.target.result;
                onSuccess(database, event);
            }
        }
    });
}


$(document).ready(function () {
    if (!MediusDB.isSupported) {
        var message = 'IndexedDB support is required for this demo!';
        window.alert(message);
        throw new Error(message);
    }

    withNoteDatabase(function (database, event) {
        updatePage({
            database: database
        });
        addGlobalClickEvents(database);
        addFilter(database);
    });
});

function updatePage(config) {
    var database = config.database;
    if (database) {
        displayNotes(database);
        doCount(database);
    }

    var note = config.note;
    $('#key').val(note ? note.id : '');
    $('#title').val(note ? note.title : '');
    $('#body').val(note ? note.body : '');
    $('#tags').val(note ? note.tags : '');

    if (config.detailMethod) {
        $('#noteDetail')[config.detailMethod]();
    }

    if (config.formMethod) {
        $('#noteForm')[config.formMethod]();
    }
}

function displayNotes(database) {
    var storeCallback = function (store, transaction) {
        $('#noteTableBody').empty();

        var range;
        var filter = $('#filterField').val();
        if (filter.trim()) {
            range = {
                lowerBound: filter,
                upperBound: filter + '\uffff'
            };
        }

        MediusDB.withCursor({
        database: database,
            transaction: transaction,
            store: DATABASE_STORE,
            range: range,
            index: 'titleLowerCase',
            cursorCallback: function (cursor) {
                var content = Note.fromDatabaseCursor(cursor)
                        .toTableRow(getAnchorClickEvents(database));
                $('#noteTableBody').append(content);
            }
        });
    };

    MediusDB.withStore({
        database: database,
        store: DATABASE_STORE,
        events: {
            complete: function () {
                addRowClickEvents(database);
                $('#noteTable').show();
            }
        },
        storeCallback: storeCallback
    });
}

function getAnchorClickEvents(database) {
    function deleteNote() {
        var noteId = $(this).parent().parent().data('id');
        MediusDB.deleteRecord({
            database: database,
            store: DATABASE_STORE,
            key: noteId,
            transactionEvents: {
                complete: function () {
                    updatePage({
                        database: database,
                        detailMethod: 'hide',
                        formMethod: 'hide'
                    });
                }
            }
        });
    }

    deleteNote.buttonClass = 'danger';

    function editNote() {
        var noteId = $(this).parent().parent().data('id');
        MediusDB.readRecordByKey({
            database: database,
            store: DATABASE_STORE,
            key: noteId,
            events: {
                success: function (event) {
                    updatePage({
                        note: new Note(event.target.result),
                        detailMethod: 'hide',
                        formMethod: 'show'
                    });
                }
            }
        });
    }

    editNote.buttonClass = 'primary';

    return {
        'edit': editNote,
        'delete': deleteNote
    };
}


function doCount(database) {
    MediusDB.doRecordCount({
        database: database,
        store: DATABASE_STORE,
        events: {
            success: function (event) {
                var size = event.target.result;
                $('#sizeSpan').text('(' + size + ' Notes Total)');
            }
        }
    });
}

function addGlobalClickEvents(database) {
    $('#addNoteButton').on('click', function () {
        updatePage({
            detailMethod: 'hide',
            formMethod: 'show'
        });
    });

    $('#saveNoteButton').on('click', function () {
        var keyVal = $('#key').val();
        var note = new Note({
            id: (keyVal.trim() !== '') ? Number(keyVal) : undefined,
            title: $('#title').val(),
            body: $('#body').val(),
            tags: $('#tags').val()
        });
        var method = ((note.id) ? 'put' : 'add') + 'Record';
        MediusDB[method]({
            database: database,
            store: DATABASE_STORE,
            record: note,
            transactionEvents: {
                complete: function () {
                    updatePage({
                        database: database,
                        detailMethod: 'hide',
                        formMethod: 'hide'
                    });

                }
            }
        });
    });
}

function addFilter(database) {
    $('#filterField').on('keyup', function () {
        updatePage({database: database});
    });
}

function addRowClickEvents(database) {
    $('#noteList').on('click', 'td', function () {
        var noteId = $(this).parent().data('id');
        MediusDB.readRecordByKey({
            database: database,
            store: DATABASE_STORE,
            key: noteId,
            events: {
                success: function (event) {
                    var result = event.target.result;
                    if (result) {
                        new Note(result).display(tagClickHandler);
                    }
                }
            }
        });
    });

    function tagClickHandler(event) {
        var tag = event.target.text;
        var parentNoteId = $(this).data('noteid');
        var doneOne = false;
        var content = $('<div></div>')
                .append($('<strong>Related Notes:</strong>'))
                .append($('<br/>'));

        var transaction = MediusDB.monitorTransaction({
            database: database,
            store: DATABASE_STORE,
            events: {
                complete: function () {
                    if (!doneOne) {
                        content.append($('<p>No other notes used this tag.</p>'));
                    }
                    $('#relatedNotesDisplay').html(content);
                }
            }
        });

        MediusDB.withCursor({
            transaction: transaction,
            store: DATABASE_STORE,
            range: {only: tag},
            index: 'tags',
            cursorCallback: function (cursor) {
                var note = new Note(cursor.value);
                if (note.id !== parentNoteId) {
                    doneOne = true;
                    content.append(note.getLink(tagClickHandler))
                            .append($('<br/>'));
                }
            }
        });

    }
}
