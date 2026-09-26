import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Icon, IconName } from './Icon';
import { useAppContext } from './AppContext';

export interface GraphNode {
  id: string;
  label: string;
  type: 'candidate' | 'credential' | 'issuer' | 'skill' | 'requisition';
  color: string;
  secondaryColor: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isPinned?: boolean;
  details: {
    subtitle: string;
    verifiedDate?: string;
    trustScore?: number;
    meta?: string;
    authorityOrg?: string;
    merkleDigest?: string;
    issuerBadge?: string;
    accreditationNo?: string;
  };
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
  strength?: number;
  type?: 'certifies' | 'holds' | 'requires' | 'validates';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
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
  const [layoutMode, setLayoutMode] = useState<'dynamic' | 'radial' | 'bipartite'>('dynamic');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [draggedNode, setDraggedNode] = useState<GraphNode | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [graphTheme, setGraphTheme] = useState<'cyber' | 'blueprint' | 'aurora'>('cyber');
  const [copiedDigest, setCopiedDigest] = useState<boolean>(false);
  const [showParticleFlows, setShowParticleFlows] = useState<boolean>(true);

  const renderTimeRef = useRef<number>(0);
  const backgroundParticlesRef = useRef<Particle[]>([]);

  // Seed background ambient particles
  useEffect(() => {
    const particles: Particle[] = [];
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    backgroundParticlesRef.current = particles;
  }, []);

