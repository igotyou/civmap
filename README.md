Civcraft Map
============

This is the repo of the civcraft map currently located at http://txapu.com


### Add tile data

Link or copy the journeymap data so that `data/day` points to or is a copy of `~/.minecraft/journeyMap/data/mp/<civcraft-ID>`. Then run `python journeymap.py`.

### Add other data

Edit `cities.geojson` or `rails.geojson`. The structure of the "JSON objects" are in GeoJSON format.

To add lines quickly, open the map and the javascript console and type `addInteraction()` then hit enter. Ypu can then draw a rail line clicking on the map. Double click to finish it, the GeoJSON feature will be printed in the console, ready to add to the file.

TODO
====

#### Tile last-modified strategy

Right now, due to how the project started being a scrape of civtransport map, last added journeymap tiles are always merged on top of existing data. Ideally, there should be one true "journeymap source tileset", with each tile conserving the timestamp when it was written by journeymap, so that other tiles can be merged on top or below depending on the timestamps. **This improvement is very important.**

#### Add tools to add features

Rails and "points" (more to that later). There should also be tools to edit existing features.

#### Points instead of cities

The layer and source the cities are currently in contain features both for cities and for things like biome info. It would be better to declare it as a "points" layer, where a point can simply mark a city, a biome, a landmark (including abandonded cities) or whatever.

#### Geosharer

Since there is a way to export geosharer data as journeymap, it should be trivial to plugin this into the map. The only difficult point might be timestamps of tiles.
