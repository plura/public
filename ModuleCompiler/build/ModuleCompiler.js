/**
 * Plura ModuleCompiler Javascript Framework [http://plura.pt]
 * 
 * Copyright (c) 2023 Plura
 *
 * Date: 2023-01-02 18:19:00 (Mon, 02 Jan 2023)
 * Revision: 6246
 */
'use strict';const ModuleCompiler=function({data:x,prefix:y,process:h="ModuleCompiler.php"}){let b,q,l,v,t,e,k,m;const a=this,c=p=>{t.refresh(p.tree);k.refresh(p.result)},f=p=>{k.refresh(p.result);m.set("loading",!1)},g=p=>{p.stopImmediatePropagation();switch(p.type){case "COLLECTIONS":t.start(q.collection(p.detail));break;case "GROUPS_SELECT":l=p.detail.id;e.refresh(q.type(l),q.returnTypes(l));q.load(l,c,e.get());break;case "FILES":case "PREFERENCES":m.set("loading",e.wait()),q.load(l,f,e.get(),
t.get())}};q=new ModuleDataManager({data:x,handler:p=>{b||(a.core=b=document.body.appendChild(document.createElement("div"))).classList.add("p-app-modulecompiler");v=new ModuleCompilerFilterCollection({data:p.filter(),prefix:"p-app-modulecompiler",target:b});v.core.addEventListener("COLLECTIONS",g);e=new ModuleCompilerPreferences({target:b,prefix:"p-app-modulecompiler"});e.core.addEventListener("PREFERENCES",g);t=new ModuleCompilerFileManager({prefix:"p-app-modulecompiler",target:b});["FILES","GROUPS_SELECT"].forEach(n=>
t.core.addEventListener(n,g));k=new ModuleCompilerResultManager({prefix:"p-app-modulecompiler",target:b});m=new ModuleCompilerSystemStatus({app:a,prefix:"p-app-modulecompiler",target:b})},prefix:y,process:h})},ModuleCompilerFileManagerGroup=function({data:x,target:y}){var h,b,q,l,v;const t=(m,a=!0,c=!0)=>{m?l.classList.add("on"):l.classList.remove("on");a&&k.activate(m,c);b=m},e=m=>{m?[h,v].forEach(a=>a.classList.add("on")):[h,v].forEach(a=>a.classList.remove("on"));q=m};(h=y.appendChild(document.createElement("div"))).classList.add(...["files-group",
"on"]);(y=h.appendChild(document.createElement("div"))).classList.add("controls");(l=y.appendChild(document.createElement("div"))).classList.add(...["control","controls-check"]);l.addEventListener("click",m=>t(!b));l.textContent=x.name||x.path;t(!0,!1);(v=y.appendChild(document.createElement("div"))).classList.add(...["control","controls-visibility"]);v.addEventListener("click",m=>e(!q));e(!0);y=void 0;var k=new ModuleCompilerFileManagerGroupTree({data:x.core,target:h});k.core.addEventListener("GROUP_TREE_CHANGE",
m=>t(k.active(),!1));this.active=k.active;this.check=t;this.core=h;this.visible=e},ModuleCompilerFileManagerGroupsNav=function({target:x}){let y,h,b,q,l,v,t,e,k,m,a;const c=w=>{let A=[],B;q=new Map;(t=document.createElement("div")).classList.add("index");w.forEach((C,D)=>{A.push({name:C.name,value:D});(B=t.appendChild(document.createElement("div"))).classList.add("i");q.set(B,D)});e=new ModuleCompilerForm({data:[{type:"select",values:A,change:u,blank:!1}],target:h});h.appendChild(t);(k=h.appendChild(document.createElement("div"))).classList.add("controls");
(m=k.appendChild(document.createElement("div"))).classList.add(...["control","controls-check"]);m.addEventListener("click",r);p(!0,!1);(a=k.appendChild(document.createElement("div"))).classList.add(...["control","controls-visibility"]);a.addEventListener("click",z);n(!0,!1)},f=(w=0)=>{w!==y&&(1<b.length&&g(w),y=w,h.dispatchEvent(new CustomEvent("GROUPS_SELECT",{bubbles:!0,detail:b[w]})))},g=w=>{e.core.querySelector("select").value=w;[...t.children].forEach((A,B)=>{w===B?(A.classList.add("active"),
A.removeEventListener("click",d)):(A.classList.remove("active"),A.addEventListener("click",d))})},p=(w,A=!0)=>{w?m.classList.add("on"):m.classList.remove("on");l=w;A&&h.dispatchEvent(new CustomEvent("GROUPS_CHECK",{detail:l}))},n=(w,A=!0)=>{w?a.classList.add("on"):a.classList.remove("on");v=w;A&&h.dispatchEvent(new CustomEvent("GROUPS_VISIBILITY",{detail:v}))},d=w=>f(q.get(w.currentTarget)),u=({element:w})=>f(Number(w.value)),r=w=>p(!l),z=w=>n(!v);(h=x.appendChild(document.createElement("div"))).classList.add("files-group-nav");
this.core=h;this.refresh=w=>{for(;h.firstChild;)h.removeChild(h.firstChild);y=null;b=w;1<b.length&&c(b);f()}},ModuleCompilerFileManagerGroupTree=function({data:x,target:y}){let h,b,q,l,v;const t=(d,u=!0)=>{u&&!l.has(d)?(l.set(d,b.get(d).data),q.delete(d)):u||q.has(d)||(q.set(d,b.get(d).data),l.delete(d));b.get(d).parents&&b.get(d).parents.forEach(r=>{var z;if(!(z=u)&&(z=!u)){a:{z=b.get(r).children;let w;for(w=0;w<z.length;w+=1)if(l.has(z[w])){z=!0;break a}z=!1}z=!z}z&&e(r,u,!1)});k(d,u)},e=(d,u=!0,
r=!0)=>{r&&b.get(d).children.forEach(z=>{b.get(z).children?e(z,u):t(z,u)});k(d,u)},k=(d,u)=>{u?b.get(d).node.classList.add("on"):b.get(d).node.classList.remove("on")},m=(d=!0)=>d&&l.size||!d&&q.size?d?l:q:!1,a=()=>({active:m(),inactive:m(!1),leaf:v.size,selected:l.size}),c=(d,u)=>{u=void 0!==u?u:b.get(d).children?!b.get(d).node.classList.contains("on"):!l.has(d);b.get(d).children?e(d,u):t(d,u)},f=(d,u)=>{let r,z=u?u+"_":"i",w,A,B;w=document.createElement("ul");d.forEach((C,D)=>{r=z+D;(A=w.appendChild(document.createElement("li"))).classList.add(...["node",
r]);(B=A.appendChild(g(C))).classList.add("trigger");b.set(r,{data:C,node:A});b.set(A,r);C.children?(A.appendChild(f(C.children,r)).classList.add("branch"),B.addEventListener("click",p)):(A.addEventListener("click",n),A.classList.add("leaf"),v.set(A,C));u?(r.split("_").slice(0,-1).forEach((G,E,F)=>(b.get(r).parents=b.get(r).parents||[]).push(F.slice(0,E+1).join("_"))),(b.get(u).children=b.get(u).children||[]).push(r)):c(r)});return w},g=d=>{let u="string"===typeof d?d:d.name||d.vanity,r=document.createElement("span");
r.textContent=u;d.path&&r.setAttribute("data-path",d.path);return r},p=d=>{d=b.get(d.currentTarget.parentNode);c(d);h.dispatchEvent(new CustomEvent("GROUP_TREE_CHANGE",{bubbles:!0,detail:a()}))},n=d=>{d=b.get(d.currentTarget);c(d);h.dispatchEvent(new CustomEvent("GROUP_TREE_CHANGE",{bubbles:!0,detail:a()}))};this.activate=(d=!0,u=!0)=>{x.forEach((r,z)=>c(`i${z}`,d));u&&(console.log("werewr"),h.dispatchEvent(new CustomEvent("GROUP_TREE_CHANGE",{bubbles:!0,detail:a()})))};this.active=m;b=new Map;q=
new Map;l=new Map;v=new Map;(h=y.appendChild(f(x))).classList.add("tree");this.core=h},ModuleCompilerFileManager=function({prefix:x,target:y}){let h,b,q,l;const v=e=>{e.stopImmediatePropagation();switch(e.type){case "GROUPS_CHECK":b.forEach(k=>k.check(e.detail,!0,!1));h.dispatchEvent(new CustomEvent("FILES"));break;case "GROUPS_VISIBILITY":b.forEach(k=>k.visible(e.detail))}},t=e=>{e.stopImmediatePropagation();h.dispatchEvent(new CustomEvent("FILES"))};(h=y.appendChild(document.createElement("div"))).classList.add(`${x}-files`);
q=new ModuleCompilerFileManagerGroupsNav({target:h});["GROUPS_CHECK","GROUPS_VISIBILITY"].forEach(e=>q.core.addEventListener(e,v));(l=h.appendChild(document.createElement("div"))).classList.add("inner");this.core=h;this.get=()=>{let e=[],k;b.forEach((m,a)=>{if(m.active()){if(k=m.active(!1),e[a]={},k){e[a].exclude=[];for(const c of k.values())e[a].exclude.push(c.path||c)}}else e[a]=!1});return e};this.refresh=e=>{for(b=[];l.firstChild;)l.removeChild(l.firstChild);e.forEach((k,m)=>{b[m]=new ModuleCompilerFileManagerGroup({data:k,
target:l});b[m].core.addEventListener("GROUP_TREE_CHANGE",t)})};this.start=e=>{q.refresh(e.groups);h.setAttribute("data-title",e.label)}},ModuleCompilerFilterCollection=function({data:x,prefix:y,target:h}){let b;(b=h.appendChild(document.createElement("div"))).classList.add(`${y}-collections`);new ModuleCompilerForm({target:b,data:[{type:"select",values:x,change:({element:q})=>{b.dispatchEvent(new CustomEvent("COLLECTIONS",{detail:q.value}))}}]});this.core=b},ModuleCompilerFormLabelAlign={LEFT:"left",
LEFT_WRAP:"left-wrap",RIGHT:"right",RIGHT_WRAP:"right-wrap"},ModuleCompilerForm=function({data:x,target:y}){let h,b;const q=this,l=(a,c)=>{a.forEach(f=>{let g;if(f instanceof Array||f.type.match(/(field)?set/))g=c.appendChild(document.createElement(f.tag||"fieldset")),l(f.fields||f,g);else{switch(f.type){case "select":g=v({elementData:f.values,blank:f.blank});break;default:g=document.createElement("input")}g.classList.add("p-modulecompiler-form-element")}c.appendChild(g);void 0!==f.label&&t(f.label,
g);e(g,f)})},v=({elementData:a,elementParent:c,elementParentID:f,blank:g=!0})=>{let p=c||document.createElement("select");!c&&g&&p.appendChild(document.createElement("option"));a.forEach((n,d)=>{let u=`${f?`${f}_`:"i"}${d}`,r;n.values||n instanceof Array?(r=n.values&&(n.label||n.name)?n.label||n.name:`group${d}`,n=n.values||n,(d=p.appendChild(document.createElement("optgroup"))).setAttribute("label",r),v({elementData:n,elementParent:d,elementParentID:u})):(r=m([n.label,n.name,n.value,n]),(d=p.appendChild(document.createElement("option"))).value=
m([n.value,r]),d.textContent=r,b.set(d,u))});return p},t=(a,c,f=ModuleCompilerFormLabelAlign.LEFT)=>{f=a.align||f;let g=document.createElement("label"),p=`p-modulecompiler-form-element-${Date.now()+Math.floor(256*Math.random())}`;k(c,{id:p});k(g,{"for":p,"align-type":f});g.textContent=a.name||a;switch(f){case ModuleCompilerFormLabelAlign.LEFT:c.parentNode.insertBefore(g,c);break;case ModuleCompilerFormLabelAlign.LEFT_WRAP:c.parentNode.appendChild(g).appendChild(c);break;case ModuleCompilerFormLabelAlign.RIGHT:c.parentNode.insertBefore(g,
c.nextSibling);break;case ModuleCompilerFormLabelAlign.RIGHT_WRAP:c.parentNode.appendChild(g).prepend(c)}g.classList.add(`align-${f}`);return g},e=(a,c)=>{let f={};if(!c.type||c.type.match(/((field)?set|checkbox|radio|text)/))if(!c.type.match(/(field)?set/)||c.tag)f.type=c.type||"text";void 0!==c.name&&(f.name=c.name);void 0!==c.change&&a.addEventListener("change",g=>c.change({data:c,form:h,element:a,obj:q}));void 0!==c.value&&(f.value=c.value);c.type.match(/(checkbox|radio)/)&&c.checked&&(f.checked=
!0);k(a,f)},k=(a,c)=>Object.entries(c).forEach(([f,g])=>a.setAttribute(f,g)),m=a=>{let c;for(const f of a)if(c=f,void 0!==c)break;return c};x&&(b=new Map,q.core=h=y.appendChild(document.createElement("form")),l(x,h))},ModuleCompilerPreferences=function({prefix:x,target:y}){let h,b;const q="ECMASCRIPT_2021 ECMASCRIPT_2020 ECMASCRIPT_2019 ECMASCRIPT_2018 ECMASCRIPT_2017 ECMASCRIPT_2016 ECMASCRIPT6 ECMASCRIPT5".split(" "),l=()=>{let k={returnType:t("[name=returnType]:checked").value};k.returnType.match(/join/)&&
t("[name=minify]").checked&&(k={...k,minify:1,language:t("[name=language]").value,language_out:t("[name=language_out]").value});return k},v=({type:k,returnTypes:m}={})=>{m&&t("[name=returnType]",!0).forEach(a=>{a.disabled=!m.includes(a.value)});t("[type=set]:not([name=main])",!0).forEach(a=>{t("[name=returnType]:checked").value===a.getAttribute("name")?a.classList.add("on"):a.classList.remove("on")});["language","language_out"].forEach(a=>{a=t(`[name="join"] [name=${a}]`);a.disabled=!t('[name="join"] [name=minify]').checked;
if(k)a.classList[k.match(/js/)?"remove":"add"]("off")});b.core.querySelectorAll("[id]").forEach(a=>{let c=t(`label[for=${a.id}]`),f;c&&(f=[[a.disabled?"add":"remove","disabled"]],k&&f.push([a.classList.contains("off")?"add":"remove","off"]),f.forEach(g=>c.classList[g[0]](g[1])))})},t=(k,m=!1)=>b.core[m?"querySelectorAll":"querySelector"](k),e=k=>{v();k=l("minify").checked;h.dispatchEvent(new CustomEvent("PREFERENCES",{detail:{load:k}}))};(h=y.appendChild(document.createElement("div"))).classList.add(`${x}-preferences`);
b=new ModuleCompilerForm({target:h,data:[{type:"set",name:"main",tag:"div",fields:[{name:"returnType",type:"radio",label:{name:"Link",align:"right"},value:"link",checked:!0,change:e},{name:"returnType",type:"radio",label:{name:"Join",align:"right"},value:"join",change:e},{name:"returnType",type:"radio",label:{name:"Closure",align:"right"},value:"closure",change:e}]},{type:"set",name:"join",tag:"div",fields:[{name:"minify",type:"checkbox",label:{name:"Minify",align:ModuleCompilerFormLabelAlign.RIGHT_WRAP},
change:e},{name:"language",type:"select",values:q,blank:!1,label:{name:"Language",align:ModuleCompilerFormLabelAlign.LEFT_WRAP},change:e},{name:"language_out",type:"select",values:q,blank:!1,label:{name:"Language Out",align:ModuleCompilerFormLabelAlign.LEFT_WRAP},change:e}]}]});v();this.core=h;this.get=l;this.refresh=(k,m)=>v({type:k,returnTypes:m});this.wait=()=>l().minify},ModuleCompilerResultManager=function({prefix:x,target:y}){var h,b,q;const l={compiled_code:"Compiled Code",errors:"Errors",
result:"Result",warnings:"Warnings",statistics:"Statistics"},v=(e,k=!0)=>{if(!k||k&&e!==h){k&&(h&&v(h,!1),h=e);let m=q.get(e).nav.classList;e=q.get(e).content.classList;k?(m.add("active"),e.add("on")):(m.remove("active"),e.remove("on"))}},t=e=>{h=void 0;for(q=new Map;b.firstChild;)b.removeChild(b.firstChild);let k,m,a,c,f;(k=b.appendChild(document.createElement("ul"))).classList.add(`${x}-result-nav`);(c=b.appendChild(document.createElement("div"))).classList.add(`${x}-result-content`);Object.entries(e).forEach(([g,
p])=>{(m=k.appendChild(document.createElement("li"))).classList.add(`${x}-result-nav-item`);(a=m.appendChild(document.createElement("a"))).textContent=l[g]||g;a.setAttribute("href","#");a.addEventListener("click",n=>v(n.currentTarget));(f=c.appendChild(document.createElement("div"))).classList.add(`${x}-result-content-item`);f.appendChild(document.createElement("textarea")).textContent=p;q.set(a,{nav:m,content:f})})};(b=y.appendChild(document.createElement("div"))).classList.add(`${x}-result`);this.refresh=
e=>{t("string"===typeof e?{result:e}:e);v(q.keys().next().value)}},ModuleCompilerSystemStatus=function({app:x,prefix:y,target:h}){let b;(b=h.appendChild(document.createElement("div"))).classList.add(`${y}-systemstatus`);b.appendChild(document.createElement("div")).classList.add(`${y}-systemstatus-indicator`);this.set=(q,l=!0)=>{b.classList[l?"add":"remove"]("on");x.core.classList[l?"add":"remove"](`status-${q}`)}},ModuleDataManager=function({data:x,handler:y,prefix:h,process:b}){let q,l,v;const t=
this,e=function(a,...c){let f=new FormData;c.forEach(g=>{for(let p in g)if(g.hasOwnProperty(p)){let n=g[p];"object"===typeof n&&(n=JSON.stringify(n));f.append(p,n)}});return new Request(a,{body:f,method:"POST"})},k=async function(a){"object"===typeof a?v=m(a):"string"===typeof a&&(v=await fetch(a).then(c=>c.json()).then(c=>m(c)));y&&y(t)},m=(a,c)=>{let f=[];a.forEach((g,p)=>{let n=`${c?`${c}_`:"i"}${p}`;if(g.values||g instanceof Array)p=m(g.values||g,n),f.push({name:g.label,values:p});else{let d=
[];p=g.data;let u=["join","link"];p instanceof Array&&(p[0]instanceof Array||p[0].group&&p[0].items)?p.forEach((r,z)=>{d.push({id:n+"_"+z,type:r.type||g.type||"js",name:r.group||"Group "+z,items:r instanceof Array?r:r.items instanceof Array?r.items:[r.items]})}):d.push({id:n+"_0",type:g.type||"js",name:"Group 0",items:p instanceof Array?p:[p]});d.forEach(r=>{l.set(r.id,r);r.returnTypes=[].concat(u);for(let z=0;z<r.items.length;z+=1)if(r.items[z].closure){r.returnTypes.push("closure");break}});q.set(n,
{groups:d,label:g.label});f.push({name:g.label,value:n})}});return f};q=new Map;l=new Map;t.load=(a,c,f,g)=>{let p=[];a=l.get(a);a.items.forEach((n,d)=>{g&&!g[d]||p.push({exclude:g&&g[d].exclude,filter:n.filter,join:n.join,name:n.name,path:(h||"")+n.path,prefix:f.returnType.match(/link/)&&n[f.returnType]||"",top:n.top})});a=e(b,f,{data:p,type:a.type});fetch(a).then(n=>n.json()).then(n=>c(n))};t.filter=()=>v;t.collection=a=>q.get(a);t.returnTypes=a=>l.get(a).returnTypes;t.type=a=>l.get(a).type;x&&
k(x)};
