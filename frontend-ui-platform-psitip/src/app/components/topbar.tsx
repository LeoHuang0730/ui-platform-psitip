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
						<Typography 
							variant="h3"
							sx={{
                fontFamily: "monospace",
              }}
						>
							User Platform for PSITIP
						</Typography>
						<Typography 
							variant="subtitle1"
							sx={{
                fontFamily: "monospace",
              }}
						>
							PSITIP Github Repo can be found&nbsp;
							<Link 
								href="https://github.com/cheuktingli/psitip"
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