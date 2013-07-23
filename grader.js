#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "https://www.google.com";
var rest = require('restler');//added
var sys = require('util');//added

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var getURL = function(url) {
    rest.get(program.url).on('complete', function(result) {
//	console.log(result);
//	console.log("page read");
	if(result instanceof Error) {
            sys.puts('Error: '+ result.message);
            this.retry(5000);
	} else {
//	    sys.puts(result);
	console.log("page read 2" + url);
	}
    }

)};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.come/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'Command Line defined url', clone(getURL),URL_DEFAULT)
        .parse(process.argv);
if (!program.file) {
//    console.log(program.url);
      console.log("page really read");
} else {
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} 
}else {
    exports.checkHtmlFile = checkHtmlFile;
}
    
