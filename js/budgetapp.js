var myDataRef = new Firebase('https://budget-analysis-app.firebaseio.com/');

var incomes = myDataRef.child('incomes');
var expenses = myDataRef.child('expenses');
var accounts = myDataRef.child('accounts');
var allocations = myDataRef.child('allocations');
var executed = false;

function loaditems() {

  allocations.child('records').once("value", function(snapshot) {
    var totals = 0, amt;  
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();      
      var childData = childSnapshot.val();
      $('<tr/>').text('').prepend($('<td/>').text(childData.amount)).prepend($('<td/>').text(childData.name+': ')).appendTo($('#budlist'));
      $('#budlist')[0].scrollTop = $('#budlist')[0].scrollHeight;
      amt = parseInt(childData.amount);
      $('<option/>').text(childData.name).appendTo($('#expselect'));
      totals += amt;
    });
    $('#budgeted').text(totals);
  });  

  incomes.child('records').once("value", function(snapshot) {  
    var totals = 0, amt;  
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      $('<tr/>').text('').prepend($('<td/>').text(childData.amount)).prepend($('<td/>').text(childData.name+': ')).appendTo($('#inclist'));
      $('#inclist')[0].scrollTop = $('#inclist')[0].scrollHeight;
      amt = parseInt(childData.amount);
      
      totals += amt;
    });
    $('#expected').text(totals);
  });  

  expenses.child('records').once("value", function(snapshot) {  
    var totals = 0, amt;  
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      $('<tr/>').text('').prepend($('<td/>').text(childData.amount)).prepend($('<td/>').text(key)).prepend($('<td/>').text(childData.name+': ')).appendTo($('#explist'));
      $('#explist')[0].scrollTop = $('#explist')[0].scrollHeight;
      amt = parseInt(childData.amount);
      
      totals += amt;
    });
    $('#spend').text(totals);
  });  

  accounts.child('records').once("value", function(snapshot) {  
    var totals = 0, amt;  
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      $('<tr/>').text('').prepend($('<td/>').text(childData.amount)).prepend($('<td/>').text(childData.name+': ')).appendTo($('#acclist'));
      $('#acclist')[0].scrollTop = $('#acclist')[0].scrollHeight;
      amt = parseInt(childData.amount);
      
      totals += amt;
    });
    $('#available').text(totals);
  });            
    
};

function sendtodb(id) {
  if (id === 'incbtn') {    
    var inc = $('#inc').val();
    var amt = $('#incamt').val();
    
    if(!validate(inc, amt, '#incerror')) {
      closealert('#incerror');
      return;
    }

    var data = {name : inc, amount: amt};

    incomes.child('counter').transaction(function(currentValue) { 
        return (currentValue||0) + 1
    }, function(err, committed, ss) {
        if( err ) {
           setError(err);
        }
        else if( committed ) {           
           addRecord('rec'+ss.val(), data, amt, incomes); 
        }
    });
    $('#inc').val('');
    $('#incamt').val('');

  } else if (id === 'expbtn') {
    var exp = $('#exp').val();
    var amt = $('#expamt').val();
    var rec = $('#expselect').val();

    if(!validate(exp, amt, '#experror')) {
      closealert('#experror');
      return;
    };

    if (rec === '0') {
      $('#experror').addClass('alert alert-danger col-md-12');
      $('#experror').text('Please select Category');  
      closealert('#experror');
      return;
    };

    var data = {name : exp, amount: amt};

    expenses.child('counter').transaction(function(currentValue) { 
        return (currentValue||0) + 1
    }, function(err, committed, ss) {
        if( err ) {
           setError(err);
        }
        else if( committed ) {           
           addRecord(rec, data, amt, expenses); 
        }
    });

    $('#exp').val('');
    $('#expamt').val('');

    $('#expselect').val('0');

  } else if (id === 'accbtn') {
    var acc = $('#acc').val();
    var amt = $('#accbal').val();
    
    if(!validate(acc, amt, '#accerror')) {
      closealert('#accerror');
      return;
    }

    var data = {name : acc, amount: amt};

    accounts.child('counter').transaction(function(currentValue) { 
        return (currentValue||0) + 1
    }, function(err, committed, ss) {
        if( err ) {
           setError(err);
        }
        else if( committed ) {           
           addRecord('rec'+ss.val(), data, amt, accounts); 
        }
    });
    $('#acc').val('');
    $('#accbal').val('');

  } else if (id === 'budbtn') {
    var bud = $('#budg').val();
    var amt = $('#budgamt').val();
    
    if(!validate(bud, amt, '#budgerror')) {
      closealert();
      return;
    }

    var data = {name : bud, amount: amt};


    allocations.child('counter').transaction(function(currentValue) { 
        return (currentValue||0) + 1
    }, function(err, committed, ss) {
        if( err ) {
           setError(err);
        }
        else if( committed ) {           
           addRecord('rec'+ss.val(), data, amt, allocations); 
        }
    });
    $('#budg').val('');
    $('#budgamt').val('');

  };

	
           
 /* myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
    
  });*/
      
};

function addRecord(recordid, data, amount, type) {
  setTimeout(function() {
     type.child('records').child(recordid).set(data, function(err) {
        err && setError(err)
     });        
  });
  
  type.child('records').on('child_added', function(snapshot) {
    var message = snapshot.val();  
      
  });

  //$('<tr/>').text('').prepend($('<td/>').text(amount)).prepend($('<td/>').text(name+': ')).appendTo($(id));
  
};


function displayList(id, name, text) {
  
  $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($(id));
  $(id)[0].scrollTop = $(id)[0].scrollHeight;

};


$( document ).ready(function() {
    $('#tabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
  })
    
});

function closealert(id) {
  window.setTimeout(function() {
    $(id).removeClass('alert alert-danger col-md-12');
    $(id).text('');      
  }, 4000);
  /*window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
  }, 4000);*/
}

function validate(name, amt, id) {
  if(name.trim().length === 0 || !($.isNumeric(amt)) ) {
      $(id).addClass('alert alert-danger col-md-12');
      $(id).text('Please enter valid data');      
      return false;
    }
  return true;  
  
}

