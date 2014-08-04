#!/bin/bash


for y in `seq -30 30`; do
	echo "y: $y"
	for x in `seq -30 30`; do
		if [ -f "/home/benja/.minecraft/journeyMap/data/mp/mc.civcraft.vg_0/DIM0/day/$x,$y.png" ]
		then
			row=64
			x2=`echo "${x} + ${row}" | bc -l`
			y2=`echo "(${y} * -1) + ${row} - 1" | bc -l`
			mkdir -p public/tiles/slimecraft/7/${x2}
			# cp /home/benja/.minecraft/journeyMap/data/mp/mc.civcraft.vg_0/DIM0/day/$x,$y.png "public/tiles/slimecraft/7/${x2}/${y2}.png"
			convert /home/benja/.minecraft/journeyMap/data/mp/mc.civcraft.vg_0/DIM0/day/$x,$y.png \
			-resize 256x256 "public/tiles/slimecraft/7/${x2}/${y2}.png"

			row=128
			x2=`echo "${x} * 2 + ${row}" | bc -l`
			y2=`echo "(${y} * 2 * -1) + ${row} - 1" | bc -l`
			mkdir -p public/tiles/slimecraft/8/${x2}
			# cp /home/benja/.minecraft/journeyMap/data/mp/mc.civcraft.vg_0/DIM0/day/$x,$y.png "public/tiles/slimecraft/7/${x2}/${y2}.png"
			convert /home/benja/.minecraft/journeyMap/data/mp/mc.civcraft.vg_0/DIM0/day/$x,$y.png \
			-gravity NorthWest -crop 256x256+0+0 \
			"public/tiles/slimecraft/8/${x2}/${y2}.png"

			


			# zoom=6
			# while [ zoom -gt 2]
			# do
				
			# done

			#echo "convert mapHD.png -repage +$x+$y /home/benja/.minecraft/journeyMap/data/mp/mc.civcraft.vg_0/DIM0/day/$x,$y.png mapHD.png"
			# convert mapHD.png -repage +$x+$y /home/benja/.minecraft/journeyMap/data/mp/mc.civcraft.vg_0/DIM0/day/$x,$y.png mapHD.png
		fi
	done
done