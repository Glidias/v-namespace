'use strict';

var balanced = require('node-balanced');

function main(source, options) {

  var FLAGS = {
    "mixed": 1
  };

  function getFlagsFromStr(str) {
    var arr = str.split("|");
    var i;
    var f;
    var flags = 0;
    for (i in arr) {
     f =  arr[i];
     f = f.trim();
     if (FLAGS[f] == null) {
       console.error("v-namespace():: Invalid flag parameter: "+f)
     }
     flags |= FLAGS[f];
     
    }
    return flags;
  }


 function prefixSource(source, prefix, mixed) {
    // remove \r  because of scss-parser can't handle carriage returns!
      return mixed ?  source.replace(/\.\-/g, "."+ prefix) :  source.replace(/\.([a-zA-Z])/g, "."+ prefix + "$1");
 }



function extractText( str ){
  var ret = "";

  if ( /[\"\']/.test( str ) ){
    ret = str.match( /[\"\'](.*?)[\"\']/ )[1];
  } else {
    ret = str;
  }

  return ret;
}

// 
function getPrefixFromLiteralExpr(expr, head) {
	var prefixToInject =  extractText(expr);

  return prefixToInject;
}

// SCSS variable referencing format (consider actual JSON lookup for actual varName)
function getPrefixFromVariableName(varName, head) {
   
  return "#{$"+varName+"}";
}



function formUpByMatches(str, matches, stackIndex, prefix, flags) {

  var isMixed = (flags & FLAGS.mixed) !=0;
    
  if( matches == null || matches.length == 0) {
   // if (str.indexOf("{") <= 0) return str;
     str = prefixSource(str, prefix, isMixed);

     return str; 
  }
  
   var i;
  var len = matches.length;
  var lastMarkIndex = 0;
  var strOutput = "";
  var portioned;
  for (i=0; i< len ; i++) {
    var markIndex = matches[i].index;
     portioned = str.slice( lastMarkIndex, markIndex );
   // console.log("PORTIONED:"+portioned);
    strOutput += 	prefixSource(portioned, prefix, isMixed); 
   // console.log( matches[i]);
    var matchedContent = str.slice( matches[i].index, matches[i].index+matches[i].length) ;
   // console.log("adding matched:"+matchedContent);
    strOutput += matchedContent;
    lastMarkIndex = markIndex + matches[i].length;
  }
  if (lastMarkIndex < str.length) {
    portioned =  str.slice(lastMarkIndex);
  //   console.log("PORTIONED_TAIL:"+portioned);
  	strOutput+=  prefixSource(portioned, prefix, isMixed); 
  }
  return strOutput;

}
	
  //  handle replacements recursively via depth-first stack, or maybe BFS is better??
	// http://regexr.com/3f1mc
    var regexHead = /@include v-namespace\([^\(\){}\+\*\.\#]*\)[\s]*\{/;


    
    
  function replaceSource(source, stackLevel) {

    var result = balanced.replacements({
        source: source,
        head: regexHead, // optional (defalut: open)
        open: '{',
        close: '}',
        balance: false, // optional (default: false)
        exceptions: false, // optional (default: false)
        replace: function (source, head, tail) {
      
            // faux replacements
            var recurse = false;
            var parenthesisGrab = /\(([^)]+)\)/;
            var prefixToInject = head.match(parenthesisGrab)[1] || "not found";
            
            if (prefixToInject === "not found") {
                console.error("Prefix to inject failed for:"+head);
                prefixToInject = "";
            }
          
            var curFlags = 0;
            var prefixParam = prefixToInject.split(",");
            if (prefixParam.length >= 2) {
              if (prefixParam.length !=2) {
                console.error("v-namespace():: Comma delimetered parameter length must be 2");
              }
              prefixToInject = prefixParam[0];
              prefixParam= prefixParam[1];
              prefixParam = prefixParam.trim();
              prefixParam = extractText(prefixParam);
              curFlags = getFlagsFromStr(prefixParam);
            }
           
            prefixToInject = prefixToInject.trim();
              prefixToInject = prefixToInject.trim();
            prefixToInject = prefixToInject.charAt(0) === "$" ? getPrefixFromVariableName(prefixToInject.slice(1), head) : getPrefixFromLiteralExpr(prefixToInject, head); 

            if (prefixParam.indexOf(" ") >=0) {
              console.error("Prefix should not contain spaces:"+head);
            }

            if (balanced.matches({source:source, head: regexHead, open:"{", close:"}" }).length ) {
           		// alert("Recursing:"+source);
                  recurse = true;
            }
           
            if (recurse) source = replaceSource(source, stackLevel + 1);
          
           var balMatches = balanced.matches({source:source, open:"//{"+(stackLevel+1), close:"//"+(stackLevel+1)+"}" }); 

          //source = sandBoxClassPrefix(source, prefixToInject);
          source = formUpByMatches(source, balMatches, stackLevel, prefixToInject, curFlags);
     
 
            return   "\n"+"//{"+stackLevel+"\n"+ source +"\n//"+stackLevel+"}\n" ;
        }
    });
    return result;
  }
  

  var finalResult = replaceSource(source, 0);

 // console.log(finalResult);

  return finalResult;
}


module.exports = main;
