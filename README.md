# deckboard-lhm
Display hardware status from Libre Hardware Monitor on Deckboard button

I replaced Open Hardware Monitor by its fork [Libre Hardware Monitor](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases), that works with newer hardware without breaking backward compatibility.

**You must have Libre Hardware Monitor running in the background to display values.**


![Example of buttons using the new monitors](/static/example.png)


## Available monitors

**Depending on your hardware, some values may not be available**

* CPU Load
* CPU Temperature
* CPU Power consumption

* GPU Load (two methods, one accurate but depending on the sensors available, and one using the Direct3D load)
* GPU Core Temperature
* GPU Hot Spot Temperature
* GPU Power consumption
* GPU Clock Speed
* GPU Memory Speed

* RAM Load

* VRM Temperature

____

Tested on
* Ryzen 5500U with integrated graphics laptop
* Intel Core i3 4010U with integrated graphics laptop
* Ryzen 5800X and NVidia 3060Ti on MSI B550 Motherboard _(the screenshot comes from this machine)_