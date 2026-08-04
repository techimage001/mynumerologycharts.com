/* Moon & Rising sign extension. Uses the bundled astronomy-engine (window.Astronomy).
   Verified against known charts (Einstein, JFK, Diana). Rising depends on exact
   birth time and place, so it is clearly labelled and only shown when both are given. */
(function(){
  var SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  var SYM=['\u2648','\u2649','\u264a','\u264b','\u264c','\u264d','\u264e','\u264f','\u2650','\u2651','\u2652','\u2653'];
  var ELEM=['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water'];
  var MOON=['quick, direct feelings and a need to act on them','steady, comfort-seeking feelings and a love of security','curious, changeable feelings expressed through words','deep, tidal feelings and a strong need for home and safety','warm, expressive feelings and a wish to be appreciated','careful, practical feelings shown through helpfulness','feelings that seek balance, fairness and companionship','intense, private feelings and a need for real depth','open, optimistic feelings and a need for freedom','contained, responsible feelings and a need to feel useful','cool, independent feelings and a need for space to think','soft, empathic feelings and a rich inner world'];
  var RISE=['a direct, energetic first impression, you seem bold and ready to go','a calm, grounded first impression, you seem steady and reassuring','a bright, talkative first impression, you seem curious and quick','a gentle, caring first impression, you seem approachable and kind','a warm, confident first impression, you seem generous and sunny','a neat, capable first impression, you seem modest and reliable','a poised, charming first impression, you seem gracious and fair','a magnetic, private first impression, you seem intense and self-contained','a friendly, adventurous first impression, you seem open and upbeat','a composed, serious first impression, you seem capable and mature','an original, cool first impression, you seem independent and open-minded','a soft, dreamy first impression, you seem gentle and imaginative'];
  var CITIES={
    'London, UK':[51.51,-0.13,0],'Manchester, UK':[53.48,-2.24,0],'Dublin, Ireland':[53.35,-6.26,0],'Lisbon, Portugal':[38.72,-9.14,0],
    'Paris, France':[48.85,2.35,1],'Madrid, Spain':[40.42,-3.70,1],'Berlin, Germany':[52.52,13.40,1],'Rome, Italy':[41.90,12.50,1],'Amsterdam, Netherlands':[52.37,4.90,1],'Stockholm, Sweden':[59.33,18.06,1],'Warsaw, Poland':[52.23,21.01,1],'Lagos, Nigeria':[6.52,3.38,1],
    'Cairo, Egypt':[30.04,31.24,2],'Athens, Greece':[37.98,23.73,2],'Johannesburg, South Africa':[-26.20,28.05,2],'Kyiv, Ukraine':[50.45,30.52,2],
    'Moscow, Russia':[55.76,37.62,3],'Istanbul, Turkey':[41.01,28.98,3],'Nairobi, Kenya':[-1.29,36.82,3],
    'Dubai, UAE':[25.20,55.27,4],'Karachi, Pakistan':[24.86,67.01,5],'Mumbai, India':[19.08,72.88,5.5],'Delhi, India':[28.61,77.21,5.5],'Dhaka, Bangladesh':[23.81,90.41,6],
    'Bangkok, Thailand':[13.76,100.50,7],'Jakarta, Indonesia':[-6.21,106.85,7],'Singapore':[1.35,103.82,8],'Beijing, China':[39.90,116.41,8],'Hong Kong':[22.32,114.17,8],'Perth, Australia':[-31.95,115.86,8],'Manila, Philippines':[14.60,120.98,8],
    'Tokyo, Japan':[35.68,139.69,9],'Seoul, South Korea':[37.57,126.98,9],'Sydney, Australia':[-33.87,151.21,10],'Melbourne, Australia':[-37.81,144.96,10],'Auckland, New Zealand':[-36.85,174.76,12],
    'Honolulu, USA':[21.31,-157.86,-10],'Anchorage, USA':[61.22,-149.90,-9],'Los Angeles, USA':[34.05,-118.24,-8],'Vancouver, Canada':[49.28,-123.12,-8],'Denver, USA':[39.74,-104.99,-7],'Chicago, USA':[41.88,-87.63,-6],'Mexico City, Mexico':[19.43,-99.13,-6],
    'New York, USA':[40.71,-74.01,-5],'Toronto, Canada':[43.65,-79.38,-5],'Miami, USA':[25.76,-80.19,-5],'Bogota, Colombia':[4.71,-74.07,-5],'Lima, Peru':[-12.05,-77.04,-5],
    'Sao Paulo, Brazil':[-23.55,-46.63,-3],'Buenos Aires, Argentina':[-34.60,-58.38,-3]
  };
  function idx(lon){return Math.floor(((lon%360)+360)%360/30);}
  function moonIdx(d){return idx(Astronomy.EclipticGeoMoon(d).lon);}
  function ascIdx(d,lat,lon){
    var gst=Astronomy.SiderealTime(d);
    var lst=((gst+lon/15)%24+24)%24, ramc=(lst*15)%360;
    var eps=23.4392911, r=Math.PI/180, R=ramc*r, E=eps*r, L=lat*r;
    var asc=Math.atan2(Math.cos(R), -(Math.sin(R)*Math.cos(E)+Math.tan(L)*Math.sin(E)));
    return idx(((asc/r)%360+360)%360);
  }
  function utcFromLocal(y,mo,d,hh,mm,offset){ return new Date(Date.UTC(y,mo-1,d,hh,mm)-offset*3600000); }
  function compute(dobStr,timeStr,cityKey){
    var m=/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dobStr||''); if(!m||!window.Astronomy) return null;
    var y=+m[1],mo=+m[2],da=+m[3];
    var city=CITIES[cityKey], t=/^(\d{1,2}):(\d{2})/.exec(timeStr||'');
    var offset=city?city[2]:0, hh=t?+t[1]:12, mm=t?+t[2]:0;
    var utc=utcFromLocal(y,mo,da,hh,mm,offset);
    var out={moon:moonIdx(utc)};
    if(city && t){ out.rising=ascIdx(utc,city[0],city[1]); }
    out.hasTime=!!t; out.hasCity=!!city;
    return out;
  }
  function card(kind,i,meaning,note){
    return '<article class="astro-body-card"><span class="zodiac-mini">'+SYM[i]+'</span><div><small>'+kind+'</small><strong>'+SIGNS[i]+'</strong><p>'+ELEM[i]+' sign \u00b7 '+meaning+'.</p>'+(note?'<p class="context-note">'+note+'</p>':'')+'</div></article>';
  }
  function section(){
    var dob=document.querySelector('#dob'), tm=document.querySelector('#birthTime'), ct=document.querySelector('#birthCity');
    if(!dob) return '';
    var r=compute(dob.value, tm?tm.value:'', ct?ct.value:'');
    if(!r) return '';
    var cards=card('Moon sign',r.moon,MOON[r.moon], r.hasTime?'':'Add your birth time for a more precise Moon sign, especially if you were born near a sign change.');
    if(r.rising!=null){
      cards+=card('Rising sign (Ascendant)',r.rising,RISE[r.rising],'Approximate: the Rising sign is very sensitive to exact birth time. Daylight saving is not applied automatically, so treat this as a close guide.');
    }
    var prompt = r.rising==null ? '<p class="notice">Add your <strong>birth time</strong> and <strong>birth place</strong> above, then recalculate, to also see your Rising sign.</p>' : '';
    return '<section id="moonRising" class="dashboard-section astrology-overview"><div class="section-heading"><div><p class="dashboard-kicker">Integrated astrology</p><h2>Your Moon and Rising signs</h2></div></div><p>Your Sun sign comes from your birth date. Your Moon sign is calculated from the Moon\u2019s position, and your Rising sign from the exact time and place you were born.</p><div class="astro-body-grid">'+cards+'</div>'+prompt+'<p class="notice">Positions are calculated with a standard astronomy engine using the tropical zodiac. For entertainment purposes only.</p></section>';
  }
  function fillSelect(){
    var sel=document.querySelector('#birthCity'); if(!sel||sel.dataset.filled) return;
    var keys=Object.keys(CITIES).sort();
    sel.insertAdjacentHTML('beforeend', keys.map(function(k){return '<option value="'+k+'">'+k+'</option>';}).join(''));
    sel.dataset.filled='1';
  }
  window.MNCastro={cities:CITIES,compute:compute,section:section,fillSelect:fillSelect};
  if(document.readyState!=='loading') fillSelect(); else document.addEventListener('DOMContentLoaded',fillSelect);
})();
