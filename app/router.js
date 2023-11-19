import EmberRouter from '@ember/routing/router';
import config from 'hash-identifier/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('identifier');
  this.route('decrypter')
});
