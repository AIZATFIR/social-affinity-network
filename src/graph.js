import cytoscape from 'cytoscape';
import { TIER_CONFIG } from './types.js';

function getEmojiSvgDataUrl(emoji, badgeEmoji = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <circle cx="60" cy="60" r="50" fill="#0f172a" stroke="rgba(255,255,255,0.4)" stroke-width="4"/>
    <text x="60" y="66" dominant-baseline="central" text-anchor="middle" font-size="52">${emoji}</text>
    ${badgeEmoji ? `<circle cx="95" cy="25" r="18" fill="#1e1b4b" stroke="#00f0ff" stroke-width="2"/>
    <text x="95" y="28" dominant-baseline="central" text-anchor="middle" font-size="18">${badgeEmoji}</text>` : ''}
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const TIER_RADII = {
  lovers: 140,
  close_friends: 260,
  family: 380,
  friends: 520,
  acquaintances: 680
};

const TIER_BADGES = {
  lovers: '🌹',
  close_friends: '👊',
  family: '🏠',
  friends: '🤝',
  acquaintances: '👤'
};

export function createGraphManager(containerEl, onSelectNode) {
  let cy = null;

  function renderDunbarBands(cyInstance) {
    let svg = containerEl.querySelector('#orbit-overlay');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'orbit-overlay';
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.pointerEvents = 'none';
      svg.style.zIndex = '1';
      containerEl.style.position = 'relative';
      containerEl.insertBefore(svg, containerEl.firstChild);
    }

    const zones = [
      { radius: TIER_RADII.acquaintances, color: '#64748b', fillOpacity: '0.04', label: '500 Acquaintances & Network' },
      { radius: TIER_RADII.friends, color: '#8b5cf6', fillOpacity: '0.06', label: '150 Friends & Community' },
      { radius: TIER_RADII.family, color: '#10b981', fillOpacity: '0.08', label: '50 Kinship & Good Friends' },
      { radius: TIER_RADII.close_friends, color: '#00f0ff', fillOpacity: '0.10', label: '15 Close Circle' },
      { radius: TIER_RADII.lovers, color: '#ff2a6d', fillOpacity: '0.14', label: '5 Loved Ones & Intimate' }
    ];

    function update() {
      if (!cyInstance) return;
      const pan = cyInstance.pan();
      const zoom = cyInstance.zoom();

      let html = `<g transform="translate(${pan.x}, ${pan.y}) scale(${zoom})">`;

      zones.forEach(zone => {
        html += `
          <!-- Dunbar Translucent Zone Band -->
          <circle cx="0" cy="0" r="${zone.radius}"
            fill="${zone.color}"
            fill-opacity="${zone.fillOpacity}"
            stroke="${zone.color}"
            stroke-width="2"
            stroke-dasharray="8,6"
            stroke-opacity="0.5"
            style="filter: drop-shadow(0 0 8px ${zone.color});"
          />
          <!-- Dunbar Zone Band Label -->
          <text x="0" y="${-zone.radius + 20}"
            fill="${zone.color}"
            font-size="12"
            font-weight="800"
            font-family="Plus Jakarta Sans, sans-serif"
            text-anchor="middle"
            letter-spacing="0.06em"
            opacity="0.85"
            style="text-shadow: 0 0 10px rgba(0,0,0,0.8);"
          >${zone.label}</text>
        `;
      });

      html += `</g>`;
      svg.innerHTML = html;
    }

    cyInstance.on('pan zoom resize position render', update);
    update();
  }

  function init(contacts) {
    const elements = [
      {
        data: {
          id: 'me',
          name: 'YOU (Me)',
          color: '#ffd700',
          avatar: '👑',
          bgImage: getEmojiSvgDataUrl('👑', '⭐'),
          isMe: true
        },
        position: { x: 0, y: 0 }
      }
    ];

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
      const radius = TIER_RADII[tierKey] || 680;
      const count = group.length;

      group.forEach((c, index) => {
        const angle = (2 * Math.PI * index) / (count || 1) - (Math.PI / 2);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const tierColor = TIER_CONFIG[c.tier]?.color || '#ffffff';
        const avatarIcon = c.avatar || '🍎';
        const badgeIcon = TIER_BADGES[c.tier] || '';

        elements.push({
          data: {
            id: c.id,
            name: c.name,
            color: tierColor,
            tier: c.tier,
            avatar: avatarIcon,
            bgImage: getEmojiSvgDataUrl(avatarIcon, badgeIcon),
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
        /* MLBB Affinity Profile Node Styling */
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
            'width': 62,
            'height': 62,
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
            'width': 88,
            'height': 88,
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
            'width': 2.8,
            'line-color': 'data(color)',
            'curve-style': 'bezier',
            'opacity': 0.6,
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

    renderDunbarBands(cy);

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
