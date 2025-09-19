import { useCallback } from 'react';
import dagre from '@dagrejs/dagre';
import { type Edge, type Node } from '@xyflow/react';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const useAutoLayout = () => {
  const getLayoutedElements = useCallback((nodes: Node[], edges: Edge[], options: { direction: string; nodeWidth?: number; nodeHeight?: number }) => {
    const nodeWidth = options.nodeWidth || 172;
    const nodeHeight = options.nodeHeight || 36;

    dagreGraph.setGraph({ rankdir: options.direction || 'LR' });

    nodes.forEach(node => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map(node => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }, []);

  return { getLayoutedElements };
};

export default useAutoLayout;
