/*
 * Copyright 2024 KolibriKing
 */

import { vfs$writeFile } from '/sys/lib/vfs.js';
import { stdio } from '/sys/lib/stdio.js';

window.Dash$_fwrite = function(args) {
  const argv = args.argv;
  switch (argv[0]) {
    case '--help', '-h':
      stdio.out('fwrite [-hq]');
      stdio.nl();
      stdio.out('Write to a file');
      stdio.nl(1);
      stdio.out('--help, -h: display this help message');
      stdio.nl();
      stdio.out('--quiet, -q: don\'t display any warnings or errors');
      stdio.nl();
      break;
    default:
      vfs$writeFile(argv[0], argv[1], function(status) {
        if (!(argv.includes('--quiet')) && !(argv.includes('-q'))) {
          switch (status) {
            case 0:
              break;
            case 1:
              stdio.out('fwrite: ' + argv[0] + ': file not found');
              break;
            case 2:
              stdio.out('fwrite: ' + argv[0] + ': not a file');
              break;
            default:
              stdio.out('fwrite: unknown code: ' + status);
              break;
          }
        }
      });
      break;
  }
}
