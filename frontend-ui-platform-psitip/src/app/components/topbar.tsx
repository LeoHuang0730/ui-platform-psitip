"use client";
import React, { } from "react";
import {
  Box,
  Typography,
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