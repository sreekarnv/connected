(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[28],{253:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return j}));var r=n(79),a=n(128),l=n(55),c=n(277),o=n(135),u=n(0);function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function s(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var d=Object(r.a)((function(e,t){var n=e.area,r=e.templateAreas,l=e.gap,c=e.rowGap,o=e.columnGap,d=e.column,b=e.row,j=e.autoFlow,p=e.autoRows,f=e.templateRows,m=e.autoColumns,O=e.templateColumns,h=s(e,["area","templateAreas","gap","rowGap","columnGap","column","row","autoFlow","autoRows","templateRows","autoColumns","templateColumns"]),g={display:"grid",gridArea:n,gridTemplateAreas:r,gridGap:l,gridRowGap:c,gridColumnGap:o,gridAutoColumns:m,gridColumn:d,gridRow:b,gridAutoFlow:j,gridAutoRows:p,gridTemplateRows:f,gridTemplateColumns:O};return u.createElement(a.a.div,i({ref:t,__css:g},h))}));function b(e){return Object(c.a)(e,(function(e){return"auto"===e?"auto":"span "+e+"/span "+e}))}l.a&&(d.displayName="Grid");var j=Object(r.a)((function(e,t){var n=e.colSpan,r=e.colStart,l=e.colEnd,c=e.rowEnd,d=e.rowSpan,j=e.rowStart,p=s(e,["colSpan","colStart","colEnd","rowEnd","rowSpan","rowStart"]),f=Object(o.a)({gridColumn:b(n),gridRow:b(d),gridColumnStart:r,gridColumnEnd:l,gridRowStart:j,gridRowEnd:c});return u.createElement(a.a.div,i({ref:t,__css:f},p))}))},257:function(e,t,n){"use strict";var r=n(3),a=n(200);n(0);t.a=function(e){var t=e.hide,n=e.children,l=e.w;return Object(r.jsx)(a.a,{w:l,display:{sm:t.sm?"none":"block",md:t.md?"none":"block",lg:t.lg?"none":"block",xl:t.xl?"none":"block"},children:n})}},277:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var r=n(55),a=n(135);n(11);Object.freeze(["base","sm","md","lg","xl"]);function l(e,t){return Object(r.b)(e)?e.map((function(e){return null===e?null:t(e)})):Object(r.f)(e)?Object(a.b)(e).reduce((function(n,r){return n[r]=t(e[r]),n}),{}):null!=e?t(e):null}},530:function(e,t,n){"use strict";n.r(t);var r=n(3),a=n(4),l=n(253),c=n(0),o=n.n(c),u=n(12),i=n(257),s=n(40),d=n(358),b={container:{templateColumns:{xs:"repeat(14, 1fr)"},h:{md:"91vh",sm:"auto"}},leftSidebar:{p:{xl:3,lg:0},colStart:{lg:1},colEnd:{"1778px":4,lg:5}},content:{colStart:{"1778px":4,lg:5,md:2,sm:1},colEnd:{"1778px":12,lg:11,md:14,sm:-1}},rightSidebar:{p:{xl:3,lg:0},colStart:{"1778px":12,lg:11},colEnd:15}},j=o.a.lazy((function(){return Promise.all([n.e(6),n.e(29)]).then(n.bind(null,511))})),p=o.a.lazy((function(){return Promise.all([n.e(0),n.e(6),n.e(25)]).then(n.bind(null,512))})),f=o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(13)]).then(n.bind(null,533))})),m=o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(15)]).then(n.bind(null,534))})),O=o.a.lazy((function(){return Promise.all([n.e(0),n.e(2),n.e(7),n.e(32)]).then(n.bind(null,528))})),h=o.a.lazy((function(){return Promise.all([n.e(0),n.e(2),n.e(7),n.e(33)]).then(n.bind(null,529))})),g=o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(6),n.e(18)]).then(n.bind(null,522))})),x=o.a.lazy((function(){return n.e(24).then(n.bind(null,515))})),w=o.a.lazy((function(){return Promise.resolve().then(n.bind(null,89))}));t.default=function(){var e=Object(u.j)(),t=Object(u.g)(),n=Object(c.useContext)(s.a).getUserGroups;return Object(c.useEffect)((function(){n()}),[]),Object(c.useEffect)((function(){if(e.isExact)return t.replace("".concat(e.url,"/public"))})),Object(r.jsx)(r.Fragment,{children:Object(r.jsxs)(c.Suspense,{fallback:Object(r.jsx)(w,{}),children:[Object(r.jsx)(i.a,{hide:{lg:!0,xl:!0},children:Object(r.jsx)(g,{})}),Object(r.jsxs)(l.a,Object(a.a)(Object(a.a)({},b.container),{},{children:[Object(r.jsx)(l.b,Object(a.a)(Object(a.a)({},b.leftSidebar),{},{children:Object(r.jsx)(i.a,{hide:{sm:!0,md:!0},children:Object(r.jsx)(p,{})})})),Object(r.jsxs)(l.b,Object(a.a)(Object(a.a)({className:"hide-scrollbar",overflowY:"scroll"},b.content),{},{children:[Object(r.jsx)(d.a,{exact:!0,path:"".concat(e.url,"/public"),children:Object(r.jsx)(m,{})}),Object(r.jsx)(d.a,{exact:!0,path:"".concat(e.url,"/groups/:groupId/:slug"),children:Object(r.jsx)(f,{})}),Object(r.jsx)(d.a,{exact:!0,path:"".concat(e.url,"/find-friends"),children:Object(r.jsx)(O,{})}),Object(r.jsx)(d.a,{exact:!0,path:"".concat(e.url,"/find-groups"),children:Object(r.jsx)(h,{})}),Object(r.jsx)(d.a,{exact:!0,path:"".concat(e.url,"/friends/:friendId"),children:Object(r.jsx)(x,{})})]})),Object(r.jsx)(l.b,Object(a.a)(Object(a.a)({},b.rightSidebar),{},{children:Object(r.jsx)(i.a,{hide:{sm:!0,md:!0},children:Object(r.jsx)(j,{})})}))]}))]})})}}}]);
//# sourceMappingURL=28.71e3602f.chunk.js.map