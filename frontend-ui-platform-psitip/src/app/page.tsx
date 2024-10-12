'use client';
import Image from "next/image";
import styles from "./page.module.css";
import {
  Box,
  Typography,
  Button,
  Input,
} from "@mui/material";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Position,
  ControlButton,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  useState,
  useEffect,
  useCallback,
} from "react";
import { FaRegPlusSquare } from "react-icons/fa";

interface mapNode {
  id: string;
  position: {
    x: number;
    y: number;
  }
  data: {
    [key: string]: any;
  }
}

interface mapEdge {
  id: string;
  source: string;
  target: string;
}

export default function Home() {

  const [mapNodes, setMapNodes] = useState<mapNode[]>([
    {
      id: '1',
      position: {
        x: 100,
        y: 100,
      },
      data: {
        type: 'message',
        label: 'Initial Message',
        content: 'Initial Message',
        rate: '999',
        // connectedBy: [],
        // connectedTo: ['2'],
      },
    },
    {
      id: '2',
      position: {
        x: 200,
        y: 200,
      },
      data: {
        type: 'encoder',
        label: 'Encoder 1',
        content: 'Encoder 1',
        rate: '',
        // connectedBy: ['1'],
        // connectedTo: ['3'],
      },
    },
    {
      id: '3',
      position: {
        x: 300,
        y: 300,
      },
      data: {
        type: 'message',
        label: 'Encoded Message',
        content: 'Encoded Message',
        rate: '',
        // connectedBy: ['2'],
        // connectedTo: ['4'],
      },
    },
    {
      id: '4',
      position: {
        x: 400,
        y: 400,
      },
      data: {
        type: 'decoder',
        label: 'Decoder 1',
        content: 'Decoder 1',
        rate: '',
        // connectedBy: ['3'],
        // connectedTo: ['5'],
      },
    },
    {
      id: '5',
      position: {
        x: 500,
        y: 500,
      },
      data: {
        type: 'message',
        label: 'Decoded Message',
        content: 'Decoded Message',
        rate: '', 
        // connectedBy: ['4'],
        // connectedTo: [],
      },
    }
  ]);

  const [mapEdges, setMapEdges] = useState<mapEdge[]>([]);

  const [selectedNode, setSelectedNode] = useState<any>();

  const onNodesChange = useCallback(
    (changes:any) => setMapNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes:any) => setMapEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params:any) => setMapEdges((eds) => addEdge(params, eds)),
    [],
  );

  const addNode = useCallback(() => {
    // yPos.current += 50;
    setMapNodes((mapNodes) => {
      console.log(mapNodes);
      return [
        ...mapNodes,
        {
          id: '6',
          position: { x: 0, y: 0 },
          data: { 
            type: 'message',
            label: 'Initial Message',
            content: 'Initial Message',
            rate: '999',
          }
        }
      ];
    });
  }, []);

  useEffect(() => {
    console.log(mapNodes);
  }, [mapNodes]);

  useEffect(() => {
    console.log(mapEdges);
  }, [mapEdges]);

  useEffect(() => {
    console.log(selectedNode);
  }, [selectedNode]);

  return (
    <Box>
      <Box width={'100vw'} height={'100vh'}>
        <ReactFlow
          nodes={mapNodes}
          onNodesChange={onNodesChange}
          edges={mapEdges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => {
            setSelectedNode(node);
          }}
          fitView
        >
          <Background />
          <Controls>
            <ControlButton
              onClick={() => {
                addNode();
              }}
            >
              <FaRegPlusSquare />
            </ControlButton>
          </Controls>
          {/* <div className="updatenode__controls">
            <label>label:</label>
            <input
              value={selectedNode?.data?.label}
              onChange={(evt) => {
                const updatedNodeProps = { 
                  ...selectedNode, 
                  data: { 
                    ...selectedNode.data, 
                    label: evt.target.value 
                  } 
                };
                setSelectedNode(updatedNodeProps);
              }}
            />
          </div> */}
        </ReactFlow>
      </Box>
    </Box>
  );
}
