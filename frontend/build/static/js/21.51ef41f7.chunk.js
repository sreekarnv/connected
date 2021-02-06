(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[21],{230:function(e,t,n){"use strict";var r=n(5),a=n(84),o=n(0);t.a=function(){var e=Object(a.a)(),t=e.isOpen,n=e.onOpen,i=e.onClose,c=Object(o.useState)(null),s=Object(r.a)(c,2),u=s[0],l=s[1];Object(o.useEffect)((function(){if(u){var e=setTimeout((function(){i()}),2500);return function(){return clearTimeout(e)}}}),[u,i]);return{setAlert:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"info",t=arguments.length>1?arguments[1]:void 0;l({status:e,message:t}),n()},isAlertOpen:t,onAlertClose:i,alertDetails:u}}},253:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return p}));var r=n(79),a=n(128),o=n(55),i=n(277),c=n(135),s=n(0);function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function l(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var d=Object(r.a)((function(e,t){var n=e.area,r=e.templateAreas,o=e.gap,i=e.rowGap,c=e.columnGap,d=e.column,f=e.row,p=e.autoFlow,b=e.autoRows,m=e.templateRows,v=e.autoColumns,j=e.templateColumns,h=l(e,["area","templateAreas","gap","rowGap","columnGap","column","row","autoFlow","autoRows","templateRows","autoColumns","templateColumns"]),O={display:"grid",gridArea:n,gridTemplateAreas:r,gridGap:o,gridRowGap:i,gridColumnGap:c,gridAutoColumns:v,gridColumn:d,gridRow:f,gridAutoFlow:p,gridAutoRows:b,gridTemplateRows:m,gridTemplateColumns:j};return s.createElement(a.a.div,u({ref:t,__css:O},h))}));function f(e){return Object(i.a)(e,(function(e){return"auto"===e?"auto":"span "+e+"/span "+e}))}o.a&&(d.displayName="Grid");var p=Object(r.a)((function(e,t){var n=e.colSpan,r=e.colStart,o=e.colEnd,i=e.rowEnd,d=e.rowSpan,p=e.rowStart,b=l(e,["colSpan","colStart","colEnd","rowEnd","rowSpan","rowStart"]),m=Object(c.a)({gridColumn:f(n),gridRow:f(d),gridColumnStart:r,gridColumnEnd:o,gridRowStart:p,gridRowEnd:i});return s.createElement(a.a.div,u({ref:t,__css:m},b))}))},255:function(e,t,n){"use strict";var r=n(5),a=n(0),o=n(84);t.a=function(){var e=Object(a.useState)(null),t=Object(r.a)(e,2),n=t[0],i=t[1],c=Object(a.useState)(null),s=Object(r.a)(c,2),u=s[0],l=s[1],d=Object(a.useState)({}),f=Object(r.a)(d,2),p=f[0],b=f[1],m=Object(a.useState)(null),v=Object(r.a)(m,2),j=v[0],h=v[1],O=Object(o.a)(),g=O.isOpen,x=O.onClose,w=O.onOpen;Object(a.useEffect)((function(){n&&(l(URL.createObjectURL(n)),w())}),[n,w]);return{image:n,setImage:i,showImageCropper:g,closeImageCropper:x,imageSettings:p,setImageSettings:b,imageUrl:u,resetValues:function(){i(null),l(null),h(null)},setImageUrl:l,setCroppedImage:h,croppedImage:j,openImageCropper:w}}},359:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(363),a=n(0),o=Object(r.a)({viewBox:"0 0 14 14",path:a.createElement("g",{fill:"currentColor"},a.createElement("polygon",{points:"5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"}))})},360:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(363),a=Object(r.a)({displayName:"CloseIcon",d:"M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"})},361:function(e,t,n){"use strict";n.d(t,"b",(function(){return E})),n.d(t,"a",(function(){return I}));var r=n(5),a=n(77);n(11);var o=function(e){return Number.isNaN(Number(e))};function i(e){return Array.isArray(e)}n(8),n(22);!function(e){var t=new WeakMap}((function(e,t,n,r){var a="string"===typeof t?t.split("."):[t];for(r=0;r<a.length&&e;r+=1)e=e[a[r]];return void 0===e?n:e}));var c=Object.freeze(["base","sm","md","lg","xl"]);var s=n(0),u=n.n(s);function l(e){return Object.entries(e).filter((function(e){var t=Object(r.a)(e,1)[0];return o(t)})).sort((function(e,t){return Number.parseInt(e[1],10)>Number.parseInt(t[1],10)?1:-1})).map((function(e,t,n){var a=Object(r.a)(e,2),o=a[0],i=a[1],c=n[t+1],s=c?c[1]:void 0;return{minWidth:i,maxWidth:s,breakpoint:o,query:function(e,t){if(!(parseInt(e,10)>=0)&&!t)return"";var n="(min-width: "+f(e)+")";if(!t)return n;n&&(n+=" and ");return n+="(max-width: "+f(function(e){return function(e,t){if("number"===typeof e)return""+(e+t);return e.replace(d,(function(e){return""+(parseFloat(e)+t)}))}(e,e.endsWith("px")?-1:-.01)}(t))+")"}(i,s)}}))}var d=/([0-9]+\.?[0-9]*)/;function f(e){return function(e){return"number"===typeof e}(e)?e+"px":e}function p(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}function b(){return(b=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function m(e){var t=function(e){var t=Object(a.d)().breakpoints,n=u.a.useMemo((function(){return l(b({base:"0px"},t))}),[t]),o=u.a.useState((function(){if(e){var t=n.find((function(t){return t.breakpoint===e}));if(t)return p(t,["query"])}})),i=Object(r.a)(o,2),c=i[0],s=i[1],d=null==c?void 0:c.breakpoint,f=u.a.useCallback((function(e,t){e.matches&&d!==t.breakpoint&&s(t)}),[d]);return u.a.useEffect((function(){var e=new Set;return n.forEach((function(t){var n=t.query,r=p(t,["query"]),a=window.matchMedia(n);f(a,r);var o=function(){f(a,r)};return a.addListener(o),e.add({mediaQuery:a,handleChange:o}),function(){a.removeListener(o)}})),function(){e.forEach((function(e){var t=e.mediaQuery,n=e.handleChange;t.removeListener(n)})),e.clear()}}),[n,t,f]),d}(),n=Object(a.d)();if(t){var s=Object.keys(n.breakpoints).filter(o);return function(e,t,n){void 0===n&&(n=c);var r=Object.keys(e).indexOf(t);if(-1!==r)return e[t];for(var a=n.indexOf(t);a>=0;){if(null!=e[n[a]]){r=a;break}a-=1}return-1!==r?e[n[r]]:void 0}(i(e)?Object.entries(function(e,t){void 0===t&&(t=c);var n={};return e.forEach((function(e,r){var a=t[r];null!=e&&(n[a]=e)})),n}(e,s)).map((function(e){var t=Object(r.a)(e,2);return[t[0],t[1]]})).reduce((function(e,t){var n=Object(r.a)(t,2),a=n[0],o=n[1];return e[a]=o,e}),{}):e,t,s)}}var v=n(128),j=n(35),h=n(79),O=n(138),g=n(48);"undefined"===typeof window||!window.document||window.document.createElement;var x=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter(Boolean).join(" ")};var w=!1;function y(){return(y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function C(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var S=Object(v.a)("div",{baseStyle:{boxShadow:"none",backgroundClip:"padding-box",cursor:"default",color:"transparent",pointerEvents:"none",userSelect:"none","&::before, &::after, *":{visibility:"hidden"}}}),N=Object(j.b)({from:{opacity:0},to:{opacity:1}}),k=Object(h.a)((function(e,t){var n=Object(O.b)("Skeleton",e),r=function(){var e=s.useRef(!0);return s.useEffect((function(){e.current=!1}),[]),e.current}(),a=Object(g.b)(e),o=a.isLoaded,i=a.fadeDuration,c=a.className,u=C(a,["startColor","endColor","isLoaded","fadeDuration","speed","className"]),l=x("chakra-skeleton",c);if(o){var d=r?"none":N+" "+i+"s";return s.createElement(v.a.div,y({ref:t,className:l,__css:{animation:d}},u))}return s.createElement(S,y({ref:t,className:l},u,{__css:n}))}));k.defaultProps={fadeDuration:.4,speed:.8};var E=function(e){var t=e.noOfLines,n=void 0===t?3:t,r=e.spacing,a=void 0===r?"0.5rem":r,o=e.skeletonHeight,i=void 0===o?"0.5rem":o,c=e.className,u=e.startColor,l=e.endColor,d=e.isLoaded,f=e.fadeDuration,p=e.speed,b=e.children,j=C(e,["noOfLines","spacing","skeletonHeight","className","startColor","endColor","isLoaded","fadeDuration","speed","children"]),h=m("number"===typeof n?[n]:n)||3,O=Array(h).fill(1).map((function(e,t){return t+1})),g=function(e){return h>1&&e===O.length?"80%":"100%"},w=x("chakra-skeleton__group",c);return s.createElement(v.a.div,y({className:w},j),O.map((function(e,t){if(d&&t>0)return null;var n=d?null:{mb:e===O.length?"0":a,width:g(e),height:i};return s.createElement(k,y({key:O.length.toString()+e,startColor:u,endColor:l,isLoaded:d,fadeDuration:f,speed:p},n),0===t?b:void 0)})))};var I=function(e){var t=e.size,n=void 0===t?"2rem":t,r=C(e,["size"]);return s.createElement(k,y({borderRadius:"full",boxSize:n},r))}},376:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(79),a=n(55),o=n(277),i=n(0),c=n(253);function s(){return(s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var u=Object(r.a)((function(e,t){var n,r,u=e.columns,l=e.spacingX,d=e.spacingY,f=e.spacing,p=e.minChildWidth,b=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,["columns","spacingX","spacingY","spacing","minChildWidth"]),m=p?(r=p,Object(o.a)(r,(function(e){return Object(a.d)(e)?null:"repeat(auto-fit, minmax("+(t=e,(Object(a.e)(t)?t+"px":t)+", 1fr))");var t}))):(n=u,Object(o.a)(n,(function(e){return Object(a.d)(e)?null:"repeat("+e+", 1fr)"})));return i.createElement(c.a,s({ref:t,gap:f,columnGap:l,rowGap:d,templateColumns:m},b))}));a.a&&(u.displayName="SimpleGrid")},489:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(363),a=n(0),o=Object(r.a)({displayName:"EditIcon",path:a.createElement("g",{fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeWidth:"2"},a.createElement("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),a.createElement("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"}))})},518:function(e,t,n){"use strict";n.r(t);var r=n(4),a=n(3),o=n(13),i=n.n(o),c=n(23),s=n(5),u=n(0),l=n.n(u),d=n(247),f=n(25),p=n.n(f),b=n(226),m=n(12),v=n(204),j=n(200),h=n(268),O=n(376),g=n(276),x=n(361),w=n(242),y=n(519),C=n(357),S=n(79),N=n(138),k=n(48),E=n(77),I=n(128);n(8),n(22);!function(e){var t=new WeakMap}((function(e,t,n,r){var a="string"===typeof t?t.split("."):[t];for(r=0;r<a.length&&e;r+=1)e=e[a[r]];return void 0===e?n:e}));"undefined"===typeof window||!window.document||window.document.createElement;var A=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter(Boolean).join(" ")};function P(e){return"function"===typeof e}var _=function(e){return"undefined"===typeof e||void 0===e};var L=!1,D=n(520),R=n(508),z=n(130),F=n(131);n(87);function G(e,t){if(null!=e)if(P(e))e(t);else try{e.current=t}catch(n){throw new Error("Cannot assign value '"+t+"' to ref '"+e+"'")}}function M(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){t.forEach((function(t){return G(t,e)}))}}function T(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){t.some((function(t){return null==t||t(e),null==e?void 0:e.defaultPrevented}))}}function q(e){var t;return function(){if(e){for(var n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];t=e.apply(this,r),e=null}return t}}q((function(e){e.condition,e.message})),q((function(e){e.condition,e.message}));function U(){return(U=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function V(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var H=function(e){void 0===e&&(e={});var t=e,n=t.strict,r=void 0===n||n,a=t.errorMessage,o=void 0===a?"useContext: `context` is undefined. Seems you forgot to wrap component within the Provider":a,i=t.name,c=u.createContext(void 0);return c.displayName=i,[c.Provider,function(){var e=u.useContext(c);if(!e&&r)throw new Error(o);return e},c]}({name:"TabsContext",errorMessage:"useTabsContext: `context` is undefined. Seems you forgot to wrap all tabs components within <Tabs />"}),W=Object(s.a)(H,2),B=W[0],Y=W[1];function J(e){var t=Y(),n=t.id,r=t.selectedIndex;return U({},e,{children:function(e){return u.Children.toArray(e).filter((function(e){return u.isValidElement(e)}))}(e.children).map((function(e,t){return u.cloneElement(e,{isSelected:t===r,id:Q(n,t),"aria-labelledby":K(n,t)})}))})}function K(e,t){return e+"--tab-"+t}function Q(e,t){return e+"--tabpanel-"+t}function X(){return(X=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function Z(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var $=Object(S.a)((function(e,t){var n=Object(N.a)("Tabs",e),r=Object(k.b)(e),a=r.children,o=r.className,i=function(e){var t=e.defaultIndex,n=e.onChange,r=e.index,a=e.isManual,o=e.isLazy,i=e.orientation,c=void 0===i?"horizontal":i,l=V(e,["defaultIndex","onChange","index","isManual","isLazy","orientation"]),d=u.useState(null!=t?t:0),f=Object(s.a)(d,2),p=f[0],b=f[1],m=Object(z.b)({defaultValue:null!=t?t:0,value:r,onChange:n,propsMap:{value:"index",defaultValue:"defaultIndex",onChange:"onChange"}}),v=Object(s.a)(m,2),j=v[0],h=v[1];u.useEffect((function(){_(r)||b(r)}),[r]);var O=Object(R.b)(),g=Object(R.b)();return{id:Object(F.a)(e.id,"tabs"),selectedIndex:j,focusedIndex:p,setSelectedIndex:h,setFocusedIndex:b,isManual:a,isLazy:o,orientation:c,enabledDomContext:O,domContext:g,htmlProps:l}}(Z(r,["children","className"])),c=i.htmlProps,l=Z(i,["htmlProps"]),d=u.useMemo((function(){return l}),[l]),f=function(e,t){var n={};return Object.keys(e).forEach((function(r){t.includes(r)||(n[r]=e[r])})),n}(c,["isFitted"]);return u.createElement(B,{value:d},u.createElement(E.b,{value:n},u.createElement(I.a.div,X({className:A("chakra-tabs",o),ref:t},f,{__css:n.root}),a)))}));var ee=Object(S.a)((function(e,t){var n=Object(E.c)(),r=function(e){var t=e.isDisabled,n=e.isFocusable,r=V(e,["isDisabled","isFocusable"]),a=Y(),o=a.setSelectedIndex,i=a.isManual,c=a.id,s=a.setFocusedIndex,l=a.enabledDomContext,d=a.domContext,f=a.selectedIndex,p=u.useRef(null),b=Object(R.a)({disabled:Boolean(t),focusable:Boolean(n),context:l,element:p.current}),m=Object(R.a)({context:d,element:p.current}),v=m===f,j=Object(D.a)(U({},r,{ref:M(p,e.ref),isDisabled:t,isFocusable:n,onClick:T(e.onClick,(function(){s(b),o(m)}))}));return U({},j,{id:K(c,m),role:"tab",tabIndex:v?0:-1,type:"button","aria-selected":v,"aria-controls":Q(c,m),onFocus:t?void 0:T(e.onFocus,(function(){!i&&(!t||!n)&&o(m)}))})}(X({},e,{ref:t})),a=X({outline:"0",display:"flex",alignItems:"center",justifyContent:"center"},n.tab);return u.createElement(I.a.button,X({},r,{className:A("chakra-tabs__tab",e.className),__css:a}))}));var te=Object(S.a)((function(e,t){var n=function(e){var t=Y(),n=t.setFocusedIndex,r=t.focusedIndex,a=t.orientation,o=t.enabledDomContext,i=o.descendants.length,c=u.useCallback((function(e){var t=o.descendants[e];null!=t&&t.element&&(t.element.focus(),n(e))}),[o.descendants,n]),s=u.useCallback((function(e){var t=function(){return c((r+1)%i)},n=function(){return c((r-1+i)%i)},o="horizontal"===a,s="vertical"===a,u={ArrowRight:function(){return o&&t()},ArrowLeft:function(){return o&&n()},ArrowDown:function(){return s&&t()},ArrowUp:function(){return s&&n()},Home:function(){return c(0)},End:function(){return c(i-1)}}[function(e){var t=e.key,n=e.keyCode;return n>=37&&n<=40&&0!==t.indexOf("Arrow")?"Arrow"+t:t}(e)];u&&(e.preventDefault(),u(e))}),[i,r,a,c]);return U({},e,{role:"tablist","aria-orientation":a,onKeyDown:T(e.onKeyDown,s)})}(X({},e,{ref:t})),r=X({display:"flex"},Object(E.c)().tablist);return u.createElement(I.a.div,X({},n,{className:A("chakra-tabs__tablist",e.className),__css:r}))}));var ne=Object(S.a)((function(e,t){var n=function(e){var t=e.isSelected,n=e.id,r=e.children;return U({tabIndex:0},V(e,["isSelected","id","children"]),{children:!Y().isLazy||t?r:null,role:"tabpanel",hidden:!t,id:n})}(X({},e,{ref:t})),r=Object(E.c)();return u.createElement(I.a.div,X({outline:"0"},n,{className:A("chakra-tabs__tab-panel",e.className),__css:r.tabpanel}))}));var re=Object(S.a)((function(e,t){var n=J(e);return u.createElement(I.a.div,X({},n,{width:"100%",ref:t,className:A("chakra-tabs__tab-panels",e.className)}))}));var ae=n(256),oe=n(360),ie=n(359),ce=n(489),se=n(363),ue=Object(se.a)({displayName:"SmallAddIcon",viewBox:"0 0 20 20",path:u.createElement("path",{fill:"currentColor",d:"M14 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H6c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1z",fillRule:"evenodd"})}),le=n(255),de=n(230),fe=n(40),pe=n(89),be={outerContainer:{mx:{lg:10,md:4},h:"90vh",overflowY:"scroll"},innerContainer:{py:10,rowGap:{sm:10,md:0},h:{lg:"65vh",sm:"auto"},columns:{lg:2,md:1},justifyItems:"center"},iconbtn:{cursor:"pointer",bgGradient:"linear(primary.600, secondary.400)",pos:"absolute",borderRadius:"50%",transition:"all .3s ease-out",_hover:{bgGradient:"linear(secondary.400, primary.500)"},_active:{bgGradient:"linear(secondary.400, primary.500)"}},iconbtnDel:{cursor:"pointer",bgGradient:"linear(red.600, red.400)",pos:"absolute",borderRadius:"50%",transition:"all .3s ease-out",_hover:{bgGradient:"linear(red.400, red.500)"},_active:{bgGradient:"linear(red.400, red.500)"}}},me=l.a.lazy((function(){return Promise.all([n.e(4),n.e(37)]).then(n.bind(null,244))})),ve=l.a.lazy((function(){return Promise.all([n.e(1),n.e(9),n.e(38)]).then(n.bind(null,261))})),je=l.a.lazy((function(){return n.e(36).then(n.bind(null,232))})),he=d.a().shape({firstName:d.c().required("Please provide your firstname"),lastName:d.c().required("Please provide your lastname"),email:d.c().email("Please provide a valid email").required("Please provide your email")}),Oe=d.a().shape({currentPassword:d.c().required("provide your current password"),password:d.c().min(6,"Password should atleast contain a minimum of 6 characters").required("Please protect your account with a password"),passwordConfirm:d.c().when("password",{is:function(e){return!!(e&&e.length>0)},then:d.c().oneOf([d.b("password")],"passwords do not match")}).required("Confirm your password")});t.default=function(){var e,t=Object(u.useContext)(fe.a),n=t.user,o=t.updateUser,l=Object(v.b)().colorMode,d=Object(le.a)(),f=d.image,S=d.setImage,N=d.showImageCropper,k=d.closeImageCropper,E=d.imageSettings,I=d.setImageSettings,A=d.imageUrl,P=d.setCroppedImage,_=d.croppedImage,L=d.openImageCropper,D=d.resetValues,R=Object(u.useState)(!1),z=Object(s.a)(R,2),F=z[0],G=z[1],M={firstName:n.firstName,middleName:n.middleName||"",lastName:n.lastName,email:n.email},T=function(){var e=Object(c.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return G(!0),(t=new FormData).append("photo",f),t.append("imageSettings",JSON.stringify(E)),e.prev=4,e.next=7,p()({url:"/api/v1/users/updateSettings",method:"PATCH",data:t});case 7:n=e.sent,o(n.data.user),D(),e.next=14;break;case 12:e.prev=12,e.t0=e.catch(4);case 14:G(!1);case 15:case"end":return e.stop()}}),e,null,[[4,12]])})));return function(){return e.apply(this,arguments)}}(),q=Object(de.a)(),U=q.setAlert,V=q.isAlertOpen,H=q.alertDetails,W=Object(m.g)();return Object(a.jsxs)(u.Suspense,{fallback:Object(a.jsx)(pe.default,{}),children:[V&&Object(a.jsx)(je,{alertDetails:H}),f&&A&&Object(a.jsx)(ve,{showImageCropper:N,closeImageCropper:k,imageSettings:E,setImageSettings:I,photo:A,setCroppedImage:P}),Object(a.jsxs)(j.a,Object(r.a)(Object(r.a)({bgColor:"light"===l?"secondary.100":"gray.700"},be.outerContainer),{},{className:"hide-scrollbar",p:5,children:[Object(a.jsx)(j.a,{mb:{lg:20,sm:2},textAlign:"center",children:Object(a.jsx)(h.a,{children:"My Profile"})}),Object(a.jsxs)(O.a,Object(r.a)(Object(r.a)({},be.innerContainer),{},{children:[Object(a.jsxs)(j.a,{alignSelf:"center",w:"max-content",pos:"relative",children:[!F&&Object(a.jsx)(g.a,{borderRadius:"0",boxSize:{md:"400px",sm:"300px"},src:_||n&&(null===(e=n.photo)||void 0===e?void 0:e.url),alt:n&&n.firstName}),F&&Object(a.jsxs)(j.a,{boxSize:"400px",padding:"6",boxShadow:"lg",bg:"white",children:[Object(a.jsx)(x.a,{size:"10"}),Object(a.jsx)(x.b,{mt:"4",noOfLines:8,spacing:"4"})]}),Object(a.jsx)("input",{onChange:function(e){return S(e.target.files[0])},type:"file",name:"image-upload",id:"image-upload",style:{display:"none"}}),!F&&Object(a.jsxs)(w.a,{children:[f&&Object(a.jsx)(y.a,{hasArrow:!0,label:"Remove Changes",children:Object(a.jsx)(C.a,Object(r.a)(Object(r.a)({bottom:"20px",left:"10px",onClick:D},be.iconbtnDel),{},{"aria-label":"revert changes",icon:Object(a.jsx)(oe.a,{color:"#fff"})}))}),f&&Object(a.jsx)(y.a,{hasArrow:!0,label:"Save Photo",children:Object(a.jsx)(C.a,Object(r.a)(Object(r.a)({bottom:"20px",right:"100px",onClick:T},be.iconbtn),{},{"aria-label":"save photo",icon:Object(a.jsx)(ie.a,{color:"#fff"})}))}),f&&Object(a.jsx)(y.a,{hasArrow:!0,label:"Edit Photo",children:Object(a.jsx)(C.a,Object(r.a)(Object(r.a)({bottom:"20px",right:"55px",onClick:L},be.iconbtn),{},{"aria-label":"edit photo",icon:Object(a.jsx)(ce.a,{color:"#fff"})}))}),Object(a.jsx)(y.a,{hasArrow:!0,label:"Change Photo",children:Object(a.jsx)(C.a,Object(r.a)(Object(r.a)({bottom:"20px",right:"10px",as:"label",htmlFor:"image-upload"},be.iconbtn),{},{"aria-label":"change photo",icon:Object(a.jsx)(ue,{color:"#fff"})}))})]})]}),Object(a.jsx)(j.a,{alignSelf:"center",w:"100%",children:Object(a.jsxs)($,{children:[Object(a.jsxs)(te,{children:[Object(a.jsx)(ee,{children:"Update Settings"}),Object(a.jsx)(ee,{children:"Update Password"})]}),Object(a.jsxs)(re,{children:[Object(a.jsx)(ne,{children:Object(a.jsx)(b.c,{validationSchema:he,initialValues:M,onSubmit:function(){var e=Object(c.a)(i.a.mark((function e(t,n){var r,a,c,s,u,l,d,f,b;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.setSubmitting,a=n.resetForm,c=t.firstName,s=t.middleName,u=t.lastName,l=t.email,(d=new FormData).append("firstName",c),s&&""!==s.trim()&&d.append("middleName",s),d.append("lastName",u),d.append("email",l),e.prev=7,e.next=10,p()({url:"/api/v1/users/updateSettings",method:"PATCH",data:d});case 10:f=e.sent,o(f.data.user),b={firstName:f.data.user.firstName,middleName:f.data.user.middleName||"",lastName:f.data.user.lastName,email:f.data.user.email},D(),a({values:b}),U("success","user details updated succesfully"),r(!1),e.next=23;break;case 19:e.prev=19,e.t0=e.catch(7),U("error","could not update user details"),r(!1);case 23:case"end":return e.stop()}}),e,null,[[7,19]])})));return function(t,n){return e.apply(this,arguments)}}(),children:function(e){var t=e.dirty,n=e.isValid,r=e.isSubmitting;return Object(a.jsxs)(j.a,{as:b.b,minH:"400px",autoComplete:"off",children:[Object(a.jsx)(me,{name:"firstName",label:"firstName"}),Object(a.jsx)(me,{required:!1,name:"middleName",label:"middleName"}),Object(a.jsx)(me,{name:"lastName",label:"lastName"}),Object(a.jsx)(me,{name:"email",label:"Email"}),n&&t&&Object(a.jsx)(ae.a,{isLoading:r,type:"submit",colorScheme:"primary",children:"Save"})]})}})}),Object(a.jsx)(ne,{children:Object(a.jsx)(b.c,{validationSchema:Oe,initialValues:{currentPassword:"",password:"",passwordConfirm:""},onSubmit:function(){var e=Object(c.a)(i.a.mark((function e(t,n){var a,o,c;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=n.setSubmitting,o=n.resetForm,c=Object(r.a)({},t),e.prev=2,e.next=5,p()({url:"/api/v1/users/updateCurrentUserPassword",method:"POST",data:c});case 5:o(),U("success","user password updated succesfully. You will be logged out..."),a(!1),setTimeout((function(){W.replace("/auth/logout")}),2e3),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(2),U("error",e.t0.response.data.message),a(!1);case 15:case"end":return e.stop()}}),e,null,[[2,11]])})));return function(t,n){return e.apply(this,arguments)}}(),children:function(e){var t=e.dirty,n=e.isValid,r=e.isSubmitting;return Object(a.jsxs)(j.a,{minH:"400px",as:b.b,autoComplete:"off",children:[Object(a.jsx)(me,{name:"currentPassword",label:"Current Password",type:"password"}),Object(a.jsx)(me,{type:"password",name:"password",label:"New Password"}),Object(a.jsx)(me,{name:"passwordConfirm",label:"Password Confirm",type:"password"}),Object(a.jsx)(ae.a,{disabled:!t&&n||t&&!n,isLoading:r,type:"submit",colorScheme:"primary",children:"Save"})]})}})})]})]})})]}))]}))]})}}}]);
//# sourceMappingURL=21.51ef41f7.chunk.js.map