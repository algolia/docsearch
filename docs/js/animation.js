document.addEventListener("DOMContentLoaded", function(){
  var box = getIndexDomPosition();

  var center = [box[0], box[1] + 40];

  var particles = [];
  for(var i=0; i<10; i++) {
    setTimeout(function(){
      var p = genParticle(center);
      particles.push(p);
    }, i * 600);
  }
  
  var ripples = [];

  window.requestAnimationFrame(function loop(){
    window.requestAnimationFrame(loop);
    particles.forEach(function(p){
      updatePosition(p, center);

      if(distance(p.pos, center) < distance(p.v, [0, 0]) * 0.6) {
        recycle(p, center); 
      }
      else{
        updateDOMPosition(p);
      }
    });
  });

  function genParticle(center){
    var theta = - Math.random() * Math.PI;
    var r = Math.random() * 300 + 500;
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);
    var e = document.createElement('img');
    var r = Math.random() * 90 - 45;
    e.src = 'img/icon-page-doc.svg';
    e.className = 'doc-page init';
    e.style.top = center[1] + 'px';
    e.style.left = center[0] + 'px';
    document.body.querySelector('.index-container').appendChild(e);
    return {
      pos: [x + center[0], y + center[1]],
      originPos: [x + center[0], y + center[1]],
      v: [0, 0],
      e: e,
      r: r
    };
  }

  function recycle(p, center) {
    var theta = - Math.random() * Math.PI;
    var r = Math.random() * 300 + 500;
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);
    var e = p.e;
    var r = Math.random() * 90 - 45;

    e.className = 'doc-page init';
    e.style.top = center[1] + 'px';
    e.style.left = center[0] + 'px';

    p.pos = [x + center[0], y + center[1]];
    p.originPos = [x + center[0], y + center[1]];
    p.v = [0, 0];
    p.r = r;
  }

  function updateDOMPosition(p) {
    var distanceOriginCenter = distance(p.originPos, [0,0]);
    var distanceOriginCurrent = distance(p.originPos, p.pos);
    var toCenter = distanceOriginCurrent / distanceOriginCenter;

    var pos = [p.pos[0] - 18, p.pos[1] - 23];
    p.e.style.transform = 'translate(' + pos[0] + 'px, ' + pos[1] + 'px) rotate('+ p.r + 'deg)';
    p.e.style.opacity = 1 - Math.max(0, Math.sqrt(Math.pow(4 * toCenter - 2, 2)) - 1) 
    p.e.className = 'doc-page';
  }

  function updatePosition(p, center) {
    var d = distance(p.pos, center);
    p.v[0] += (center[0] - p.pos[0] ) / 500;
    p.v[1] += (center[1] - p.pos[1] ) / 500;
    p.pos[0] += p.v[0] / 10;
    p.pos[1] += p.v[1] / 10;
  }

  function distance(a, b) {
    return Math.sqrt(
      Math.pow(b[0] - a[0], 2) +
      Math.pow(b[1] - a[1], 2));
  }

  function getIndexDomPosition() {
    var position = document.querySelector('#index').getBBox();
    return [position.x , position.y ];
  }
});
