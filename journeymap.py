import os
from subprocess import call
import pdb

def crop(z, x, y, xoffset, yoffset, xdest, ydest):
	if not os.path.exists("public/tiles/slimecraft/%d/%d" % (z, xdest)):
		os.makedirs("public/tiles/slimecraft/%d/%d" % (z, xdest))

	call("convert data/gipsyking/%d,%d.png \
		-gravity NorthWest -crop 256x256+%d+%d \
		public/tiles/slimecraft/%d/%d/%d.png" % (x, y, xoffset, yoffset, z, xdest, ydest),
		shell=True)


for y in range(-129, 129):
	print "Level y %d" % y
	for x in range(-129, 129):
		# source = "data/gipsyking/%d,%d.png" % (x, y)
		# if not os.path.exists(source):
		# 	continue

		rowSize = 64
		xdest = x + rowSize
		ydest = -y + rowSize - 1

		if not os.path.exists("public/tiles/slimecraft/7/%d" % xdest):
			os.makedirs("public/tiles/slimecraft/7/%d" % xdest)

		rowSize = 128

		if os.path.exists("data/gipsyking/%d,%d.png" % (x, y)):
			call("convert data/gipsyking/%d,%d.png -resize 256x256 public/tiles/slimecraft/7/%d/%d.png" % (x, y, xdest, ydest), shell=True)

			crop(8, x, y, 0, 0, x * 2 + rowSize, -y * 2 + rowSize - 1)
			crop(8, x, y, 256, 0, x * 2 + rowSize + 1, -y * 2 + rowSize - 1)
			crop(8, x, y, 0, 256, x * 2 + rowSize, -y * 2 + rowSize - 1 - 1)
			crop(8, x, y, 256, 256, x * 2 + rowSize + 1, -y * 2 + rowSize - 1 - 1)

		# if x % 2 == 0 and y % 2 == 0:
		# 	rowSize = 32
		# 	xdest = x / 2 + rowSize
		# 	ydest = -y / 2 + rowSize - 1

		# 	if not os.path.exists("public/tiles/slimecraft/6/%d" % xdest):
		# 		os.makedirs("public/tiles/slimecraft/6/%d" % xdest)

		# 	call("composite -gravity NorthWest data/gipsyking/%d,%d.png \
		# 		-geometry 128x128+0+0 public/tiles/slimecraft/6/%d/%d.png public/tiles/slimecraft/6/%d/%d.png" % (x, y, xdest, ydest, xdest, ydest), shell=True)
		# 	call("composite -gravity NorthWest data/gipsyking/%d,%d.png \
		# 		-geometry 128x128+128+0 public/tiles/slimecraft/6/%d/%d.png public/tiles/slimecraft/6/%d/%d.png" % (x + 1, y, xdest, ydest, xdest, ydest), shell=True)
		# 	call("composite -gravity NorthWest data/gipsyking/%d,%d.png \
		# 		-geometry 128x128+0+128 public/tiles/slimecraft/6/%d/%d.png public/tiles/slimecraft/6/%d/%d.png" % (x, y + 1, xdest, ydest, xdest, ydest), shell=True)
		# 	call("composite -gravity NorthWest data/gipsyking/%d,%d.png \
		# 		-geometry 128x128+128+128 public/tiles/slimecraft/6/%d/%d.png public/tiles/slimecraft/6/%d/%d.png" % (x + 1, y + 1, xdest, ydest, xdest, ydest), shell=True)
		

		# if x == -1 and y == -21:
		# 	print xdest
		# 	pdb.set_trace()

		factor = 1
		tileSize = 256
		rowSize = 64
		for z in range(6, 1, -1):
			factor *= 2

			if x % factor == 0 and y % factor == 0:
				rowSize /= 2
				xdest = x / factor + rowSize
				ydest = -y / factor + rowSize - 1

				if not os.path.exists("public/tiles/slimecraft/%d/%d" % (z, xdest)):
					os.makedirs("public/tiles/slimecraft/%d/%d" % (z, xdest))

				for xoffset in range(0, factor):
					for yoffset in range(0, factor):
						if not os.path.exists("data/gipsyking/%d,%d.png" % (x + xoffset, y + yoffset)):
							continue

						command = "composite -gravity NorthWest \
							data/gipsyking/%d,%d.png \
							-geometry %dx%d+%d+%d \
							public/tiles/slimecraft/%d/%d/%d.png \
							public/tiles/slimecraft/%d/%d/%d.png" % (
							x + xoffset, y + yoffset,
							tileSize / factor, tileSize / factor, xoffset * tileSize / factor, yoffset * tileSize / factor,
							z, xdest, ydest,
							z, xdest, ydest,
							)
						

						call(command, shell=True)

		
