import{I as h,j as e,R as u,b as m,B as k,c as p,A as j,d as l}from"./index.Dd4IuXLn.js";const b=({parentClassName:i,childrensInArray:a,itemByLine:c=3})=>{const g=(n,t)=>n.includes("<#>")?n.split("<#>").map((s,x)=>e.jsx(u.Fragment,{children:t?e.jsx("a",{className:"GridFullWidth-row--item---content",target:"_blank",href:t,children:s}):e.jsx("p",{className:"GridFullWidth-row--item---content",children:s})},x)):e.jsx(u.Fragment,{children:t?e.jsx("a",{className:"GridFullWidth-row--item---content",target:"_blank",href:t,children:n}):e.jsx("p",{className:"GridFullWidth-row--item---content",children:n})},index),o=h()?a.filter(n=>!n.excludeOnMobile):a,d=[];for(let n=0;n<o.length;n+=c)d.push(o.slice(n,n+c));return e.jsx("div",{className:`${i}-grid GridFullWidth`,style:{"--itemByLine":c},children:d.map((n,t)=>e.jsx("div",{className:"GridFullWidth-row",children:n.map((r,s)=>e.jsx("div",{className:"GridFullWidth-row--item",children:g(r.content,r.link)},s))},t))})},N=({cursorClicked:i})=>{const a=[{content:"email :<#>valentin.gassend@gmail.com",link:"mailto:valentin.gassend@gmail.com",excludeOnMobile:!0},{content:"twitter :<#>@GassValentin",link:"https://twitter.com/GassValentin",excludeOnMobile:!1},{content:"phone :<#>07 68 93 59 96",link:"tel:+0768935996",excludeOnMobile:!1},{content:"github :<#>ValentinGassend",link:"https://github.com/ValentinGassend",excludeOnMobile:!0},{content:"instagram :<#>@levavalou",link:"https://www.instagram.com/levavalou/",excludeOnMobile:!1},{content:"designed by :<#>Hugo Pinna",link:"https://hugopinna.com/",excludeOnMobile:!1}];return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"ContactMaskingBackground",children:[e.jsx("div",{className:"ContactMaskingBackground-texture"}),e.jsxs("div",{className:"ContactMaskingBackground-background",children:[e.jsxs("div",{className:"ContactMaskingBackground-background--layout",children:[e.jsx(m,{name:"valentiN",parentClassName:"ContactMaskingBackground-background--layout"}),e.jsx(m,{name:"Gassend",parentClassName:"ContactMaskingBackground-background--layout"})]}),e.jsx(k,{})]}),e.jsxs("div",{className:"ContactMaskingBackground-content",children:[e.jsx("h3",{className:"ContactMaskingBackground-content--title Center Uppercase",children:"click pour voir"}),e.jsxs("div",{className:`ContactMaskingBackground-content--bottom ${i?"__clicked":""}`,children:[e.jsx(b,{parentClassName:"ContactMaskingBackground-content--bottom",childrensInArray:a,itemByLine:h()?2:3}),e.jsxs(p,{className:"ContactMaskingBackground-content--bottom---title Uppercase __ScrollText",slidesPerView:"auto",autoplay:{enabled:!0,delay:0,disableOnInteraction:!1},spaceBetween:30,loop:!0,modules:[j],speed:1e4,children:[e.jsx(l,{children:e.jsx("h4",{className:"After Before",children:"Développement créatif"})}),e.jsx(l,{children:e.jsx("h4",{className:"After Before",children:"À l'écoute de tes idées"})}),e.jsx(l,{children:e.jsx("h4",{className:"After Before",children:"Développement créatif"})}),e.jsx(l,{children:e.jsx("h4",{className:"After Before",children:"À l'écoute de tes idées"})})]})]})]})]})})};export{N as default};
