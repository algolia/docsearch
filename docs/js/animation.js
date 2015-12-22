document.addEventListener("DOMContentLoaded", function(){
  var box = getIndexDomPosition();

  console.log(box);
  var center = [box[0] + 90, box[1] - 90];

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
      if(distance(p.pos, center) < distance(p.v, [0, 0])) {
        recycle(p, center); 
      }
      else{
        updateDOMPosition(p);
      }
    });
  });

  function genParticle(center){
    var theta = - Math.random() * Math.PI;
    var r = Math.random() * 300 + 400;
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);
    var e = document.createElement('img');
    e.src = 'img/icon-page-doc.svg';
    e.className = 'doc-page init';
    e.style.top = center[1] + 'px';
    e.style.left = center[0] + 'px';
    document.body.querySelector('.jumbotron').appendChild(e);
    return {
      pos: [x + center[0], y + center[1]],
      v: [0, 0],
      e: e
    };
  }

  function recycle(p, center) {
    var theta = - Math.random() * Math.PI;
    var r = Math.random() * 500 + 200;
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);
    var e = p.e;

    e.className = 'doc-page init';
    e.style.top = center[1] + 'px';
    e.style.left = center[0] + 'px';

    p.pos = [x + center[0], y + center[1]];
    p.v = [0, 0];
  }

  function updateDOMPosition(p) {
    var pos = [p.pos[0] - 18, p.pos[1] - 23];
    p.e.style.transform = 'translate3D(' + pos[0] + 'px, ' + pos[1] + 'px, 0)';
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
    var position = jQuery('.index-container').position();
    return [position.left, position.top];
  }
});
