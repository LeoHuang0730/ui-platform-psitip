"use client";
import React, { 
  useEffect, 
  useState, 
} from "react";
import {
  Box,
} from "@mui/material";
import "@xyflow/react/dist/style.css";

import Topbar from "./components/topbar";
import ReactflowPSITIP from "./components/reactflowPSITIP";
import ConditionBar from "./components/conditionBar";
import CodeBar from "./components/codeBar";

export interface mapNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    type: string;
    label: string;
    content: string;
    rate: string;
    blockLength?: number | string;
    inputs?: string[];
    outputs?: string[];
  };
}

export interface mapEdge {
  id: string;
  source: string;
  target: string;
}

export default function Home() {
  const [mapNodes, setMapNodes] = useState<mapNode[]>([]);
  const [mapEdges, setMapEdges] = useState<mapEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<mapNode | null>(null);
  const [lastBlockLength, setLastBlockLength] = useState<number | string>("n");
  const [additionalConditions, setAdditionalConditions] = useState<string[]>(
    []
  );

  useEffect(() => {
    console.log(mapNodes);
  }, [mapNodes]);

  useEffect(() => {
    console.log(mapEdges);
  }, [mapEdges]);

  // useEffect(() => {
  //   console.log(selectedNode);
  // }, [selectedNode]);

  // useEffect(() => {
  //   console.log(lastBlockLength);
  // }, [lastBlockLength]);

  // useEffect(() => {
  //   console.log(additionalConditions);
  // }, [additionalConditions]);

  return (
    <Box
      display={"flex"}
      height={"100vh"}
      width={"100vw"}
      flexDirection={"column"}
      borderRadius={"8px"}
    >
      <Topbar />
      <Box display="flex" flexDirection="row" height="100vh">
        {/* Left Side: ReactflowPSITIP (Expands to fit available height) */}
        <Box flex={3} display="flex" minHeight={0} overflow="hidden">
          <ReactflowPSITIP
            mapNodes={mapNodes}
            setMapNodes={setMapNodes}
            mapEdges={mapEdges}
            setMapEdges={setMapEdges}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            lastBlockLength={lastBlockLength}
            setLastBlockLength={setLastBlockLength}
          />
        </Box>

        {/* Right Side: ConditionBar + CodeBar (Scrolls when needed) */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          minHeight={0}
          overflow="auto"
        >
          <Box flexShrink={0}>
            <ConditionBar
              additionalConditions={additionalConditions}
              setAdditionalConditions={setAdditionalConditions}
            />
          </Box>
          <Box flexShrink={0}>
            <CodeBar mapNodes={mapNodes} mapEdges={mapEdges} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* 
Put hat on Decoded M
Additional Information box
Add source default S, decoded as S and can choose from sources.
UI imporvements
*/
