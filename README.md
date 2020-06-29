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
https://github.com/prc5/react-zoom-pan-pinch#readme
https://walterebert.com/playground/wpo/google-maps/