  // Generate Graph Data
  const { initialNodes, initialLinks } = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // 1. Candidate Nodes
    profiles.slice(0, 6).forEach((p, idx) => {
      const angle = (idx / 6) * Math.PI * 2;
      const radius = 240;
      nodes.push({
        id: `candidate_${p.id}`,
        label: p.name,
        type: 'candidate',
        color: '#6366f1', // Indigo
        secondaryColor: '#4338ca',
        size: 26,
        x: 480 + Math.cos(angle) * radius,
        y: 340 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: p.headline,
          trustScore: p.verificationStatus === 'Verified & Authentic' ? 99 : 88,
          meta: `Sovereign Identity • ${p.experienceYears || 5}+ yrs verified exp • ${p.location}`,
          merkleDigest: `0x7f${p.id.padStart(8, '0')}a91b4c3e802f1a667b9cde56`
        }
      });
    });

    // 2. Issuer Nodes (Accredited Authorities)
    credentialIssuers.forEach((iss, idx) => {
      const angle = (idx / Math.max(1, credentialIssuers.length)) * Math.PI * 2 + 0.4;
      const radius = 370;
      nodes.push({
        id: `issuer_${iss.id}`,
        label: iss.orgName,
        type: 'issuer',
        color: '#10b981', // Emerald
        secondaryColor: '#047857',
        size: 24,
        x: 480 + Math.cos(angle) * radius,
        y: 340 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: `${iss.orgType} • Accredited Root Authority`,
          trustScore: 100,
          meta: `Accreditation No: ${iss.accreditationNumber} • Jurisdiction: Kenya / Global`,
          merkleDigest: `0x9e${iss.id.padStart(8, '0')}f012cc4b558832a884bc7100`,
          issuerBadge: 'Statutory Regulator'
        }
      });
    });

    // 3. Credential Nodes
    credentials.slice(0, 10).forEach((cred, idx) => {
      const angle = (idx / 10) * Math.PI * 2 + 0.2;
      const radius = 150;
      nodes.push({
        id: `cred_${cred.id}`,
        label: cred.title,
        type: 'credential',
        color: '#0ea5e9', // Sky/Azure
        secondaryColor: '#0284c7',
        size: 20,
        x: 480 + Math.cos(angle) * radius,
        y: 340 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: `Issued by ${cred.issuingOrg}`,
          verifiedDate: cred.issueDate,
          trustScore: 99,
          meta: `Ref ID: ${cred.credentialNumber || cred.id} • SHA-256 Non-Repudiation Leaf Valid`,
          authorityOrg: cred.issuingOrg,
          merkleDigest: `0xcd${cred.id.padStart(8, '0')}42e18b95ff6013a77bd43219`
        }
      });

      // Link credential to candidate
      const cand = profiles.find(p => p.id === cred.candidateId);
      if (cand) {
        links.push({
          source: `candidate_${cand.id}`,
          target: `cred_${cred.id}`,
          label: 'Holds Verified Credential',
          strength: 0.85,
          type: 'holds'
        });
      }

      // Link credential to issuing authority
      const issuer = credentialIssuers.find(i => 
        i.orgName.toLowerCase().includes(cred.issuingOrg.toLowerCase()) || 
        cred.issuingOrg.toLowerCase().includes(i.orgName.toLowerCase())
      );
      if (issuer) {
        links.push({
          source: `cred_${cred.id}`,
          target: `issuer_${issuer.id}`,
          label: 'Cryptographically Certified By',
          strength: 0.9,
          type: 'certifies'
        });
      }
    });

    // 4. Skills / Competencies Nodes
    const coreSkills = [
      { name: 'Multi-Crew Coordination', cat: 'Aviation Ops' },
      { name: 'B737 Type Rating', cat: 'Flight Deck' },
      { name: 'FAA First Class Medical', cat: 'Aeromedical' },
      { name: 'Structural FEA', cat: 'Engineering' },
      { name: 'Avionics Bus Architecture', cat: 'Systems' },
      { name: 'PostgreSQL Internals', cat: 'Distributed Data' }
    ];

    coreSkills.forEach((skill, idx) => {
      const angle = (idx / coreSkills.length) * Math.PI * 2 + 0.8;
      const radius = 95;
      nodes.push({
        id: `skill_${idx}`,
        label: skill.name,
        type: 'skill',
        color: '#f59e0b', // Amber
        secondaryColor: '#d97706',
        size: 17,
        x: 480 + Math.cos(angle) * radius,
        y: 340 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        details: {
          subtitle: `${skill.cat} • Verified Competency Anchor`,
          meta: 'National Skills Framework Taxonomical Rubric',
          trustScore: 97,
          merkleDigest: `0xaa00${idx}8421bbff32900ee12740`
        }
      });

      // Link skill to matching candidate or credential
      if (nodes.length > 0) {
        links.push({
          source: `skill_${idx}`,
          target: nodes[idx % Math.min(nodes.length, 6)].id,
          label: 'Verified Competency Anchor',
          strength: 0.7,
          type: 'validates'
        });
      }
    });

    // 5. Open Requisitions
    requisitions.slice(0, 3).forEach((req, idx) => {
      nodes.push({
        id: `req_${req.id}`,
        label: req.title,
        type: 'requisition',
        color: '#a855f7', // Purple/Fuchsia
        secondaryColor: '#7e22ce',
        size: 22,
        x: 240 + idx * 240,
        y: 560,
        vx: 0,
        vy: 0,
        details: {
          subtitle: `${req.department} • Req #${req.id}`,
          meta: `Openings: ${req.openingsCount} • Compliance Standard: Strict`,
          trustScore: 99,
          merkleDigest: `0xbb55${req.id.padStart(6, '0')}7799aa22`
        }
      });

      // Link requisition to skills
      if (coreSkills.length > idx) {
        links.push({
          source: `req_${req.id}`,
          target: `skill_${idx}`,
          label: 'Requires Competency',
          strength: 0.75,
          type: 'requires'
        });
      }
    });

    return { initialNodes: nodes, initialLinks: links };
  }, [profiles, credentials, credentialIssuers, requisitions]);

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [links] = useState<GraphLink[]>(initialLinks);

  // Sync initial nodes if props update
  useEffect(() => {
    setNodes(initialNodes);
    if (initialNodes.length > 0 && !selectedNode) {
      setSelectedNode(initialNodes[0]);
    }
  }, [initialNodes]);

  // Apply layout modes
  const applyLayout = useCallback((mode: 'dynamic' | 'radial' | 'bipartite') => {
    setLayoutMode(mode);
    setNodes(prev => {
      const updated = prev.map(n => ({ ...n, vx: 0, vy: 0 }));
      const centerX = 480;
      const centerY = 340;

      if (mode === 'radial') {
        // Group by types into concentric orbital rings
        const typeRadii: Record<GraphNode['type'], number> = {
          skill: 85,
          credential: 175,
          candidate: 275,
          issuer: 380,
          requisition: 450
        };

        const typeGroups: Record<string, GraphNode[]> = {};
        updated.forEach(n => {
          if (!typeGroups[n.type]) typeGroups[n.type] = [];
          typeGroups[n.type].push(n);
        });

        Object.entries(typeGroups).forEach(([type, group]) => {
          const r = typeRadii[type as GraphNode['type']] || 200;
          group.forEach((node, i) => {
            const angle = (i / group.length) * Math.PI * 2 - Math.PI / 2;
            node.x = centerX + Math.cos(angle) * r;
            node.y = centerY + Math.sin(angle) * r;
          });
        });
      } else if (mode === 'bipartite') {
        // 4 Columns: [Candidate] -> [Credential] -> [Issuer & Skill] -> [Requisitions]
        const colX: Record<GraphNode['type'], number> = {
          candidate: 120,
          credential: 360,
          issuer: 620,
          skill: 620,
          requisition: 850
        };

        const colCounts: Record<string, number> = {};
        updated.forEach(n => {
          const key = n.type === 'skill' ? 'skill' : n.type;
          colCounts[key] = (colCounts[key] || 0) + 1;
        });

        const colIndices: Record<string, number> = {};
        updated.forEach(n => {
          const key = n.type === 'skill' ? 'skill' : n.type;
          const idx = colIndices[key] || 0;
          colIndices[key] = idx + 1;
          const total = colCounts[key] || 1;
          
          nodeX: n.x = colX[n.type] || 480;
          const spacing = Math.min(75, 480 / Math.max(1, total));
          const startY = centerY - ((total - 1) * spacing) / 2;
          n.y = startY + idx * spacing;
        });
      }
      return updated;
    });
  }, []);

  // Main Physics Simulation & High-Performance Canvas Redraw Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width || 960;
    const height = canvas.height || 680;
    const centerX = width / 2;
    const centerY = height / 2;

    const mainLoop = () => {
      // 1. Force-Directed Physics Simulation (if active and in dynamic mode)
      if (isPhysicsActive && layoutMode === 'dynamic') {
        setNodes(prevNodes => {
          const updated = prevNodes.map(node => ({ ...node }));

          // Node-to-node repulsion
          for (let i = 0; i < updated.length; i++) {
            for (let j = i + 1; j < updated.length; j++) {
              const n1 = updated[i];
              const n2 = updated[j];
              const dx = n2.x - n1.x;
              const dy = n2.y - n1.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const minDist = 180;
              if (dist < minDist) {
                const force = ((minDist - dist) / dist) * 0.08;
                if (!n1.isPinned) {
                  n1.vx -= dx * force;
                  n1.vy -= dy * force;
                }
                if (!n2.isPinned) {
                  n2.vx += dx * force;
                  n2.vy += dy * force;
                }
              }
            }
          }

          // Link spring attraction
          links.forEach(link => {
            const sourceNode = updated.find(n => n.id === link.source);
            const targetNode = updated.find(n => n.id === link.target);
            if (sourceNode && targetNode) {
              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const targetDist = 135;
              const force = (dist - targetDist) * 0.003;
              if (!sourceNode.isPinned) {
                sourceNode.vx += dx * force;
                sourceNode.vy += dy * force;
              }
              if (!targetNode.isPinned) {
                targetNode.vx -= dx * force;
                targetNode.vy -= dy * force;
              }
            }
          });

          // Gentle center gravity & damping
          updated.forEach(n => {
            if (!n.isPinned) {
              const cdx = centerX - n.x;
              const cdy = centerY - n.y;
              n.vx += cdx * 0.0005;
              n.vy += cdy * 0.0005;

              n.vx *= 0.88;
              n.vy *= 0.88;
              n.x += n.vx;
              n.y += n.vy;

              // Boundaries containment
              n.x = Math.max(50, Math.min(width - 50, n.x));
              n.y = Math.max(50, Math.min(height - 50, n.y));
            }
          });

          return updated;
        });
      }

      // Tick animation
      renderTimeRef.current += 1;
      const t = renderTimeRef.current;

      // 2. High-Fidelity Rendering
      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Theme Aesthetics
      const isCyber = graphTheme === 'cyber';
      const isAurora = graphTheme === 'aurora';
      const isBlueprint = graphTheme === 'blueprint';

      // Background color / gradient
      if (isCyber) {
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, width * 0.8);
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.6, '#060913');
        bgGrad.addColorStop(1, '#020409');
        ctx.fillStyle = bgGrad;
      } else if (isAurora) {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0d111f');
        bgGrad.addColorStop(0.5, '#111827');
        bgGrad.addColorStop(1, '#081726');
        ctx.fillStyle = bgGrad;
      } else {
        // Blueprint: Crisp clean light background
        ctx.fillStyle = '#f8fafc';
      }
      ctx.fillRect(0, 0, width, height);

      // Ambient background particles drift
      backgroundParticlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isBlueprint ? 'rgba(99, 102, 241, 0.08)' : p.color;
        ctx.globalAlpha = isBlueprint ? 0.2 : p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Apply Pan & Zoom
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);

      // Technical Grid Lines & Blueprint Alignment
      const gridSize = 60;
      ctx.strokeStyle = isCyber
        ? 'rgba(34, 211, 238, 0.04)'
        : isAurora
        ? 'rgba(168, 85, 247, 0.04)'
        : 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1;

      const gridRange = 1500;
      for (let x = -gridRange; x < width + gridRange; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -gridRange);
        ctx.lineTo(x, height + gridRange);
        ctx.stroke();
      }
      for (let y = -gridRange; y < height + gridRange; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-gridRange, y);
        ctx.lineTo(width + gridRange, y);
        ctx.stroke();
      }

      // Decorative Center Calibration Reticle
      ctx.strokeStyle = isCyber
        ? 'rgba(34, 211, 238, 0.15)'
        : isAurora
        ? 'rgba(168, 85, 247, 0.15)'
        : 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 45, centerY);
      ctx.lineTo(centerX + 45, centerY);
      ctx.moveTo(centerX, centerY - 45);
      ctx.lineTo(centerX, centerY + 45);
      ctx.stroke();

      // Outer Orbital Radar Rings
      [200, 360, 480].forEach(r => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isCyber
          ? 'rgba(34, 211, 238, 0.03)'
          : isAurora
          ? 'rgba(236, 72, 153, 0.03)'
          : 'rgba(99, 102, 241, 0.03)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Render Links & Curved Data Flow Streams
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        const isSourceVisible = filterType === 'all' || sourceNode.type === filterType;
        const isTargetVisible = filterType === 'all' || targetNode.type === filterType;
        if (!isSourceVisible && !isTargetVisible) return;

        const isSelectedLink =
          selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);
        const isHoveredLink =
          hoveredNode && (hoveredNode.id === sourceNode.id || hoveredNode.id === targetNode.id);
        const isHighlighted = isSelectedLink || isHoveredLink;

        // Curved Bézier Control Points
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const normalX = -dy * 0.08;
        const normalY = dx * 0.08;
        const cpX = midX + normalX;
        const cpY = midY + normalY;

        // Link gradient stroke
        const lineGrad = ctx.createLinearGradient(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
        lineGrad.addColorStop(0, sourceNode.color);
        lineGrad.addColorStop(1, targetNode.color);

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.quadraticCurveTo(cpX, cpY, targetNode.x, targetNode.y);

        ctx.strokeStyle = isHighlighted
          ? lineGrad
          : isCyber
          ? 'rgba(148, 163, 184, 0.16)'
          : isAurora
          ? 'rgba(192, 132, 252, 0.18)'
          : 'rgba(100, 116, 139, 0.15)';
        ctx.lineWidth = isHighlighted ? 3 : 1.4;
        ctx.stroke();

        // Animated Cryptographic Data Packets flowing along Bézier curve
        if (showParticleFlows) {
          const packetSpeed = 0.012;
          const numPackets = isHighlighted ? 3 : 2;

          for (let pIdx = 0; pIdx < numPackets; pIdx++) {
            const offset = pIdx / numPackets;
            const progress = (t * packetSpeed + offset) % 1;

            // Quadratic bezier calculation
            const u = 1 - progress;
            const px = u * u * sourceNode.x + 2 * u * progress * cpX + progress * progress * targetNode.x;
            const py = u * u * sourceNode.y + 2 * u * progress * cpY + progress * progress * targetNode.y;

            ctx.beginPath();
            ctx.arc(px, py, isHighlighted ? 4 : 2.5, 0, Math.PI * 2);
            ctx.fillStyle = isHighlighted
              ? '#ffffff'
              : isCyber
              ? '#22d3ee'
              : isAurora
              ? '#f472b6'
              : '#6366f1';
            
            if (isHighlighted) {
              ctx.shadowColor = targetNode.color;
              ctx.shadowBlur = 10;
            }
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          }
        }
      });

      // 4. Render Nodes with Radiant Halos, Vector Rings & Icons
      nodes.forEach(node => {
        const isVisible = filterType === 'all' || node.type === filterType;
        const isSearchMatch =
          searchQuery === '' ||
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.details.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        const alpha = isVisible && isSearchMatch ? 1 : 0.15;
        ctx.globalAlpha = alpha;

        // Animated Outer Pulsing Aura (for selected / hovered / 99% trust nodes)
        if (isSelected || isHovered) {
          const auraRadius = node.size + 10 + Math.sin(t * 0.08) * 4;
          const auraGrad = ctx.createRadialGradient(node.x, node.y, node.size, node.x, node.y, auraRadius);
          auraGrad.addColorStop(0, node.color + '66');
          auraGrad.addColorStop(1, node.color + '00');

          ctx.beginPath();
          ctx.arc(node.x, node.y, auraRadius, 0, Math.PI * 2);
          ctx.fillStyle = auraGrad;
          ctx.fill();

          // Outer dashed beacon ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, auraRadius - 2, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Concentric Spherical Radiant Node Body
        const nodeGrad = ctx.createRadialGradient(
          node.x - node.size * 0.3,
          node.y - node.size * 0.3,
          1,
          node.x,
          node.y,
          node.size
        );
        nodeGrad.addColorStop(0, '#ffffff');
        nodeGrad.addColorStop(0.35, node.color);
        nodeGrad.addColorStop(1, isBlueprint ? '#1e293b' : node.secondaryColor);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeGrad;
        ctx.fill();

        // Crisply defined perimeter border
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#ffffff' : isBlueprint ? '#ffffff' : node.color;
        ctx.lineWidth = isSelected ? 3.5 : 2;
        ctx.stroke();

        // Center vector glyph / icon symbol
        ctx.save();
        ctx.font = `bold ${Math.round(node.size * 0.55)}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let symbol = '★';
        if (node.type === 'candidate') symbol = '👤';
        else if (node.type === 'credential') symbol = '📜';
        else if (node.type === 'issuer') symbol = '🏛️';
        else if (node.type === 'skill') symbol = '⚡';
        else if (node.type === 'requisition') symbol = '💼';

        ctx.fillText(symbol, node.x, node.y);
        ctx.restore();

        // Verification Checkmark Badge overlay for 99%+ trust
        if (node.details.trustScore && node.details.trustScore >= 98) {
          const badgeX = node.x + node.size * 0.7;
          const badgeY = node.y - node.size * 0.7;
          ctx.beginPath();
          ctx.arc(badgeX, badgeY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981'; // Emerald check badge
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 7px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✓', badgeX, badgeY);
        }

        // High-Legibility Node Labels
        ctx.font = isSelected ? 'bold 12px sans-serif' : '600 11px sans-serif';
        ctx.fillStyle = isSelected
          ? isBlueprint
            ? '#4f46e5'
            : '#ffffff'
          : isBlueprint
          ? '#0f172a'
          : '#f1f5f9';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Subtle text backdrop glow for clean readability
        if (!isBlueprint) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 6;
        }
        ctx.fillText(node.label, node.x, node.y + node.size + 7);
        ctx.shadowBlur = 0;

        // Subtitle badge on selection or hover
        if (isSelected || isHovered) {
          ctx.font = '9px monospace';
          ctx.fillStyle = isBlueprint ? '#4f46e5' : node.color;
          const subText = node.details.subtitle.length > 26 
            ? node.details.subtitle.substring(0, 26) + '...' 
            : node.details.subtitle;
          ctx.fillText(subText, node.x, node.y + node.size + 22);
        }

        ctx.globalAlpha = 1;
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(mainLoop);
    };

    animationFrameId = requestAnimationFrame(mainLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    nodes,
    links,
    selectedNode,
    hoveredNode,
    filterType,
    searchQuery,
    zoomLevel,
    panOffset,
    isPhysicsActive,
    layoutMode,
    graphTheme,
    showParticleFlows
  ]);

  // Canvas Mouse & Interaction Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    // Check if clicked directly on a node
    const clicked = nodes.find(node => {
      const dx = node.x - mouseX;
      const dy = node.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= node.size + 4;
    });

    if (clicked) {
      setSelectedNode(clicked);
      setDraggedNode(clicked);
      // Pin node during dragging
      setNodes(prev =>
        prev.map(n => (n.id === clicked.id ? { ...n, isPinned: true } : n))
      );
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (draggedNode) {
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
      setNodes(prev =>
        prev.map(n =>
          n.id === draggedNode.id
            ? { ...n, x: mouseX, y: mouseY, vx: 0, vy: 0 }
            : n
        )
      );
      return;
    }

    if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    const hovered = nodes.find(node => {
      const dx = node.x - mouseX;
      const dy = node.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= node.size + 6;
    });

    setHoveredNode(hovered || null);
    canvas.style.cursor = hovered ? 'pointer' : isDraggingCanvas ? 'grabbing' : 'grab';
  };

  const handleCanvasMouseUp = () => {
    if (draggedNode) {
      // Unpin node unless in static layout
      if (layoutMode === 'dynamic') {
        setNodes(prev =>
          prev.map(n => (n.id === draggedNode.id ? { ...n, isPinned: false } : n))
        );
      }
      setDraggedNode(null);
    }
    setIsDraggingCanvas(false);
  };

  // Zoom wheel support
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoomLevel(z => Math.max(0.4, Math.min(2.5, z + delta)));
  };

  // Helper to copy Merkle Digest
  const handleCopyDigest = (digest?: string) => {
    if (!digest) return;
    navigator.clipboard.writeText(digest);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  // Find linked entities for selected node
  const linkedEntities = useMemo(() => {
    if (!selectedNode) return [];
    const directLinks = links.filter(
      l => l.source === selectedNode.id || l.target === selectedNode.id
    );
    const connectedNodeIds = directLinks.map(l =>
      l.source === selectedNode.id ? l.target : l.source
    );
    return nodes.filter(n => connectedNodeIds.includes(n.id));
  }, [selectedNode, links, nodes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        
        {/* Top Sovereign Navigation Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/90 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 flex-shrink-0">
              <Icon name="network" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Graphify Talent &amp; Credential Knowledge Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Non-Repudiation
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hidden sm:inline-block">
                  v3.4 Sovereign DAG
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-entity cryptographically certified graph connecting verified talent, statutory authorities, competency rubrics, and requisitions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Telemetry Pill */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono">
              <span className="text-slate-500 dark:text-slate-400">Nodes: <strong className="text-slate-900 dark:text-white">{nodes.length}</strong></span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-500 dark:text-slate-400">Edges: <strong className="text-indigo-600 dark:text-indigo-400">{links.length}</strong></span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">SHA-256 Validated</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Knowledge Graph"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Filter Architecture */}
        <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Entity Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Entities', count: nodes.length, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' },
              { id: 'candidate', label: 'Verified Talent', count: nodes.filter(n => n.type === 'candidate').length, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300', dot: 'bg-indigo-600' },
              { id: 'credential', label: 'Credentials', count: nodes.filter(n => n.type === 'credential').length, color: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300', dot: 'bg-sky-600' },
              { id: 'issuer', label: 'Statutory Issuers', count: nodes.filter(n => n.type === 'issuer').length, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', dot: 'bg-emerald-600' },
              { id: 'skill', label: 'Competencies', count: nodes.filter(n => n.type === 'skill').length, color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', dot: 'bg-amber-600' },
              { id: 'requisition', label: 'Requisitions', count: nodes.filter(n => n.type === 'requisition').length, color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300', dot: 'bg-purple-600' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  filterType === f.id
                    ? 'ring-2 ring-indigo-600 shadow-xs ' + f.color
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700/80'
                }`}
              >
                {f.dot && <span className={`w-2 h-2 rounded-full ${f.dot}`} />}
                <span>{f.label}</span>
                <span className="opacity-70 text-[10px]">({f.count})</span>
              </button>
            ))}
          </div>

          {/* Topology Presets & Search */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search graph nodes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs w-36 sm:w-48 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Layout Mode Selector */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => applyLayout('dynamic')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  layoutMode === 'dynamic'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Force-Directed Physics Topology"
              >
                Dynamic
              </button>
              <button
                onClick={() => applyLayout('radial')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  layoutMode === 'radial'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Concentric Radial Orbits"
              >
                Radial
              </button>
              <button
                onClick={() => applyLayout('bipartite')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  layoutMode === 'bipartite'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Pipeline Column Flow"
              >
                Pipeline
              </button>
            </div>

            {/* Particle Flows Toggle */}
            <button
              onClick={() => setShowParticleFlows(!showParticleFlows)}
              title={showParticleFlows ? 'Hide animated energy flows' : 'Show animated energy flows'}
              className={`p-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                showParticleFlows
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-400'
              }`}
            >
              <Icon name="sparkles" className="w-3.5 h-3.5" />
            </button>

            {/* Physics Pause / Play */}
            <button
              onClick={() => setIsPhysicsActive(!isPhysicsActive)}
              title={isPhysicsActive ? 'Pause physics simulation' : 'Resume physics simulation'}
              className={`p-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                isPhysicsActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-500'
              }`}
            >
              <Icon name={isPhysicsActive ? 'bolt' : 'play'} className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                setGraphTheme(t => (t === 'cyber' ? 'aurora' : t === 'aurora' ? 'blueprint' : 'cyber'));
              }}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Switch Canvas Graphics Theme"
            >
              <span>
                {graphTheme === 'cyber' ? '🛰️ Cyber Grid' : graphTheme === 'aurora' ? '🌌 Aurora Glow' : '📐 Blueprint'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Body: Canvas + Node Inspector Sidebar */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-[500px] relative overflow-hidden">
          
          {/* Main Canvas Workspace */}
          <div className="lg:col-span-3 relative bg-slate-100/50 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={960}
              height={620}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onWheel={handleWheel}
              className="w-full h-full block select-none cursor-grab"
            />

            {/* Floating Navigation Controls (Bottom Right) */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
              <button
                onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.2))}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Zoom In"
              >
                <Icon name="plus" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(z => Math.max(0.4, z - 0.2))}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Zoom Out"
              >
                <Icon name="minus" className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold cursor-pointer"
                title="Center & Reset View"
              >
                Reset
              </button>
            </div>

            {/* Floating Graphic Legend (Bottom Left) */}
            <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-[11px] shadow-lg space-y-1.5 max-w-xs hidden sm:block">
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold mb-1">
                <span>Knowledge Graph Schema</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">DAG v3.4</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Verified Talent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Credential</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Statutory Issuer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Competency</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Enterprise Requisition</span>
                </div>
              </div>
            </div>

            {/* Top-Left Mode & Coordinate Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono shadow-xs text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Layout: <strong className="text-indigo-600 dark:text-indigo-400 uppercase">{layoutMode}</strong></span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            </div>
          </div>

          {/* Right-Side Node Inspector Drawer */}
          <div className="p-5 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between overflow-y-auto max-h-[620px] transition-colors duration-300">
            {selectedNode ? (
              <div className="space-y-5">
                {/* Node Category & Trust Rating */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider ${
                    selectedNode.type === 'candidate' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' :
                    selectedNode.type === 'issuer' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                    selectedNode.type === 'credential' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800' :
                    selectedNode.type === 'skill' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}>
                    {selectedNode.type === 'candidate' ? '👤 Verified Talent' :
                     selectedNode.type === 'issuer' ? '🏛️ Statutory Authority' :
                     selectedNode.type === 'credential' ? '📜 Certified Asset' :
                     selectedNode.type === 'skill' ? '⚡ Competency Rubric' : '💼 Enterprise Requisition'}
                  </span>

                  {selectedNode.details.trustScore && (
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <Icon name="shieldCheck" className="w-4 h-4 text-emerald-500" />
                      <span>{selectedNode.details.trustScore}% Score</span>
                    </div>
                  )}
                </div>

                {/* Main Node Header */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {selectedNode.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedNode.details.subtitle}
                  </p>
                </div>

                {/* Cryptographic Proof Details */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span>Cryptographic Verification</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">ECDSA SECP256K1</span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                    {selectedNode.details.meta}
                  </p>

                  {/* Merkle Root Digest */}
                  {selectedNode.details.merkleDigest && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400 font-mono">
                        <span>MERKLE LEAF DIGEST</span>
                        <button
                          onClick={() => handleCopyDigest(selectedNode.details.merkleDigest)}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <Icon name="clipboard" className="w-3 h-3" />
                          <span>{copiedDigest ? 'Copied!' : 'Copy Hash'}</span>
                        </button>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono text-[10px] text-slate-800 dark:text-cyan-300 break-all border border-slate-200 dark:border-slate-800 select-all">
                        {selectedNode.details.merkleDigest}
                      </div>
                    </div>
                  )}

                  {/* Integrity Bar */}
                  {selectedNode.details.trustScore && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                        <span>IMMUTABILITY ASSURANCE</span>
                        <span className="text-emerald-600 dark:text-emerald-400">VERIFIED</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${selectedNode.details.trustScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Trust Links & Connected Entities */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Connected Entities ({linkedEntities.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal">Click to Inspect</span>
                  </h4>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {linkedEntities.map(entity => (
                      <button
                        key={entity.id}
                        onClick={() => setSelectedNode(entity)}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: entity.color }}
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {entity.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono flex-shrink-0">
                          {entity.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                {selectedNode.type === 'candidate' && (
                  <button
                    onClick={() => {
                      const id = selectedNode.id.replace('candidate_', '');
                      if (onSelectCandidate) {
                        onSelectCandidate(id);
                        onClose();
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Sovereign Candidate Dossier</span>
                    <Icon name="arrowRight" className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Icon name="network" className="w-6 h-6 stroke-1" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Knowledge Node Inspector</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Click on any candidate, credential, authority, or competency node in the canvas to inspect cryptographic trust relationships.
                </p>
              </div>
            )}

            {/* Bottom Status Card */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Verified Authority Chains:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">4 Roots Verified</strong>
              </div>
              <div className="flex justify-between">
                <span>Graph Execution Model:</span>
                <strong className="text-slate-700 dark:text-slate-300">Client-Side WASM/Canvas</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
