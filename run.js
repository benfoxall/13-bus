// HACK HACK HACK HACK

// source - http://www.oxontime.com/Naptan.aspx?t=stoppointsdetails&vc=13&Dest=Headington&Direction=1&Operator=OBC&format=xhtml
var ids = [69326574, 69346324, 69346326, 69325243, 69325235, 69328785, 69328787, 
69328786, 69325264, 69325262, 69325248, 69325253, 69325246, 69325257, 69325259, 
69328653, 69325652, 69325659, 69323289, 69345658, 69326482, 69345486, 69347578, 
69327497, 69328972, 69326564];



var jsdom = require('jsdom'),
	async = require('async'),
	fs = require('fs');



function get(sms_id, callback){
	jsdom.env(
		'http://www.oxontime.com/Naptan.aspx?hdnSearchType=searchbySMSnumber&hdnSearchValue=' + sms_id,
		["http://code.jquery.com/jquery.js"],
		function (errors, window) {
			if(errors){
				return callback(errors);
			}
			var $ = window.$;
			var busses = $('table:eq(1) tbody tr').map(function(){
				var $tds = $('td', this);
				return {
					bus:$tds.first().text(),
					time:$tds.last().text()
				}
			}).toArray();
			console.log("bysses",busses);

			if(callback){
				callback(null, busses);
			}
		}
	);
}


var interval = 1000 * 60 * 5,
	last;

function check(){

	var now = + new Date();
	var next = now - (now % interval);

	if(next != last){
		last = next;
		//DO IT!

		console.log("\n\n\n\nGOING");

		async.mapSeries(ids, get, function(errr,data){
			console.log("DATA!!", data);
			fs.writeFile("data/" + next + ".json", JSON.stringify(data));
		});

	}

	setTimeout(check,500);
}

// run this every 5 minutes
var now = +new Date();


check();
