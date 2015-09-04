$(document).ready(function() {
  var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index) {
      $(this).width($originals.eq(index).width())
    });
    return $helper;
  }; //Make diagnosis table sortable    
  $("#budgtable tbody").sortable({
    helper: fixHelperModified,
    stop: function(event, ui) {
      renumber_table('#budgtable')
    }
  }).disableSelection();
  
}); //Renumber table rows 
function renumber_table(tableID) {
  $(tableID + " tr").each(function() {
    count = $(this).parent().children().index($(this));
    $(this).find('.priority').html(count);
  });
}