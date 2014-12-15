
var uploadType = 0;
var _upload = new Array();

var uploadFinished = 0;
var uploadIndex;
var pendingFolderName = 0;

function chgDirName()
{
	$('#dirIndex').val(uploadIndex);
	$.post("dirName.php", $('#dirNameForm').serialize(), function(data) {
		$("#dirNameSubmit").removeAttr("disabled");
		$("#dirNameSubmit").html("Succeeded");
	}).error(function(request) {
		alert("Server error!");
	});
}

$(function () {
	$('#refreshPage').click(function() {
		location.reload();
	});
	
	$('.modal .close').click(function() {
		location.reload();
	});
	
	$(document).bind('drop dragover', function (e) {
		e.preventDefault();
	});
	
	$('#dirName').on("input", function(e) {
		pendingFolderName = 0;
		$("#dirNameSubmit").removeAttr("disabled");
		$("#dirNameSubmit").html("Submit");
	});
	
	$('#dirNameForm').submit(function(e) {
		e.preventDefault();
		$("#dirNameSubmit").attr("disabled", "");
		$("#dirNameSubmit").html("Pending");
		if (uploadFinished == 1 && pendingFolderName == 0)
			chgDirName();
		else
			pendingFolderName = 1;
	});
    $('#fileupload').fileupload({
        dataType: 'json',
		dropZone: $('#uploadBox'),
		singleFileUploads: false,
		limitMultiFileUploads: 32,
		submit: function (e, data) {
			uploadFinished = 0;
			pendingFolderName = 0;
			$('.modal-body.folder-info').hide();
			if (data.files.length > 1)
				$('.modal-body.folder-info').show('fade');
			data.formData = {secret: uploadType, sharer: "NoName"};
		},
		start: function (e) {
			$('#progress').css('width', '0%');
			$('#progress').html('0%');
			$('#uploadModal .close').attr('disabled');
			$('#refreshPage').attr('disabled');
			$('.link-info').hide();
			$('.copy-tips').css('opacity', 0);
			$('.loading.icon').show();
			$('#uploadModalText').html('Uploading your file(s)');
			$('.progress-bar').css('width', '0%');
			$('.progress-bar').html('0%');
			$('#uploadModal').modal('show');
			
			_upload = new Array();
			_upload.push(new Array((new Date()).getTime(), 0));
		},
        done: function (e, data) {
			uploadIndex = data.result.index;
			uploadFinished = 1;
			if (pendingFolderName == 1)
				chgDirName();
			$('.share-url').attr('value', "http://upload.201a.cn/" + data.result.index);
            if (uploadType == 2)
			{
				$('.private').show();
				$('.public').hide();
				$('.share-password').attr('value', data.result.password);
			}
			else
			{
				$('.private').hide();
				$('.public').show();
			}
			$('.loading.icon').hide();
			$('#uploadModalText').html('File(s) uploaded!');
			$('#uploadModal .close').removeAttr('disabled');
			$('#refreshPage').removeAttr('disabled');
			$('.link-info').show();
        },
        fail: function (e, data) {
            alert("Upload failed...");
			location.reload();
        },
		progressall: function (e, data) {
			var progress = data.loaded / data.total * 100;
			$('.progress-bar').css('width', progress + '%');
			$('.progress-bar').html(parseInt(progress * 10) / 10 + '%');
			
			var now;
			_upload.push(now = new Array((new Date()).getTime(), data.loaded));
			var last = _upload.length >= 5 ? _upload.shift() : _upload[0];
			var _size = now[1] - last[1];
			var _time = now[0] - last[0];
			var speed = _size * 1000 / _time; // date.getTime [ms]
			
			$('#uploadSpeed').html(size(speed) + "/s");
		}
    });
	
	$('#openShare').bind('dragenter dragover', function (e) {
		uploadType = 1;
	});
	$('#secretShare').bind('dragenter dragover', function (e) {
		uploadType = 2;
	});
});

$(function() {
	$('.del.icon').click(function(e) {
		$.post('del.php', {id: $(this).attr('index')}, function() {
			location.reload();
		});
	});
});

$(function() {
	$('#copyLink').zclip({
		path: 'js/ZeroClipboard.swf',
		copy: function() {return $('.share-url').attr("value");},
		afterCopy: function() {$('.copy-tips').css('opacity', 1);}
	});
	$('#copyLinkWithPwd').zclip({
		path: 'js/ZeroClipboard.swf',
		copy: function() {return 'Link: ' + $('.share-url').attr("value") + ' ; Password: ' + $('.share-password').attr("value")},
		afterCopy: function() {$('.copy-tips').css('opacity', 1);}
	});
});

var _unit = new Array("B", "KB", "MB", "GB", "TB");

function size(x)
{
	if (isNaN(x)) return "";
	var u = arguments[1] ? arguments[1] : 0;
	if (x < 1024)
		return (u ? x.toFixed(2) : x) + " " + _unit[u];
	else
		return size(x / 1024, u + 1);
}

$(function() {
	$(".FileSize").each(function(i, t) {
		t.innerHTML = size(parseInt(t.innerHTML));
		$(t).css("text-align", "right");
	});
});
