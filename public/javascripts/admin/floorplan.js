var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 3,
    zoomSnap: 0.5,
    attributionControl: false
});

var bounds     = [[0,0], [720,1280]];
var map_file   = '';
var map_device = [];

var $device_table = $('#device_table');
var $sg_table     = $('#sg_table');
var $mg_table     = $('#mg_table');

var PROPERTY      = $('#site_name').text();

$('#myTab a').on('click', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

$(function() {
    $device_table.bootstrapTable();
    $sg_table.bootstrapTable();
    $mg_table.bootstrapTable();

    refreshBlock();
});

function refreshBlock() {
    var site = PROPERTY;

    var i = 0;
    var L = document.getElementById("block_select").options.length - 1;
    
    for(i = L; i >= 1; i--) {
        document.getElementById("block_select").remove(i);
    }

    $device_table.bootstrapTable('removeAll');
    $sg_table.bootstrapTable('removeAll');
    $mg_table.bootstrapTable('removeAll');

    if (site.indexOf('SELECT') == -1) {
        socket.emit('client2server_floorplan_refreshBlock', site);
    }

    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });

    var map_path = '/images/default_image.png';
    var image = L.imageOverlay(map_path, bounds).addTo(map);
    map.fitBounds(bounds);
    map.setZoom(0);
}

socket.on('server2client_floorplan_refreshBlock', function(blockList) {
    for(i = 0; i < blockList.length; i++) {
        var block = blockList[i].split(',');

        $("#block_select").append($('<option></option>').val(block[1]).html(block[0]));
    }
});

function refreshFloor() {
    var MGID = $("#block_select").val();
    var site = PROPERTY;

    var i = 0;
    var L = document.getElementById("floor_select").options.length - 1;
    
    for(i = L; i >= 1; i--) {
        document.getElementById("floor_select").remove(i);
    }

    $device_table.bootstrapTable('removeAll');
    $sg_table.bootstrapTable('removeAll');
    $mg_table.bootstrapTable('removeAll');

    if (MGID.indexOf('SELECT') == -1) {
        socket.emit('client2server_floorplan_refreshFloor', MGID, site, '');
    }

    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });

    var map_path = '/images/default_image.png';
    var image = L.imageOverlay(map_path, bounds).addTo(map);
    map.fitBounds(bounds);
    map.setZoom(0);
}

socket.on('server2client_floorplan_refreshFloor', function(deviceList, floorList, sgList, mgblock, refresh) {
    if (refresh != 'refresh') {
        for(i = 0; i < floorList.length; i++) {
            var floor = floorList[i].split(',');
            $("#floor_select").append($('<option></option>').val(floor[1]).html(floor[0]));
        }
    }

    for(i = 0; i < deviceList.length; i++) {
        var device = deviceList[i].split('=');

        $device_table.bootstrapTable('insertRow', {
            index: 1,
            row: {
                ep:       device[0],
                nickname: device[1],
                type:     device[2],
                floor:    device[3]
            }
        });
    }

    for(i = 0; i < sgList.length; i++) {
        var sg = sgList[i].split('=');

        $sg_table.bootstrapTable('insertRow', {
            index: 1,
            row: {
                sg:    sg[0],
                floor: sg[1],
            }
        });
    }

    var mg = mgblock.split('=');

    $mg_table.bootstrapTable('insertRow', {
        index: 1,
        row: {
            mg:    mg[0],
            name:  mg[1],
            floor: mg[2]
        }
    });
});

function loadMap() {
     var floor_img = $("#floor_select").val();

    var floor = $("#floor_select option:selected").text();
    var mgid  = $("#block_select").val();
    var site  = PROPERTY;

    var map_path = '';

    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });

    if (floor_img.indexOf('SELECT') == -1) {
        socket.emit('client2server_floorplan_loadMap', floor, mgid, site);

        map_path = '/uploads/' + floor_img;
    } else {
        map_path = '/images/default_image.png';
    }

    var image = L.imageOverlay(map_path, bounds).addTo(map);
    map.fitBounds(bounds);
    map.setZoom(0);

    map_device = [];

    setTimeout(function() {
        $device_table.bootstrapTable('removeAll');
        $sg_table.bootstrapTable('removeAll');
        $mg_table.bootstrapTable('removeAll');

        if (mgid.indexOf('SELECT') == -1) {
            socket.emit('client2server_floorplan_refreshFloor', mgid, site, 'refresh');
        }
    }, 500);
}

socket.on('server2client_floorplan_loadMap', function(lampList) {    
    for(i = 0; i < lampList.length; i++) {
        var lamp = lampList[i].split(',');
        var id   = lamp[0];
        var y    = lamp[1];
        var x    = lamp[2];
        var type = lamp[3];


        var sol = L.latLng(x, y);

        var EP_icon = new L.Icon({
            iconUrl: lamptype[type],
            iconAnchor:    [38, 70],
            tooltipAnchor: [0, -15]
        });

        var marker = new L.marker(sol, {draggable: 'true', icon: EP_icon})
                    .bindTooltip(id, {direction: "bottom", permanent: "true"})
                    .openTooltip()
                    .addTo(map);

        map.addLayer(marker);
        map_device.push(id);
    }
});

