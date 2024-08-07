/*
 * Copyright 2024 KolibriKing
 */

import { fs } from '/sys/lib/fs.js';

/* Check if root exists */
export function vfs$checkRoot() {
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    if (!(`${prefix}:/` in localStorage)) {
      localStorage.setItem(`${prefix}:/`, JSON.stringify({
        "type": "dir",
        "parent": "root",
        "rights": ["R", "W"]
      }));
    }
  });
}
/* Parse directory */
function vfs$parseDir(dir) {
  let newdir = '';
  for (let char of dir) {
    if (char === '.') {
      if (window.GLOBAL_VFS_DIR !== '/') {
        newdir += window.GLOBAL_VFS_DIR;
      }
    } else {
      newdir += char;
    }
  }
  return newdir;
}
/* Create a directory in a virtual filesystem */
export function vfs$mkdir(adest, dir, callback) {
  const dest = vfs$parseDir(adest);
  vfs$checkRoot(); // Check root in virtual filesystem
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) { // Read vfs prefix
    console.log('debug: vfs_prefix is ' + prefix);
    if (`${prefix}:${dest}` in localStorage) { // If folder destination exists
      // Destination folder data
      let dest$ = JSON.parse(localStorage.getItem(`${prefix}:${dest}`));
      if (dest$.type === 'dir') { // If destination is a directory
        if (dest$.rights.includes('W')) { // If we user has access to write to destination folder
          if (!dir.includes('/')) { // If new folder name
            if (!(dest === '/')) {
              if (!(`${prefix}:${dest}/${dir}` in localStorage)) { // If folder don't exist already
                localStorage.setItem(`${prefix}:${dest}/${dir}`, JSON.stringify({
                  "type": "dir",
                  "parent": dest,
                  "rights": ["R", "W", "D"],
                  "name": `${dest}/${dir}`,
                  "sname": dir
                })); // Create directory object in localStorage
                window.GLOBAL_VFS_TMPSTATUS = 0; // Status: done
                callback(0);
              } else {
                window.GLOBAL_VFS_TMPSTATUS = 5; // Error: directory already exists
                callback(5);
              }
            } else {
              if (!(`${prefix}:/${dir}` in localStorage)) {
                localStorage.setItem(`${prefix}:/${dir}`, JSON.stringify({
                  "type": "dir",
                  "parent": dest,
                  "rights": ["R", "W", "D"],
                  "name": '/' + dir,
                  "sname": dir
                })); // Create directory object in localStorage
                window.GLOBAL_VFS_TMPSTATUS = 0; // Status: done
                callback(0);
              } else {
                window.GLOBAL_VFS_TMPSTATUS = 5; // Error: directory already exists
                callback(5);
              }
            }
          } else {
            window.GLOBAL_VFS_TMPSTATUS = 4; // Error: directory name contains invalid characters
            callback(4);
          }
        } else {
          window.GLOBAL_VFS_TMPSTATUS = 3; // Error: permission denied
          callback(3);
        }
      } else {
        window.GLOBAL_VFS_TMPSTATUS = 2; // Error: given path is not a directory
        callback(2);
      }
    } else {
      window.GLOBAL_VFS_TMPSTATUS = 1; // Error: destination directory not found
      callback(1);
    }
  });
}
/*List all sub-directories and files in a directory*/
export function vfs$list(adir, callback) {
  const dir = vfs$parseDir(adir);
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    let result = [];
    if (`${prefix}:${dir}` in localStorage) {
      let dir$ = JSON.parse(localStorage.getItem(`${prefix}:${dir}`));
      if (dir$.type == 'dir') {
        for (let i in localStorage) {
          let item = localStorage[i];
          if (item[0] == '{') {
            let parsed = JSON.parse(item);
            console.log('debug: checking item: ' + item + ', type is ' + typeof parsed);
            if (typeof parsed == 'object') {
              if (parsed.parent == dir && parsed.parent != 'root') {
                result.push(parsed.name);
                console.log('debug: item logged');
              } else {
                console.log('debug: item not logged');
              }
            }
          }
        }
        callback(0, result);
      } else {
        callback(2, []); // Error: given path is not a directory
      }
    } else {
      callback(1); // Error: directory not found
    }
  });
}
/* Get information about item */
export function vfs$get(item, callback) {
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    if (`${prefix}:${item}` in localStorage) {
      callback(JSON.parse(localStorage.getItem(`${prefix}:${item}`)));
    } else {
      callback(1); // Error: item not found
    }
  });
}
/* Remove a directory */
export function vfs$rmdir(adir, callback) {
  const dir = vfs$parseDir(adir);
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    if (`${prefix}:${dir}` in localStorage) {
      vfs$get(dir, function(dir$) {
        if (dir$.type == 'dir') {
          if (dir$.rights.includes('D')) {
            vfs$list(dir, function(status, list) {
              console.log('debug: vfs$rmdir: list is ' + JSON.stringify(list));
              if (JSON.stringify(list) == '[]') {
                localStorage.removeItem(`${prefix}:${dir}`);
                callback(0);
              } else {
                callback(6); // Error: directory is not empty
              }
            });
          } else {
            callback(3); // Error: permission denied
          }
        } else {
          callback(2); // Error: given path is not a directory
        }
      });
    } else {
      callback(1); // Error: item not found
    }
  });
}
/* Create a file in a virtual filesystem */
export function vfs$mkfile(adest, dir, callback) {
  /* note: dir is file name */
  const dest = vfs$parseDir(adest);
  vfs$checkRoot(); // Check root in virtual filesystem
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) { // Read vfs prefix
    console.log('debug: vfs_prefix is ' + prefix);
    if (`${prefix}:${dest}` in localStorage) { // If file destination exists
      // Destination folder data
      let dest$ = JSON.parse(localStorage.getItem(`${prefix}:${dest}`));
      if (dest$.type === 'dir') { // If destination is a directory
        if (dest$.rights.includes('W')) { // If user has access to write to destination folder
          if (!dir.includes('/')) { // If new file name not contains '/'
            if (!(dest === '/')) {
              if (!(`${prefix}:${dest}/${dir}` in localStorage)) { // If folder don't exist already
                localStorage.setItem(`${prefix}:${dest}/${dir}`, JSON.stringify({
                  "type": "file",
                  "parent": dest,
                  "rights": ["R", "W", "D"],
                  "name": `${dest}/${dir}`,
                  "sname": dir,
                  "content": ""
                })); // Create file object in localStorage
                window.GLOBAL_VFS_TMPSTATUS = 0; // Status: done
                callback(0);
              } else {
                window.GLOBAL_VFS_TMPSTATUS = 5; // Error: file already exists
                callback(5);
              }
            } else {
              if (!(`${prefix}:/${dir}` in localStorage)) {
                localStorage.setItem(`${prefix}:/${dir}`, JSON.stringify({
                  "type": "file",
                  "parent": dest,
                  "rights": ["R", "W", "D"],
                  "name": '/' + dir,
                  "sname": dir,
                  "content": ""
                })); // Create file object in localStorage
                window.GLOBAL_VFS_TMPSTATUS = 0; // Status: done
                callback(0);
              } else {
                window.GLOBAL_VFS_TMPSTATUS = 5; // Error: file already exists
                callback(5);
              }
            }
          } else {
            window.GLOBAL_VFS_TMPSTATUS = 4; // Error: file name contains invalid characters
            callback(4);
          }
        } else {
          window.GLOBAL_VFS_TMPSTATUS = 3; // Error: permission denied
          callback(3);
        }
      } else {
        window.GLOBAL_VFS_TMPSTATUS = 2; // Error: given path is not a directory
        callback(2);
      }
    } else {
      window.GLOBAL_VFS_TMPSTATUS = 1; // Error: destination directory not found
      callback(1);
    }
  });
}
/* Remove a file */
export function vfs$rmfile(adir, callback) {
  const dir = vfs$parseDir(adir);
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    if (`${prefix}:${dir}` in localStorage) {
      vfs$get(dir, function(dir$) {
        if (dir$.type == 'file') {
          if (dir$.rights.includes('D')) {
            localStorage.removeItem(`${prefix}:${dir}`);
            callback(0);
          } else {
            callback(3); // Error: permission denied
          }
        } else {
          callback(2); // Error: given path is not a file
        }
      });
    } else {
	      callback(1); // Error: item not found
    }
  });
}
/* Change current working directory */
export function vfs$setdir(adir, callback) {
  const dir = vfs$parseDir(adir);
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    if (`${prefix}:${dir}` in localStorage) {
      let dir$ = JSON.parse(localStorage.getItem(`${prefix}:${dir}`));
      if (dir$.type == 'dir') {
        window.GLOBAL_VFS_DIR = dir;
        callback(0);
      } else {
        callback(2); // Error: given path is not a directory
      }
    } else {
      callback(1); // Error: directory not found
    }
  });
}
export function vfs$writeFile(adir, c, callback) {
    const dir = vfs$parseDir(adir);
    fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    if (`${prefix}:${dir}` in localStorage) {
      vfs$get(dir, function(file) {
        if (file.type === 'file') {
          if (file.rights.includes('W')) {
            let nf = JSON.parse(localStorage[`${prefix}:${dir}`]);
            nf.content = c;
            localStorage.setItem(`${prefix}:${dir}`, JSON.stringify(nf));
            callback(0);
          } else {
            callback(3); // Error: permission denied
          }
        } else {
          callback(2); // Error: given path is not a file
        }
      });
    } else {
      callback(1); // Error: file not found
    }
  });
}

export function vfs$readFile(adir, callback) {
  const dir = vfs$parseDir(adir);
  fs.readFile('/sys/cfg/vfs_prefix.txt', function(prefix) {
    if (`${prefix}:${dir}` in localStorage) {
      vfs$get(dir, function(file) {
        if (file.type === 'file') {
          if (file.rights.includes('R')) {
            callback(0, file.content);
          } else {
            callback(3, null); // Error: permission denied
          }
        } else {
          callback(2, null); // Error: given path is not a file
        }
      });
    } else {
      callback(1, null); // Error: file not found
    }
  });
}
