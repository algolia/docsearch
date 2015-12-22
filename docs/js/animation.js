document.addEventListener("DOMContentLoaded", function(){
  var box = getIndexDomPosition();

  console.log(box);
  var center = [box[0] + 60, box[1] + 35];

  var particles = [];
  for(var i=0; i<10; i++) {
    setTimeout(function(){
      var p = genParticle(center);
      particles.push(p);
    }, i * 300);
  }

  window.requestAnimationFrame(function loop(){
    window.requestAnimationFrame(loop);
    particles.forEach(function(p){
      updatePosition(p, center);

      if(distance(p.pos, center) < distance(p.v, [0, 0]) * 0.9) {
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
    p.v = [0, 0];
    p.r = r;
  }

  function updateDOMPosition(p) {
    var distanceOriginCenter = distance(p.originPos, [0,0]);
    var distanceOriginCurrent = distance(p.originPos, p.pos);
    var toCenter = distanceOriginCurrent / distanceOriginCenter;

    var pos = [p.pos[0] - 18, p.pos[1] - 23];
    p.e.style.transform = 'translate(' + pos[0] + 'px, ' + pos[1] + 'px) rotate('+ p.r + 'deg)';
    p.e.style.opacity = 1 - Math.pow( 2 * toCenter - 1 , 10);
    p.e.className = 'doc-page';
  }

  function updatePosition(p, center) {
    var d = distance(p.pos, center);
    p.v[0] += (center[0] - p.pos[0] ) / 500;
    p.v[1] += (center[1] - p.pos[1] ) / 500;
    p.pos[0] += p.v[0] / 5;
    p.pos[1] += p.v[1] / 5;
  }

  function distance(a, b) {
    return Math.sqrt(
      Math.pow(b[0] - a[0], 2) +
      Math.pow(b[1] - a[1], 2));
  }

  function getIndexDomPosition() {
    var positionContainer = jQuery('.index-container').position();
    var position = jQuery('.index').position();
    return [position.left , position.top ];
    return [position.left + positionContainer.left, position.top + positionContainer.top];
  }
});