$device_table.on('click-row.bs.table', function (e, row, $element) {
    var floor = $("#floor_select").val();

    if (floor.indexOf('SELECT') == -1) {
        var id   = row['ep'];
        var type = row['type'];

        if ((type == undefined) || (type == null) || (type == '')) {
            alert('#' + id + ' has not set lamp type!');
        } else {
            if (map_device.indexOf(id) == -1) {
                var sol = L.latLng(360, 640);
    
                var EP_icon = new L.Icon({
                    iconUrl: lamptype[type],
                    iconAnchor:    [38, 70],
                    tooltipAnchor: [0, -15]
                });
    
                var marker = new L.marker(sol, {draggable: 'true', icon: EP_icon}).addTo(map);
                marker.bindTooltip(id, {direction: "bottom", permanent: "true"}).openTooltip();
                map.addLayer(marker);
    
                map_device.push(id);
    
                $device_table.bootstrapTable('updateByUniqueId', {
                    id: id,
                    row: {
                        floor: $("#floor_select option:selected").text()
                    }
                });
    
            } else {
                alert('#' + id + ' has already added in the floorplan!');
            }
        }
    } else {
        alert('Please select floorplan before adding devices!');
    }
});

$sg_table.on('click-row.bs.table', function (e, row, $element) {
    var floor = $("#floor_select").val();

    if (floor.indexOf('SELECT') == -1) {
        var id   = row['sg'];
        var type = 'Sub Gateway';
        
        if (map_device.indexOf(id) == -1) {
            var sol = L.latLng(360, 640);

            var EP_icon = new L.Icon({
                iconUrl: lamptype[type],
                iconAnchor:    [38, 70],
                tooltipAnchor: [0, -15]
            });

            var marker = new L.marker(sol, {draggable: 'true', icon: EP_icon}).addTo(map);
            marker.bindTooltip(id, {direction: "bottom", permanent: "true"}).openTooltip();
            map.addLayer(marker);

            map_device.push(id);

            $sg_table.bootstrapTable('updateByUniqueId', {
                id: id,
                row: {
                    floor: $("#floor_select option:selected").text()
                }
            });
        } else {
            alert('#' + id + ' has already added in the floorplan!');
        }
    } else {
        alert('Please select floorplan before adding devices!');
    }
});

$mg_table.on('click-row.bs.table', function (e, row, $element) {
    var floor = $("#floor_select").val();

    if (floor.indexOf('SELECT') == -1) {
        var id   = row['mg'];
        var type = 'Main Gateway';
        
        if (map_device.indexOf(id) == -1) {
            var sol = L.latLng(360, 640);
            
            var EP_icon = new L.Icon({
                iconUrl: lamptype[type],
                iconAnchor:    [38, 70],
                tooltipAnchor: [0, -15]
            });

            var marker = new L.marker(sol, {draggable: 'true', icon: EP_icon}).addTo(map);
            marker.bindTooltip(id, {direction: "bottom", permanent: "true"}).openTooltip();
            map.addLayer(marker);

            map_device.push(id);

            $mg_table.bootstrapTable('updateByUniqueId', {
                id: id,
                row: {
                    floor: $("#floor_select option:selected").text()
                }
            });
        } else {
            alert('#' + id + ' has already added in the floorplan!');
        }
    } else {
        alert('Please select floorplan before adding devices!');
    }
});

function saveFloor() {
    var floor = $("#floor_select option:selected").text();

    map.eachLayer(function(layer) {
        if (layer === undefined) {
        } else {
            if (layer.getTooltip() === undefined) {
            } else {
                if (layer.getLatLng() === undefined) {
                } else {
                    if ((layer.getLatLng()["lat"] > 720) || (layer.getLatLng()["lat"] < 0) || 
                        (layer.getLatLng()["lng"] > 1280)  || (layer.getLatLng()["lng"] < 0)) {
                        
                        var id_delete = layer.getTooltip().getContent();
                        socket.emit('client2server_floorplan_saveFloor_delete', id_delete);

                        map.removeLayer(layer);

                    } else {
                        var id = layer.getTooltip().getContent();
                        var xy = layer.getLatLng()["lng"] + ',' + layer.getLatLng()["lat"];
                        
                        socket.emit('client2server_floorplan_saveFloor', id, floor, xy);
                    }
                }
            }
        }
    });
}

socket.on('server2client_floorplan_saveFloor_delete', function(dev_id) {
    $device_table.bootstrapTable('updateByUniqueId', {
        id: dev_id,
        row: {
            floor: ''
        }
    });

    $sg_table.bootstrapTable('updateByUniqueId', {
        id: dev_id,
        row: {
            floor: ''
        }
    });

    $mg_table.bootstrapTable('updateByUniqueId', {
        id: dev_id,
        row: {
            floor: ''
        }
    });
});