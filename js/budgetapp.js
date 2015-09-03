var myDataRef = new Firebase('https://budget-analysis-app.firebaseio.com/');
var incomes = myDataRef.child('incomes');
var expenses = myDataRef.child('expenses');
var accounts = myDataRef.child('accounts');
var allocations = myDataRef.child('allocations');
var executed = false, inctotals = 0, todelete;

function loaditems() {
  displayList('#budlist', allocations);
  displayList('#inclist', incomes);
  displayList('#explist', expenses);
  displayList('#acclist', accounts);
  settotals(allocations, '#budgeted');
  settotals(incomes, '#expected');
  settotals(expenses, '#spend');
  settotals(accounts, '#available');
/*    allocations.child('records').once("value", function(snapshot) {
    var i = 1;
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();      
      var catid = 'cat' + i; 
      var delfunction = "deleteitem('" + key + "', '" + childData.name +"')";

      todelete = '<button type="button" class="btn btn-default btn-sm" onclick="' + delfunction +'"> <span class="glyphicon glyphicon-remove " aria-hidden="true"></span></button>';

      categorytotals(childData.name, '#' + catid);

      $('<tr/>').text('').prepend($('<td/>').html(todelete)).prepend($('<td id="'+ catid +'">').text('')).prepend($('<td/>').text(childData.amount)).prepend(
        $('<td class="item">').text(childData.name)).prepend($(
        '<td class="priority">').text(i)).appendTo($('#budlist'));
      $('#budlist')[0].scrollTop = $('#budlist')[0].scrollHeight;
      $('<option/>').text(childData.name).appendTo($('#expselect'));
      
      i += 1;
    });

    settotals(allocations, '#budgeted');

  });*/

  

 /* incomes.child('records').once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      $('<tr/>').text('').prepend($('<td/>').text(childData.amount)).prepend(
        $('<td/>').text(childData.name)).appendTo($(
        '#inclist'));
      $('#inclist')[0].scrollTop = $('#inclist')[0].scrollHeight;
    });

    settotals(incomes, '#expected');


  });

  

  expenses.child('records').once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      $('<tr/>').text('').prepend($('<td/>').text(childData.amount)).prepend(
        $('<td/>').text(childData.cat)).prepend($('<td/>').text(childData.name)).appendTo($('#explist'));
      $('#explist')[0].scrollTop = $('#explist')[0].scrollHeight;
    });

    settotals(expenses, '#spend');

  });

  accounts.child('records').once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      $('<tr/>').text('').prepend($('<td/>').text(childData.amount)).prepend(
        $('<td/>').text(childData.name)).appendTo($(
        '#acclist'));
      $('#acclist')[0].scrollTop = $('#acclist')[0].scrollHeight;
    });

    settotals(accounts, '#available');

  });
  
    */
    

  window.setTimeout(function() {
    settotals(null, '#totals');
  }, 5000);
  

  
}

function sendtodb(id) {
  if (id === 'incbtn') {
    var inc = $('#inc').val();
    var amt = $('#incamt').val();

    if (!validate(inc, amt, '#incerror')) {
      closealert('#incerror');
      return;
    }

    var data = {
      name: inc,
      amount: amt
    };

    incomes.child('counter').transaction(function(currentValue) {
      return (currentValue || 0) + 1;
    }, function(err, committed, ss) {
      if (err) {
        setError(err);
      } else if (committed) {
        addRecord('rec' + ss.val(), data, '#expected', incomes);
      }

    });


    $('#inc').val('');
    $('#incamt').val('');

  } else if (id === 'expbtn') {
    var exp = $('#exp').val();
    var amt = $('#expamt').val();
    var category = $('#expselect').val();

    if (!validate(exp, amt, '#experror')) {
      closealert('#experror');
      return;
    }

    if (category === '0') {
      $('#experror').addClass('alert alert-danger col-md-12');
      $('#experror').text('Please select Category');
      closealert('#experror');
      return;
    }

    var data = {
      name: exp,
      cat: category,
      amount: amt
    };

    expenses.child('counter').transaction(function(currentValue) {
      return (currentValue || 0) + 1;
    }, function(err, committed, ss) {
      if (err) {
        setError(err);
      } else if (committed) {
        addRecord('rec' + ss.val(), data, '#spend', expenses);
      }
    });

    $('#exp').val('');
    $('#expamt').val('');
    $('#expselect').val('0');

  } else if (id === 'accbtn') {
    var acc = $('#acc').val();
    var amt = $('#accbal').val();

    if (!validate(acc, amt, '#accerror')) {
      closealert('#accerror');
      return;
    }

    var data = {
      name: acc,
      amount: amt
    };

    accounts.child('counter').transaction(function(currentValue) {
      return (currentValue || 0) + 1;
    }, function(err, committed, ss) {
      if (err) {
        setError(err);
      } else if (committed) {
        addRecord('rec' + ss.val(), data, '#available', accounts);
      }
    });

    $('#acc').val('');
    $('#accbal').val('');
  } else if (id === 'budbtn') {
    var bud = $('#budg').val();
    var amt = $('#budgamt').val();
    if (!validate(bud, amt, '#budgerror')) {
      closealert('#budgerror');
      return;
    }

    var data = {
      name: bud,
      amount: amt
    };

    allocations.child('counter').transaction(function(currentValue) {
      return (currentValue || 0) + 1;
    }, function(err, committed, ss) {
      if (err) {
        setError(err);
      } else if (committed) {
        addRecord('rec' + ss.val(), data, '#budgeted', allocations);
      }
    });

    $('#budg').val('');
    $('#budgamt').val('');
  }
  
}

