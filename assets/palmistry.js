/* Guided palm reading selector.
   Reads its data from an inline JSON block emitted by the generator from the
   same dataset that builds the line pages, so the tool and the pages can never
   drift apart. No network, no storage, no upload. */
(function () {
  var el = document.getElementById('plData');
  if (!el) return;
  var data;
  try { data = JSON.parse(el.textContent); } catch (e) { return; }

  var lineSel = document.getElementById('plSel');
  var varSel  = document.getElementById('plVar');
  var where   = document.getElementById('plWhere');
  var out     = document.getElementById('plOut');
  if (!lineSel || !varSel || !out) return;

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function renderOut(key, idx) {
    clear(out);
    if (!key) return;
    var d = data[key];
    if (idx === '' || idx == null) return;
    var v = d.variations[Number(idx)];
    if (!v) return;

    var h = document.createElement('h3');
    h.textContent = d.name + ': ' + v[0];
    out.appendChild(h);

    var p = document.createElement('p');
    p.textContent = v[1];
    out.appendChild(p);

    var lim = document.createElement('div');
    lim.className = 'notice';
    var ls = document.createElement('strong');
    ls.textContent = 'What this cannot tell you. ';
    lim.appendChild(ls);
    lim.appendChild(document.createTextNode(d.limits));
    out.appendChild(lim);

    var more = document.createElement('p');
    var a = document.createElement('a');
    a.className = 'btn btn-secondary';
    a.href = key + '.html';
    a.textContent = 'Read the full ' + d.name + ' page';
    more.appendChild(a);
    out.appendChild(more);
  }

  lineSel.addEventListener('change', function () {
    var key = lineSel.value;
    clear(varSel);
    clear(out);
    var first = document.createElement('option');
    first.value = '';
    if (!key) {
      first.textContent = 'Choose a line first';
      varSel.appendChild(first);
      varSel.disabled = true;
      where.hidden = true;
      return;
    }
    first.textContent = 'Choose what it looks like';
    varSel.appendChild(first);
    data[key].variations.forEach(function (v, i) {
      var o = document.createElement('option');
      o.value = String(i);
      o.textContent = v[0];
      varSel.appendChild(o);
    });
    varSel.disabled = false;
    clear(where);
    var b = document.createElement('strong');
    b.textContent = 'Where to look. ';
    where.appendChild(b);
    where.appendChild(document.createTextNode(data[key].where));
    where.hidden = false;
  });

  varSel.addEventListener('change', function () {
    renderOut(lineSel.value, varSel.value);
  });
})();
