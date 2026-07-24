# 🎵 Nebel Radio Template

Tato složka obsahuje základní šablonu pro všechna rádia eBradavic.

---

## Jak vytvořit nové rádio

### 1. Zkopíruj šablonu

Zkopíruj obsah této složky do nové složky v:

```
radia/
```

Například:

```
radia/dusicky-radio/
```

tj. add file -> creat new file a do názvu vložím: dusicky-radio/

pak to bude vypadat takto: Nebelradio/radia/dusicky-radio/

zkopíruju z templátu:

index.html 

playlist.json

v index.html si změním title a h1 podle názvu, jak chci aby se rádio jmenovalo a pak už nesahám, pokud se něco neposere, nebo nebudu chtít změnit

+ v index.html se ještě mění začátek vysílání rádia viz níže
+ vždy kontroluju, že to měním v index.html, který je připojený ke složce mojí akce, neměním to v templátu nebo kořenovém html, protože by se tím celé rádio rozhodilo, sahám jen na věci v té dané složce, krom config.js viz níže

dále udělám tyto složky opět přes add file: 

assets/.gitkeep - sem už nikdy nic dávat nebudu

music/.gitkeep


vytvořím nové (prázdné) přes add file:

effects.css

theme.css

a nechám nakódovat AI pozadí a vzhled té stránky


---

### 2. Přidej hudbu

Nahraj MP3 soubory do složky:

```
music/
```
do nové vytvořené složky music v kroku 1 uploaduju písničky (koncovka .mp3!)
+ tady je pravidlo: písničky jmenuju tak, že dám počáteční písmeno akce, takže Dušičky -> d, napíšu song a číslo písničky, takže ve výsledku to bude vypadat třeba takto: dsong1.mp3, dsong2.mp3, dsong51mp3..., čísluju samozřejme postupně a nevynechávám čísla, až pak když mám takhle přejmenované audia, je sem začnu vkládat (jen do složky music u dané akce, nikam jinam!)

písničky stahuju normálně pomocí konvertu URL to mp3 na internetu milion a vkládám odkazy přímo z YT

---

### 3. Uprav playlist

Otevři:

```
playlist.json
```

+ otevřu ho opět v mé složce té akce!

teď sestavím playslit, tímhle stylem:

[
 
  {
    
    "title": "Song 1",
    
    "url": "music/dsong1.mp3"
 
  },
  
  {
  
    "title": "Song 2",
    
    "url": "music/dsong2.mp3"
  
  },
  
  {
  
    "title": "Song 3",
    
    "url": "music/dsong3.mp3"
  
  },
  
  ...
  
  {
  
    "title": "Song X",
    
    "url": "music/dsongX.mp3"
  
  }              pozor zde za tou závorkou nedávám čárku u poslední skladby a vždy vkládám správný název skladby, které jsem si podle akce udělala

  
  ]

---

### 4. Nastav čas vysílání

V souboru `index.html` změň:

```html
<body data-start="2026-07-24T20:00:00">
```
tady klasicky nastavím čas, pozor nevím, jak to funguje ještě se zimním časem, kdyžtak to bude +-1 hodina, musím otestovat

!formát je: RRRR-MM-DDTHH:MM:SS

---

### 5. configurace rádia

najedu do repozitáře Nebelradio a kliknu na config.js

zde změním název rádia, které chci, aby hrálo


---

### 6. Hotovo 🎉

pozn.: pokud chci vkládat obrázek jako pozadí:

stáhnu libovolný obrázek dané velikosti s koncovkou .jpg!, pojmenuju ho názevakcebackground.jpg, např.: dusickybackground.jpg

pak ho nahraju do složky assets a vkládám do kódu theme. css do body, například takto:

body {
   
    background-image: url("assets/dusickybackground.jpg");

ale to už pořeší i AI
