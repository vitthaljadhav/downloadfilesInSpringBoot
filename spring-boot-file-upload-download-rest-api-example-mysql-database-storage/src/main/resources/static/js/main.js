'use strict';

var singleUploadForm = document.querySelector('#singleUploadForm');
//alert(" hello");
var singleFileUploadInput = document.querySelector('#singleFileUploadInput');
var singleFileUploadError = document.querySelector('#singleFileUploadError');
var singleFileUploadSuccess = document.querySelector('#singleFileUploadSuccess');

var multipleUploadForm = document.querySelector('#multipleUploadForm');
var multipleFileUploadInput = document.querySelector('#multipleFileUploadInput');
var multipleFileUploadError = document.querySelector('#multipleFileUploadError');
var multipleFileUploadSuccess = document.querySelector('#multipleFileUploadSuccess');

//new Param

var hiddenBtn = document.querySelector('#hiddenBtnform');
var listOfNames =document.querySelector('#listOfFiles');


function uploadSingleFile(file) {
    var formData = new FormData();
    formData.append("file", file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadFile");

    xhr.onload = function() {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if(xhr.status == 200) {
            singleFileUploadError.style.display = "none";
            singleFileUploadSuccess.innerHTML = "<p>File Uploaded Successfully.</p><p>DownloadUrl : <a href='" + response.fileDownloadUri + "' target='_blank'>" + response.fileDownloadUri + "</a></p>";
            singleFileUploadSuccess.style.display = "block";
        } else {
            singleFileUploadSuccess.style.display = "none";
            singleFileUploadError.innerHTML = (response && response.message) || "Some Error Occurred";
        }
    }

    xhr.send(formData);
}

function uploadMultipleFiles(files) {
    var formData = new FormData();
    for(var index = 0; index < files.length; index++) {
        formData.append("files", files[index]);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadMultipleFiles");

    xhr.onload = function() {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if(xhr.status == 200) {
            multipleFileUploadError.style.display = "none";
            var content = "<p>All Files Uploaded Successfully</p>";
            for(var i = 0; i < response.length; i++) {
                content += "<p>DownloadUrl : <a href='" + response[i].fileDownloadUri + "' target='_blank'>" + response[i].fileDownloadUri + "</a></p>";
            }
            multipleFileUploadSuccess.innerHTML = content;
            multipleFileUploadSuccess.style.display = "block";
        } else {
            multipleFileUploadSuccess.style.display = "none";
            multipleFileUploadError.innerHTML = (response && response.message) || "Some Error Occurred";
        }
    }

    xhr.send(formData);
}


//New methods
/*function downloadZip(file) {
  
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/downloadZip/"+file);

    xhr.send();
}*/


function downloadZip(id) {
   // var id = $('#file').attr('id')
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/downloadZip/' + id, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
        if(this.status == '200') {
           var filename = '';
           //get the filename from the header.
           var disposition = xhr.getResponseHeader('Content-Disposition');
           if (disposition && disposition.indexOf('attachment') !== -1) {
               var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
               var matches = filenameRegex.exec(disposition);
               if (matches !== null && matches[1])
                   filename = matches[1].replace(/['"]/g, '');
           }
           var type = xhr.getResponseHeader('Content-Type');
           var blob = new Blob([this.response],  {type: type});
           //workaround for IE
           if(typeof window.navigator.msSaveBlob != 'undefined') {
               window.navigator.msSaveBlob(blob, filename);
           }
           else {
               var URL = window.URL || window.webkitURL;
               var download_URL = URL.createObjectURL(blob);
               if(filename) {
                   var a_link = document.createElement('a');
                   if(typeof a_link.download == 'undefined') {
                       window.location = download_URL;
                   }else {
                       a_link.href = download_URL;
                       a_link.download = filename;
                       document.body.appendChild(a_link);
                       a_link.click();
                   }
               }else {
                   window.location = download_URL;
               }
               setTimeout(function() {
                   URL.revokeObjectURL(download_URL);
               }, 10000);
           }
        }else {
            alert('error');
        }
    }; 
    xhr.setRequestHeader('Content-type', 'application/*');
    xhr.send();
}

singleUploadForm.addEventListener('submit', function(event){
    var files = singleFileUploadInput.files;
    if(files.length === 0) {
        singleFileUploadError.innerHTML = "Please select a file";
        singleFileUploadError.style.display = "block";
    }
    uploadSingleFile(files[0]);
    event.preventDefault();
}, true);


multipleUploadForm.addEventListener('submit', function(event){
    var files = multipleFileUploadInput.files;
    if(files.length === 0) {
        multipleFileUploadError.innerHTML = "Please select at least one file";
        multipleFileUploadError.style.display = "block";
    }
    uploadMultipleFiles(files);
    event.preventDefault();
}, true);

//new method
hiddenBtn.addEventListener('submit', function(event){
   var finalList = listOfNames.value;
    downloadZip(finalList);
    event.preventDefault();
}, true);
