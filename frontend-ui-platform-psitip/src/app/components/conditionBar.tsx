"use client";
import React, { } from "react";
import {
  Box,
  Typography,
  Input,
	AppBar,
  Toolbar,
} from "@mui/material";
import "@xyflow/react/dist/style.css";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface SidebarRightProps {
	additionalConditions: string[];
	setAdditionalConditions: React.Dispatch<React.SetStateAction<string[]>>;
}

const ConditionBar = ({additionalConditions, setAdditionalConditions} : SidebarRightProps) => {
	return (
		<Box display={"flex"} flexDirection={"column"} height={"50%"}>
			<AppBar position="static">
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography 
						variant="h5"
						sx={{
							fontFamily: "monospace",
						}}
					>
						Conditions
					</Typography>
					<FaPlus
						style={{
							cursor: "pointer",
							fontSize: "24px",
							margin: "8px",
						}}
						onClick={() => {
							setAdditionalConditions([...additionalConditions, ""]);
						}}
					/>
				</Toolbar>
			</AppBar>
			<Box flexGrow={1} bgcolor={"lightblue"}>
				{additionalConditions.map((condition, index) => (
					<Box
						key={index}
						margin={"8px"}
						sx={{ display: "flex", alignItems: "center" }}
					>
						<Input
							placeholder="Condition"
							value={condition}
							onChange={(e) => {
								const newConditions = [...additionalConditions];
								newConditions[index] = e.target.value;
								setAdditionalConditions(newConditions);
							}}
							sx={{ 
								flex: 1, 
								fontFamily: "monospace", 
							}}
						/>
						<MdDelete
							style={{ cursor: "pointer", margin: "8px" }}
							onClick={() => {
								const newConditions = [...additionalConditions];
								newConditions.splice(index, 1);
								setAdditionalConditions(newConditions);
							}}
						/>
					</Box>
				))}
			</Box>
		</Box>
	)
};

export default ConditionBar