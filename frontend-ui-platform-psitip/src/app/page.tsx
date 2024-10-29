'use client';

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
  };
  data: {
    type: string;
    label: string;
    content: string;
    rate: string;
    blockLength?: number;
  };
}

interface mapEdge {
  id: string;
  source: string;
  target: string;
}

let variableSequence = ['X', 'Y', 'Z', 'W', 'T', 'Q']; // Sequence of variable names

export default function Home() {
  const [mapNodes, setMapNodes] = useState<mapNode[]>([
    
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

  const addMessageNode = useCallback(() => {
    const messageNodes = mapNodes.filter(node => node.data.type === 'message');
    const existingMessageNumbers = messageNodes
      .map(node => parseInt(node.id.replace('M', ''), 10))
      .sort((a, b) => a - b);

    let newMessageNumber = 1;
    for (let i = 0; i < existingMessageNumbers.length; i++) {
      if (existingMessageNumbers[i] !== newMessageNumber) {
        break;
      }
      newMessageNumber++;
    }

    const newId = `M${newMessageNumber}`;
    const newRate = `R${newMessageNumber}`;

    setMapNodes((mapNodes) => [
      ...mapNodes,
      {
        id: newId,
        position: { x: 0, y: 0 },
        data: { 
          type: 'message',
          label: newId,
          content: `Message ${newMessageNumber}`,
          rate: newRate,
        }
      }
    ]);
  }, [mapNodes]);

  const addVariableNode = useCallback(() => {
    const variableNodes = mapNodes.filter(node => node.data.type === 'variable');
    
    let nextVariableId = 'X';
    let nextBlockLength = 1;

    if (variableNodes.length > 0) {
      const lastVariable = variableNodes[variableNodes.length - 1];
      const lastVariableLabel = lastVariable.data.label;

      const match = lastVariableLabel.match(/^([A-Z])_(\d+)$/);
      
      if (match) {
        const [_, letter, blockLength] = match;
        const nextBlockNumber = parseInt(blockLength) + 1;

        nextVariableId = `${letter}_${nextBlockNumber}`;
      } else {
        const nextIndex = variableSequence.indexOf(lastVariableLabel) + 1;
        if (nextIndex < variableSequence.length) {
          nextVariableId = variableSequence[nextIndex];
        }
      }
    }

    setMapNodes((mapNodes) => [
      ...mapNodes,
      {
        id: nextVariableId,
        position: { x: 0, y: 0 },
        data: { 
          type: 'variable',
          label: nextVariableId,
          content: nextVariableId,
          rate: '',
          blockLength: nextBlockLength,  
        }
      }
    ]);
  }, [mapNodes]);

  const addEncoderNode = useCallback(() => {
    const encoderNodes = mapNodes.filter(node => node.data.type === 'encoder');
    const encoderId = `E${encoderNodes.length + 1}`;  // Count only encoder nodes
    setMapNodes((mapNodes) => [
      ...mapNodes,
      {
        id: encoderId,
        position: { x: 0, y: 0 },
        data: { 
          type: 'encoder',
          label: encoderId,
          content: `Encoder ${encoderId}`,
          rate: '',
        }
      }
    ]);
  }, [mapNodes]);

  const addDecoderNode = useCallback(() => {
    const decoderNodes = mapNodes.filter(node => node.data.type === 'decoder');
    const decoderId = `D${decoderNodes.length + 1}`;  // Count only decoder nodes
    setMapNodes((mapNodes) => [
      ...mapNodes,
      {
        id: decoderId,
        position: { x: 0, y: 0 },
        data: { 
          type: 'decoder',
          label: decoderId,
          content: `Decoder ${decoderId}`,
          rate: '',
        }
      }
    ]);
  }, [mapNodes]);

  const addDecodedMessageNode = useCallback(() => {
    const decodedMessageId = `DM${mapNodes.filter(node => node.data.type === 'decoded').length + 1}`;
    setMapNodes((mapNodes) => [
      ...mapNodes,
      {
        id: decodedMessageId,
        position: { x: 0, y: 0 },
        data: { 
          type: 'decoded',
          label: decodedMessageId,
          content: `Decoded Message ${decodedMessageId}`,
          rate: '',
        }
      }
    ]);
  }, [mapNodes]);

  const updateNodeData = useCallback((key: string, value: string) => {
    if (!selectedNode) return;
    setMapNodes((nodes) =>
      nodes.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, [key]: value } } : node
      )
    );
    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, [key]: value } } : null);
  }, [selectedNode]);

  const getDecodeSequence = useCallback((messageId: string) => {
    const decodedNodes = mapNodes
      .filter(node => node.data.type === 'decoded' && node.data.content === messageId)
      .map(node => {
        const match = node.data.label.match(/^.+,(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num) => num !== null) as number[];

    decodedNodes.sort((a, b) => a - b);

    let nextSequence = 1;
    for (let i = 0; i < decodedNodes.length; i++) {
      if (decodedNodes[i] !== nextSequence) {
        break;
      }
      nextSequence++;
    }

    return nextSequence;
  }, [mapNodes]);

  const handleDecoderChange = useCallback((selectedMessageId: string) => {
    const nextSequence = getDecodeSequence(selectedMessageId);
    const newLabel = `${selectedMessageId},${nextSequence}`;
    updateNodeData('label', newLabel);
  }, [getDecodeSequence, updateNodeData]);

  const onNodeDelete = useCallback((nodeId: string) => {
    setMapNodes((nodes) => {
      const nodeToDelete = nodes.find(node => node.id === nodeId);
      if (nodeToDelete && nodeToDelete.data.type === 'decoded') {
        const messageId = nodeToDelete.data.content;
        const updatedNodes = nodes.filter(node => node.id !== nodeId);

        return updatedNodes;
      }

      return nodes.filter(node => node.id !== nodeId);
    });
  }, [setMapNodes]);

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
          <Controls
            position="top-left"
            orientation="horizontal"
            // showZoom={false}
            // showFitView={false}
            // showInteractive={false}
          >
            <ControlButton style={{ width: 'auto' }} onClick={addMessageNode}>
              Add Message
            </ControlButton>
            <ControlButton style={{ width: 'auto' }} onClick={addVariableNode}>
              Add Variable
            </ControlButton>
            <ControlButton style={{ width: 'auto' }} onClick={addEncoderNode}>
              Add Encoder
            </ControlButton>
            <ControlButton style={{ width: 'auto' }} onClick={addDecoderNode}>
              Add Decoder
            </ControlButton>
            <ControlButton style={{ width: 'auto' }} onClick={addDecodedMessageNode}>
              Add Decoded Message
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
            width='auto'
            height='auto'
          >
            <Typography variant="h6">Edit Node</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Input
                placeholder="Label"
                value={selectedNode.data.label}
                onChange={(e) => updateNodeData('label', e.target.value)}
              />
              <Input
                placeholder="Content"
                value={selectedNode.data.content}
                onChange={(e) => updateNodeData('content', e.target.value)}
              />
              {selectedNode.data.type === 'message' && (
                <Input
                  placeholder="Rate"
                  value={selectedNode.data.rate}
                  onChange={(e) => updateNodeData('rate', e.target.value)}
                />
              )}
              {selectedNode.data.type === 'variable' && (
                <>
                  <Input
                    placeholder="Block Length"
                    value={selectedNode.data.blockLength || 1}
                    onChange={(e) => updateNodeData('blockLength', e.target.value)}
                  />
                  <Typography>
                    Current Variable: {selectedNode.data.blockLength && selectedNode.data.blockLength > 1 
                      ? `${selectedNode.data.label}^${selectedNode.data.blockLength}` 
                      : selectedNode.data.label}
                  </Typography>
                </>
              )}
              {selectedNode.data.type === 'decoded' && (
                <Select
                  value={selectedNode.data.content}
                  onChange={(e) => {
                    handleDecoderChange(e.target.value);
                    updateNodeData('content', e.target.value);
                  }}
                >
                  {mapNodes
                    .filter(node => node.data.type === 'message')
                    .map(node => (
                      <MenuItem key={node.id} value={node.id}>{node.id}</MenuItem>
                    ))}
                </Select>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}