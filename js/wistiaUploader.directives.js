angular.module("wistiaUploader.directives", []).directive('wistiaUploader', function() {
  return {
    restrict: "E",
    replace: true,
    //On compile function we replace the element tag with our template
    compile: function(element, attrs) {
      //This is the template for the element.
      var template = "<div><span class=\"btn btn-success fileinput-button\"><i class=\"glyphicon glyphicon-plus\"></i> <span>Select Video</span><input type=\"file\" name=\"files[]\"></span><div id=\"progress\" class=\"progress\"><div class=\"progress-bar progress-bar-success\" style=\"width: 0%;\"></div></div><div id=\"myvideo\" style=\"height:349px;width:620px\">&nbsp;</div></div>"
        //Replace the element with directive name with the template
      element.replaceWith($(template));
      //Link function, here we will implement the logic behind the directive
      //In this case what we want to do is bind Jquery Fileupload to our input element in the template
      return function(scope, element, attrs, controller) {
        var input = element[0].querySelector('input');
        //Callback for "done" event: This is triggered when the selected file has been uploaded to the server
        var doneCallback = function(e, data) {
            alert("Video uploaded successfully!");
            //Clear the progress bar
            $('#progress .progress-bar').css('width', '0%');
            //Embedded video template
            var embedded_video = $("<div class=\"wistia_embed wistia_async_" + data._response.result.hashed_id + "\" style=\"height:349px;width:620px\">&nbsp;</div>");
            //Here we insert the video template in the proper div.
            angular.element(element[0].querySelector("#myvideo")).append(embedded_video)
          }
          //Callback for "add" event: this event is triggered when a file is selected
        var addCallback = function(e, data) {
            //Accept only wistia supported video format types.
            //According to page: https://wistia.com/doc/export-settings
            //Formats: MOV, MPG, AVI, FLV, F4V, MP4, M4V, ASF, WMV, VOB, MOD, 3GP, MKV, DIVX, XVID
            var acceptFileTypes = /(\.|\/)(mov|mpg|mpeg|avi|FLV|F4V|MP4|M4V|ASF|WMV|VOB|MOD|3GP|DIVX|XVID)/i;
            if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
              alert("Invalid file type!");
            } else {
              //If its valid, upload to wistia server.
              data.submit();
            }
          }
          //Callback for "progressall" event: This event is triggered to inform the progress of all files being uploaded. In this case we are only dealing with one.
        var progressCallback = function(e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress .progress-bar').css('width',progress + '%');
        };
        //Callback for "fail" event: This event is triggered when some error occurred when uploading files
        var failCallback = function(e, data) {
          //Clears progress bar
          $('#progress .progress-bar').css('width', '0%');
          //Shows the error that occurred when trying to upload as an alert
          alert(data._response.jqXHR.responseJSON.error);
        };
        angular.element(input).fileupload({
          url: "https://upload.wistia.com",
          //Sets the expected response data type
          dataType: 'json',
          //Attach the access token to form data
          formData: [{
            name: 'access_token',
            value: attrs.accessToken
          }],
          //Sets autoUpload true so that as soon as a file is selected it is uploaded to the server.
          autoUpload: true,
          // Here we bind the callbacks.
          add: addCallback,
          done: doneCallback,
          progressall: progressCallback,
          fail: failCallback,
        });
      };
    }
  };
});