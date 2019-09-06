#!/bin/bash

if [ $# -eq 0 ]
	then
		echo "No arguments supplied"
		exit 
fi

inputdir=$1
outputdir=$2

inotifywait -m $inputdir -e create -e moved_to |
	while read path action file; do
		echo "File received $action $file"
		filename="${file%.*}"
		
		gdal_translate "$inputdir/$file" "$outputdir/$filename.tiff" -of GTiff
	done