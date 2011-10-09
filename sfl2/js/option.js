var jsonURL = "OptionItems.json";
var SIDEMENU_CHAR = 30;



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
	status.innerHTML = "Options Saved.";
	var time = isClose? 1550 : 750;
	setTimeout(function(){
		status.innerHTML = "";
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
	var sm = '<ul>';
	var al = '';
	var altmp = '';
	var cByteNum=0;
	var tByteNum=0;
	$.getJSON(jsonURL,function(json) {
		for (var i in json) {
			//generate item menu
			//d += '<div class="itembody" style="background-color:' + json[i].bgcolor + '" >';
			d += '<div class="itembody" style="background-color:#97d397" >';
			ib = 'itemBox-' + json[i].categoryId;
			d += createSection(json[i].categoryName,json[i].categoryId, json[i].color );
			d += '<div class="itembox" id="' + ib + '" >';
			for (var j in json[i].data) {
				d += createRow(json[i].data[j].id, json[i].data[j].name, json[i].data[j].linkURL);
			}
			d += "</div>";
			d += "</div>";
			
			//generate sidemenu
			al = createSidemenuitem(json[i].categoryId, json[i].categoryName);
			cByteNum = getByte(json[i].categoryName);
			tByteNum += cByteNum;
			if(tByteNum > SIDEMENU_CHAR){
				sm += '<li>'+altmp+'</li>';
				altmp=al;
				tByteNum = cByteNum;
			}else{
				altmp === '' ? altmp = al:altmp += ' / ' + al;
			}
		}
		sm += '</ul>';
		$("#visible-opt-table").html(d);
		$("#sidebarmenu").html(sm);
	})
	//collapseAll();
	
	
	//tooltip
	$('#allcheckon').twipsy({
		live: true,
		title: 'alt',
		placement:'below',
		offset:1
	});
	$('#allcheckoff').twipsy({
		live: true,
		title: 'alt',
		placement:'below',
		offset:1
	});
	$('#expandAll').twipsy({
		live: true,
		title: 'alt',
		placement:'below',
		offset:1
	});
	$('#collapseall').twipsy({
		live: true,
		title: 'alt',
		placement:'below',
		offset:1
	});
	

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
	return item;
}

/**
 * セクションを作成
 * @param {Object} title
 */
function createSection(title,id,color ){
	var scItem = '<div id="separatorItem" class="sectionheader" >';
	scItem += '<a id="' + id + '" class="" onclick="folding(\'' + id +'\')" >';
	scItem += '<img src="image/plus-grey.png" id="plus-' + id + '" align="left" class="img" style="display:none"/>';
	scItem += '<img src="image/minus-grey.png" id="minus-' + id + '" align="left" class="img"/>';
	scItem += '<h5 style="color:' + color + '" >' + title + '</h5></a></div>';
	return scItem;
}

/**
 * sidebar menu
 */
function createSidemenuitem(id,name){
	var item = '<a href="#" name="' + id + '" onClicK="sc(this);">' + name + '</a>';
	return item;
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

/*check all*/
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
/**
 * スクロール処理
 * @param {Object} e
 */
function sc(e){
	var tId = $(e).attr('name');
	var target = $("#"+tId);
	$('html,body').animate({
    scrollTop: target.offset().top-55}, {
    duration: 400,
    easing: "swing",
  });
}

function getByte(text){
  count = 0;
  for (i=0; i<text.length; i++){
    n = escape(text.charAt(i));
    if (n.length < 4) count++; else count+=2;
  }
  return count;
}
