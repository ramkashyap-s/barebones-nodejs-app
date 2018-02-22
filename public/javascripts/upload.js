//set and reset the upload progress bar
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

    var files = $(this).get(0).files;
    // One file is selected, process the file upload  
    if (files.length == 1){

    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    var file = files[0];

    // add the files to formData object for the data payload
    formData.append('uploads[]', file, file.name);
    
    $.ajax({
        url: '/upload',
        type: 'POST',
        // dataType: "html",
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();
  
          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {
  
            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
  
              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');
  
              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('Done');
              }
  
            }
  
          }, false);
  
          return xhr;
        }
      });
      //on each load of new file truncate the results file
      // d3.json("data/userViews.json", function(error, user){
      //   if(error){
      //     return
      //   }        
      // })
    }
});