import Image from "next/image";
import styles from "./page.module.css";
import {
  Box,
  Typography,
} from "@mui/material";

export default function Home() {
  return (
    <Box className={styles.page}>
      <Box className={styles.main}>
        <Typography variant="h1">
          UI Platform for PSITIP 
        </Typography>
      </Box>
    </Box>
  );
}

/*

interface mapObject{
  objectId: string;
  type: string;
  label: string;
  content: string;
  connectedBy: mapObject[];
  connectedTo: mapObject[];
}

function generateCode(mapObjects) {
  const nodes = mapObjects.filter(obj => obj.type !== 'Connection');
  const edges = mapObjects.filter(obj => obj.type === 'Connection');

  let code = '';

  nodes.forEach(node => {
    switch (node.type) {
      case 'Encoder':
        code += model.add_node(${node.content}, label="${node.label}");\n;
        break;
      case 'Decoder':
        code += model.add_node(${node.content}, label="${node.label}");\n;
        break;
      // Add more cases as needed
    }
  });

  edges.forEach(edge => {
    const fromNode = nodes.find(node => node.objectId === edge.connectedBy[0].objectId);
    const toNode = nodes.find(node => node.objectId === edge.connectedTo[0].objectId);
    if (fromNode && toNode) {
      code += model.add_edge(${fromNode.content}, ${toNode.content});\n;
    }
  });

  return code;
}

// Example usage
const mapObjects = [
  // Populate with your mapObject instances
];

const generatedCode = generateCode(mapObjects);
console.log(generatedCode);

*/
