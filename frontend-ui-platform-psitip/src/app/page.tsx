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
