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

gdal_translate "$inputfile" "$outputdir/$filename.tiff" -of GTiff
