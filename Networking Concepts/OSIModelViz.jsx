import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'
import {
  Layers,
  Share2,
  Network,
  Router,
  Link,
  Box,
  Send,
  Server,
} from 'lucide-react';

const OSIModelVisualizer = () => {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(3000);

  const layers = [
    {
      id: 7,
      name: 'Application',
      icon: <Server className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-500',
      protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'SSH', 'Telnet', 'SNMP', 'POP3', 'IMAP'],
      description:
        'The Application layer is the topmost layer and provides network services directly to the end-users or applications. It deals with user interface and application-level communication.',
      pdu: 'Data',
      devices: ['Application Gateways', 'Layer 7 Firewalls', 'Web Servers', 'Email Servers'],
      functions: [
        'Network Services for Applications: Providing interfaces for applications to access network services (e.g., email, file transfer, web browsing).',
        'Resource Sharing: Enabling sharing of resources such as files, printers, and databases over the network.',
        'Remote File Access: Allowing access to files stored on remote systems.',
        'Directory Services: Providing a distributed database of network resources (e.g., DNS).',
        'Network Management: Monitoring and managing network resources and activities.',
      ],
      examples: [
        'Web Browsers: Accessing websites via HTTP/HTTPS.',
        'Email Clients: Sending and receiving emails via SMTP, POP3, or IMAP.',
        'File Transfer Protocol (FTP): Transferring files between client and server.',
        'Domain Name System (DNS): Resolving domain names to IP addresses.',
        'Secure Shell (SSH): Securely accessing remote systems.',
        'Telnet: Remote terminal access.',
        'Simple Network Management Protocol (SNMP): Network monitoring and management.',
      ],
      security: [
        'SSL/TLS Encryption: Securing data transmitted between client and server.',
        'Application Firewalls: Filtering traffic based on application-level rules.',
        'Input Validation: Preventing malicious code injection.',
        'Authentication: Verifying user identities before granting access.',
        'Authorization: Determining user access levels and permissions.',
        'Intrusion Detection and Prevention Systems (IDPS): Monitoring and blocking malicious activity.',
      ],
    },
    {
      id: 6,
      name: 'Presentation',
      icon: <Box className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-500',
      protocols: ['SSL/TLS', 'JPEG', 'GIF', 'MPEG', 'ASCII', 'EBCDIC', 'MIDI', 'PICT'],
      description:
        'The Presentation layer handles data formatting, encryption, and decryption. It ensures that data is presented in a format that the receiving application can understand.',
      pdu: 'Data',
      devices: ['Format Converters', 'Encoders/Decoders', 'Encryption Devices'],
      functions: [
        'Data Translation: Converting data between different formats (e.g., ASCII to EBCDIC).',
        'Encryption/Decryption: Securing data during transmission and decrypting it upon receipt.',
        'Character Encoding: Representing characters in a specific format (e.g., ASCII, Unicode).',
        'Data Compression: Reducing the size of data for efficient transmission.',
        'Format Conversion: Converting data into specific formats for different media (e.g., JPEG, GIF, MPEG).',
      ],
      examples: [
        'Image Format Conversion: Converting between JPEG, GIF, PNG, etc.',
        'Character Encoding Conversion: Converting ASCII to EBCDIC or Unicode.',
        'SSL/TLS Encryption: Encrypting data for secure web browsing (HTTPS).',
        'Video Format Conversion: Converting between MPEG, AVI, MP4, etc.',
        'Audio Format Conversion: Converting between MP3, WAV, AAC, etc.',
        'Data Compression: Compressing files for faster transfer.',
      ],
      security: [
        'Data Encryption: Encrypting sensitive data during transmission and storage.',
        'Digital Certificates: Verifying the authenticity of entities in a network.',
        'Compression Attacks Prevention: Mitigating attacks that exploit data compression.',
        'Format Validation: Ensuring that data formats are valid and not malicious.',
      ],
    },
    {
      id: 5,
      name: 'Session',
      icon: <Share2 className="w-6 h-6 text-green-600" />,
      color: 'bg-green-500',
      protocols: ['NetBIOS', 'RPC', 'SQL', 'NFS', 'SCP', 'ASP', 'ZIP'],
      description:
        'The Session layer establishes, manages, and terminates sessions between applications. It handles authentication and authorization for session establishment.',
      pdu: 'Data',
      devices: ['Session Controllers', 'Gateway Services', 'API Gateways'],
      functions: [
        'Session Establishment: Initiating and setting up sessions between applications.',
        'Session Maintenance: Managing and maintaining the established sessions.',
        'Session Termination: Gracefully closing sessions when they are no longer needed.',
        'Authentication: Verifying the identity of communicating entities.',
        'Authorization: Granting or denying access to resources based on user roles.',
        'Synchronization: Keeping track of data flow within a session.',
      ],
      examples: [
        'Login Sessions: Establishing a secure connection between a user and a server.',
        'Database Connections: Managing persistent connections to a database server.',
        'Remote Procedure Calls (RPC): Allowing a program to execute a procedure on another computer.',
        'Network File System (NFS): Accessing files over a network as if they were local.',
        'Secure Copy Protocol (SCP): Securely transferring files between hosts.',
        'Video Conferencing: Establishing and managing audio/video sessions.',
      ],
      security: [
        'Session Tokens: Using unique tokens to identify and authenticate sessions.',
        'Authentication Mechanisms: Employing strong authentication methods (e.g., multi-factor authentication).',
        'Session Timeouts: Automatically terminating idle sessions to prevent unauthorized access.',
        'Access Control: Implementing role-based access control (RBAC) to restrict resource access.',
        'Session Hijacking Prevention: Using techniques like encrypted session IDs to prevent session hijacking attacks.',
      ],
    },
    {
      id: 4,
      name: 'Transport',
      icon: <Send className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-500',
      protocols: ['TCP', 'UDP', 'SCTP', 'DCCP', 'SPX', 'RDP'],
      description:
        'The Transport layer provides end-to-end communication services for applications. It ensures reliable and ordered delivery of data segments between hosts.',
      pdu: 'Segment',
      devices: ['Load Balancers', 'WAN Optimizers', 'Firewalls', 'Gateways'],
      functions: [
        'Segmentation: Dividing data into smaller segments for transmission.',
        'Flow Control: Regulating data flow to prevent network congestion.',
        'Error Control: Detecting and correcting errors in data transmission.',
        'Connection Management: Establishing, maintaining, and terminating connections between hosts.',
        'Reliability: Ensuring reliable data transfer through acknowledgments and retransmissions.',
        'Port Addressing: Using port numbers to identify specific applications or processes on a host.',
      ],
      examples: [
        'TCP Reliable Data Transfer: Ensuring that data is delivered accurately and in order.',
        'UDP Streaming: Transmitting data without reliability guarantees for applications like video streaming.',
        'Port Number Addressing: Identifying specific applications (e.g., HTTP on port 80, HTTPS on port 443).',
        'Connection Establishment: Establishing a connection using a three-way handshake (TCP).',
        'Flow Control: Using techniques like sliding window to manage data flow.',
      ],
      security: [
        'TCP Sequence Checking: Verifying the correct order of segments.',
        'Port Scanning Prevention: Using firewalls to block unauthorized port scanning.',
        'Denial-of-Service (DoS) Protection: Implementing mechanisms to mitigate DoS attacks.',
        'Connection Limits: Limiting the number of concurrent connections to prevent resource exhaustion.',
        'Stateful Firewalls: Monitoring the state of active connections to filter traffic.',
      ],
    },
    {
      id: 3,
      name: 'Network',
      icon: <Network className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-500',
      protocols: ['IP (IPv4, IPv6)', 'ICMP', 'OSPF', 'BGP', 'RIP', 'EIGRP', 'IPsec', 'IGMP'],
      description:
        'The Network layer is responsible for routing data packets across networks. It determines the best path for packets to travel from the source to the destination.',
      pdu: 'Packet',
      devices: ['Routers', 'Layer 3 Switches', 'Firewalls', 'Multilayer Switches'],
      functions: [
        'Logical Addressing: Assigning IP addresses to devices on a network.',
        'Route Determination: Finding the best path for packets to travel across networks.',
        'Packet Forwarding: Sending packets along the selected route.',
        'Traffic Control: Managing network traffic to prevent congestion.',
        'Fragmentation: Dividing packets into smaller fragments for transmission over different networks.',
        'Reassembly: Reassembling fragments into the original packet at the destination.',
      ],
      examples: [
        'IP Routing: Forwarding packets between different networks based on IP addresses.',
        'Subnet Creation: Dividing a network into smaller subnetworks.',
        'ICMP Error Messages: Sending error messages (e.g., destination unreachable, time exceeded).',
        'Router Configurations: Configuring routing protocols (e.g., OSPF, BGP) to determine optimal routes.',
        'Network Address Translation (NAT): Translating private IP addresses to public IP addresses.',
      ],
      security: [
        'IP Filtering: Using access control lists (ACLs) to filter traffic based on IP addresses.',
        'Network Firewalls: Filtering traffic between networks based on predefined rules.',
        'Route Authentication: Ensuring that routing updates are from legitimate sources.',
        'IPsec: Providing secure communication over IP networks through encryption and authentication.',
        'Intrusion Detection Systems (IDS): Monitoring network traffic for malicious activity.',
      ],
    },
    {
      id: 2,
      name: 'Data Link',
      icon: <Link className="w-6 h-6 text-red-600" />,
      color: 'bg-red-500',
      protocols: ['Ethernet', 'PPP', 'Frame Relay', 'MAC', 'Token Ring', 'Wi-Fi (802.11)', 'HDLC'],
      description:
        'The Data Link layer handles the transfer of data frames between two directly connected nodes. It provides error detection and correction for reliable communication over the physical medium.',
      pdu: 'Frame',
      devices: ['Switches', 'Bridges', 'Network Interface Cards (NICs)', 'Wireless Access Points'],
      functions: [
        'Physical Addressing: Using MAC addresses to identify devices on a local network.',
        'Error Detection: Using techniques like CRC to detect errors in frames.',
        'Frame Synchronization: Defining the start and end of frames.',
        'Flow Control: Regulating data flow to prevent overwhelming the receiver.',
        'Media Access Control: Controlling access to the physical transmission medium.',
        'Framing: Encapsulating data into frames with header and trailer information.',
      ],
      examples: [
        'MAC Address Resolution: Using ARP to map IP addresses to MAC addresses.',
        'Switch Forwarding: Forwarding frames based on MAC addresses.',
        'VLAN Configuration: Creating virtual LANs to segment network traffic.',
        'Error Checking: Using CRC to detect and correct errors in frames.',
        'Spanning Tree Protocol (STP): Preventing loops in switched networks.',
      ],
      security: [
        'MAC Filtering: Allowing or denying network access based on MAC addresses.',
        'Port Security: Limiting the number of MAC addresses that can be learned on a switch port.',
        'Storm Control: Preventing broadcast, multicast, and unicast storms from disrupting the network.',
        'ARP Inspection: Preventing ARP spoofing attacks.',
        'VLAN Security: Implementing security policies within VLANs.',
        '802.1X Authentication: Authenticating devices before allowing network access.',
      ],
    },
    {
      id: 1,
      name: 'Physical',
      icon: <Router className="w-6 h-6 text-pink-600" />,
      color: 'bg-pink-500',
      protocols: ['RS-232', 'USB', 'Ethernet physical layer (e.g., 10BASE-T, 100BASE-TX)', 'Bluetooth', 'DSL', 'ISDN'],
      description:
        'The Physical layer is responsible for the actual transmission of raw bits over the physical medium. It deals with electrical, mechanical, and procedural characteristics of the transmission medium.',
      pdu: 'Bit',
      devices: ['Hubs', 'Repeaters', 'Cables (e.g., coaxial, twisted-pair, fiber-optic)', 'Modems', 'Transceivers'],
      functions: [
        'Bit Transmission: Sending and receiving raw bits over the physical medium.',
        'Physical Topology: Defining the physical layout of the network (e.g., bus, star, mesh).',
        'Voltage Levels: Specifying voltage levels for representing bits.',
        'Data Rates: Determining the speed of data transmission.',
        'Physical Connectors: Defining the types of connectors used for physical connections.',
        'Signal Modulation: Encoding digital data into signals suitable for transmission.',
      ],
      examples: [
        'Ethernet Cabling: Using twisted-pair cables to transmit data.',
        'Fiber Optic Transmission: Using optical fibers to transmit data as light pulses.',
        'Wireless Signals: Transmitting data wirelessly using radio waves or microwaves.',
        'Hub Operations: Broadcasting signals to all connected devices.',
        'Repeater Operations: Regenerating and retransmitting signals to extend the network range.',
      ],
      security: [
        'Physical Access Control: Securing physical access to network devices and cabling.',
        'Cable Protection: Using conduits and other protective measures to prevent cable damage or tampering.',
        'Signal Interference Prevention: Using shielding to prevent electromagnetic interference (EMI).',
        'Port Disabling: Disabling unused physical ports to prevent unauthorized access.',
        'Wireless Security: Implementing WEP, WPA, or WPA2 encryption for wireless networks.',
      ],
    },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentLayer((prev) => (prev + 1) % layers.length);
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, layers.length]);

  useEffect(() => {
    let progressInterval;
    if (isPlaying) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress((prev) => (prev + 1 > 100 ? 0 : prev + 1));
      }, speed / 100);
    }
    return () => clearInterval(progressInterval);
  }, [isPlaying, speed, currentLayer]);

  const handleLayerClick = (index) => {
    setCurrentLayer(index);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen font-mono bg-gray-50 p-4">
      <div className="max-w-auto mx-auto bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-blue-500" />
              <h1 className="text-lg font-bold">OSI Model</h1>
            </div>
            <div className="flex items-center space-x-2">
            <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-1 py-1 rounded-md text-sm font-medium flex items-center gap-2 ${
                    isPlaying
                      ? 'bg-red-200 text-red-600'
                      : 'bg-green-200 text-green-600'
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
                className="px-1 py-1 rounded-md border border-gray-300 text-sm"
              >
                <option value={25000}>Fast</option>
                <option value={50000}>Normal</option>
                <option value={95000}>Slow</option>
              </select>
            </div>
          </div>
        </div>
            <div className="p-6">
              <p className="text-black text-xs text-base leading-relaxed">
                The <span className="text-blue-500 font-bold">OSI</span> (Open Systems Interconnection) model is a conceptual framework designed to standardize network communication. 
                It divides the communication process into seven layers : 
                <span className="text-purple-500 font-bold"> Application</span>, 
                <span className="text-blue-500 font-bold"> Presentation</span>, 
                <span className="text-green-500 font-bold"> Session</span>, 
                <span className="text-yellow-500 font-bold"> Transport</span>, 
                <span className="text-orange-700 font-bold"> Network</span>, 
                <span className="text-red-500 font-bold"> Data Link</span>, and 
                <span className="text-pink-500 font-bold"> Physical</span>. 
                Each layer has distinct responsibilities, allowing devices to communicate seamlessly across diverse systems and networks.
              </p>
            </div>    
        {/* Content */}
        <div className="p-6">
          {/* Layer Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-2">
            {layers.map((layer, index) => (
              <button
                key={layer.id}
                onClick={() => handleLayerClick(index)}
                className={`p-4 rounded-lg transition-all flex flex-col items-center space-y-1 ${
                  currentLayer === index
                    ? `${layer.color} text-white shadow-lg`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {React.cloneElement(layer.icon, { className: 'w-4 h-4' })}
                <span className="text-sm font-medium text-center">
                  {layer.name}
                </span>
                <span className="text-xs text-center">Layer {layer.id}</span>
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-2 rounded-full mb-8">
            <div
              className={`h-full rounded-full transition-all duration-100 ${layers[currentLayer].color}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Layer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Layer Description */}
            <div className="space-y-4">
              <div
                className={`rounded-lg p-4 ${layers[
                  currentLayer
                ].color.replace('500', '100')}`}
              >
                <h3 className="font-semibold text-md mb-2">
                  Layer {layers[currentLayer].id}: {layers[currentLayer].name}
                </h3>
                <p className="text-gray-700 text-sm">
                  {layers[currentLayer].description}
                </p>
                <div className="mt-2 text-sm">
                  <span className="font-bold">PDU:</span>{' '}
                  {layers[currentLayer].pdu}
                </div>
              </div>

              {/* Key Protocols */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md">Key Protocols</h4>
                <div className="flex flex-wrap gap-2">
                  {layers[currentLayer].protocols.map((protocol, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                    >
                      {protocol}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Functions & Network Devices */}
            <div className="space-y-4">
              {/* Key Functions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md">Key Functions</h4>
                <ul className="space-y-2">
                  {layers[currentLayer].functions.map((func, index) => (
                    <li key={index} className="flex items-center space-x-2 text-xs">
                      <div
                        className={`w-2 h-2 rounded-full ${layers[currentLayer].color}`}
                      />
                      <span>{func}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Network Devices */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md">Network Devices</h4>
                <div className="flex flex-wrap gap-2">
                  {layers[currentLayer].devices.map((device, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs"
                    >
                      {device}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-world Examples & Security Considerations */}
            <div className="space-y-4">
              {/* Real-world Examples */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md">
                  Real-world Examples
                </h4>
                <ul className="space-y-2">
                  {layers[currentLayer].examples.map((example, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-xs"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${layers[currentLayer].color}`}
                      />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security Considerations */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold mb-2 text-md">
                  Security Considerations
                </h4>
                <ul className="space-y-2">
                  {layers[currentLayer].security.map((security, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-xs"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${layers[currentLayer].color}`}
                      />
                      <span>{security}</span>
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

export default OSIModelVisualizer;