"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  Handle,
  Position,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { JourneyItem, JourneyStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Split,
  Clock,
  Send,
  Brain,
  ShieldCheck,
  Target,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Save,
  RotateCcw,
  Sparkles,
  Trash2,
  Plus,
  XCircle,
  X,
} from "lucide-react";

// Custom node components for clean visual styling inside ReactFlow
function TriggerNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3.5 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[190px] transition-all ${
        selected ? "border-amber-400 ring-2 ring-amber-400/30" : "border-amber-500/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300">
          <Zap className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] uppercase font-mono font-bold text-amber-300">
          Trigger
        </span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-amber-400 border-2 border-slate-900" />
    </div>
  );
}

function ConditionNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3.5 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[190px] transition-all ${
        selected ? "border-purple-400 ring-2 ring-purple-400/30" : "border-purple-500/40"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-purple-400 border-2 border-slate-900" />
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1 rounded-lg bg-purple-500/20 text-purple-300">
          <Split className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] uppercase font-mono font-bold text-purple-300">
          Condition
        </span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label}</div>
      <Handle type="source" position={Position.Bottom} id="yes" className="w-2.5 h-2.5 bg-purple-400 border-2 border-slate-900" />
    </div>
  );
}

function DelayNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[170px] transition-all ${
        selected ? "border-blue-400 ring-2 ring-blue-400/30" : "border-blue-500/40"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-blue-400 border-2 border-slate-900" />
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1 rounded-lg bg-blue-500/20 text-blue-300">
          <Clock className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] uppercase font-mono font-bold text-blue-300">
          Delay
        </span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-blue-400 border-2 border-slate-900" />
    </div>
  );
}

function ChannelActionNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3.5 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[190px] transition-all ${
        selected ? "border-emerald-400 ring-2 ring-emerald-400/30" : "border-emerald-500/40"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900" />
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
          <Send className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] uppercase font-mono font-bold text-emerald-300">
          Channel Action
        </span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900" />
    </div>
  );
}

function AgentActionNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3.5 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[190px] transition-all ${
        selected ? "border-cyan-400 ring-2 ring-cyan-400/30" : "border-cyan-500/40"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-cyan-400 border-2 border-slate-900" />
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300">
          <Brain className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] uppercase font-mono font-bold text-cyan-300">
          AI Agent Task
        </span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-cyan-400 border-2 border-slate-900" />
    </div>
  );
}

function ApprovalNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3.5 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[190px] transition-all ${
        selected ? "border-rose-400 ring-2 ring-rose-400/30" : "border-rose-500/40"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-rose-400 border-2 border-slate-900" />
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1 rounded-lg bg-rose-500/20 text-rose-300">
          <ShieldCheck className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] uppercase font-mono font-bold text-rose-300">
          Human Approval
        </span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-rose-400 border-2 border-slate-900" />
    </div>
  );
}

function GoalNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3.5 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[190px] transition-all ${
        selected ? "border-amber-400 ring-2 ring-amber-400/30" : "border-amber-500/40"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-amber-400 border-2 border-slate-900" />
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300">
          <Target className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] uppercase font-mono font-bold text-amber-300">
          Conversion Goal
        </span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label}</div>
    </div>
  );
}

function EndNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div
      className={`p-3 rounded-2xl border bg-slate-900/90 backdrop-blur-xl shadow-xl min-w-[140px] text-center transition-all ${
        selected ? "border-slate-400 ring-2 ring-slate-400/30" : "border-slate-700"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-500 border-2 border-slate-900" />
      <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">End Journey</div>
      <div className="text-xs text-slate-300">{data.label || "Exit Point"}</div>
    </div>
  );
}

const nodeTypes = {
  triggerNode: TriggerNode,
  conditionNode: ConditionNode,
  delayNode: DelayNode,
  actionNode: ChannelActionNode,
  agentNode: AgentActionNode,
  approvalNode: ApprovalNode,
  goalNode: GoalNode,
  endNode: EndNode,
};

interface JourneyCanvasProps {
  journey: JourneyItem;
  onSaveJourney: (journey: JourneyItem) => void;
  onPublishJourney: (journey: JourneyItem) => void;
  onPauseJourney: (journey: JourneyItem) => void;
}

export function JourneyCanvas({
  journey,
  onSaveJourney,
  onPublishJourney,
  onPauseJourney,
}: JourneyCanvasProps) {
  // Initial Nodes & Edges from journey canvasData
  const initialNodes: Node[] = (journey.canvasData as any)?.nodes || [
    {
      id: "node-1",
      type: "triggerNode",
      position: { x: 250, y: 50 },
      data: { label: "Website Enquiry Form Submitted", triggerType: "WEBSITE_ENQUIRY" },
    },
    {
      id: "node-2",
      type: "actionNode",
      position: { x: 250, y: 190 },
      data: { label: "Dispatch WhatsApp Lookbook HSM", channel: "WHATSAPP" },
    },
    {
      id: "node-3",
      type: "goalNode",
      position: { x: 250, y: 330 },
      data: { label: "Goal: Creative Consultation Booked", targetMetric: "Form Submission" },
    },
  ];

  const initialEdges: Edge[] = (journey.canvasData as any)?.edges || [
    { id: "e1-2", source: "node-1", target: "node-2" },
    { id: "e2-3", source: "node-2", target: "node-3" },
  ];

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [journeyName, setJourneyName] = useState(journey.name);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [status, setStatus] = useState<JourneyStatus>(journey.status);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  // Node Drag Palette item
  const handleAddNode = (type: string, label: string) => {
    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type,
      position: { x: 250 + Math.random() * 40, y: 150 + nodes.length * 60 },
      data: { label },
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode);
  };

  const handleUpdateSelectedNodeLabel = (newLabel: string) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, label: newLabel } } : n
      )
    );
    setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null));
  };

  const handleDeleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  };

  // Validation invariant: Every journey needs a trigger and at least one goal
  const handlePublish = () => {
    setValidationError(null);

    const hasTrigger = nodes.some((n) => n.type === "triggerNode");
    const hasGoal = nodes.some((n) => n.type === "goalNode");

    if (!hasTrigger) {
      setValidationError("Validation Blocked: Every journey requires at least one Trigger event node.");
      return;
    }

    if (!hasGoal) {
      setValidationError("Validation Blocked: Every journey requires at least one Goal / Conversion node to measure success.");
      return;
    }

    const updatedJourney: JourneyItem = {
      ...journey,
      name: journeyName,
      status: "PUBLISHED",
      canvasData: { nodes, edges },
      version: journey.version + 1,
      updatedAt: new Date().toISOString(),
    };

    setStatus("PUBLISHED");
    onPublishJourney(updatedJourney);
  };

  const handlePause = () => {
    const updatedJourney: JourneyItem = {
      ...journey,
      status: "PAUSED",
      canvasData: { nodes, edges },
      updatedAt: new Date().toISOString(),
    };
    setStatus("PAUSED");
    onPauseJourney(updatedJourney);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[750px]">
      {/* Canvas Top Bar */}
      <div className="p-4 border-b border-white/10 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <Input
            value={journeyName}
            onChange={(e) => setJourneyName(e.target.value)}
            className="h-8 font-bold text-white bg-slate-900 border-white/10 text-sm max-w-xs rounded-xl"
          />
          <Badge
            className={
              status === "PUBLISHED"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs"
                : status === "PAUSED"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs"
                : "bg-slate-800 text-slate-300 text-xs"
            }
          >
            v{journey.version}.0 • {status}
          </Badge>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {status === "PUBLISHED" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePause}
              className="border-amber-500/30 text-amber-300 hover:bg-amber-950/40 text-xs h-8"
            >
              <Pause className="h-3.5 w-3.5 mr-1" />
              <span>Pause Journey</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handlePublish}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-8 px-4 shadow-md"
            >
              <Play className="h-3.5 w-3.5 mr-1" />
              <span>Validate & Publish</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onSaveJourney({
                ...journey,
                name: journeyName,
                canvasData: { nodes, edges },
              });
              alert("Journey draft saved.");
            }}
            className="border-white/15 text-xs text-slate-300 hover:bg-white/5 h-8"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            <span>Save Draft</span>
          </Button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-red-950/80 border-b border-red-500/30 text-red-300 text-xs flex items-center justify-between z-10 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Canvas Area: Left Node Palette (3 cols), Center ReactFlow, Right Inspector (3 cols) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Palette */}
        <div className="w-56 border-r border-white/10 bg-slate-950/90 p-4 space-y-3 z-10 overflow-y-auto hidden md:block">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Node Palette
          </div>
          <p className="text-[10px] text-slate-500">
            Click to add steps onto the canvas
          </p>

          <div className="space-y-1.5 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("triggerNode", "Trigger: Inbound Event")}
              className="w-full justify-start text-xs border-amber-500/30 text-amber-300 hover:bg-amber-950/40 h-8"
            >
              <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
              <span>+ Trigger Event</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("conditionNode", "Condition: Consent Opt-In?")}
              className="w-full justify-start text-xs border-purple-500/30 text-purple-300 hover:bg-purple-950/40 h-8"
            >
              <Split className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
              <span>+ Condition Branch</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("delayNode", "Delay: Wait 24 Hours")}
              className="w-full justify-start text-xs border-blue-500/30 text-blue-300 hover:bg-blue-950/40 h-8"
            >
              <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
              <span>+ Delay Wait Timer</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("actionNode", "Action: Dispatch WhatsApp HSM")}
              className="w-full justify-start text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40 h-8"
            >
              <Send className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              <span>+ Channel Action</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("agentNode", "AI Task: Content Synthesizer")}
              className="w-full justify-start text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 h-8"
            >
              <Brain className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
              <span>+ AI Agent Action</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("approvalNode", "Human Sign-Off Gate")}
              className="w-full justify-start text-xs border-rose-500/30 text-rose-300 hover:bg-rose-950/40 h-8"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-rose-400" />
              <span>+ Human Approval</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("goalNode", "Goal: Consultation Booked")}
              className="w-full justify-start text-xs border-amber-400/40 text-amber-200 hover:bg-amber-950/40 h-8"
            >
              <Target className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
              <span>+ Goal / Conversion</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddNode("endNode", "Exit Journey")}
              className="w-full justify-start text-xs border-white/10 text-slate-400 hover:text-white h-8"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              <span>+ End / Exit</span>
            </Button>
          </div>
        </div>

        {/* Center: ReactFlow Canvas */}
        <div className="flex-1 h-full bg-slate-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls className="bg-slate-900 border border-white/10 text-white fill-white" />
            <Background color="#334155" gap={20} size={1} variant={BackgroundVariant.Dots} />
          </ReactFlow>
        </div>

        {/* Right Inspector: Configure Selected Node */}
        {selectedNode && (
          <div className="w-64 border-l border-white/10 bg-slate-950/95 p-4 space-y-4 z-10 animate-in slide-in-from-right-4 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Step Inspector
              </span>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400">Step Label</label>
              <Input
                value={selectedNode.data.label || ""}
                onChange={(e) => handleUpdateSelectedNodeLabel(e.target.value)}
                className="bg-slate-900 border-white/10 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Node Type</span>
              <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-slate-300">
                {selectedNode.type}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="text-slate-300 font-semibold">Node Telemetry</div>
              <div>Connected edges: {edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length}</div>
              <div>ID: <span className="font-mono text-slate-500">{selectedNode.id}</span></div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteSelectedNode}
              className="w-full border-red-500/30 text-red-300 hover:bg-red-950/40 text-xs h-8"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1 text-red-400" />
              <span>Delete Node</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