function addRecord(recordid, data, id, type) {
  type.child('records').child(recordid).set(data, function(error) {
    if (error) {
      alert("error saving data." + error);
    } else {
      settotals(type, id);
    }
  });

  type.child('records').on('child_added', function(snapshot) {
    var message = snapshot.val();
  });
}

function displayList(id, type) {

  type.child('records').once("value", function(snapshot) {

    var i = 1;
    var source = $(id).closest('tbody').attr('id');

    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();

      var childData = childSnapshot.val();  

      var delfunction = "deleteitem('" + key + "', '" + childData.name +"', '" + source +"')";
      todelete = '<button type="button" class="btn btn-default btn-sm" onclick="' + delfunction +'"> <span class="glyphicon glyphicon-remove " aria-hidden="true"></span></button>';

      if (type === allocations) {
        var catid = 'cat' + i; 
        categorytotals(childData.name, '#' + catid);
        $('<tr/>').text('').prepend($('<td/>').html(todelete)).prepend($('<td id="'+ catid +'">').text('')).prepend($('<td/>').text(childData.amount)).prepend($('<td class="item">').text(childData.name)).prepend($('<td class="priority">').text(i)).appendTo($(id));
        $('<option/>').text(childData.name).appendTo($('#expselect'));

      } else if (type === expenses) {
        $('<tr/>').text('').prepend($('<td/>').html(todelete)).prepend($('<td id="'+ catid +'">').text('')).prepend($('<td/>').text(childData.amount)).prepend($('<td/>').text(childData.cat)).prepend($('<td/>').text(childData.name)).prepend($(
        '<td class="priority">').text(i)).appendTo($(id));

      } else {
        $('<tr/>').text('').prepend($('<td/>').html(todelete)).prepend($('<td/>').text(childData.amount)).prepend(
        $('<td class="item">').text(childData.name)).prepend($(
        '<td class="priority">').text(i)).appendTo($(id));
      }
      
      i += 1;

    });    

  });
}

$(document).ready(function() {
  $('#tabs a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
  });


  $( "span.glyphicon-remove" ).hover( function() {
      $( this ).parent().addClass( "btn-danger" );
    }, function() {
      $( this ).parent().removeClass( "btn-danger" );
  });
  
});

function closealert(id) {
  window.setTimeout(function() {
    $(id).removeClass('alert alert-danger col-md-12');
    $(id).text('');
  }, 4000);
  
}

function validate(name, amt, id) {
  if (name.trim().length === 0 || !($.isNumeric(amt))) {
    $(id).addClass('alert alert-danger col-md-12');
    $(id).text('Please enter valid data');
    return false;
  }

  return true;
}

function settotals(type, id) {
  var totals = 0, amt;
  if (id === '#totals') {
    inctotals = parseInt($('#available').text()) + parseInt($('#expected').text());
    $(id).html('<h3>Totals: ' + inctotals + '</h3>');
  }  

  else {
    type.child('records').once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        amt = parseInt(childData.amount);
        totals += amt;
      });

      $(id).text(totals);

    });
  }
}

function categorytotals(cat, catid) {
  var tot = 0;
  expenses.child('records').once("value", function(snapshot) {
    
    snapshot.forEach(function(childSnapshot) {      
      var childData = childSnapshot.val(); 
      var category = childData.cat;
      amt = parseInt(childData.amount);
      if (category === cat) {
        tot += amt;        
      };    
    });        
    $(catid).text(tot);
  }); 
  
}

function deleteitem(id, name, src) {
  var type, list;

  if (src === 'budlist') {
    type = allocations;
    list = '#budgeted';

  } else if (src === 'inclist') {
    type = incomes;
    list = '#expected';

  } else if (src === 'explist') {
    type = expenses;
    list = '#spend';
    
  } else if (src === 'acclist') {
    type = accounts;
    list = '#available';
    
  }


  var sure = confirm ("Are you sure?")

  if (!sure) {
    return;
  };
    
  if (type === allocations) {
    var found = false;
    expenses.child('records').once("value", function(snapshot) {    
      snapshot.forEach(function(childSnapshot) {      
        var childData = childSnapshot.val(); 
        var category = childData.cat;
        
        if (category === name) {
                found = true;
                return; 
        };    
        console.log(name, category, found);
      });  
      console.log(found); 
      if (found) {
        $('#budgerror').addClass('alert alert-danger col-md-12');
        $('#budgerror').text('Category contains expenses items. Please delete them first');
        closealert('#budgerror');
        return false;
      } else {
        allocations.child('records').child(id).remove();
      }       
    });
    
    
  } else {
    type.child('records').child(id).remove();
  }
  $('#' + src).html('');
  displayList('#' + src, type);  
  settotals(type, list);
   window.setTimeout(function() {
    settotals(null, '#totals');
  }, 1000);
  
} 
