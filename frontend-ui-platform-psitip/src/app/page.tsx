"use client";
import React, { CSSProperties, useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
} from "@mui/material";
import "@xyflow/react/dist/style.css";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import Topbar from "./components/topbar";
import ReactflowPSITIP from "./components/reactflowPSITIP";
import ConditionBar from "./components/conditionBar";
import CodeBar from "./components/codeBar";

interface mapNode {
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

interface mapEdge {
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

  // useEffect(() => {
  //   console.log(mapNodes);
  // }, [mapNodes]);

  // useEffect(() => {
  //   console.log(mapEdges);
  // }, [mapEdges]);

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
      <Box flexGrow={1} display="flex" flexDirection={"row"}>
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
        <Box display={"flex"} flexDirection={"column"}>
          <ConditionBar 
            additionalConditions={additionalConditions}
            setAdditionalConditions={setAdditionalConditions}
          />
          <CodeBar />
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
