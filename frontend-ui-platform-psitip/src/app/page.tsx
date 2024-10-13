'use client';
import Image from "next/image";
import styles from "./page.module.css";
import {
  Box,
  Typography,
  Button,
  Input,
  Select,
  MenuItem,
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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  useState,
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
    type: string;
    label: string;
    content: string;
    rate: string;
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
      position: { x: 100, y: 100 },
      data: {
        type: 'message',
        label: 'Initial Message',
        content: 'Initial Message',
        rate: '999',
      },
    },
    {
      id: '2',
      position: { x: 200, y: 200 },
      data: {
        type: 'encoder',
        label: 'Encoder 1',
        content: 'Encoder 1',
        rate: '',
      },
    },
    {
      id: '3',
      position: { x: 300, y: 300 },
      data: {
        type: 'message',
        label: 'Encoded Message',
        content: 'Encoded Message',
        rate: '',
      },
    },
    {
      id: '4',
      position: { x: 400, y: 400 },
      data: {
        type: 'decoder',
        label: 'Decoder 1',
        content: 'Decoder 1',
        rate: '',
      },
    },
    {
      id: '5',
      position: { x: 500, y: 500 },
      data: {
        type: 'message',
        label: 'Decoded Message',
        content: 'Decoded Message',
        rate: '', 
      },
    }
  ]);

  const [mapEdges, setMapEdges] = useState<mapEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<mapNode | null>(null);

  const onNodesChange = useCallback(
    (changes: any) => setMapNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: any) => setMapEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params: any) => setMapEdges((eds) => addEdge(params, eds)),
    [],
  );

  const addNode = useCallback(() => {
    setMapNodes((mapNodes) => [
      ...mapNodes,
      {
        id: `${mapNodes.length + 1}`,
        position: { x: 0, y: 0 },
        data: { 
          type: 'message',
          label: 'New Message',
          content: 'New Message',
          rate: '999',
        }
      }
    ]);
  }, []);

  const updateNodeData = useCallback((key: string, value: string) => {
    if (!selectedNode) return;
    setMapNodes((nodes) =>
      nodes.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, [key]: value } } : node
      )
    );
    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, [key]: value } } : null);
  }, [selectedNode]);

  return (
    <Box>
      <Box width={'100vw'} height={'100vh'} position="relative">
        <ReactFlow
          nodes={mapNodes.map(node => ({
            ...node,
            style: { borderRadius: '50%', textAlign: 'center', padding: 10 },
            type: 'default',
            data: { ...node.data, label: node.data.label }
          }))}
          onNodesChange={onNodesChange}
          edges={mapEdges.map(edge => ({
            ...edge,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: 'black' }
          }))}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => {
            if (selectedNode && selectedNode.id === node.id) {
              setSelectedNode(null);
            } else {
              setSelectedNode(node);
            }
          }}
          fitView
        >
          <Background />
          <Controls>
            <ControlButton onClick={addNode}>
              <FaRegPlusSquare />
            </ControlButton>
          </Controls>
        </ReactFlow>
        {selectedNode && (
          <Box
            position="absolute"
            top={0}
            right={0}
            bgcolor="white"
            p={2}
            boxShadow={3}
            zIndex={10}
            width={300}
            height={200}
          >
            <Typography variant="h6">Edit Node</Typography>
            <Select
              value={selectedNode.data.type}
              onChange={(e) => updateNodeData('type', e.target.value)}
              fullWidth
            >
              <MenuItem value="message">Message</MenuItem>
              <MenuItem value="encoder">Encoder</MenuItem>
              <MenuItem value="decoder">Decoder</MenuItem>
              <MenuItem value="encoded">Encoded Message</MenuItem>
              <MenuItem value="decoded">Decoded Message</MenuItem>
            </Select>
            <Input
              placeholder="Label"
              value={selectedNode.data.label}
              onChange={(e) => updateNodeData('label', e.target.value)}
              fullWidth
            />
            <Input
              placeholder="Content"
              value={selectedNode.data.content}
              onChange={(e) => updateNodeData('content', e.target.value)}
              fullWidth
            />
            {selectedNode.data.type === 'message' && (
              <Input
                placeholder="Rate"
                value={selectedNode.data.rate}
                onChange={(e) => updateNodeData('rate', e.target.value)}
                fullWidth
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}