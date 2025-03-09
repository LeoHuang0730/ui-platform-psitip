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
import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { RxCross1 } from "react-icons/rx";

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
    switch (nodeType) {
      case "encoder":
      case "decoder":
      case "channel":
        return { width: "auto", height: "auto", borderRadius: "0%" };
      default:
        return { width: "auto", height: "auto", borderRadius: "50%" };
    }
  };

  const getNodeLabel = (node: mapNode) => {
    if (node.data.type === "variable") {
      const label = node.data.label;
      const blockLength = node.data.blockLength;

      if (blockLength && blockLength !== "1") {
        return `${label}^${blockLength}`;
      }
    }
    return node.data.label;
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection={"row"}>
      <ReactFlow
        colorMode="light"
        nodes={mapNodes.map((node) => ({
          ...node,
          style: getNodeStyle(node.data.type),
          type: "default",
          data: { ...node.data, label: getNodeLabel(node) },
        }))}
        onNodesChange={onNodesChange}
        edges={mapEdges.map((edge) => ({
          ...edge,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "black" },
        }))}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
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
        <Controls position="top-left" orientation="horizontal">
          <ControlButton style={{ width: "auto" }} onClick={addMessageNode}>
            Add Source
          </ControlButton>
          <ControlButton style={{ width: "auto" }} onClick={addVariableNode}>
            Add Variable
          </ControlButton>
          <ControlButton style={{ width: "auto" }} onClick={addEncoderNode}>
            Add Encoder
          </ControlButton>
          <ControlButton style={{ width: "auto" }} onClick={addDecoderNode}>
            Add Decoder
          </ControlButton>
          <ControlButton
            style={{ width: "auto" }}
            onClick={addDecodedMessageNode}
          >
            Add Decoded Message
          </ControlButton>
          <ControlButton style={{ width: "auto" }} onClick={addChannelNode}>
            Add Channel
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
            width="auto"
            height="auto"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Edit Node</Typography>
              <RxCross1
                onClick={() => setSelectedNode(null)}
                style={{ cursor: "pointer" }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Label:</Typography>
                <Input
                  placeholder="Label"
                  value={selectedNode.data.label}
                  onChange={(e) => updateNodeData("label", e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Content:</Typography>
                <Input
                  placeholder="Content"
                  value={selectedNode.data.content}
                  onChange={(e) => updateNodeData("content", e.target.value)}
                />
              </Box>
              {selectedNode.data.type === "message" && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>Rate:</Typography>
                  <Input
                    placeholder="Rate"
                    value={selectedNode.data.rate}
                    onChange={(e) => updateNodeData("rate", e.target.value)}
                  />
                </Box>
              )}
              {selectedNode.data.type === "variable" && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Block Length:</Typography>
                    <Input
                      placeholder="Block Length"
                      value={selectedNode.data.blockLength || "n"}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isValid = /^(\d+|n)$/.test(value); // Check if value is an integer or "n"
                        updateNodeData("blockLength", isValid ? value : "n");
                      }}
                    />
                  </Box>
                  <Typography>
                    Current Variable: {selectedNode.data.label}
                  </Typography>
                </>
              )}
              {selectedNode.data.type === "decoded" && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>Decoding:</Typography>
                  <Select
                    value={selectedNode.data.content}
                    style={{ minWidth: "100px", height: "40px" }}
                    onChange={(e) => {
                      handleDecoderChange(e.target.value);
                      updateNodeData("content", e.target.value);
                    }}
                  >
                    {mapNodes
                      .filter((node) => node.data.type === "message")
                      .map((node) => (
                        <MenuItem key={node.id} value={node.id}>
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
        
  )
}

export default ReactflowPSITIP;