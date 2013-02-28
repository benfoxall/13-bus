// HACK HACK HACK HACK

var stamps = [1361895000000, 1361895300000, 1361895600000, 1361895900000, 1361896200000, 1361896500000, 1361896800000, 1361897100000, 1361897400000, 1361897700000, 1361898000000, 1361898300000, 1361898600000, 1361898900000, 1361899200000, 1361899500000, 1361899800000, 1361900100000, 1361900400000, 1361900700000, 1361901000000, 1361901300000, 1361901600000, 1361901900000, 1361902200000, 1361902500000, 1361902800000];



var async = require('async'),
    fs = require('fs');

async.map(stamps,
    function(i, callback){
        fs.readFile('data/' + i + '.json', function (err, data) {
            if(err) return callback(err);
            callback(null, JSON.parse(data));
        });
    },
    function(err, data){

        var arr = [];

        data.forEach(function(json,i){

            // get the timestamp at i
            var observedTimestamp = stamps[i];

            var d = new Date(observedTimestamp);
            var startMinute = (d.getHours()*60) + d.getMinutes();



            json.forEach(function(busses,stop_i){

                busses.forEach(function(bus,_i){

                    var times = bus.time.split(':').map(parseFloat);

                    var arriveMinute = (times[0]*60) + times[1];

                    var num = bus.bus;

                    arr.push([num,stop_i,startMinute, arriveMinute]);

                });
            });
        });

        var filtered = arr
            .filter(function(row){return row[0] == '13';})
            .filter(function(row){return row[3] > 0;});

        fs.writeFile("data/all.json", JSON.stringify(filtered));

});
