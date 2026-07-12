<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.12.2" name="scene_1" tilewidth="16" tileheight="16" tilecount="104" columns="8">
 <image source="../../public/assets/sprite/scene_1.png" width="128" height="208"/>
 <tile id="72">
  <objectgroup draworder="index" id="2">
   <object id="1" x="-0.5" y="1" width="16.5" height="10.5"/>
  </objectgroup>
 </tile>
 <tile id="73">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="2.625" width="15.75" height="8.5"/>
  </objectgroup>
 </tile>
 <tile id="80">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="-0.25" width="6.875" height="16.375"/>
  </objectgroup>
 </tile>
 <wangsets>
  <wangset name="esquinas camino" type="corner" tile="73">
   <wangcolor name="grass" color="#00ff00" tile="45" probability="1"/>
   <wangcolor name="sand" color="#ffff00" tile="61" probability="0.5"/>
   <wangcolor name="barranco" color="#0000ff" tile="-1" probability="1"/>
   <wangcolor name="flowers" color="#ff7700" tile="7" probability="1"/>
   <wangcolor name="walls" color="#00e9ff" tile="73" probability="1"/>
   <wangcolor name="void" color="#ff00d8" tile="-1" probability="1"/>
   <wangtile tileid="44" wangid="0,2,0,2,0,2,0,2"/>
   <wangtile tileid="45" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="46" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="52" wangid="0,1,0,2,0,1,0,1"/>
   <wangtile tileid="53" wangid="0,1,0,2,0,2,0,1"/>
   <wangtile tileid="54" wangid="0,1,0,1,0,2,0,1"/>
   <wangtile tileid="58" wangid="0,2,0,1,0,2,0,2"/>
   <wangtile tileid="59" wangid="0,2,0,2,0,1,0,2"/>
   <wangtile tileid="60" wangid="0,2,0,2,0,1,0,1"/>
   <wangtile tileid="61" wangid="0,2,0,2,0,2,0,2"/>
   <wangtile tileid="62" wangid="0,1,0,1,0,2,0,2"/>
   <wangtile tileid="66" wangid="0,1,0,2,0,2,0,2"/>
   <wangtile tileid="67" wangid="0,2,0,2,0,2,0,1"/>
   <wangtile tileid="68" wangid="0,2,0,1,0,1,0,1"/>
   <wangtile tileid="69" wangid="0,2,0,1,0,1,0,2"/>
   <wangtile tileid="70" wangid="0,1,0,1,0,1,0,2"/>
   <wangtile tileid="72" wangid="0,5,0,1,0,5,0,5"/>
   <wangtile tileid="73" wangid="0,5,0,1,0,1,0,5"/>
   <wangtile tileid="74" wangid="0,5,0,5,0,1,0,5"/>
   <wangtile tileid="80" wangid="0,1,0,1,0,5,0,5"/>
   <wangtile tileid="82" wangid="0,5,0,5,0,1,0,1"/>
   <wangtile tileid="88" wangid="0,1,0,5,0,5,0,5"/>
   <wangtile tileid="89" wangid="0,1,0,5,0,5,0,1"/>
   <wangtile tileid="90" wangid="0,5,0,5,0,5,0,1"/>
  </wangset>
  <wangset name="terreno" type="mixed" tile="-1">
   <wangcolor name="grass" color="#00ff00" tile="60" probability="1"/>
   <wangcolor name="wall" color="#550000" tile="73" probability="1"/>
   <wangcolor name="dirt" color="#ffff00" tile="44" probability="1"/>
   <wangcolor name="flores" color="#ff7700" tile="-1" probability="1"/>
   <wangtile tileid="7" wangid="4,1,4,1,4,1,4,1"/>
   <wangtile tileid="15" wangid="4,1,4,4,4,1,4,4"/>
   <wangtile tileid="23" wangid="1,1,1,4,4,4,4,4"/>
   <wangtile tileid="31" wangid="4,4,4,1,4,1,4,1"/>
   <wangtile tileid="39" wangid="4,1,4,4,4,1,4,4"/>
   <wangtile tileid="44" wangid="3,3,3,3,3,3,3,3"/>
   <wangtile tileid="45" wangid="1,1,1,1,1,1,1,1"/>
   <wangtile tileid="46" wangid="1,1,1,1,1,1,1,1"/>
   <wangtile tileid="47" wangid="1,1,1,4,4,4,4,4"/>
   <wangtile tileid="52" wangid="1,0,0,3,0,0,1,1"/>
   <wangtile tileid="53" wangid="1,0,0,3,3,3,0,0"/>
   <wangtile tileid="54" wangid="1,1,1,0,0,3,0,0"/>
   <wangtile tileid="55" wangid="4,1,4,1,4,1,4,1"/>
   <wangtile tileid="58" wangid="3,0,0,1,0,0,3,3"/>
   <wangtile tileid="59" wangid="3,3,3,0,0,1,0,0"/>
   <wangtile tileid="60" wangid="0,3,3,3,0,0,1,0"/>
   <wangtile tileid="61" wangid="3,3,3,3,3,3,3,3"/>
   <wangtile tileid="62" wangid="0,0,1,0,0,3,3,3"/>
   <wangtile tileid="63" wangid="4,1,4,4,4,1,4,4"/>
   <wangtile tileid="64" wangid="2,0,0,0,0,0,2,2"/>
   <wangtile tileid="65" wangid="2,2,2,0,0,0,0,0"/>
   <wangtile tileid="66" wangid="0,1,0,0,3,3,3,0"/>
   <wangtile tileid="67" wangid="0,0,3,3,3,0,0,1"/>
   <wangtile tileid="68" wangid="0,3,0,0,1,1,1,0"/>
   <wangtile tileid="69" wangid="3,3,0,0,1,0,0,3"/>
   <wangtile tileid="70" wangid="0,0,1,1,1,0,0,3"/>
   <wangtile tileid="71" wangid="1,1,1,4,4,4,4,4"/>
   <wangtile tileid="72" wangid="0,0,2,2,2,0,0,0"/>
   <wangtile tileid="73" wangid="0,0,2,2,2,2,2,0"/>
   <wangtile tileid="74" wangid="0,0,0,0,2,2,2,0"/>
   <wangtile tileid="80" wangid="2,2,2,2,2,0,0,0"/>
   <wangtile tileid="82" wangid="2,0,0,0,2,2,2,2"/>
   <wangtile tileid="86" wangid="2,0,0,0,0,0,2,2"/>
   <wangtile tileid="87" wangid="0,0,0,0,2,2,2,0"/>
   <wangtile tileid="88" wangid="2,2,2,0,0,0,0,0"/>
   <wangtile tileid="89" wangid="2,2,2,0,0,0,2,2"/>
   <wangtile tileid="90" wangid="2,0,0,0,0,0,2,2"/>
   <wangtile tileid="94" wangid="2,2,2,0,0,0,0,0"/>
   <wangtile tileid="95" wangid="0,0,2,2,2,0,0,0"/>
  </wangset>
  <wangset name="Unnamed Set" type="edge" tile="-1">
   <wangcolor name="" color="#ff0000" tile="-1" probability="1"/>
   <wangtile tileid="72" wangid="0,0,1,0,1,0,0,0"/>
   <wangtile tileid="73" wangid="0,0,1,0,0,0,1,0"/>
   <wangtile tileid="74" wangid="0,0,0,0,1,0,1,0"/>
   <wangtile tileid="80" wangid="1,0,0,0,1,0,0,0"/>
   <wangtile tileid="82" wangid="1,0,0,0,1,0,0,0"/>
   <wangtile tileid="88" wangid="1,0,1,0,0,0,0,0"/>
   <wangtile tileid="89" wangid="0,0,1,0,0,0,1,0"/>
   <wangtile tileid="90" wangid="1,0,0,0,0,0,1,0"/>
  </wangset>
 </wangsets>
</tileset>
