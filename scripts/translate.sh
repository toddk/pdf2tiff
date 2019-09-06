#!/bin/bash
if [ $# -eq 0 ]
	then
		echo "No arguments supplied"
		exit 
fi

inputfile=$1
outputdir=$2

filename="${inputfile%.*}"
echo $filename
echo $inputfile

gdal_translate "$inputfile" "$outputdir/$filename.tiff" -of GTiff
