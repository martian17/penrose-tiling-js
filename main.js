class Tile{
    x = 0;
    y = 0;
    a = 0;
    rende
}


const canvas = document.createElement("canvas");
canvas.width = 6100;
canvas.height = 2100;
canvas.style.width = "100vw";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");


//     if(Math.random() < 0.5){
//     }else{
//     }


const rotate = function(x,y,a){
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    return [x*cos-y+sin, x*sin+y*cos];
}

const vecRatio = function(v1,v2,r){
    const res = [];
    for(let i = 0; i < v1.length; i++){
        res.push(v1[i] + r*(v2[i]-v1[i]));
    }
    return res;
}

const dimmenColor = function(color){
    const c = color.slice(1);
    const len = c.length;
    const s = Math.floor(len/3);
    let r = parseInt(c.slice(0,s),16);
    let g = parseInt(c.slice(s,s*2),16);
    let b = parseInt(c.slice(s*2,s*3),16);
    const rgb = [r,g,b].map(v=>Math.floor(v/2)).map(v=>(v.toString(16)+v.toString(16)).slice(-2)).join("");
    return "#"+rgb;
};

let highlightMarkedEdges = false;

const baseRender = function(p1,p2,p3,color="#fff",be){
    ctx.beginPath();
    ctx.moveTo(...p1);
    ctx.lineTo(...p2);
    ctx.lineTo(...p3);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();

    if(!highlightMarkedEdges)return;
    // drawing the bright edge
    const verts = [p1,p2,p3];
    const v1 = verts[be];
    const v2 = verts[(be+1)%3];
    ctx.beginPath();
    ctx.moveTo(...v1);
    ctx.lineTo(...v2);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#00f";
    ctx.stroke();
}

const r = (3-Math.sqrt(5))/2

const renderT1 = function(p1,p2,p3,depth){
    if(depth === 0){
        baseRender(p1,p2,p3,"#fcc",2);
        return;
    }
    let p12 = vecRatio(p1,p2,r);
    let p31 = vecRatio(p3,p1,r);
    renderT3(p1,p12,p31,depth-1);
    renderT2(p2,p31,p12,depth-1);
    renderT1(p2,p3, p31,depth-1);
}

const renderT2 = function(p1,p2,p3,depth){
    if(depth === 0){
        baseRender(p1,p2,p3,"#f99",0);
        return;
    }
    let p12 = vecRatio(p1,p2,1-r);
    let p31 = vecRatio(p3,p1,1-r);
    renderT4(p12,p31,p1,depth-1);
    renderT1(p3,p31,p12,depth-1);
    renderT2(p3,p12,p2, depth-1);
}

const renderT3 = function(p1,p2,p3,depth){
    if(depth === 0){
        baseRender(p1,p2,p3,"#ffc",0);
        return;
    }
    let p31 = vecRatio(p3,p1,r);
    renderT2(p1,p2,p31,depth-1);
    renderT3(p3,p31,p2,depth-1);
}

const renderT4 = function(p1,p2,p3,depth){
    if(depth === 0){
        baseRender(p1,p2,p3,"#ff9",1);
        return;
    }
    let p31 = vecRatio(p3,p1,1-r);
    renderT4(p2,p31,p1,depth-1);
    renderT1(p3,p31,p2,depth-1);
}

//ui
{
    let depth = 8;
    const input = document.createElement("input");
    input.setAttribute("type","text");
    input.value = depth;
    const btn = document.createElement("input");
    btn.setAttribute("type","button");
    btn.setAttribute("value","Calculate");
    btn.addEventListener("click",()=>{
        depth = parseInt(input.value);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        renderT3([0,2000],[3000,0],[6000,2000],depth);
    });
    const l = document.createElement("label");
    l.innerHTML = "Highlight marked edges"
    const c = document.createElement("input");
    c.type = "checkbox";
    c.addEventListener("click",()=>{
        highlightMarkedEdges = !!c.checked;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        renderT3([0,2000],[3000,0],[6000,2000],depth);
    });
    document.body.appendChild(input);
    document.body.appendChild(btn);
    document.body.appendChild(l);
    document.body.appendChild(c);
    
    renderT3([0,2000],[3000,0],[6000,2000],depth);
}




