(function(l){l.extend(l.inputmask.defaults.aliases,{Regex:{mask:"r",greedy:!1,repeat:"*",regex:null,regexTokens:null,tokenizer:/\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,quantifierFilter:/[0-9]+[^,]/,definitions:{r:{validator:function(j,m,l,n,i){function g(){this.matches=[];this.isLiteral=this.isQuantifier=this.isGroup=!1}function q(){var c=
new g,d,a=[];for(i.regexTokens=[];d=i.tokenizer.exec(i.regex);)switch(d=d[0],d.charAt(0)){case "[":case "\\":0<a.length?a[a.length-1].matches.push(d):c.matches.push(d);break;case "(":!c.isGroup&&0<c.matches.length&&i.regexTokens.push(c);c=new g;c.isGroup=!0;a.push(c);break;case ")":d=a.pop();0<a.length?a[a.length-1].matches.push(d):(i.regexTokens.push(d),c=new g);break;case "{":var b=new g;b.isQuantifier=!0;b.matches.push(d);0<a.length?a[a.length-1].matches.push(b):c.matches.push(b);break;default:b=
new g,b.isLiteral=!0,b.matches.push(d),0<a.length?a[a.length-1].matches.push(b):c.matches.push(b)}0<c.matches.length&&i.regexTokens.push(c)}function p(c,d){var a=!1;d&&(b+="(",k++);for(var g=0;g<c.matches.length;g++){var e=c.matches[g];if(!0==e.isGroup)a=p(e,!0);else if(!0==e.isQuantifier){for(var e=e.matches[0],f=i.quantifierFilter.exec(e)[0].replace("}",""),f=b+"{1,"+f+"}",h=0;h<k;h++)f+=")";a=RegExp("^("+f+")$");a=a.test(o);b+=e}else if(!0==e.isLiteral){for(var e=e.matches[0],f=b,j="",h=0;h<k;h++)j+=
")";for(h=0;h<e.length&&!(f=(f+e[h]).replace(/\|$/,""),a=RegExp("^("+f+j+")$"),a=a.test(o));h++);b+=e}else{b+=e;f=b.replace(/\|$/,"");for(h=0;h<k;h++)f+=")";a=RegExp("^("+f+")$");a=a.test(o)}if(a)break}d&&(b+=")",k--);return a}null==i.regexTokens&&q();var n=m.slice(),b="",m=!1,k=0;n.splice(l,0,j);for(var o=n.join(""),j=0;j<i.regexTokens.length&&!(g=i.regexTokens[j],m=p(g,g.isGroup));j++);return m},cardinality:1}}}})})(jQuery);