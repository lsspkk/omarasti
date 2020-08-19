# karttapala
https://tiedostopalvelu.maanmittauslaitos.fi/tp/kartta
vasen alareuna N: 6812432 E: 320480
oikea yläreuna N: 6831760 E: 337728

M421.png
pgw
4.0   # pikselin koko maastometreinä 
0.0 
0.0 
-4.0 
308002.00 # vasemman yläkulman pikselin keskipisteen koordinaatit
6833998.00 


Pikselin koordinaatit voi laskea

https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters

r_earth = 6371000
new_latitude  = latitude  + (dy / r_earth) * (180 / pi);
new_longitude = longitude + (dx / r_earth) * (180 / pi) / cos(latitude * pi/180);

=>

dy = (new_latitude - latitude) / (180/pi) * r_earth * 1000km/m / 4 px/m
dx = (new_longitude - longitude) / (180/pi) * cos(latitude *pi/180) * r_earth * 1000km/m / 4 px/m


# koordinaatit selaimeen
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API


# zoom pan pinch
https://react-leaflet.js.org/
https://github.com/prc5/react-zoom-pan-pinch#readme
https://walterebert.com/playground/wpo/google-maps/


Toimiva ratkaisu oli asentaa qgis, ja ajaa maanmittauslaitoksen png karttapalalle komento
    ./gdal_translate.exe -of GTiff -a_srs "EPSG:3857" /c/Users/Omistaja/Desktop/space/study/fullstackopen/part1/omarasti/data/M421.png /e/tampere/tampere2.tiff

    qgis -ohjelmaan lisätään tif rasteritasoksi ja klikataan työkalupalkista auki työkalut, generate xyz tiles
    gdal2tiles.py -skriptillä vois tehdä saman, mutta windows ja python3 asennus ja kirjastot... haastavaa...
    

## oma karttadata karttapalvelimeksi
https://tilemill-project.github.io/tilemill/docs/win-install/

### Ohjeet
http://www.qgistutorials.com/en/docs/georeferencing_basics.html


### Toiset Ohjeet 
https://mapitgis.com/generating-mbtiles-from-an-image/
https://www.qgis.org/en/site/
http://maperitive.net/

### kolmannet
https://gis.stackexchange.com/questions/317910/convert-a-png-file-to-a-geotiff-while-knowing-the-boundings