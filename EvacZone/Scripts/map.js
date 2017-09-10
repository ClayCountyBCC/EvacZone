"use strict";
var EM = null;
var LocationLayer = null;

function MapStart()
{
  require(["esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Legend",
    "dojo/_base/array",
    "dojo/parser",
    "dijit/layout/BorderContainer",
    "dojo/domReady!"],
    function (
      Map,
      ArcGISDynamicMapServiceLayer,
      Legend,
      arrayUtils,
      Parser
    )
    {
      Parser.parse();

      EM = new Map("EvacMap", {
        center: [-81.80, 29.950],
        zoom: 10,
        basemap: "osm",
        smartNavigation: false,
        logo: false
      });
      EM.disablePan();
      EM.disableScrollWheelZoom();
      EM.disableMapNavigation();
      var evacZone = new ArcGISDynamicMapServiceLayer('https://maps.claycountygov.com:6443/arcgis/rest/services/EvacuationZones/MapServer');
      //var parcels = new ArcGISDynamicMapServiceLayer('https://maps.claycountygov.com:6443/arcgis/rest/services/Parcel/MapServer');
      //add the legend
      EM.on("layers-add-result", function (evt)
      {
        var layerInfo = arrayUtils.map(evt.layers, function (layer, index)
        {
          return { layer: layer.layer, title: layer.layer.name };
        });
        if (layerInfo.length > 0)
        {
          var legendDijit = new Legend({
            map: EM,
            layerInfos: layerInfo
          }, "legendDiv");
          legendDijit.startup();
        }
      });

      LocationLayer = new esri.layers.GraphicsLayer();
      EM.addLayers([evacZone, LocationLayer]);
    });
}
function Zoom(latlong, EvacZone)
{
  console.log('zoom evaczone', EvacZone);
  require(["esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "esri/SpatialReference",
    "esri/symbols/TextSymbol"],
    function (Point, PictureMarkerSymbol, Graphic, SpatialReference, TextSymbol)
    {
      var symbol = new PictureMarkerSymbol({
        "angle": 0,
        "xoffset": 0,
        "yoffset": 0,
        "type": "esriPMS",
        "contentType": "image/png",
        "width": 20,
        "height": 20,
        "url": "http://static.arcgis.com/images/Symbols/Basic/GreenSphere.png"
      });
      var textSymbol = new TextSymbol('Evacuation Zone: ' + EvacZone); //esri.symbol.TextSymbol(data.Records[i].UnitName);
      textSymbol.setColor(new dojo.Color([0, 0, 0]));
      textSymbol.setAlign(TextSymbol.ALIGN_MIDDLE);
      textSymbol.setOffset(0, -25);
      textSymbol.setHaloColor(new dojo.Color([255, 255, 255]));
      textSymbol.setHaloSize(3);
      LocationLayer.clear();
      var p = new Point([latlong.Longitude, latlong.Latitude]);      
      //var p = new Point([latlong.OriginalX, latlong.OriginalY], new SpatialReference({ wkid: 4326 }));
      //var wmIncident = esri.geometry.geographicToWebMercator(p);
      //var graphic = new Graphic(wmIncident);
      var font = new esri.symbol.Font();
      font.setSize("14pt");
      font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
      textSymbol.setFont(font);
      var graphic = new Graphic(p);
      graphic.setSymbol(symbol);
      var s = new Graphic(p);
      s.setSymbol(textSymbol);
      LocationLayer.add(graphic);
      LocationLayer.add(s);
      EM.centerAndZoom(p, 16);
    });

}