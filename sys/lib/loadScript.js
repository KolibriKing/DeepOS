/*
 * Copyright 2024 KolibriKing
 */

export function loadScript(scriptName) {
  console.log("loadScript: Importing " + scriptName + "...");
  // Function to load scripts
  var script = document.createElement('script'); // Create script
  script.type = 'module';
  if (!(scriptName[0] == '/')) { // Check if script direction is NOT absolute
    script.src = "/sys/lib/" + scriptName + ".js"; // Get script direction
  } else {
    script.src = scriptName;
  }
  var scriptNameArray = []; // Initialize scriptName Array
  var scriptId = ''; // Define script id
  for (let char of scriptName) { // Convert scriptName to Array
    scriptNameArray.push(char);
  }
  if (scriptNameArray.includes('/')) { // Check if script is nested into other direcrory
    for (let char of scriptName) { // Loop through scriptName
      if (!(char == '/')) { // Check if current character is NOT '/'
        scriptId += char; // Add character to scriptId
      } else { // If character is '/'
        scriptId += '__'; // Add '__' instead of char
      }
    }
    script.id = 'importScript_' + scriptId; // Set script id
    document.querySelector('body').appendChild(script); // Append script
  } else {
    script.id = 'importScript_' + scriptName; // Set script id
    document.querySelector('body').appendChild(script); // Append script
  }
}
