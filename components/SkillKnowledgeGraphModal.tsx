import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from './Icon';
import { useAppContext } from './AppContext';
import { UserRole } from '../types';

interface GraphNode {
  id: string;
  label: string;
  type: 'candidate' | 'credential' | 'issuer' | 'skill' | 'requisition';
  color: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  details: {
    subtitle: string;
    verifiedDate?: string;
    trustScore?: number;
    meta?: string;
  };
}

interface GraphLink {
  source: string;
  target: string;
  label?: string;
  strength?: number;
}

interface SkillKnowledgeGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate?: (candidateId: string) => void;
}

export const SkillKnowledgeGraphModal: React.FC<SkillKnowledgeGraphModalProps> = ({
  isOpen,
  onClose,
  onSelectCandidate,
}) => {
  const { profiles, credentials, credentialIssuers, requisitions } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPhysicsActive, setIsPhysicsActive] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [graphTheme, setGraphTheme] = useState<'blueprint' | 'cyber'>('cyber');
  const renderTimeRef = useRef<number>(0);

  // Generate Graph Data
  const { initialNodes, initialLinks } = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // 1. Candidate Nodes
    profiles.slice(0, 6).forEach((p, idx) => {
      const angle = (idx / 6) * Math.PI * 2;
      const radius = 220;
      nodes.push({
        id: `candidate_${p.id}`,
        label: p.name,
        type: 'candidate',
        color: '#4f46e5', // indigo
        size: 22,
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: p.headline,
          trustScore: p.verificationStatus === 'Verified & Authentic' ? 98 : 85,
          meta: `Aviation & Flight Ops • ${p.experienceYears || 5} yrs exp`
        }
      });
    });

    // 2. Issuer Nodes
    credentialIssuers.forEach((iss, idx) => {
      const angle = (idx / Math.max(1, credentialIssuers.length)) * Math.PI * 2;
      const radius = 340;
      nodes.push({
        id: `issuer_${iss.id}`,
        label: iss.orgName,
        type: 'issuer',
        color: '#059669', // emerald
        size: 20,
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: `${iss.orgType} • Accredited Authority`,
          trustScore: 98,
          meta: `Accredited No: ${iss.accreditationNumber}`
        }
      });
    });

    // 3. Credential Nodes
    credentials.slice(0, 10).forEach((cred, idx) => {
      const angle = (idx / 10) * Math.PI * 2 + 0.3;
      const radius = 140;
      nodes.push({
        id: `cred_${cred.id}`,
        label: cred.title,
        type: 'credential',
        color: '#2563eb', // blue
        size: 16,
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: `Issued by ${cred.issuingOrg}`,
          verifiedDate: cred.issueDate,
          trustScore: 99,
          meta: `ID: ${cred.credentialNumber || cred.id}`
        }
      });

      // Link credential to candidate
      const cand = profiles.find(p => p.id === cred.candidateId);
      if (cand) {
        links.push({
          source: `candidate_${cand.id}`,
          target: `cred_${cred.id}`,
          label: 'Holds Verified Credential',
          strength: 0.8
        });
      }

      // Link credential to issuer
      const issuer = credentialIssuers.find(i => i.orgName.toLowerCase().includes(cred.issuingOrg.toLowerCase()) || cred.issuingOrg.toLowerCase().includes(i.orgName.toLowerCase()));
      if (issuer) {
        links.push({
          source: `cred_${cred.id}`,
          target: `issuer_${issuer.id}`,
          label: 'Cryptographically Certified By',
          strength: 0.9
        });
      }
    });

    // 4. Skills Nodes
    const coreSkills = ['Multi-Crew Coordination', 'B737 Type Rating', 'FAA First Class Medical', 'Structural FEA', 'Avionics Bus', 'PostgreSQL Internals'];
    coreSkills.forEach((skill, idx) => {
      const angle = (idx / coreSkills.length) * Math.PI * 2 + 0.7;
      const radius = 90;
      nodes.push({
        id: `skill_${idx}`,
        label: skill,
        type: 'skill',
        color: '#d97706', // amber
        size: 14,
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: 'Verified Competency Anchor',
          meta: 'Standardized Taxonomy'
        }
      });

      // Link skill to first matching credential or candidate
      if (nodes.length > 0) {
        links.push({
          source: `skill_${idx}`,
          target: nodes[idx % Math.min(nodes.length, 6)].id,
          label: 'Competency Match'
        });
      }
    });

    // 5. Requisitions
    requisitions.slice(0, 3).forEach((req, idx) => {
      nodes.push({
        id: `req_${req.id}`,
        label: req.title,
        type: 'requisition',
        color: '#7c3aed', // purple
        size: 18,
        x: 200 + idx * 200,
        y: 480,
        vx: 0,
        vy: 0,
        details: {
          subtitle: `${req.department} • Req ${req.id}`,
          meta: `Target Headcount: ${req.openingsCount}`
        }
      });
    });

    return { initialNodes: nodes, initialLinks: links };
  }, [profiles, credentials, credentialIssuers, requisitions]);

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [links] = useState<GraphLink[]>(initialLinks);

  // Sync initial nodes if props update
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  // Consolidated High-Performance Simulation & Redraw Engine
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const mainLoop = () => {
      // 1. Physics Calculations
      if (isPhysicsActive) {
        setNodes(prevNodes => {
          const updated = prevNodes.map(node => ({ ...node }));

          // Repulsion
          for (let i = 0; i < updated.length; i++) {
            for (let j = i + 1; j < updated.length; j++) {
              const n1 = updated[i];
              const n2 = updated[j];
              const dx = n2.x - n1.x;
              const dy = n2.y - n1.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              if (dist < 260) {
                const force = (260 - dist) / dist * 0.09;
                n1.vx -= dx * force;
                n1.vy -= dy * force;
                n2.vx += dx * force;
                n2.vy += dy * force;
              }
            }
          }

          // Spring attraction along links
          links.forEach(link => {
            const sourceNode = updated.find(n => n.id === link.source);
            const targetNode = updated.find(n => n.id === link.target);
            if (sourceNode && targetNode) {
              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const targetDist = 130;
              const force = (dist - targetDist) * 0.0035;
              sourceNode.vx += dx * force;
              sourceNode.vy += dy * force;
              targetNode.vx -= dx * force;
              targetNode.vy -= dy * force;
            }
          });

          // Center gravity and damping
          updated.forEach(n => {
            const cdx = centerX - n.x;
            const cdy = centerY - n.y;
            n.vx += cdx * 0.0006;
            n.vy += cdy * 0.0006;

            n.vx *= 0.88;
            n.vy *= 0.88;
            n.x += n.vx;
            n.y += n.vy;

            // Containment
            n.x = Math.max(60, Math.min(width - 60, n.x));
            n.y = Math.max(60, Math.min(height - 60, n.y));
          });

          return updated;
        });
      }

      // Increment animation ticker
      renderTimeRef.current += 1;

      // 2. High-Fidelity Rendering
      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Theme Colors & Constants
      const isCyber = graphTheme === 'cyber';
      const bgFill = isCyber ? '#090d1a' : '#f8fafc';
      const gridColor = isCyber ? 'rgba(34, 211, 238, 0.04)' : 'rgba(99, 102, 241, 0.03)';
      const crosshairColor = isCyber ? 'rgba(34, 211, 238, 0.15)' : 'rgba(99, 102, 241, 0.1)';
      const textColor = isCyber ? '#94a3b8' : '#334155';

      // Draw background flat color
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, width, height);

      // Apply pan & zoom transformations
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);

      // Draw Coordinates Grid (Blueprint / Techy Style)
      const gridSize = 60;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      // Draw Grid Lines and Labels
      const startX = -1000;
      const endX = 2000;
      const startY = -1000;
      const endY = 2000;

      for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();

        // Print tiny coordinates labels on key intervals
        if (x % (gridSize * 4) === 0 && x >= 0 && x <= width) {
          ctx.fillStyle = isCyber ? 'rgba(34, 211, 238, 0.25)' : 'rgba(99, 102, 241, 0.2)';
          ctx.font = '8px monospace';
          ctx.fillText(`X:${x}`, x + 4, 15);
        }
      }

      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();

        if (y % (gridSize * 4) === 0 && y >= 0 && y <= height) {
          ctx.fillStyle = isCyber ? 'rgba(34, 211, 238, 0.25)' : 'rgba(99, 102, 241, 0.2)';
          ctx.font = '8px monospace';
          ctx.fillText(`Y:${y}`, 6, y - 4);
        }
      }

      // Draw Center Crosshair
      ctx.strokeStyle = crosshairColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 30, centerY);
      ctx.lineTo(centerX + 30, centerY);
      ctx.moveTo(centerX, centerY - 30);
      ctx.lineTo(centerX, centerY + 30);
      ctx.stroke();

      // Outer bounding decorative ring
      ctx.strokeStyle = isCyber ? 'rgba(34, 211, 238, 0.08)' : 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 380, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Links & Flow Packets
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (sourceNode && targetNode) {
          const isSelectedLink =
            selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);
          const isHoveredLink =
            hoveredNode && (hoveredNode.id === sourceNode.id || hoveredNode.id === targetNode.id);
          const isHighlighted = isSelectedLink || isHoveredLink;

          // Standard Connection Line
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = isHighlighted
            ? (isCyber ? '#22d3ee' : '#6366f1')
            : (isCyber ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.12)');
          ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
          ctx.stroke();

          // Flow Packets flowing from source to target
          const pulseSpeed = 0.015;
          const progress = (renderTimeRef.current * pulseSpeed) % 1;
          const pX = sourceNode.x + (targetNode.x - sourceNode.x) * progress;
          const pY = sourceNode.y + (targetNode.y - sourceNode.y) * progress;

          ctx.beginPath();
          ctx.arc(pX, pY, isHighlighted ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isHighlighted
            ? (isCyber ? '#38bdf8' : '#818cf8')
            : (isCyber ? 'rgba(34, 211, 238, 0.4)' : 'rgba(99, 102, 241, 0.3)');
          ctx.fill();

          if (isHighlighted) {
            // Flow Packet shadow glow
            ctx.shadowColor = isCyber ? '#22d3ee' : '#6366f1';
            ctx.shadowBlur = 8;
            ctx.fillStyle = isCyber ? '#ffffff' : '#4f46e5';
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          }
        }
      });

      // Draw Nodes with Layers & Glows
      nodes.forEach(node => {
        const isVisible = filterType === 'all' || node.type === filterType;
        const isSearchMatch = searchQuery === '' || node.label.toLowerCase().includes(searchQuery.toLowerCase());
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        const alpha = isVisible && isSearchMatch ? 1 : 0.15;
        ctx.globalAlpha = alpha;

        // 1. Glowing outer aura ring for selected / hovered
        if (isSelected || isHovered) {
          const auraRadius = node.size + (6 + Math.sin(renderTimeRef.current * 0.08) * 2.5);
          ctx.beginPath();
          ctx.arc(node.x, node.y, auraRadius, 0, Math.PI * 2);
          ctx.fillStyle = isCyber ? node.color + '22' : node.color + '28';
          ctx.fill();

          ctx.strokeStyle = node.color + '55';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // 2. Styled Double Concentric Circle Body
        const gradient = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, node.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, node.color);
        gradient.addColorStop(1, isCyber ? '#090d1a' : '#1e293b');

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // White/Color border
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#ffffff' : node.color;
        ctx.lineWidth = isSelected ? 3.5 : 2;
        ctx.stroke();

        // Innermost core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // 3. Entity Symbol Icon Signatures Drawn on Nodes
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let typeSymbol = '★';
        if (node.type === 'candidate') typeSymbol = '👤';
        else if (node.type === 'credential') typeSymbol = '📜';
        else if (node.type === 'issuer') typeSymbol = '🏛️';
        else if (node.type === 'skill') typeSymbol = '⚡';
        else if (node.type === 'requisition') typeSymbol = '💼';

        ctx.fillText(typeSymbol, node.x, node.y - 0.5);
        ctx.restore();

        // 4. Label & Details Texts below nodes
        ctx.shadowColor = isCyber ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 4;
        
        // Node Name text
        ctx.font = isSelected ? 'bold 12px sans-serif' : '11px sans-serif';
        ctx.fillStyle = isSelected
          ? (isCyber ? '#ffffff' : '#4f46e5')
          : (isCyber ? '#f1f5f9' : '#0f172a');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + node.size + 8);

        // Subtitle sub-text
        if (isSelected || isHovered) {
          ctx.font = '9px monospace';
          ctx.fillStyle = isCyber ? '#38bdf8' : '#4f46e5';
          ctx.fillText(node.details.subtitle.substring(0, 24) + '...', node.x, node.y + node.size + 24);
        }

        ctx.shadowBlur = 0; // reset
        ctx.globalAlpha = 1;
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(mainLoop);
    };

    animationFrameId = requestAnimationFrame(mainLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [nodes, links, selectedNode, hoveredNode, filterType, searchQuery, zoomLevel, panOffset, isPhysicsActive, graphTheme]);

  // Canvas Mouse Interactions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    // Find clicked node
    const clicked = nodes.find(node => {
      const dx = node.x - mouseX;
      const dy = node.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= node.size;
    });

    if (clicked) {
      setSelectedNode(clicked);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    const hovered = nodes.find(node => {
      const dx = node.x - mouseX;
      const dy = node.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= node.size + 4;
    });

    setHoveredNode(hovered || null);
    canvas.style.cursor = hovered ? 'pointer' : isDragging ? 'grabbing' : 'grab';
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Icon name="network" className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Graphify Talent &amp; Credential Knowledge Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Interactive Physics
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing multi-entity trust links between verified talent, issuing authorities, competency rubrics, and open requisitions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Node Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Nodes', count: nodes.length, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
              { id: 'candidate', label: 'Verified Talent', count: nodes.filter(n => n.type === 'candidate').length, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
              { id: 'credential', label: 'Credentials', count: nodes.filter(n => n.type === 'credential').length, color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
              { id: 'issuer', label: 'Authorities', count: nodes.filter(n => n.type === 'issuer').length, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
              { id: 'skill', label: 'Competencies', count: nodes.filter(n => n.type === 'skill').length, color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
              { id: 'requisition', label: 'Open Requisitions', count: nodes.filter(n => n.type === 'requisition').length, color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  filterType === f.id
                    ? 'ring-2 ring-indigo-600 shadow-xs ' + f.color
                    : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70'
                }`}
              >
                <span>{f.label}</span>
                <span className="opacity-70 text-[10px]">({f.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Canvas Controls */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search graph nodes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs w-44 focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => setIsPhysicsActive(!isPhysicsActive)}
              title={isPhysicsActive ? 'Pause simulation' : 'Resume simulation'}
              className={`p-1.5 rounded-xl border font-bold transition-colors ${
                isPhysicsActive
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-500'
              }`}
            >
              <Icon name={isPhysicsActive ? 'bolt' : 'play'} className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setZoomLevel(z => Math.min(2, z + 0.2))}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              title="Zoom In"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(z => Math.max(0.4, z - 0.2))}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              title="Zoom Out"
            >
              <Icon name="minus" className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[11px] font-bold mr-1"
            >
              Reset
            </button>

            {/* Premium Theme Switcher */}
            <button
              onClick={() => setGraphTheme(t => t === 'cyber' ? 'blueprint' : 'cyber')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                graphTheme === 'cyber'
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60 shadow-sm shadow-cyan-950/20'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
              }`}
            >
              <span>Theme: {graphTheme === 'cyber' ? '🛰️ Cyber Grid' : '📐 Blueprint'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Workspace Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-[460px] relative overflow-hidden">
          
          {/* Main Canvas */}
          <div className="lg:col-span-3 relative bg-slate-50/60 dark:bg-slate-950/60 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={820}
              height={520}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="w-full h-full block select-none"
            />

            {/* Quick Helper Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-[11px] shadow-sm space-y-1">
              <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Knowledge Nodes</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span className="text-slate-600 dark:text-slate-400">Verified Talent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-600 dark:text-slate-400">Credential</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-600 dark:text-slate-400">Authority</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-slate-600 dark:text-slate-400">Competency</span>
                </div>
              </div>
            </div>
          </div>

          {/* Node Inspector Sidebar */}
          <div className={`p-4 border-t lg:border-t-0 lg:border-l flex flex-col justify-between overflow-y-auto transition-all duration-300 ${
            graphTheme === 'cyber'
              ? 'bg-[#0b0f1d] text-slate-100 border-cyan-950/60'
              : 'bg-white text-slate-800 border-slate-100 dark:bg-slate-900 dark:border-slate-800'
          }`}>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedNode.type === 'candidate' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                    selectedNode.type === 'issuer' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    selectedNode.type === 'credential' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {selectedNode.type}
                  </span>
                  {selectedNode.details.trustScore && (
                    <span className={`text-xs font-mono font-bold ${graphTheme === 'cyber' ? 'text-cyan-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      Trust: {selectedNode.details.trustScore}%
                    </span>
                  )}
                </div>

                <div>
                  <h3 className={`text-base font-black ${graphTheme === 'cyber' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {selectedNode.label}
                  </h3>
                  <p className={`text-xs mt-0.5 ${graphTheme === 'cyber' ? 'text-cyan-200/70' : 'text-slate-500 dark:text-slate-400'}`}>
                    {selectedNode.details.subtitle}
                  </p>
                </div>

                <div className={`p-3 rounded-2xl space-y-2 text-xs transition-all ${
                  graphTheme === 'cyber'
                    ? 'bg-[#070b14] border border-cyan-950/60 text-slate-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700'
                }`}>
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${graphTheme === 'cyber' ? 'text-cyan-400/80' : 'text-slate-500'}`}>Metadata / Cert Details</div>
                  <div className="font-mono text-[11px] break-all leading-relaxed">
                    {selectedNode.details.meta}
                  </div>
                  {selectedNode.details.verifiedDate && (
                    <div className={`text-[11px] font-mono ${graphTheme === 'cyber' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Verified Date: {selectedNode.details.verifiedDate}
                    </div>
                  )}
                  {selectedNode.details.trustScore && (
                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <span>INTEGRITY VERIFICATION</span>
                        <span className="text-cyan-400 font-bold">100% SECURE</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${selectedNode.details.trustScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Action */}
                {selectedNode.type === 'candidate' && (
                  <button
                    onClick={() => {
                      const id = selectedNode.id.replace('candidate_', '');
                      if (onSelectCandidate) {
                        onSelectCandidate(id);
                        onClose();
                      }
                    }}
                    className={`w-full py-2 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      graphTheme === 'cyber'
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    <span>View Full Candidate Dossier</span>
                    <Icon name="arrowRight" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12 space-y-2">
                <Icon name="network" className={`w-8 h-8 mx-auto stroke-1 transition-all ${
                  graphTheme === 'cyber' ? 'text-cyan-800' : 'text-slate-300 dark:text-slate-600'
                }`} />
                <p className={`text-xs font-medium ${graphTheme === 'cyber' ? 'text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  Click any node on the graph canvas to inspect cryptographic trust links and verified relationships.
                </p>
              </div>
            )}

            <div className={`pt-4 border-t text-[11px] space-y-1 ${
              graphTheme === 'cyber' ? 'border-cyan-950/60 text-slate-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'
            }`}>
              <div>Network Nodes: <strong className={graphTheme === 'cyber' ? 'text-cyan-400' : 'text-slate-600 dark:text-slate-300'}>{nodes.length}</strong></div>
              <div>Certified Links: <strong className={graphTheme === 'cyber' ? 'text-cyan-400' : 'text-slate-600 dark:text-slate-300'}>{links.length}</strong></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
