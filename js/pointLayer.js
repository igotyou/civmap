
var createTextStyle = function(feature, resolution, dom) {
  var fontSize = resolution < 5000 ? 16 : 12;
  return new ol.style.Text({
    // textAlign: align,
    // textBaseline: baseline,
    font: 'bold ' + fontSize + 'px Arial',
    text: resolution > 16 ? feature.get('code') || '' : feature.get('name') || '?',
    fill: new ol.style.Fill({color: '#000000'}),
    stroke: new ol.style.Stroke({color: '#ffffff', width: 2}),
    // offsetX: offsetX,
    // offsetY: offsetY,
    // rotation: rotation
  });
};

// Points
var showInactive = false;
var createPointStyleFunction = function() {
  return function(feature, resolution) {
    if ((resolution > 16 && (feature.get('status') !== 'OK' || !feature.get('code')))
      || (!showInactive && feature.get('code') && feature.get('status') !== 'OK')
      || ['mushroom biome', 'Nether biome'].indexOf(feature.get('name')) !== -1) {
      return [];
    }
    var color = feature.get('status') === 'OK' ? 'rgba(256, 256, 256, 0.5)' : 'rgba(255, 0, 0, 0.5)';
    var style = {
      text: createTextStyle(feature, resolution, {})
    };
    
    if (resolution > 16 && (feature.get('status') === 'OK' || feature.get('code'))) {
      style.image = new ol.style.Circle({
        radius: 15,
        fill: new ol.style.Fill({color: color}),
        stroke: new ol.style.Stroke({color: 'gray', width: 1})
      });
    }
    return [new ol.style.Style(style)];
  };
};

var citiesSource = new ol.source.GeoJSON({
  projection: 'minecraft',
  url: 'cities.geojson'
});

citiesSource.on('change', function(e) {
  citiesSource.un('change', arguments.callee);
  var select = $('#jump');
  e.target.getFeatures().sort(function(a, b) {
    var textA = a.get('name'), textB = b.get('name');
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  }).forEach(function(feature) {
    if (!feature.get('code') || !feature.get('name')) {
      return;
    }
    select.append($('<option value="' + feature.get('code') + '">').text(feature.get('name')));
  });
});
var vectorPoints = new ol.layer.Vector({
  source: citiesSource,
  style: createPointStyleFunction()
});



var element = document.getElementById('popup');
var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});

var clickHandler = function(evt) {
  $(element).popover('destroy');

  var feature = evt.map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
  if (feature && feature.getGeometry().getType() === 'Point' && feature.get('name')) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    popup.setPosition(coord);
    var html = $('<div/>');
    if (feature.get('flag')) {
      var img = $(feature.get('flag'));
      img.css({height: '40px', float: 'right'});
      html.append(img);
    }

    html.append($('<strong>' + feature.get('name') + '</strong>'));

    if (feature.get('reddit')) {
      html.append('<br/>').append($(feature.get('reddit')));
    }

    html.append('<br/>').append('<a href="http://civcraft.org/doku.php?id=towns:' + feature.get('name').toLowerCase() + '" target="blank">Wiki</a>');
    
    $(element).popover({
      'placement': 'top',
      'html': true,
      'content': html
    });
    $(element).popover('show');
  } else if (feature) {
    // console.log(JSON.stringify(feature.getGeometry().getCoordinates()), feature.getProperties());
  }
};

exports.init = function(map) {
  map.addLayer(vectorPoints);

  map.addOverlay(popup);
  map.on('click', clickHandler);
};

exports.toggleInactive = function(show) {
  showInactive = !showInactive;
  vectorPoints.setStyle(createPointStyleFunction());
  return showInactive;
};
