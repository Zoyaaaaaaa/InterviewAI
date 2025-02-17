"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  ConnectionLineType,
  Controls,
  Edge,
  MiniMap,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Developer Career" },
    position: { x: 0, y: 0 },
    style: { backgroundColor: "#6366f1", color: "white" },
  },
  {
    id: "2",
    data: { label: "Frontend" },
    position: { x: -200, y: 100 },
    style: { backgroundColor: "#10b981", color: "white" },
  },
  {
    id: "3",
    data: { label: "Backend" },
    position: { x: 200, y: 100 },
    style: { backgroundColor: "#f59e0b", color: "white" },
  },
  {
    id: "4",
    data: { label: "Full Stack" },
    position: { x: 0, y: 200 },
    style: { backgroundColor: "#ef4444", color: "white" },
  },
  {
    id: "5",
    data: { label: "UI/UX" },
    position: { x: -300, y: 200 },
    style: { backgroundColor: "#8b5cf6", color: "white" },
  },
  {
    id: "6",
    data: { label: "DevOps" },
    position: { x: 300, y: 200 },
    style: { backgroundColor: "#14b8a6", color: "white" },
  },
  {
    id: "7",
    data: { label: "Mobile Dev" },
    position: { x: -100, y: 300 },
    style: { backgroundColor: "#f43f5e", color: "white" },
  },
  {
    id: "8",
    data: { label: "AI/ML" },
    position: { x: 100, y: 300 },
    style: { backgroundColor: "#0ea5e9", color: "white" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    label: "Specializes in",
    animated: true,
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    label: "Specializes in",
    animated: true,
  },
  { id: "e1-4", source: "1", target: "4", label: "Combines", animated: true },
  { id: "e2-5", source: "2", target: "5", label: "Focuses on" },
  { id: "e3-6", source: "3", target: "6", label: "Integrates with" },
  { id: "e4-7", source: "4", target: "7", label: "Expands to" },
  { id: "e4-8", source: "4", target: "8", label: "Incorporates" },
];

export function MindmapBox({
  nodes: generatedNodes,
  edges: generatedEdges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(generatedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(generatedEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "450px" }} className="">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
