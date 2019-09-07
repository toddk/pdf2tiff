#!/bin/bash
if [ $# -eq 0 ]
	then
		echo "No arguments supplied"
		exit 
fi

inputfile=$1
outputdir=$2
file_only=$(basename $inputfile)

filename="${file_only%.*}"
""
gdal_translate "$inputfile" "$outputdir/$filename.tiff" -of GTiff --config GDAL_PDF_LAYERS_OFF "Map_Collar, Map_Frame.Projections_and_Grids, Map_Frame.Terrain.Shaded_Relief, Images.Orthoimage" --config GDAL_PDF_DPI 100
