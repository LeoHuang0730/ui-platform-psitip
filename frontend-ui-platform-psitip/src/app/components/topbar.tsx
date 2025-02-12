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
	Link,
} from "@mui/material";

const Topbar = () => {
	return (
		<AppBar position="static" sx={{ bgcolor: "black" }}>
			<Toolbar>
				<Box sx={{ display: 'flex', flexDirection: 'column' }}>
					<Typography variant="h3">User Platform for PSITIP</Typography>
					<Typography variant="subtitle1">Test Your Code&nbsp;
						<Link 
							href="https://mybinder.org/v2/gh/cheuktingli/psitip/master?labpath=examples/table_of_contents.ipynb"
							target="_blank"
						>
							Here
						</Link>
					</Typography>
				</Box>
			</Toolbar>
		</AppBar>
	)
};

export default Topbar;