import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'hash-identifier/config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

//we dont talk about this
window.addEventListener('load', function getDate() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var year = d.getFullYear();
  var date = month + '/' + day + '/' + year;
  document.getElementById('date').innerHTML = date;
})

window.addEventListener('load', function getDate() {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  var time = h + ':' + m + ':' + s + ' ' + ampm;
  document.getElementById('time').innerHTML = time;
  setTimeout(getDate, 1000);
}
)