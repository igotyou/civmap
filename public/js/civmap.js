var coordsToBlocks = function(coords) {

}
var blocksToCoords = function(position) {
  return [parseInt(position[0]), parseInt(position[1])].map(function(c, i) {
    return c * (i ? -1 : 1) * (9190000 / 15000);
  });
};
var NaNsToZeros = function(array) {
  return array.map(function(e) {
    return isNaN(e) ? 0 : e;
  });
};

var projection = new ol.proj.Projection({
  code: 'minecraft',
  units: 'block',
  extent: [-1000000, -1000000, 1000000, 1000000],
  global: true
});
ol.proj.addProjection(projection);

var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(4),
  // projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  // className: 'custom-mouse-position',
  // target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
});
var size = 8000;
var map = new ol.Map({
  // renderer: 'webgl',
  target: 'map',
  controls: [
    // mousePositionControl
  ],
  layers: [
    new ol.layer.Tile({
      source:  new ol.source.TileImage({
        attributions: [
          new ol.Attribution({
            html: 'Player map data compiled by pavel_the_hitman at r/civtransport, interface by GipsyKing'
          }),
          ol.source.OSM.DATA_ATTRIBUTION
        ],
        // tileUrlFunction: ol.TileUrlFunction.createFromTemplates(ol.TileUrlFunction.expandUrl('http://civcraft.slimecraft.eu/tiles/{z}/tile_{x}_{-y}_normal.png')),
        tileUrlFunction: ol.TileUrlFunction.createFromTemplates(ol.TileUrlFunction.expandUrl('tiles/{z}/{x}/{y}.png')),
        // tileUrlFunction: ol.TileUrlFunction.createFromTemplates(ol.TileUrlFunction.expandUrl('http://localhost:8888/v2/civcraft/{z}/{x}/{y}.png')),
        // tileGrid: new ol.tilegrid.XYZ({maxZoom: 14}),
        // tilePixelRatio: 2,
        projection: 'EPSG:3857',
        maxZoom: 12,
        // minZoom: 4,
        // extent: [-size, -size, size, size],
        wrapX: true
      })
    }),


    
    // new ol.layer.Tile({
    //   source: new ol.source.TileDebug({
    //     projection: 'EPSG:3857',
    //     tileGrid: new ol.tilegrid.XYZ({
    //       maxZoom: 22
    //     })
    //   })
    // })
  ],
  view: new ol.View({
    center: NaNsToZeros(blocksToCoords(window.location.hash.substr(1).split('/').slice(1))),
    zoom: Math.min(8, Math.max(2, parseInt(window.location.hash.substr(1).split('/').slice(0, 1)) || 0)),
    minZoom: 1,
    maxZoom: 12
  })
});

var position = $('#position');
map.on('pointermove', function(e) {
  position.text(e.coordinate.map(function(p, index) {
    return parseInt(p * 0.001635310 * (index ? -1 : 1));
  }));
  if (window.showCoords === true) {
    console.log(e.coordinate);
  }
});
$(document).on('keypress', function(e) {
  if (e.keyCode === 115) {
    window.showCoords = !window.showCoords;
  }
})



var featureOverlay = new ol.FeatureOverlay({
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});
featureOverlay.setMap(map);

var modify = new ol.interaction.Modify({
  features: featureOverlay.getFeatures(),
  // the SHIFT key must be pressed to delete vertices, so
  // that new vertices can be drawn at the same position
  // of existing vertices
  deleteCondition: function(event) {
    return ol.events.condition.shiftKeyOnly(event) &&
        ol.events.condition.singleClick(event);
  }
});
map.addInteraction(modify);

var draw; // global so we can remove it later
function addInteraction() {
  draw = new ol.interaction.Draw({
    features: featureOverlay.getFeatures(),
    type: /** @type {ol.geom.GeometryType} */ ('LineString')
  });
  map.addInteraction(draw);
  draw.on('drawend', function(e) {
    var geometry = ol.format.GeoJSON.writeLineStringGeometry_(e.feature.getGeometry());
    var origin = prompt('origin');
    var destination = prompt('destination');
    
    var feature = {
      type: 'Feature',
      properties: {
        origin: origin,
        destination: destination,
      },
      geometry: geometry
    };
    console.log(JSON.stringify(feature));
  });
}

var typeSelect = document.getElementById('type');


/**
 * Let user change the geometry type.
 * @param {Event} e Change event.
 */
// typeSelect.onchange = function(e) {
//   map.removeInteraction(draw);
//   addInteraction();
// };

// addInteraction();




var railsSource = new ol.source.GeoJSON({
  projection: 'EPSG:4326',
  url: 'rails.geojson'
});

