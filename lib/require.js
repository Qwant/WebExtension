// (c) 2012 Salsita s.r.o.
// Dual-licensed under MIT license and GPL v2.

// Implementation of CommonJS require() for browser environments where synchronous
// loading is approach (e.g. browser extension).

// Makes use of printStackTrace() as defined in https://github.com/eriwen/javascript-stacktrace.

var require = function require(id, scriptUrlPath) {
  if (!scriptUrlPath) {
    frames = printStackTrace();
    // We are interested in the frame right below the first call to require().
    var foundRequireFrame = false;
    for (var i=0; i<frames.length; i++) {
      // Extract the function name and file path from a frame.
      // The frame we are interested in should look something like:
      // require()@file:///path/to/require.js:8:11
      // or
      // require("module")@file:///path/to/require.js:8:11
      // or
      // require (file://path/to/require.js:8:11)
      var match = frames[i].match("((([^ ]+) \\()|(([^@]+)\\([^)]*\\)@))(.*)\/.+\.js:");
      if (foundRequireFrame && match) {
        scriptUrlPath = match[6];
        break;
      }
      if (match && (match[3] == "require" || match[5] == "require")) {
        foundRequireFrame = true;
      }
    }
    if (!scriptUrlPath) {
      throw new Error("Cannot get the path of the current module");
    }
  }
  if (id[0] == "/") {
    // Separate the path and filename;
    var pathInfo = id.match("/?(.*)/([^/]+)$");
    var path = pathInfo[1];
    id = pathInfo[2];

    // Extract the part of the URL preceding the path, e.g.:
    // file:///path/to/ -> file://
    // http://server/path/to/ -> http://server
    var urlPrefix = scriptUrlPath.match("([^:]+://[^/]*)/")[1];
    // Turn the path into a URL
    scriptUrlPath = urlPrefix + "/" + path;
  }
  var url = normalize(scriptUrlPath + "/" + id + ".js");
  // Recalculate scriptUrlPath to be the full path based on the normalized URL.
  scriptUrlPath = url.match("(.*)/[^/]+\.js")[1];

  if (!(url in require._cache)) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.send();

      var responseText = xhr.responseText;
    }
    catch(e) {
      throw new Error("Cannot load module " + id + " (" + url + "): " + e.message);
    }

    // CommonJS modules expect three symbols to be available:
    // - require is this function.
    // - exports is the context to which any exported symbols should be attached.
    // - module contains additional metadata about the module.
    // See http://wiki.commonjs.org/wiki/Modules/1.1#Module_Context for more information.
    // So we wrap the code in a function that takes these symbols as arguments.
    // For compatibility with Node.js, we create a header that defines global variables
    // that it provides to modules. Right now that means __dirname but we may want to add others.
    var header = "var __dirname = '/" + scriptUrlPath.match(".*://[^/]*/(.*)")[1] + "';";
    var func = new Function("require", "exports", "module", header + responseText);
    var context = {};
    // jQuery is not a CommonJS module, include it in the context
    // if it was loaded already:
    if (typeof(jQuery) != "undefined") {
      context.jQuery = jQuery;
      context.$ = jQuery;
    }
    var exports = require._cache[url] = {};
    var module = { id: id, uri: url };
    // Invoke our function with the appropriate parameters.
    // We use a closure for require since we want to pass in the current script path.
    // This ensures that relative paths in the module will be resolved properly.
    func.call(context, function(id) { return require(id, scriptUrlPath); }, exports, module);
  }
  return require._cache[url];

  // Normalize paths that contain . and .. segments
  function normalize(path) {
    var segments = path.split("/");
    var normalizedSegments = [];
    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];
      if (segment === ".") {
        continue;
      }
      else if (segment === "..") {
        if (normalizedSegments.length == 0) {
          throw Error("Invalid path: " + path);
        }
        normalizedSegments.pop();
      }
      else {
        normalizedSegments.push(segment);
      }
    }
    return normalizedSegments.join("/");
  }
};

require._cache = {};
