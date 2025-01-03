import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import {
  Globe,
  Router,
  Link,
  Send,
  Server,
  Wifi,
  ShieldCheck,
  Cloud,
  Database,
} from 'lucide-react';

const RoutingProtocolsVisualizer = () => {
  const [currentProtocol, setCurrentProtocol] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(3000);

  const protocols = [
    {
      id: 1,
      name: 'RIP (Routing Information Protocol)',
      icon: <Router className="w-6 h-6 text-cyan-400" />,
      color: 'bg-cyan-600',
      description:
        'RIP is a distance-vector routing protocol that uses hop count as a routing metric. It is simple and easy to configure but has limitations in larger networks.',
      keyFeatures: ['Distance-Vector', 'Hop Count Metric', 'Maximum Hop Count: 15', 'Periodic Updates'],
      advantages: ['Simple Configuration', 'Low Resource Usage'],
      disadvantages: ['Slow Convergence', 'Limited Scalability'],
      useCases: ['Small Networks', 'Legacy Systems'],
      technicalDetails: [
        'Uses Bellman-Ford algorithm',
        'Broadcasts updates every 30 seconds',
        'Supports split horizon and route poisoning',
        'Maximum hop count of 15 to prevent routing loops',
        'RIPv1 is classful, RIPv2 is classless and supports VLSM',
      ],
      definitions: [
        { term: 'Distance-Vector', definition: 'A routing protocol that uses the number of hops to determine the best path.' },
        { term: 'Hop Count', definition: 'The number of routers a packet must pass through to reach its destination.' },
        { term: 'Split Horizon', definition: 'A technique to prevent routing loops by not advertising routes back to the interface they were learned from.' },
      ],
    },
    {
      id: 2,
      name: 'OSPF (Open Shortest Path First)',
      icon: <Globe className="w-6 h-6 text-green-400" />,
      color: 'bg-green-600',
      description:
        'OSPF is a link-state routing protocol designed for larger networks. It uses cost as a routing metric and provides fast convergence and scalability.',
      keyFeatures: ['Link-State', 'Cost Metric', 'Hierarchical Design', 'Fast Convergence'],
      advantages: ['Scalability', 'Fast Convergence', 'Hierarchical Design'],
      disadvantages: ['Complex Configuration', 'High Resource Usage'],
      useCases: ['Large Enterprise Networks', 'ISP Networks'],
      technicalDetails: [
        'Uses Dijkstra’s algorithm',
        'Supports VLSM and CIDR',
        'Areas and ABRs (Area Border Routers)',
        'LSA (Link State Advertisements)',
        'Hello packets for neighbor discovery',
        'DR (Designated Router) and BDR (Backup Designated Router) for efficient LSA flooding',
      ],
      definitions: [
        { term: 'Link-State', definition: 'A routing protocol that maintains a complete map of the network topology.' },
        { term: 'Cost Metric', definition: 'A value assigned to each link, typically based on bandwidth.' },
        { term: 'LSA', definition: 'Link State Advertisements are packets containing link-state information that are flooded throughout the network.' },
      ],
    },
    {
      id: 3,
      name: 'EIGRP (Enhanced Interior Gateway Routing Protocol)',
      icon: <Send className="w-6 h-6 text-purple-400" />,
      color: 'bg-purple-600',
      description:
        'EIGRP is an advanced distance-vector routing protocol that provides rapid convergence and reduced routing overhead. It uses a composite metric of bandwidth and delay.',
      keyFeatures: ['Advanced Distance-Vector', 'Composite Metric', 'Rapid Convergence', 'DUAL Algorithm'],
      advantages: ['Rapid Convergence', 'Efficient Use of Bandwidth', 'Scalability'],
      disadvantages: ['Proprietary (Cisco)', 'Complex Configuration'],
      useCases: ['Large Enterprise Networks', 'Cisco-based Networks'],
      technicalDetails: [
        'Uses DUAL (Diffusing Update Algorithm)',
        'Supports unequal-cost load balancing',
        'Hello packets for neighbor discovery',
        'Feasibility condition to ensure loop-free paths',
        'Supports both IPv4 and IPv6',
      ],
      definitions: [
        { term: 'DUAL', definition: 'Diffusing Update Algorithm is used to ensure loop-free paths and rapid convergence.' },
        { term: 'Composite Metric', definition: 'A metric that combines multiple factors such as bandwidth and delay.' },
        { term: 'Feasibility Condition', definition: 'A condition that ensures a route is loop-free by comparing the reported distance to the feasible distance.' },
      ],
    },
    {
      id: 4,
      name: 'BGP (Border Gateway Protocol)',
      icon: <Link className="w-6 h-6 text-blue-400" />,
      color: 'bg-blue-600',
      description:
        'BGP is a path-vector routing protocol used for routing between autonomous systems. It is designed for scalability and stability in large networks.',
      keyFeatures: ['Path-Vector', 'AS Path Attribute', 'Policy-Based Routing', 'Scalability'],
      advantages: ['Scalability', 'Stability', 'Policy Control'],
      disadvantages: ['Complex Configuration', 'Slow Convergence'],
      useCases: ['Internet Backbone', 'ISP Networks'],
      technicalDetails: [
        'Uses TCP port 179',
        'Supports iBGP and eBGP',
        'Route reflectors and confederations',
        'BGP attributes such as AS Path, Next Hop, Local Preference, MED, and Community',
        'BGP policies for route filtering and manipulation',
      ],
      definitions: [
        { term: 'Path-Vector', definition: 'A routing protocol that makes routing decisions based on path attributes.' },
        { term: 'AS Path', definition: 'A BGP attribute that lists the autonomous systems a route has traversed.' },
        { term: 'iBGP', definition: 'Internal BGP, used for routing within an autonomous system.' },
        { term: 'eBGP', definition: 'External BGP, used for routing between autonomous systems.' },
      ],
    },
    {
      id: 5,
      name: 'IS-IS (Intermediate System to Intermediate System)',
      icon: <Server className="w-6 h-6 text-yellow-400" />,
      color: 'bg-yellow-600',
      description:
        'IS-IS is a link-state routing protocol similar to OSPF but uses a different terminology and is often used in large ISP networks.',
      keyFeatures: ['Link-State', 'Cost Metric', 'TLVs', 'Scalability'],
      advantages: ['Scalability', 'Flexibility', 'Efficient Use of Bandwidth'],
      disadvantages: ['Complex Configuration', 'Less Common'],
      useCases: ['Large ISP Networks', 'Enterprise Networks'],
      technicalDetails: [
        'Uses Dijkstra’s algorithm',
        'Supports TLVs (Type-Length-Values)',
        'L1 and L2 routing',
        'NET (Network Entity Title) for addressing',
        'Hello packets for neighbor discovery',
      ],
      definitions: [
        { term: 'TLV', definition: 'Type-Length-Value, a flexible encoding scheme used in IS-IS.' },
        { term: 'L1 Routing', definition: 'Level 1 routing within an area.' },
        { term: 'L2 Routing', definition: 'Level 2 routing between areas.' },
        { term: 'NET', definition: 'Network Entity Title, a unique identifier for IS-IS routers.' },
      ],
    },
    {
      id: 6,
      name: 'IGRP (Interior Gateway Routing Protocol)',
      icon: <Wifi className="w-6 h-6 text-red-400" />,
      color: 'bg-red-600',
      description:
        'IGRP is a distance-vector routing protocol developed by Cisco. It uses a composite metric of bandwidth and delay but has been largely replaced by EIGRP.',
      keyFeatures: ['Distance-Vector', 'Composite Metric', 'Periodic Updates', 'Cisco Proprietary'],
      advantages: ['Simple Configuration', 'Efficient Use of Bandwidth'],
      disadvantages: ['Slow Convergence', 'Proprietary'],
      useCases: ['Legacy Cisco Networks', 'Small to Medium Networks'],
      technicalDetails: [
        'Uses Bellman-Ford algorithm',
        'Broadcasts updates every 90 seconds',
        'Supports split horizon and route poisoning',
        'Composite metric includes bandwidth, delay, reliability, and load',
        'IGRP is classful, does not support VLSM',
      ],
      definitions: [
        { term: 'Composite Metric', definition: 'A metric that combines multiple factors such as bandwidth and delay.' },
        { term: 'Split Horizon', definition: 'A technique to prevent routing loops by not advertising routes back to the interface they were learned from.' },
        { term: 'Route Poisoning', definition: 'A technique to prevent routing loops by setting the metric of a route to infinity.' },
      ],
    },
    {
      id: 7,
      name: 'Multicast Routing Protocols',
      icon: <ShieldCheck className="w-6 h-6 text-pink-400" />,
      color: 'bg-pink-600',
      description:
        'Multicast routing protocols are used to efficiently deliver data to multiple destinations. Examples include PIM, DVMRP, and MOSPF.',
      keyFeatures: ['Multicast', 'Efficient Data Delivery', 'Group Management', 'Scalability'],
      advantages: ['Efficient Use of Bandwidth', 'Scalability', 'Group Management'],
      disadvantages: ['Complex Configuration', 'Special Hardware Requirements'],
      useCases: ['Video Conferencing', 'IPTV', 'Stock Ticker Applications'],
      technicalDetails: [
        'PIM-SM (Protocol Independent Multicast - Sparse Mode)',
        'PIM-DM (Protocol Independent Multicast - Dense Mode)',
        'IGMP (Internet Group Management Protocol)',
        'Rendezvous Point (RP) for PIM-SM',
        'Multicast Distribution Trees (MDTs)',
      ],
      definitions: [
        { term: 'Multicast', definition: 'A method of sending data to multiple destinations simultaneously.' },
        { term: 'PIM-SM', definition: 'Protocol Independent Multicast - Sparse Mode, used for efficient multicast routing in sparse networks.' },
        { term: 'IGMP', definition: 'Internet Group Management Protocol, used for managing multicast group memberships.' },
      ],
    },
    {
      id: 8,
      name: 'MPLS (Multiprotocol Label Switching)',
      icon: <Cloud className="w-6 h-6 text-teal-400" />,
      color: 'bg-teal-600',
      description:
        'MPLS is a routing technique designed to speed up and shape traffic flows across enterprise wide area and service provider networks.',
      keyFeatures: ['Label Switching', 'Traffic Engineering', 'QoS', 'VPN Support'],
      advantages: ['Efficient Traffic Management', 'QoS Support', 'VPN Support'],
      disadvantages: ['Complex Configuration', 'Requires Specialized Hardware'],
      useCases: ['WAN Optimization', 'VPN Services', 'Traffic Engineering'],
      technicalDetails: [
        'Uses labels to forward data between routers',
        'Supports LDP (Label Distribution Protocol)',
        'RSVP-TE (Resource Reservation Protocol - Traffic Engineering)',
        'VRFs (Virtual Routing and Forwarding) for VPNs',
        'MPLS-TE for traffic engineering',
      ],
      definitions: [
        { term: 'Label Switching', definition: 'A forwarding mechanism based on labels rather than IP addresses.' },
        { term: 'LDP', definition: 'Label Distribution Protocol, used for distributing labels between routers.' },
        { term: 'RSVP-TE', definition: 'Resource Reservation Protocol - Traffic Engineering, used for reserving bandwidth.' },
      ],
    },
    {
      id: 9,
      name: 'VPLS (Virtual Private LAN Service)',
      icon: <Database className="w-6 h-6 text-indigo-400" />,
      color: 'bg-indigo-600',
      description:
        'VPLS is a way to provide Ethernet-based multipoint to multipoint communication over IP or MPLS networks.',
      keyFeatures: ['Ethernet over MPLS', 'Multipoint Connectivity', 'Layer 2 VPN', 'Scalability'],
      advantages: ['Scalability', 'Flexibility', 'Ease of Management'],
      disadvantages: ['Complex Configuration', 'Requires MPLS Infrastructure'],
      useCases: ['Data Center Interconnect', 'Enterprise WAN', 'Service Provider Networks'],
      technicalDetails: [
        'Uses MPLS for transport',
        'Supports MAC address learning',
        'VPLS instances for isolated networks',
        'BGP or LDP for signaling',
        'H-VPLS for hierarchical VPLS',
      ],
      definitions: [
        { term: 'Ethernet over MPLS', definition: 'A method of transporting Ethernet frames over an MPLS network.' },
        { term: 'MAC Address Learning', definition: 'A process of learning MAC addresses in a VPLS network.' },
        { term: 'H-VPLS', definition: 'Hierarchical VPLS, used for scaling VPLS networks.' },
      ],
    },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentProtocol((prev) => (prev + 1) % protocols.length);
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, protocols.length]);

  useEffect(() => {
    let progressInterval;
    if (isPlaying) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress((prev) => (prev + 1 > 100 ? 0 : prev + 1));
      }, speed / 100);
    }
    return () => clearInterval(progressInterval);
  }, [isPlaying, speed, currentProtocol]);

  const handleProtocolClick = (index) => {
    setCurrentProtocol(index);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen font-mono bg-gray-900 text-white p-4">
      <div className="max-w-auto mx-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-6">
            <p className="text-white text-sm text-base leading-relaxed">
                Routing protocols are essential for determining the best path for data transmission across networks. Here’s a breakdown of some of the key routing protocols
            </p>
        </div>

        {/* Header */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Router className="w-6 h-6 text-cyan-400" />
              <h1 className="text-lg font-bold text-cyan-400">Routing Protocols</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-2 py-1 rounded-md text-sm font-medium flex items-center gap-2 ${
                  isPlaying
                    ? 'bg-red-700 text-white'
                    : 'bg-green-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    <span>Play</span>
                  </>
                )}
              </button>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="px-2 py-1 rounded-md border border-gray-600 text-sm bg-gray-700 text-white"
              >
                <option value={25000}>Fast</option>
                <option value={50000}>Normal</option>
                <option value={95000}>Slow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Protocol Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
            {protocols.map((protocol, index) => (
              <button
                key={protocol.id}
                onClick={() => handleProtocolClick(index)}
                className={`p-4 rounded-lg transition-all flex flex-col items-center space-y-1 ${
                  currentProtocol === index
                    ? `${protocol.color} text-white shadow-lg`
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {React.cloneElement(protocol.icon, { className: 'w-4 h-4' })}
                <span className="text-sm font-medium text-center">
                  {protocol.name}
                </span>
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-700 h-2 rounded-full mb-8">
            <div
              className={`h-full rounded-full transition-all duration-100 ${protocols[currentProtocol].color}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Protocol Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Protocol Description */}
            <div className="space-y-4">
              <div
                className={`rounded-lg p-4 ${protocols[
                  currentProtocol
                ].color.replace('600', '800')}`}
              >
                <h3 className="font-semibold text-md mb-2 text-white">
                  {protocols[currentProtocol].name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {protocols[currentProtocol].description}
                </p>
              </div>

              {/* Key Features */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md text-cyan-400">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {protocols[currentProtocol].keyFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-600 text-gray-300 rounded-md text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Advantages & Disadvantages */}
            <div className="space-y-4">
              {/* Advantages */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md text-green-400">Advantages</h4>
                <ul className="space-y-2">
                  {protocols[currentProtocol].advantages.map((advantage, index) => (
                    <li key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                      <div
                        className={`w-2 h-2 rounded-full ${protocols[currentProtocol].color}`}
                      />
                      <span>{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disadvantages */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md text-red-400">Disadvantages</h4>
                <ul className="space-y-2">
                  {protocols[currentProtocol].disadvantages.map((disadvantage, index) => (
                    <li key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                      <div
                        className={`w-2 h-2 rounded-full ${protocols[currentProtocol].color}`}
                      />
                      <span>{disadvantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Use Cases & Technical Details */}
            <div className="space-y-4">
              {/* Use Cases */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md text-yellow-400">Use Cases</h4>
                <ul className="space-y-2">
                  {protocols[currentProtocol].useCases.map((useCase, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-xs text-gray-300"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${protocols[currentProtocol].color}`}
                      />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Definitions */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md text-pink-400">Definitions</h4>
                <ul className="space-y-2">
                  {protocols[currentProtocol].definitions.map((def, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-xs text-gray-300"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${protocols[currentProtocol].color}`}
                      />
                      <span><strong>{def.term}:</strong> {def.definition}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Details */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md text-purple-400">Additional Notes</h4>
                <ul className="space-y-2">
                  {protocols[currentProtocol].technicalDetails.map((detail, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-xs text-gray-300"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${protocols[currentProtocol].color}`}
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutingProtocolsVisualizer;
