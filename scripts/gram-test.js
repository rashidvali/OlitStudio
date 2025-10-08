const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'syntaxes', 'olit-injection.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const sample = "Name1: _ LIKE 'J%'";
console.log('Sample:', sample, '\n');

const patterns = (data.patterns && data.patterns[0] && data.patterns[0].patterns) || [];
for (let i = 0; i < patterns.length; i++) {
  const p = patterns[i];
  const label = p.name || (`pattern#${i}`);
  if (p.match) {
    try {
      const re = new RegExp(p.match);
      const m = sample.match(re);
      console.log(`#${i} ${label} (match):`, !!m);
      if (m) console.log('  captures:', m.slice(0, 10));
    } catch (e) {
      console.log(`#${i} ${label} (match) - regex error:`, e.message);
    }
  }
  if (p.begin) {
    try {
      const re = new RegExp(p.begin);
      const m = sample.match(re);
      console.log(`#${i} ${label} (begin):`, !!m);
    } catch (e) {
      console.log(`#${i} ${label} (begin) - regex error:`, e.message);
    }
  }
}

// Also test meta.key-value.single-line and meta.olitql.rhs.placeholder.simple directly by name
function findByName(name){ return patterns.find(x=>x.name===name); }
["meta.olitql.rhs.placeholder.simple","meta.olitql.rhs.placeholder","meta.key-value.single-line"].forEach(name=>{
  const p = findByName(name);
  if (!p) { console.log('No pattern found for', name); return; }
  console.log('\nDirect test for', name);
  try{ const re = new RegExp(p.match); const m = sample.match(re); console.log(' match:', !!m); if(m) console.log(' captures:', m.slice(0,10)); }catch(e){console.log(' regex error:', e.message);} 
});
