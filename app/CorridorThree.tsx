"use client";
import {useEffect,useRef} from "react";
import * as THREE from "three";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const LENGTH=276;
const center=(depth:number)=>({x:Math.sin(depth*.018)*.65+Math.sin(depth*.045)*.22,y:Math.cos(depth*.019)*.38});

function canvasFallback(node:HTMLDivElement){
  const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");if(!ctx)return()=>{};
  node.appendChild(canvas);let raf=0;
  const resize=()=>{const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(d,0,0,d,0,0)};
  function draw(){const w=innerWidth,h=innerHeight,cx=w*.5,cy=h*.5,travel=scrollY/Math.max(1,document.body.scrollHeight-h)*LENGTH;
    ctx!.clearRect(0,0,w,h);
    const glow=ctx!.createRadialGradient(cx,cy,4,cx,cy,w*.6);glow.addColorStop(0,"rgba(220,161,86,.35)");glow.addColorStop(1,"rgba(0,0,0,0)");ctx!.fillStyle=glow;ctx!.fillRect(0,0,w,h);
    for(let i=64;i>=0;i--){const depth=((i*3.6-travel)%235+235)%235+2,scale=6/(depth+2),c=center(travel+depth),x=cx+c.x*scale*55,y=cy-c.y*scale*55,rx=3.1*scale*w*.48,ry=2.4*scale*h*.45;
      ctx!.strokeStyle=`rgba(222,169,103,${Math.min(.62,.085+scale*.34)})`;ctx!.lineWidth=1+Math.min(2,scale);ctx!.beginPath();ctx!.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx!.stroke();
    }
    for(let i=0;i<240;i++){const depth=((i*1.17-travel)%280+280)%280+2,scale=6/(depth+2),angle=i*2.39996,c=center(travel+depth),x=cx+(c.x+Math.cos(angle)*3)*scale*w*.15,y=cy+(c.y+Math.sin(angle)*2.3)*scale*h*.15;
      ctx!.fillStyle=`rgba(241,190,119,${Math.min(.95,.2+scale*.4)})`;ctx!.fillRect(x,y,Math.max(1,scale),Math.max(1,scale));
    }
    raf=requestAnimationFrame(draw);
  }
  resize();draw();addEventListener("resize",resize);return()=>{removeEventListener("resize",resize);cancelAnimationFrame(raf);node.removeChild(canvas)};
}

