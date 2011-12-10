/** popup.js */
var c = chrome;
var ws = c.windows;
var tbs = c.tabs;
var sfUrl;

$(function() {
	ws.getCurrent(function (window) {
		tbs.getSelected(window.id, function (tab) {
			
			$('#optionItem').click(function(){
				tbs.create({ url: 'options.html'});
			});
			
			var url = tab.url;
			var domain = url.split('/')[2];
			sfUrl = 'https://' + domain;
			if(sfUrl.indexOf('force.com') == -1){
				$('#main').before("not Salesforce!");
				$('#goidlink').hide();
				return false;
			}
			//load json
			var jsonURL = "OptionItems.json";
			var isExist;
			$.getJSON(jsonURL, function(json){
				for (var i in json) {
					var section = createSection(json[i].categoryName);
					$('#main').append(section);
					isExist = false;
					for (var j in json[i].data) {
						var checked = localStorage[json[i].data[j].id];
						if (checked === 'checked') {
							var div1 = createItem(json[i].data[j].id, json[i].data[j].name, sfUrl, json[i].data[j].linkURL);
							$('#main').append(div1);
							isExist = true;
						}
					}
					if(!isExist){
						$('#main div').remove(":last-child");
					}
				}				
			})
			
			var checked = localStorage["visibleIdLink"];
      if (checked === 'checked') {
        $("#goidlink").show();
      }else{
        $("#goidlink").hide();        
      }
			
		});
	});
});

var golink = function(){
  window.open(sfUrl+'/'+$("#inputId").val(), '_blank');
}


//create Items
function createItem(id,name,sfUrl,url){
	var d1 =$(document.createElement('div'));
	d1.addClass('items');
	var a1=document.createElement('a');
	a1.setAttribute('id',id);
	a1.setAttribute('target','_blank');
	a1.appendChild(document.createTextNode(name));
	a1.setAttribute('href', sfUrl + url);
	d1.append(a1);
	return d1;
}

/**
 * セクションを作成
 * @param {Object} title
 */
function createSection(title){
	var span1=document.createElement('span');
	var txt1=document.createTextNode(title);
	span1.appendChild(txt1);
	var div1=document.createElement('div');
	div1.setAttribute('id','separatorItem');
	div1.className='separator';
	div1.appendChild(span1);
	return div1;
}
