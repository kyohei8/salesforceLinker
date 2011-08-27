var jsonURL = "OptionItems.json";
//保存
function save_options(isClose) {
	$.getJSON(jsonURL,function(json) {
		for (var i in json) {
			for (var j in json[i].data) {
				localStorage[json[i].data[j].id] = $('#' + json[i].data[j].id).attr('checked');
			}
		}
	});
	
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
		var time = isClose? 0 : 750;
    status.innerHTML = "Options Saved.";
    setTimeout(function(){
        status.innerHTML = "";
        if (isClose) {
            top.name = 'CLOSE_WINDOW';
            wid = window.open('', 'CLOSE_WINDOW');
            top.close();
        }
    }, time);
}

// 復元
function restore_options() {
	$.getJSON(jsonURL,function(json) {
		for (var i in json) {
			for (var j in json[i].data) {
				var checked = localStorage[json[i].data[j].id];
				if (!checked) {
					continue;
				}
				if (checked === 'checked') {
					$('#' + json[i].data[j].id).attr('checked', 'checked');
				}
			}
		}
	});
}

//初期処理
$(document).ready(function() {
	var d = '';
	var ib= '';
	$.getJSON(jsonURL,function(json) {
		for (var i in json) {
			ib = 'itemBox-' + json[i].categoryId;
			d += createSection(json[i].categoryName,json[i].categoryId, ib );
			d += "<div class='itembox' id='" + ib + "'>";
			for (var j in json[i].data) {
				d += createRow(json[i].data[j].id, json[i].data[j].name, json[i].data[j].linkURL);
			}
			d += "</div>";
		}
		$("#visible-opt-table").html(d);
		return;
	})
});

/**
 * item
 * @param {Object} id
 * @param {Object} name
 * @param {Object} url
 */
function createRow(id,name,url){
	var item = '<div class="item"><label>';
	item += '<input type="checkbox" id="' + id + '">';
	item += '<span class="visible-opt-name">' + name + '</span>';
	item += '<div style="color: rgb(187, 187, 187); padding-left: 20px; margin-bottom: 5px; ">' + url + '</div>';
	item += '</label></div>';
	return item
}

/**
 * セクションを作成
 * @param {Object} title
 */
function createSection(title,id){
	var scItem = '<div id="separatorItem" class="sectionheader">';
	scItem += '<a id="' + id + '" class="" onclick="folding(\'' + id +'\')" >';
	scItem += '<img src="image/plus-grey.png" id="plus-' + id + '" align="left" class="img" style="display:none"/>';
	scItem += '<img src="image/minus-grey.png" id="minus-' + id + '" align="left" class="img"/>';
	scItem += '<h5>' + title + '</h5></a></div>';
	return scItem;
}


/**
 * 折りたたみに関するJs
 */
function folding(id){
	$("#plus-"+id).toggle();
	$("#minus-"+id).toggle();
	$("#itemBox-"+id).toggle();
}

function expand(id){
	$("#plus-"+id).hide();
	$("#minus-"+id).show();
	$("#itemBox-"+id).show();
}

function collapse(id){
	$("#plus-"+id).show();
	$("#minus-"+id).hide();
	$("#itemBox-"+id).hide();
}
function expandAll(){
	$.getJSON(jsonURL,function(json) {
		for (var i in json) {
			 expand(json[i].categoryId);
		}
	})
}
function collapseAll(){
	$.getJSON(jsonURL,function(json) {
		for (var i in json) {
			 collapse(json[i].categoryId);
		}
	})
}

/*check*/
function checkall(isCheck){
	$.getJSON(jsonURL,function(json) {
		for (var i in json) {
			for (var j in json[i].data) {
				if(isCheck){				
					$('#' + json[i].data[j].id).attr('checked', 'checked');
				}else{
					$('#' + json[i].data[j].id).removeAttr('checked');
				}
			}
		}
	})
}

