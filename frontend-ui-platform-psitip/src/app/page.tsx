'use client';
import Image from "next/image";
import styles from "./page.module.css";
import {
  Box,
  Typography,
} from "@mui/material";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState } from "react";

interface mapNode {
  objectId: string;
  type: string;
  label: string;
  content: string;
  rate?: string;
  connectedBy: string[];
  connectedTo: string[];
}

interface mapEdge {
  id: string;
  source: string;
  target: string;
}

export default function Home() {

  const [mapNodes, setMapNodes] = useState<mapNode[]>([
    {
      objectId: '1',
      type: 'message',
      label: 'Initial Message',
      content: 'Initial Message',
      rate: '999',
      connectedBy: [],
      connectedTo: ['2'],
    },
    {
      objectId: '2',
      type: 'encoder',
      label: 'Encoder 1',
      content: 'Encoder 1',
      connectedBy: ['1'],
      connectedTo: ['3'],
    },
    {
      objectId: '3',
      type: 'message',
      label: 'Encoded Message',
      content: 'Encoded Message',
      connectedBy: ['2'],
      connectedTo: ['4'],
    },
    {
      objectId: '4',
      type: 'decoder',
      label: 'Decoder 1',
      content: 'Decoder 1',
      connectedBy: ['3'],
      connectedTo: ['5'],
    },
    {
      objectId: '5',
      type: 'message',
      label: 'Decoded Message',
      content: 'Decoded Message',
      connectedBy: ['4'],
      connectedTo: [],
    }
  ]);

  const [mapEdges, setMapEdges] = useState<mapEdge[]>([]);

  const nodeTranslator = (nodes: mapNode[]) => {
    const reactFlowNodes: any[] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].connectedBy.length > 0) {
        for (let j = 0; j < nodes[i].connectedBy.length; j++) {
          mapEdges.push({
            id: nodes[i].connectedBy[j] + '-' + nodes[i].objectId,
            source: nodes[i].connectedBy[j],
            target: nodes[i].objectId,
          })
        }
      }
      console.log(mapEdges);
      reactFlowNodes.push({
        id: nodes[i].objectId,
        position: {
          x: 100*(i+1),
          y: 100*(i+1),
        },
        data: {
          label: nodes[i].label,
        },
      })
    }
    console.log(reactFlowNodes);
    return reactFlowNodes;
  }

  return (
    <Box>
      <Box width={'100vw'} height={'100vh'}>
        <ReactFlow
          nodes={nodeTranslator(mapNodes)}
          edges={mapEdges}
        >
          <Background />
          {/* <Controls /> */}
        </ReactFlow>
      </Box>
    </Box>
  );
}
