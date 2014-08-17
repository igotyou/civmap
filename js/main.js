var map = require('./map.js');

require('./controls.js').init(map);

require('./railsLayer.js').init(map);

require('./pointLayer.js').init(map);



require('./editMode.js')(map);

require('./gui.js')(map);