export default function CorridorThree(){
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=host.current;if(!node)return;
    const probe=document.createElement("canvas");
    if(!probe.getContext("webgl2")&&!probe.getContext("webgl"))return canvasFallback(node);
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"})}catch{return canvasFallback(node)}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    node.appendChild(renderer.domElement);
    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x050507,.018);
    const camera=new THREE.PerspectiveCamera(76,innerWidth/innerHeight,.06,95);
    camera.position.z=5;
    const geometry:THREE.BufferGeometry[]=[];
    const materials:THREE.Material[]=[];
    const track=new THREE.Group();scene.add(track);
    // Broken concentric bands make the corridor feel organic rather than like a wireframe box.
    for(let ring=0;ring<112;ring++){
      const depth=ring*2.55, z=-depth, c=center(depth),radius=3.05+Math.sin(ring*.2)*.18;
      for(let strand=0;strand<3;strand++){
        const vertices:number[]=[];const phase=ring*.37+strand*2.1;
        for(let j=0;j<=43;j++){
          const theta=j/43*Math.PI*2;
          const r=radius+Math.sin(theta*5+ring*.33)*.075+strand*.11;
          vertices.push(c.x+Math.cos(theta)*r,c.y+Math.sin(theta)*r*.77,z+Math.sin(theta*3+phase)*.22);
        }
        const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));geometry.push(g);
        const m=new THREE.LineBasicMaterial({color:strand===0?0xb38956:0x69583f,transparent:true,opacity:strand===0?.36:.13,blending:THREE.AdditiveBlending,depthWrite:false});materials.push(m);
        track.add(new THREE.Line(g,m));
      }
    }
    const rails:number[]=[];
    for(let lane=0;lane<32;lane++){
      const theta=lane/32*Math.PI*2;
      for(let i=0;i<111;i++){
        const d=i*2.55,a=center(d),b=center(d+2.55);
        const r=3.12+Math.sin(i*.23+lane*.7)*.06;
        rails.push(a.x+Math.cos(theta)*r,a.y+Math.sin(theta)*r*.77,-d,b.x+Math.cos(theta)*r,b.y+Math.sin(theta)*r*.77,-d-2.55);
      }
    }
    const railGeometry=new THREE.BufferGeometry();railGeometry.setAttribute("position",new THREE.Float32BufferAttribute(rails,3));geometry.push(railGeometry);
    const railMaterial=new THREE.LineBasicMaterial({color:0x79583b,transparent:true,opacity:.14,blending:THREE.AdditiveBlending,depthWrite:false});materials.push(railMaterial);
    track.add(new THREE.LineSegments(railGeometry,railMaterial));
    const points:number[]=[],streaks:number[]=[];
    for(let i=0;i<2400;i++){
      const d=((i*97.751)%LENGTH),a=i*2.39996,loc=center(d),radius=2.6+(i%11)*.055;
      const x=loc.x+Math.cos(a)*radius,y=loc.y+Math.sin(a)*radius*.77,z=-d;
      points.push(x,y,z);
      if(i%4===0)streaks.push(x,y,z,x,y,z-((i%7)+1)*.21);
    }
    const pointGeometry=new THREE.BufferGeometry();pointGeometry.setAttribute("position",new THREE.Float32BufferAttribute(points,3));geometry.push(pointGeometry);
    const dotMaterial=new THREE.PointsMaterial({color:0xf3c687,size:.043,transparent:true,opacity:.76,sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false});materials.push(dotMaterial);
    const dots=new THREE.Points(pointGeometry,dotMaterial);track.add(dots);
    const streakGeometry=new THREE.BufferGeometry();streakGeometry.setAttribute("position",new THREE.Float32BufferAttribute(streaks,3));geometry.push(streakGeometry);
    const streakMaterial=new THREE.LineBasicMaterial({color:0xbb9360,transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false});materials.push(streakMaterial);track.add(new THREE.LineSegments(streakGeometry,streakMaterial));
    // Small data readouts float on the inner wall and rush past with the tunnel.
    const textures:THREE.Texture[]=[];
    for(let i=0;i<35;i++){
      const label=document.createElement("canvas");label.width=256;label.height=64;
      const ctx=label.getContext("2d");if(!ctx)continue;
      ctx.font="24px monospace";ctx.fillStyle="rgba(244,197,129,.72)";
      ctx.fillText(`${(1950+i*2).toString()}   +${((i*37)%89/10).toFixed(1)}%`,3,42);
      const texture=new THREE.CanvasTexture(label);textures.push(texture);
      const mat=new THREE.SpriteMaterial({map:texture,transparent:true,opacity:.48,depthWrite:false,blending:THREE.AdditiveBlending});materials.push(mat);
      const sprite=new THREE.Sprite(mat),d=9+i*7.7,c=center(d),a=(i*.9)%Math.PI*2;
      sprite.position.set(c.x+Math.cos(a)*2.48,c.y+Math.sin(a)*1.85,-d);sprite.scale.set(1.15,.29,1);track.add(sprite);
    }
    gsap.registerPlugin(ScrollTrigger);
    const travel={value:0};
    const timeline=gsap.to(travel,{value:LENGTH-12,ease:"none",scrollTrigger:{trigger:document.documentElement,start:"top top",end:"bottom bottom",scrub:.7}});
    let raf=0;const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse={x:0,y:0};const pointer=(e:PointerEvent)=>{mouse.x=e.clientX/innerWidth-.5;mouse.y=e.clientY/innerHeight-.5};
    addEventListener("pointermove",pointer,{passive:true});
    function render(){
      const d=reduced?Math.min(travel.value,LENGTH-12):travel.value;
      const c=center(d),ahead=center(d+6);
      camera.position.set(c.x+mouse.x*.15,c.y-mouse.y*.12,4-d);
      camera.lookAt(ahead.x,ahead.y,-d-15);
      camera.rotateZ(Math.sin(d*.025)*.035);
      renderer.render(scene,camera);raf=requestAnimationFrame(render);
    }
    render();
    function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener("resize",resize);
    return()=>{removeEventListener("resize",resize);removeEventListener("pointermove",pointer);cancelAnimationFrame(raf);timeline.scrollTrigger?.kill();timeline.kill();geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();node.removeChild(renderer.domElement)};
  },[]);
  return <div ref={host} className="corridor" aria-hidden="true"/>;
}
