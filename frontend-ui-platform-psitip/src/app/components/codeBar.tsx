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

const CodeBar = () => {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", bgcolor: "grey", height: "50%" }}>
			<AppBar position="static">
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography variant="h5">Code</Typography>
				</Toolbar>
			</AppBar>
			<Box flexGrow={1} bgcolor={"lightblue"}>
				<Typography variant="body1">Code Here</Typography>
			</Box>
		</Box>
	);
};

export default CodeBar;