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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { RxCross1 } from "react-icons/rx";
import { BiReset } from "react-icons/bi";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

import { mapNode, mapEdge } from "../page";

interface ReactflowPSITIPProps {
  mapNodes: mapNode[];
  setMapNodes: any;
  mapEdges: mapEdge[];
  setMapEdges: any;
  selectedNode: mapNode | null;
  setSelectedNode: any;
  lastBlockLength: number | string;
  setLastBlockLength: any;
}

// Add CSS styles at the top of the file
const customHandleStyles: CSSProperties = {
  width: '25px',
  height: '25px',
  backgroundColor: '#000',
  border: '3px solid #fff',
  borderRadius: '50%'
};

const ReactflowPSITIP = ({
  mapNodes,
  setMapNodes,
  mapEdges,
  setMapEdges,
  selectedNode,
  setSelectedNode,
  lastBlockLength,
  setLastBlockLength
}: ReactflowPSITIPProps) => {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });

  let variableSequence = ["X", "Y", "Z", "W", "T", "Q"];

  const onNodesChange = useCallback(
    (changes: any) => setMapNodes((nds: mapNode[]) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setMapEdges((eds: mapEdge[]) => applyEdgeChanges(changes, eds)),
    []
  );

  const onEdgesDelete = useCallback((edges: mapEdge[]) => {
    edges.forEach(() => {
      setMapNodes((nodes: mapNode[]) =>
        nodes.map((node) => {
          if (node.data.type === "channel") {
            const newInputs = (node.data.inputs || []).filter(
              (input) =>
                !edges.some((e) => e.source === input && e.target === node.id)
            );
            const newOutputs = (node.data.outputs || []).filter(
              (output) =>
                !edges.some((e) => e.source === node.id && e.target === output)
            );
            const newLabel = `P(${newOutputs.join(", ")} | ${newInputs.join(
              ", "
            )})`;
            return {
              ...node,
              data: {
                ...node.data,
                inputs: newInputs,
                outputs: newOutputs,
                label: newLabel,
              },
            };
          }
          return node;
        })
      );
    });
  }, []);

  const onConnect = useCallback((params: any) => {
    setMapEdges((eds: mapEdge[]) => addEdge(params, eds));
    updateChannelLabel(params.source, params.target);
  }, []);

  const addMessageNode = useCallback(() => {
    const messageNodes = mapNodes.filter(
      (node) => node.data.type === "message"
    );
    const existingMessageNumbers = messageNodes
      .map((node) => parseInt(node.id.replace("S", ""), 10))
      .sort((a, b) => a - b);

    let newMessageNumber = 1;
    for (let i = 0; i < existingMessageNumbers.length; i++) {
      if (existingMessageNumbers[i] !== newMessageNumber) {
        break;
      }
      newMessageNumber++;
    }

    const newId = `S${newMessageNumber}`;
    const newRate = `R${newMessageNumber}`;

    setMapNodes((mapNodes: mapNode[]) => [
      ...mapNodes,
      {
        id: newId,
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 0, y: messageNodes.length * 50 },
        data: {
          type: "message",
          label: newId,
          content: `Message ${newMessageNumber}`,
          rate: newRate,
        },
      },
    ]);
  }, [mapNodes]);

  const addVariableNode = useCallback(() => {
    const variableNodes = mapNodes.filter(
      (node) => node.data.type === "variable"
    );

    let nextVariableId = "X";

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

    setMapNodes((mapNodes: mapNode[]) => [
      ...mapNodes,
      {
        id: nextVariableId,
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 50, y: variableNodes.length * 50 },
        data: {
          type: "variable",
          label: nextVariableId,
          content:
            lastBlockLength === "1"
              ? `${nextVariableId}`
              : `${nextVariableId}^${lastBlockLength}`,
          rate: "",
          blockLength: lastBlockLength,
        },
      },
    ]);
  }, [mapNodes, lastBlockLength]);

  const addEncoderNode = useCallback(() => {
    const encoderNodes = mapNodes.filter(
      (node) => node.data.type === "encoder"
    );
    const encoderId = `Enc${encoderNodes.length + 1}`;
    setMapNodes((mapNodes: mapNode[]) => [
      ...mapNodes,
      {
        id: encoderId,
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 100, y: encoderNodes.length * 50 },
        data: {
          type: "encoder",
          label: encoderId,
          content: `Encoder ${encoderId}`,
          rate: "",
        },
      },
    ]);
  }, [mapNodes]);

  const addDecoderNode = useCallback(() => {
    const decoderNodes = mapNodes.filter(
      (node) => node.data.type === "decoder"
    );
    const decoderId = `Dec${decoderNodes.length + 1}`;
    setMapNodes((mapNodes: mapNode[]) => [
      ...mapNodes,
      {
        id: decoderId,
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 150, y: decoderNodes.length * 50 },
        data: {
          type: "decoder",
          label: decoderId,
          content: `Decoder ${decoderId}`,
          rate: "",
        },
      },
    ]);
  }, [mapNodes]);

  const addDecodedMessageNode = useCallback(() => {
    const decodedMessageNodes = mapNodes.filter(
      (node) => node.data.type === "decoded"
    );
    const decodedMessageId = `DM${
      mapNodes.filter((node) => node.data.type === "decoded").length + 1
    }`;
    setMapNodes((mapNodes: mapNode[]) => [
      ...mapNodes,
      {
        id: decodedMessageId,
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 200, y: decodedMessageNodes.length * 50 },
        data: {
          type: "decoded",
          label: decodedMessageId,
          content: `Decoded Message ${decodedMessageId}`,
          rate: "",
        },
      },
    ]);
  }, [mapNodes]);

  const addChannelNode = useCallback(() => {
    const channelNodes = mapNodes.filter(
      (node) => node.data.type === "channel"
    );
    const channelId = `C${channelNodes.length + 1}`;
    setMapNodes((mapNodes: mapNode[]) => [
      ...mapNodes,
      {
        id: channelId,
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 250, y: channelNodes.length * 50 },
        data: {
          type: "channel",
          label: "P( | )",
          content: `Channel ${channelId}`,
          rate: "",
          inputs: [],
          outputs: [],
        },
      },
    ]);
  }, [mapNodes]);

  const updateChannelLabel = useCallback(
    (sourceId: string, targetId: string) => {
      setMapNodes((nodes: mapNode[]) =>
        nodes.map((node) => {
          if (node.id === targetId && node.data.type === "channel") {
            const sourceNode = nodes.find((n) => n.id === sourceId);
            if (sourceNode) {
              const newInputs = Array.from(
                new Set([...(node.data.inputs || []), sourceNode.id])
              );
              const newOutputs = node.data.outputs || [];
              const newLabel = `P(${newOutputs.join(", ")} | ${newInputs.join(
                ", "
              )})`;
              return {
                ...node,
                data: { ...node.data, inputs: newInputs, label: newLabel },
              };
            }
          }
          if (node.id === sourceId && node.data.type === "channel") {
            const targetNode = nodes.find((n) => n.id === targetId);
            if (targetNode) {
              const newOutputs = Array.from(
                new Set([...(node.data.outputs || []), targetNode.id])
              );
              const newInputs = node.data.inputs || [];
              const newLabel = `P(${newOutputs.join(", ")} | ${newInputs.join(
                ", "
              )})`;
              return {
                ...node,
                data: { ...node.data, outputs: newOutputs, label: newLabel },
              };
            }
          }
          return node;
        })
      );
    },
    []
  );

  const updateNodeData = useCallback(
    (key: string, value: string) => {
      if (!selectedNode) return;
      setMapNodes((nodes: mapNode[]) =>
        nodes.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, [key]: value } }
            : node
        )
      );
      setSelectedNode((prev: mapNode) =>
        prev ? { ...prev, data: { ...prev.data, [key]: value } } : null
      );

      if (selectedNode.data.type === "variable" && key === "blockLength") {
        setLastBlockLength(value);
      }
    },
    [selectedNode]
  );

  const getDecodeSequence = useCallback(
    (messageId: string) => {
      const decodedNodes = mapNodes
        .filter(
          (node) =>
            node.data.type === "decoded" && node.data.content === messageId
        )
        .map((node) => {
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
    },
    [mapNodes]
  );

  const handleDecoderChange = useCallback(
    (selectedMessageId: string) => {
      const nextSequence = getDecodeSequence(selectedMessageId);
      const newLabel = `${selectedMessageId},${nextSequence}`;
      updateNodeData("label", newLabel);
    },
    [getDecodeSequence, updateNodeData]
  );

  const getNodeStyle = (nodeType: string): CSSProperties => {
    const baseStyle = {
      width: "auto",
      height: "auto",
      padding: "15px",
      backgroundColor: nodeColors[nodeType as keyof typeof nodeColors],
      border: "2px solid rgba(0,0,0,0.2)",
    };
    
    return {
      ...baseStyle,
      borderRadius: ["encoder", "decoder", "channel"].includes(nodeType) ? "0%" : "50%",
    };
  };

  const getNodeLabel = (node: mapNode) => {
    if (node.data.type === "variable") {
      const content = node.data.content;
      const [base, exponent] = content.split("^");
      
      if (exponent) {
        return (
          <InlineMath>
            {`${base}^{${exponent}}`}
          </InlineMath>
        );
      }
    }
    return node.data.label;
  };

  const handleResetCanvas = () => {
    setMapNodes([]);
    setMapEdges([]);
    setSelectedNode(null);
    setShowResetDialog(false);
  };

  // Add color mapping for different node types
  const nodeColors = {
    message: "#FF9E80",    // Coral orange for source
    variable: "#81D4FA",   // Light blue for variables
    encoder: "#FFCDD2",    // Light red for encoder
    decoder: "#C8E6C9",    // Light green for decoder
    decoded: "#FFB74D",    // Light orange for decoded (paired with message)
    channel: "#757575",    // Grey for channel
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection={"row"}>
      {/* Vertical Toolbar */}
      <Box
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: "white",
          padding: 1,
          borderRadius: 1,
          boxShadow: 2,
          zIndex: 10,
        }}
      >
        <Button
          variant="contained"
          onClick={addMessageNode}
          sx={{ backgroundColor: nodeColors.message, color: "black" }}
        >
          Add Source
        </Button>
        <Button
          variant="contained"
          onClick={addVariableNode}
          sx={{ backgroundColor: nodeColors.variable, color: "black" }}
        >
          Add Variable
        </Button>
        <Button
          variant="contained"
          onClick={addEncoderNode}
          sx={{ backgroundColor: nodeColors.encoder, color: "black" }}
        >
          Add Encoder
        </Button>
        <Button
          variant="contained"
          onClick={addDecoderNode}
          sx={{ backgroundColor: nodeColors.decoder, color: "black" }}
        >
          Add Decoder
        </Button>
        <Button
          variant="contained"
          onClick={addDecodedMessageNode}
          sx={{ backgroundColor: nodeColors.decoded, color: "black" }}
        >
          Add Decoded Message
        </Button>
        <Button
          variant="contained"
          onClick={addChannelNode}
          sx={{ backgroundColor: nodeColors.channel, color: "black" }}
        >
          Add Channel
        </Button>
        <Button
          variant="contained"
          onClick={() => setShowResetDialog(true)}
          sx={{ backgroundColor: "#f5f5f5", color: "black" }}
          startIcon={<BiReset />}
        >
          Reset Canvas
        </Button>
      </Box>

      <ReactFlow
        colorMode="light"
        nodes={mapNodes.map((node) => ({
          ...node,
          style: getNodeStyle(node.data.type),
          type: "default",
          data: { 
            ...node.data, 
            label: getNodeLabel(node),
            sourceHandleStyle: customHandleStyles,
            targetHandleStyle: customHandleStyles,
          },
        }))}
        onNodesChange={onNodesChange}
        edges={mapEdges.map((edge) => ({
          ...edge,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { 
            stroke: "black",
            strokeWidth: 3,
          },
        }))}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        onPaneClick={() => setSelectedNode(null)}
        onNodeClick={(event, node) => {
          // Get the clicked position relative to the viewport
          const rect = (event.target as Element).getBoundingClientRect();
          const x = rect.right;
          const y = rect.top - 10; // Position slightly above the node
          
          if (selectedNode && selectedNode.id === node.id) {
            setSelectedNode(null);
          } else {
            setSelectedNode(node);
            setEditPosition({ x, y });
          }
        }}
        fitView
      >
        <Background />
      </ReactFlow>

      {/* Reset Canvas Confirmation Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset Canvas</DialogTitle>
        <DialogContent>
          Are you sure you want to reset the canvas? This will remove all nodes and connections.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetCanvas} color="error">Reset</Button>
        </DialogActions>
      </Dialog>

      {selectedNode && (
          <Box
            position="absolute"
            sx={{
              left: `${editPosition.x}px`,
              top: `${editPosition.y}px`,
              transform: 'translate(20px, 0)',
              bgcolor: "white",
              p: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 10,
              width: "300px",
              minHeight: "auto",
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                pb: 1.5,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600,
                  color: '#1976d2'
                }}
              >
                {selectedNode.data.type.charAt(0).toUpperCase() + selectedNode.data.type.slice(1)} Node
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 0.5,
                  borderRadius: 1,
                  color: '#666',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.05)'
                  }
                }}
                onClick={() => setSelectedNode(null)}
              >
                <RxCross1 size={20} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#666' }}>
                  Label
                </Typography>
                <Input
                  fullWidth
                  placeholder="Enter label"
                  value={selectedNode.data.label}
                  onChange={(e) => updateNodeData("label", e.target.value)}
                  sx={{
                    fontSize: '0.9rem',
                    padding: '4px 8px',
                    borderRadius: 1,
                    '& input': { padding: '4px 8px' },
                    '&:before': { borderBottom: '2px solid rgba(0,0,0,0.1)' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: '2px solid rgba(0,0,0,0.2)' }
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#666' }}>
                  Content
                </Typography>
                <Input
                  fullWidth
                  placeholder="Enter content"
                  value={selectedNode.data.content}
                  onChange={(e) => updateNodeData("content", e.target.value)}
                  sx={{
                    fontSize: '0.9rem',
                    padding: '4px 8px',
                    borderRadius: 1,
                    '& input': { padding: '4px 8px' },
                    '&:before': { borderBottom: '2px solid rgba(0,0,0,0.1)' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: '2px solid rgba(0,0,0,0.2)' }
                  }}
                />
              </Box>
              {selectedNode.data.type === "message" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#666' }}>
                    Rate
                  </Typography>
                  <Input
                    fullWidth
                    placeholder="Enter rate"
                    value={selectedNode.data.rate}
                    onChange={(e) => updateNodeData("rate", e.target.value)}
                    sx={{
                      fontSize: '0.9rem',
                      padding: '4px 8px',
                      borderRadius: 1,
                      '& input': { padding: '4px 8px' },
                      '&:before': { borderBottom: '2px solid rgba(0,0,0,0.1)' },
                      '&:hover:not(.Mui-disabled):before': { borderBottom: '2px solid rgba(0,0,0,0.2)' }
                    }}
                  />
                </Box>
              )}
              {selectedNode.data.type === "variable" && (
                <>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#666' }}>
                      Block Length
                    </Typography>
                    <Input
                      fullWidth
                      placeholder="Enter block length"
                      value={selectedNode.data.blockLength || "n"}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isValid = /^(\d+|n)$/.test(value);
                        updateNodeData("blockLength", isValid ? value : "n");
                      }}
                      sx={{
                        fontSize: '0.9rem',
                        padding: '4px 8px',
                        borderRadius: 1,
                        '& input': { padding: '4px 8px' },
                        '&:before': { borderBottom: '2px solid rgba(0,0,0,0.1)' },
                        '&:hover:not(.Mui-disabled):before': { borderBottom: '2px solid rgba(0,0,0,0.2)' }
                      }}
                    />
                  </Box>
                  <Typography sx={{ 
                    fontSize: '0.85rem', 
                    color: '#666',
                    bgcolor: 'rgba(25,118,210,0.05)',
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid rgba(25,118,210,0.1)'
                  }}>
                    Current Variable: {selectedNode.data.label}
                  </Typography>
                </>
              )}
              {selectedNode.data.type === "decoded" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#666' }}>
                    Decoding
                  </Typography>
                  <Select
                    value={selectedNode.data.content}
                    onChange={(e) => {
                      handleDecoderChange(e.target.value);
                      updateNodeData("content", e.target.value);
                    }}
                    sx={{
                      fontSize: '0.9rem',
                      '& .MuiSelect-select': {
                        padding: '8px 12px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    {mapNodes
                      .filter((node) => node.data.type === "message")
                      .map((node) => (
                        <MenuItem 
                          key={node.id} 
                          value={node.id}
                          sx={{
                            fontSize: '0.9rem',
                            py: 1
                          }}
                        >
                          {node.id}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              )}
            </Box>
          </Box>
      )}
    </Box>
  );
};

export default ReactflowPSITIP;