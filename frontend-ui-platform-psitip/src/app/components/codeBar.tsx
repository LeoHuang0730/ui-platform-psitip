import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import { FaCopy } from "react-icons/fa";
import { mapNode, mapEdge } from "../page";

interface codeBarProps {
  mapNodes: mapNode[];
  mapEdges: mapEdge[];
}

export const codeTranslator = (mapNodes: mapNode[], mapEdges: mapEdge[]): string => {
  let pythonCode = `# Auto-generated Python Code from ReactFlow Data Structure\n\n`;
  
  // Add PSITIP imports and settings
  pythonCode += `from psitip import *\n\n`;
  pythonCode += `PsiOpts.setting(\n`;
  pythonCode += `    solver = "ortools.GLOP",    # Set linear programming solver\n`;
  pythonCode += `    repr_latex = True,          # Jupyter Notebook LaTeX display\n`;
  pythonCode += `    venn_latex = True,          # LaTeX in diagrams\n`;
  pythonCode += `    proof_note_color = "blue",  # Reasons in proofs are blue\n`;
  pythonCode += `    solve_display_reg = True,   # Display claims in solve commands\n`;
  pythonCode += `)\n\n`;

  // Extract core variables (only base, not power)
  let coreVariables = mapNodes
    .filter((node) => node.data.type === "variable")
    .map((node) => node.data.content.split("^")[0].trim());

  if (coreVariables.length > 0) {
    pythonCode += `${coreVariables.join(", ")} = rv("${coreVariables.join(", ")}")\n\n`;
  }

  let sourceMessages: string[] = [];
  let rateVariables: string[] = [];
  let encoderNodes: string[] = [];
  let decoderNodes: { [key: string]: { id: string; inputVar: string } } = {};

  // Step 1: Define Messages and Rates
  pythonCode += `# Step 1: Define Messages and Rates\n`;
  mapNodes.forEach((node) => {
    const nodeId = node.id;
    const { type, rate } = node.data;

    if (type === "message") {
      sourceMessages.push(nodeId);
      if (rate) {
        rateVariables.push(`R${sourceMessages.length}`);
      }
    } else if (type === "encoder") {
      encoderNodes.push(nodeId);
    } else if (type === "decoder") {
      decoderNodes[nodeId] = { id: nodeId, inputVar: "" };
    }
  });

  const messageArraySize = sourceMessages.length > 0 ? sourceMessages.length + 1 : 2;
  const rateArraySize = rateVariables.length > 0 ? rateVariables.length + 1 : 2;

  if (sourceMessages.length > 0) {
    pythonCode += `${sourceMessages.join(", ")} = rv_array("S", 1, ${messageArraySize})  # Source Messages\n`;
  }

  if (rateVariables.length > 0) {
    pythonCode += `${rateVariables.join(", ")} = real_array("R", 1, ${rateArraySize})  # Rate Variables\n`;
  }

  pythonCode += `\n# Step 2: Initialize the Coding Model\n`;
  pythonCode += `model = CodingModel()\n\n`;

  // Step 3: Add Encoder Nodes
  pythonCode += `# Step 3: Add Encoder Nodes\n`;
  encoderNodes.forEach((nodeId) => {
    const node = mapNodes.find((n) => n.id === nodeId);
    if (!node) return;

    const inputVars = mapEdges
      .filter((edge) => edge.target === nodeId)
      .map((edge) =>
        sourceMessages.includes(edge.source) ? edge.source : edge.source
      )
      .join(" + ");

    pythonCode += `model.add_node(${inputVars}, ${coreVariables[0]}, label="${node.data.label}")  # Encoder Node\n`;
  });

  // Step 4: Add Edges
  pythonCode += `\n# Step 4: Add Edges\n`;
  mapEdges.forEach((edge) => {
    const sourceNode = mapNodes.find((n) => n.id === edge.source);
    const targetNode = mapNodes.find((n) => n.id === edge.target);

    if (
      sourceNode &&
      targetNode &&
      sourceNode.data.type === "variable" &&
      targetNode.data.type === "variable"
    ) {
      pythonCode += `model.add_edge(${edge.source}, ${edge.target})  # Edge from ${edge.source} to ${edge.target}\n`;
    }
  });

  // Step 5: Add Decoder Nodes
  pythonCode += `\n# Step 5: Add Decoder Nodes\n`;
  Object.values(decoderNodes).forEach(({ id }) => {
    const node = mapNodes.find((n) => n.id === id);
    if (!node) return;

    const inputEdge = mapEdges.find((edge) => edge.target === id);
    if (inputEdge) {
      decoderNodes[id].inputVar = inputEdge.source;
    }

    const outputEdge = mapEdges.find((edge) => edge.source === id);
    if (outputEdge) {
      const outputNode = mapNodes.find((n) => n.id === outputEdge.target);
      if (outputNode) {
        const outputVar = outputNode.data.content;
        if (outputVar) {
          pythonCode += `model.add_node(${decoderNodes[id].inputVar}, ${outputVar}, label="${node.data.label}")  # Decoder Node\n`;
        }
      }
    }
  });

  // Step 6: Set Message Rates
  pythonCode += `\n# Step 6: Set Message Rates\n`;
  sourceMessages.forEach((msg, index) => {
    if (rateVariables[index]) {
      pythonCode += `model.set_rate(${msg}, ${rateVariables[index]})  # Rate of ${msg} is ${rateVariables[index]}\n`;
    }
  });

  pythonCode += `\n# Step 7: Generate and Display Model Graph\n`;
  pythonCode += `model.graph()\n`;

  return pythonCode;
};

const CodeBar = ({ mapNodes, mapEdges }: codeBarProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const translatedCode = codeTranslator(mapNodes, mapEdges);
    navigator.clipboard.writeText(translatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide tooltip after 2 seconds
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey",
        height: "50%",
      }}
    >
      <AppBar position="static" color="secondary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h5"
              sx={{
                fontFamily: "monospace",
              }}
            >
              Code
            </Typography>
          </Box>
          {/* Copy Button with Tooltip */}
          <Tooltip title={"Copied!"} open={copied} arrow>
            <IconButton color="inherit" onClick={handleCopy}>
              <FaCopy />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box flexGrow={1} bgcolor={"lightblue"} p={2}>      
        <Typography
            variant="body1"
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              backgroundColor: "#f5f5f5",
              padding: "1rem",
              borderRadius: "0.5rem",
              overflowX: "auto",
              border: "1px solid #e0e0e0",
            }}
            align="center"
          >Test Your Code&nbsp;
          <Link 
            href="https://mybinder.org/v2/gh/cheuktingli/psitip/master?labpath=examples/table_of_contents.ipynb"
            target="_blank"
          >
            Here
          </Link>
          &nbsp;or&nbsp; 
          <Link 
            href="https://colab.research.google.com/github/cheuktingli/psitip/blob/master/examples/table_of_contents.ipynb"
            target="_blank"
          >
            Here
          </Link>
        </Typography>   
        <Box height={"16px"} /> 
        <Typography
          variant="body1"
          component="pre"
          sx={{
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            backgroundColor: "#f5f5f5",
            padding: "1rem",
            borderRadius: "0.5rem",
            overflowX: "auto",
            border: "1px solid #e0e0e0",
          }}
        >
          {codeTranslator(mapNodes, mapEdges)}
        </Typography>
      </Box>
    </Box>
  );
};

export default CodeBar;
