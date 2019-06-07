# pdf2tiff
A GeoPDF to GeoTIFF conversion service using NodeJS.

The purpose of this project is to provide a web application that will take a GeoPDF and convert it to a GeoTIFF asynchronously. The GeoTIFF imagery format is an image format that is more widely supported by
geospatial visualization packages versus GeoPDF. 

## Architecture
This application consists of 3 components. A ReactJS front end that gathers inputs from the user, a NodeJS backend that provides a REST API for the conversion job, and shell scripts that invoke `gdal` to perform the conversion from GeoPDF to GeoTIFF. To utilize the shell scripts you will need to run the NodeJS service on a system that supports `inotify`. 

## Usage
To use this application you will first need to start the BASH scripts included with the program. Both scripts monitor a directory for change and, in order to function correctly, should be run first before the NodeJS or ReactJS applications are brought online. The next step in the process is to run the NodeJS service via `node server.js`. To run the ReactJS portion, run `npm start` from within the `client` sub directory found in this project.
