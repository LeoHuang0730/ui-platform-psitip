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

const Topbar = () => {
	return (
		<AppBar position="static" sx={{ bgcolor: "black" }}>
			<Toolbar>
				<Typography variant="h5">User Platform for PSITIP</Typography>
			</Toolbar>
		</AppBar>
	)
};

export default Topbar;