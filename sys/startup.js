/*
 * /sys/startup.js
 *
 * This is executed when everything is loaded (when body loaded)(this script is executed from /sys/boot.js)
 */

import { std } from '/sys/lib/std.js';
import { fs } from '/sys/lib/fs.js';
import { Term } from '/sys/lib/Term.js';
import { Dash$ } from '/sys/shell/Dash.js';

if (!(Term.exists())) {
  Term.create('div#term');
}
fs.readFile('/sys/data/ver.txt', function(version) {
<<<<<<< HEAD
  std.out('DeepOS ' + version);
  fs.readFile('/sys/msg/DeepOS/boot/finish.txt', function(welcomeMsg) {
    std.nl();
    std.out(welcomeMsg);
  });
  console.log('Launching input loop');
  std.in(false, function(userInput) {
    std.nl();
    std.out(userInput);
    Dash$(userInput);
=======
  fs.readFile('/sys/data/ver.patch.txt', function(version_patch) {
    if (version_patch !== '0') {
      std.out('DeepOS ' + version + ' patch ' + version_patch);
    } else {
      std.out('DeepOS ' + version);
    }
    fs.readFile('/sys/msg/DeepOS/boot/finish.txt', function(welcomeMsg) {
      std.nl();
      std.out(welcomeMsg);
    });
    console.log('Launching input loop');
    std.in(false, function(userInput) {
      std.nl();
      std.out(userInput);
      Dash$(userInput);
    });
>>>>>>> f38c54f0fbea0f0abae5bf21e521b4e284a4bb9a
  });
});