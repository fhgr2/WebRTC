# StudRTC

[Demoversion unter goo.gl/sycmTi](http://stud.htwchur.ch/studermartin_stu205/WebAppProj/)

## Beschreibung
Eine Mobiletaugliche Webapplikation zur Browserbasierten und Browserübergreiffenden Kommunikation zwischen zwei Benutzern per Video, Audio und Chat und zum Austuasch von Files jeglicher Art. Basierend auf WebRTC und dem PubNub Data-Streaming-Network.
Das GUI Basiert auf dem Mobile-Angular-UI Framework.

Unterstützt werden Folgende Desktop- sowie Mobile-Browser:
- Firefox
- Chrome
- Opera

## Verwendung
Beim Aufrufen der Website wird der Benutzer durch eine Willkommensseite begrüsst. Durch klick auf "got it" wird er auf die Seite weitergeleitet, von der aus er einen Call starten kann. Beim erstmaligen aufrufen dieser Seite wird der Benutzer aufgefordert, dem Browser seine Webcam- und Audio-Geräte freizugeben **1**.

![first](https://cloud.githubusercontent.com/assets/9406816/7958030/f8174b0a-09eb-11e5-9829-0bae7cb72742.png)

Von dieser Seite aus kann ein Call getätigt werden. Dazu schickt der User entweder den Link **2** an den gesprächspartner weiter (ruft dieser den Link auf wird automatisch ein call gestartet) oder er gibt die Nummer des gesprächspartner im entsprechenden Feld **3** ein und klickt auf den grünen Button **4**, um den Call zu starten. 

![second](https://cloud.githubusercontent.com/assets/9406816/7958031/f834414c-09eb-11e5-8db5-fc44d6ac4c96.PNG)

Während einem Call kann über das Menu (auf mobile geräten per Swipe oder betätigen des Menu-Knopfes oben links) zwischen dem Video/Audio Call **5** und dem Chat/Filetransfer **6** hin und her gewechselt werden. Mit einem Klick auf End Call **7** wird der call beendet und der User findet sich auf der Ausgangsseite wieder, wo er einen weiteren Call Starten kann.

![third](https://cloud.githubusercontent.com/assets/9406816/7958032/f8376318-09eb-11e5-853d-4ae3cbf67f02.PNG)

## Installation
Um die Webapplikation auf dem eigenen rechner auszuprobieren werden ausser einem Browser (Firefox, Chrome und Opera unterstützt und getestet) keine weitere Software benötigt.
Laden Sie das Zip von dieser Github-Page herunter, entpacken Sie es und öffnen Sie index.html.
Um die Applikation auf einem Webserver zu verwenden müssen wiederum die Inhalte der Zip-Datei in das gewünschte Verzeichnis des Webservers geladen werden. Es gibt keine speziellen Voraussetzungen für den Webserver, alle benötigten Files und bibliotheken sind in der Ordnerstruktur vorhanden.
