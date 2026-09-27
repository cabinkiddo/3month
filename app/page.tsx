"use client";
import {lazy,Suspense,useEffect,useState} from "react";
import {Preloader} from "@/components/Preloader";
import {AmbientSound} from "@/components/AmbientSound";
import {Hero} from "@/components/sections/Hero";
import {OldWay} from "@/components/sections/OldWay";
import {NewWay} from "@/components/sections/NewWay";
import {RuleSection} from "@/components/sections/RuleSection";
import {Simulation} from "@/components/sections/Simulation";
import {TopHundred} from "@/components/sections/TopHundred";
import {useScrollTracker} from "@/hooks/useScrollSignal";
import CorridorFallback from "./CorridorThree";

const TunnelCanvas=lazy(()=>import("@/components/TunnelCanvas"));
export default function Home(){
  const [entered,setEntered]=useState(false);
  const [webgl,setWebgl]=useState<boolean|null>(null);
  useScrollTracker();
  useEffect(()=>{const canvas=document.createElement("canvas");setWebgl(Boolean(canvas.getContext("webgl2")||canvas.getContext("webgl")));},[]);
  return <main className="relative">
    {webgl===true?<Suspense fallback={null}><TunnelCanvas/></Suspense>:webgl===false?<CorridorFallback/>:null}
    <div className="relative z-10 transition-opacity duration-1000" style={{opacity:entered?1:0}}>
      <Hero/><OldWay/><NewWay/><RuleSection/><Simulation/><TopHundred/>
    </div>
    {!entered?<Preloader onDone={()=>setEntered(true)}/>:null}
    {entered?<AmbientSound/>:null}
  </main>;
}
