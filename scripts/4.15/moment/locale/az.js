//>>built
(function(c,b){"object"===typeof exports&&"undefined"!==typeof module&&"function"===typeof require?b(require("../moment")):"function"===typeof define&&define.amd?define(["../moment"],b):b(c.moment)})(this,function(c){var b={1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-\u00fcnc\u00fc",4:"-\u00fcnc\u00fc",100:"-\u00fcnc\u00fc",6:"-nc\u0131",9:"-uncu",10:"-uncu",30:"-uncu",60:"-\u0131nc\u0131",90:"-\u0131nc\u0131"};return c.defineLocale("az",{months:"yanvar fevral mart aprel may iyun iyul avqust sentyabr oktyabr noyabr dekabr".split(" "),
monthsShort:"yan fev mar apr may iyn iyl avq sen okt noy dek".split(" "),weekdays:"Bazar;Bazar ert\u0259si;\u00c7\u0259r\u015f\u0259nb\u0259 ax\u015fam\u0131;\u00c7\u0259r\u015f\u0259nb\u0259;C\u00fcm\u0259 ax\u015fam\u0131;C\u00fcm\u0259;\u015e\u0259nb\u0259".split(";"),weekdaysShort:"Baz BzE \u00c7Ax \u00c7\u0259r CAx C\u00fcm \u015e\u0259n".split(" "),weekdaysMin:"Bz BE \u00c7A \u00c7\u0259 CA C\u00fc \u015e\u0259".split(" "),weekdaysParseExact:!0,longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",
LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bug\u00fcn saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[g\u0259l\u0259n h\u0259ft\u0259] dddd [saat] LT",lastDay:"[d\u00fcn\u0259n] LT",lastWeek:"[ke\u00e7\u0259n h\u0259ft\u0259] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s \u0259vv\u0259l",s:"birne\u00e7\u0259 saniy\u0259",ss:"%d saniy\u0259",m:"bir d\u0259qiq\u0259",mm:"%d d\u0259qiq\u0259",h:"bir saat",hh:"%d saat",d:"bir g\u00fcn",
dd:"%d g\u00fcn",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gec\u0259|s\u0259h\u0259r|g\u00fcnd\u00fcz|ax\u015fam/,isPM:function(a){return/^(g\u00fcnd\u00fcz|ax\u015fam)$/.test(a)},meridiem:function(a,b,c){return 4>a?"gec\u0259":12>a?"s\u0259h\u0259r":17>a?"g\u00fcnd\u00fcz":"ax\u015fam"},dayOfMonthOrdinalParse:/\d{1,2}-(\u0131nc\u0131|inci|nci|\u00fcnc\u00fc|nc\u0131|uncu)/,ordinal:function(a){if(0===a)return a+"-\u0131nc\u0131";var c=a%10;return a+(b[c]||b[a%100-c]||b[100<=a?100:
null])},week:{dow:1,doy:7}})});