railsSource.on('change', function(e) {
  railsSource.un('change', arguments.callee);
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
function hexToRgb(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return r + "," + g + "," + b;
}
var vectorLines = new ol.layer.Vector({
  source: railsSource,
  style: function(feature, resolution) {   
    var color = feature.get('color') ? 'rgba(' + hexToRgb(feature.get('color').slice(1)) + ',0.75)' : 'rgba(200,200,200,0.75)';

    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
          color: color,
          width: Math.min(8, Math.max(6, Math.floor(resolution / 1000))),
          lineDash: feature.get('unconfirmed') ? [5, 10] : undefined
        }),
      // image: new ol.style.Circle({
      //   radius: 10,
      //   fill: new ol.style.Fill({color: color}),
      //   stroke: new ol.style.Stroke({color: 'gray', width: 1})
      // }),
      // text: createTextStyle(feature, resolution, {})
    });
    return [style];
  }
});

map.addLayer(vectorLines);






var createTextStyle = function(feature, resolution, dom) {
  var fontSize = resolution < 5000 ? 16 : 12;
  return new ol.style.Text({
    // textAlign: align,
    // textBaseline: baseline,
    font: 'bold ' + fontSize + 'px Arial',
    text: resolution > 10000 ? feature.get('code') || '' : feature.get('name') || '?',
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
  var maxResolution = 100000;
  return function(feature, resolution) {
    if (resolution > maxResolution 
      || (resolution > 10000 && (feature.get('status') !== 'OK' || !feature.get('code')))
      || (!showInactive && feature.get('code') && feature.get('status') !== 'OK')
      || ['mushroom biome', 'Nether biome'].indexOf(feature.get('name')) !== -1) {
      return [];
    }
    var color = feature.get('status') === 'OK' ? 'rgba(256, 256, 256, 0.5)' : 'rgba(255, 0, 0, 0.5)';
    var style = {
      text: createTextStyle(feature, resolution, {})
    };
    
    if (resolution > 10000 && (feature.get('status') === 'OK' || feature.get('code'))) {
      style.image = new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({color: color}),
        stroke: new ol.style.Stroke({color: 'gray', width: 1})
      });
    }
    return [new ol.style.Style(style)];
  };
};

var citiesSource = new ol.source.GeoJSON({
  projection: 'EPSG:4326',
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

map.addLayer(vectorPoints);

var element = document.getElementById('popup');
var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(popup);
map.on('click', function(evt) {
  $(element).popover('destroy');

  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
  if (feature) {
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
  }
});



$('#showInactive').click(function(e) {
  showInactive = !showInactive;
  vectorPoints.setStyle(createPointStyleFunction());
  $('#showInactive').find('.glyphicon-ok').css({opacity: showInactive ? 1 : 0});
});
var showRails = true;
$('#showRails').click(function(e) {
  showRails = !showRails;
  vectorLines.setVisible(showRails);
  $('#showRails').find('.glyphicon-ok').css({opacity: showRails ? 1 : 0});
});

$('#jumpHome').click(function() {
  var view = map.getView();
  var duration = 1000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 39135.75848201024,
    start: start
  });
  map.beforeRender(pan, bounce);
  view.setCenter([0, 0]);
});

$('#jump').change(function(e) {
  var view = map.getView();
  var duration = 1000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var zoom = ol.animation.zoom({
    duration: duration,
    resolution: view.getResolution(),
    start: start
  });
  map.beforeRender(pan, zoom);

  var code = $(e.target).val();
  var feature = citiesSource.getFeatures().filter(function(feature) {
    return feature.get('code') === code;
  })

  if (feature[0].get('status') !== 'OK' && !showInactive) {
    showInactive = true;
  }

  view.setCenter(feature[0].getGeometry().getCoordinates());
  view.setZoom(6);
});

// Allow Bootstrap dropdown menus to have forms/checkboxes inside, 
// and when clicking on a dropdown item, the menu doesn't disappear.
$(document).on('click', '.dropdown-menu.dropdown-menu-form', function(e) {
  if ($(e.target).closest('.menuitem-noclose').length > 0) {
    e.stopPropagation();
  }
});

$('#geturl').on('click', function(e) {
  e.preventDefault();
  var view = map.getView();
  var zoom = Math.min(8, Math.max(2, view.getZoom()));
  if (zoom !== view.getZoom()) {
    map.beforeRender(ol.animation.zoom({
      duration: 1000,
      resolution: map.getView().getResolution(),
    }));
    view.setZoom(zoom);
  }
  window.location.hash = zoom + '/' + view.getCenter().map(function(p, index) {
    return Math.floor(p * 0.001635310 * (index ? -1 : 1));
  }).join('/');
});