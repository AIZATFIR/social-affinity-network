import cytoscape from 'cytoscape';
import { TIER_CONFIG } from './types.js';

function getEmojiSvgDataUrl(emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="55%" dominant-baseline="central" text-anchor="middle" font-size="52">${emoji}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const TIER_RADII = {
  lovers: 130,
  close_friends: 240,
  family: 350,
  friends: 470,
  acquaintances: 600
};

export function createGraphManager(containerEl, onSelectNode) {
  let cy = null;

  function init(contacts) {
    const elements = [
      {
        data: {
          id: 'me',
          name: 'YOU (Me)',
          color: '#ffd700',
          avatar: '👑',
          bgImage: getEmojiSvgDataUrl('👑'),
          isMe: true
        },
        position: { x: 0, y: 0 }
      }
    ];

    // Group contacts by tier to distribute evenly on concentric rings
    const tierGroups = {
      lovers: [],
      close_friends: [],
      family: [],
      friends: [],
      acquaintances: []
    };

    contacts.forEach(c => {
      const t = c.tier || 'acquaintances';
      if (!tierGroups[t]) tierGroups[t] = [];
      tierGroups[t].push(c);
    });

    Object.keys(tierGroups).forEach(tierKey => {
      const group = tierGroups[tierKey];
      const radius = TIER_RADII[tierKey] || 500;
      const count = group.length;

      group.forEach((c, index) => {
        // Distribute angle evenly around concentric circle
        const angle = (2 * Math.PI * index) / (count || 1) - (Math.PI / 2);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const tierColor = TIER_CONFIG[c.tier]?.color || '#ffffff';
        const avatarIcon = c.avatar || '🍎';

        elements.push({
          data: {
            id: c.id,
            name: c.name,
            color: tierColor,
            tier: c.tier,
            avatar: avatarIcon,
            bgImage: getEmojiSvgDataUrl(avatarIcon),
            contact: c
          },
          position: { x, y }
        });

        elements.push({
          data: {
            source: 'me',
            target: c.id,
            color: tierColor
          }
        });
      });
    });

    if (cy) {
      cy.destroy();
    }

    cy = cytoscape({
      container: containerEl,
      elements: elements,
      style: [
        /* Dunbar Orbital Concentric Circle Styling */
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'background-image': 'data(bgImage)',
            'background-fit': 'cover',
            'background-clip': 'node',
            'label': 'data(name)',
            'color': '#f8fafc',
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'font-size': '13px',
            'font-weight': '700',
            'text-valign': 'bottom',
            'text-margin-y': 8,
            'width': 58,
            'height': 58,
            'border-width': 4,
            'border-color': 'rgba(255, 255, 255, 0.95)',
            'shadow-blur': 25,
            'shadow-color': 'data(color)',
            'shadow-opacity': 0.85
          }
        },
        {
          selector: 'node[?isMe]',
          style: {
            'width': 82,
            'height': 82,
            'border-width': 6,
            'border-color': '#ffd700',
            'font-weight': '800',
            'font-size': '15px',
            'shadow-blur': 40,
            'shadow-color': '#ffd700',
            'shadow-opacity': 0.95
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2.5,
            'line-color': 'data(color)',
            'curve-style': 'bezier',
            'opacity': 0.55,
            'line-dash-pattern': [6, 4],
            'target-arrow-shape': 'none'
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 6,
            'border-color': '#ffffff',
            'shadow-blur': 45,
            'shadow-opacity': 1.0,
            'scale': 1.18
          }
        }
      ],
      layout: {
        name: 'preset',
        animate: true,
        animationDuration: 800,
        animationEasing: 'ease-out-cubic'
      }
    });

    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      const contact = node.data('contact');
      if (contact && onSelectNode) {
        onSelectNode(contact);
      }
    });
  }

  return { init };
}
