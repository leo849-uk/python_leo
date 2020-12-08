/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/people',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(fname, lname, sname, gname, dname, aname, pname) {
            let ajax_options = {
                type: 'POST',
                url: 'api/people',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'fname': fname,
                    'lname': lname,
                    'sname': sname,
                    'gname': gname,
                    'dname': dname,
                    'aname': aname,
                    'pname': pname
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(fname, lname, sname, gname, dname, aname, pname) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/people/' + lname,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'fname': fname,
                    'lname': lname,
                    'sname': sname,
                    'gname': gname,
                    'dname': dname,
                    'aname': aname,
                    'pname': pname
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(lname) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/people/' + lname,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $fname = $('#fname'),
        $lname = $('#lname'),
        $sname = $('#sname'),
        $gname = $('#gname'),
        $dname = $('#dname'),
        $aname = $('#aname'),
        $pname = $('#pname');


    // return the API
    return {
        reset: function() {
            $lname.val('');
            $fname.val('');
            $sname.val('');
            $gname.val('');
            $dname.val('');
            $aname.val('');
            $pname.val('').focus();

        },
        update_editor: function(fname, lname, sname, gname, dname, aname, pname) {
            $lname.val(lname);
            $fname.val(fname);
            $sname.val(sname);
            $gname.val(gname);
            $dname.val(dname);
            $aname.val(dname);
            $pname.val(pname).focus();
        },
        build_table: function(people) {
            let rows = ''

            // clear the table
            $('.people table > tbody').empty();

            // did we get a people array?
            if (people) {
                for (let i=0, l=people.length; i < l; i++) {
                    rows += `<tr><td class="fname">${people[i].fname}</td><td class="lname">${people[i].lname}</td><td class="sname">${people[i].sname}</td></tr><td class="gname">${people[i].gname}</td></tr><td class="dname">${people[i].dname}</td></tr><td class="aname">${people[i].aname}</td></tr><td class="pname">${people[i].pname}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $fname = $('#fname'),
        $lname = $('#lname'),
        $sname = $('#sname'),
        $gname = $('#gname'),
        $dname = $('#dname'),
        $aname = $('#aname'),
        $pname = $('#pname');


    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(fname, lname, sname, gname, dname, aname, pname) {
        return fname !== "" && lname !== "" &&sname !== "" &&gname !== "" &&dname !== "" &&aname !== "" &&pname !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let fname = $fname.val(),
            lname = $lname.val(),
            sname = $sname.val(),
            gname = $gname.val(),
            dname = $dname.val(),
            aname = $aname.val(),
            pname = $pname.val();

        e.preventDefault();

        if (validate(fname, lname, sname, gname, dname, aname, pname)) {
            model.create(fname, lname, sname, gname, dname, aname, pname)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function(e) {
        let fname = $fname.val(),
            lname = $lname.val(),
            sname = $sname.val(),
            gname = $gname.val(),
            dname = $dname.val(),
            aname = $aname.val(),
            pname = $pname.val();

        e.preventDefault();

        if (validate(fname, lname, sname, gname, dname, aname, pname)) {
            model.update(fname, lname, sname, gname, dname, aname, pname)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let lname = $lname.val();

        e.preventDefault();

        if (validate('placeholder', lname)) {
            model.delete(lname)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            fname,
            lname,
            sname,
            gname,
            dname,
            aname,
            pname

        fname = $target
            .parent()
            .find('td.fname')
            .text();

        lname = $target
            .parent()
            .find('td.lname')
            .text();

        sname = $target
            .parent()
            .find('td.sname')
            .text();

        gname = $target
            .parent()
            .find('td.gname')
            .text();

        dname = $target
            .parent()
            .find('td.dname')
            .text();

        aname = $target
            .parent()
            .find('td.aname')
            .text();

        pname = $target
            .parent()
            .find('td.pname')
            .text();

        view.update_editor(fname, lname, sname, gname, dname, aname, pname);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));