(function () {
  function toggle(id, cls) {
    var b = document.getElementById(id);
    if (!b) return;
    b.addEventListener('click', function () {
      var on = !document.body.classList.contains(cls);
      document.body.classList.toggle(cls, on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  toggle('colored', 'colored');
  toggle('answers', 'answers');
  var p = document.getElementById('print');
  if (p) p.addEventListener('click', function () { window.print(); });
})();
