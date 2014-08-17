module.exports = function(map) {
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
    var geojson = new ol.format.GeoJSON();
    draw.on('drawend', function(e) {
      var geometry = geojson.writeFeature(e.feature);
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

  window.addInteraction = addInteraction;

  // map.addInteraction(new ol.interaction.Select());
};
