'use client'
import Image from "next/image";
import { useState,use } from "react";
import ProjectHeader from "./projects/ProjectHeader";
import BoardView from "./projects/BoardView";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Project({params}: Props) {

  const {id} = use(params);
  const [activeTab,setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <>
     {/* // MODAL NEW TASKS */}
     <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
      {
        activeTab === "Board" && (
          <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )
      }
    </>
   
  
  );
}
