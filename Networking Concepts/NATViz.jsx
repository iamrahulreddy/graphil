import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Database,
} from "lucide-react";

const NATVisualization = () => {
  // --- Data Definitions ---
  const internalDevices = [
    { id: 1, name: "Laptop", ip: "192.168.1.10", icon: "💻" },
    { id: 2, name: "Smartphone", ip: "192.168.1.11", icon: "📱" },
    { id: 3, name: "Smart TV", ip: "192.168.1.12", icon: "📺" },
    { id: 4, name: "Tablet", ip: "192.168.1.13", icon: "📟" },
    { id: 5, name: "IoT Device", ip: "192.168.1.14", icon: "🔌" },
  ];

  const router = {
    internalIP: "192.168.1.1",
    externalIP: "203.0.113.5",
    icon: "🌐",
  };

  const externalServer = {
    name: "Web Server",
    ip: "8.8.8.8",
    icon: "🖥️",
  };

  const animationSteps = [
    {
      title: "Step 1: Device Creates Request",
      description:
        "Your device initiates communication by creating a data packet.",
      details:
        "When you type a website address or use an app, your device prepares a packet with your private IP (e.g., 192.168.1.10) as the source and the server's public IP as the destination.",
    },
    {
      title: "Step 2: Packet to Router",
      description: "The packet is transmitted to your network router.",
      details:
        "This packet travels within your local network to your router, which acts as a gateway to the internet.",
    },
    {
      title: "Step 3: NAT - Private to Public IP",
      description: "The router performs Network Address Translation (NAT).",
      details:
        "The router replaces your device's private IP in the packet's source address with its own public IP. This makes it possible for your private network to interact with the public internet.",
    },
    {
      title: "Step 4: NAT Table Entry Created",
      description: "A record of this translation is stored.",
      details:
        "The router logs the connection details (your private IP:port and its public IP:port) in a NAT table. This is crucial for directing return traffic correctly.",
    },
    {
      title: "Step 5: Packet Sent to Internet",
      description: "The modified packet is forwarded towards the internet.",
      details:
        "Now bearing the router's public IP, the packet is sent out onto the internet, heading towards the destination server.",
    },
    {
      title: "Step 6: Server Receives Request",
      description: "The server only sees the router's public IP address.",
      details:
        "The web server receives the request and perceives it as originating from your router's public IP. Your internal network structure remains hidden.",
    },
    {
      title: "Step 7: Server Response",
      description: "The server sends back a response.",
      details:
        "Upon processing, the server creates a response packet destined for the router's public IP.",
    },
    {
      title: "Step 8: Router Receives Response",
      description: "The router receives the server's reply.",
      details:
        "The response packet journeys back across the internet and reaches your router's public IP address.",
    },
    {
      title: "Step 9: Reverse NAT - Public to Private IP",
      description:
        "The router consults its NAT table to find the original recipient.",
      details:
        "Using the NAT table, the router identifies the private IP address of your device that initiated the original request.",
    },
    {
      title: "Step 10: Response to Device",
      description: "The response is forwarded to your device.",
      details:
        "The router modifies the packet, replacing the destination IP with your device's private IP, and finally sends it back to your device, completing the communication.",
    },
  ];

  const translationTable = internalDevices.map((device, index) => ({
    privateIP: device.ip,
    privatePort: 45678 + index,
    publicIP: router.externalIP,
    publicPort: 45678 + index, // Use a consistent port mapping for simplicity
    destination: `${externalServer.ip}:80`,
    protocol: "TCP",
    status: "ESTABLISHED",
    lifeTime: "23:57",
  }));

  // --- State Variables ---
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showTranslationTable, setShowTranslationTable] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeElements, setActiveElements] = useState({
    device: null,
    router: false,
    server: false,
  });
  const [packetInfo, setPacketInfo] = useState(null);

  // --- useEffect Hooks ---

  // Auto-play animation
  useEffect(() => {
    let interval;
    if (isAutoPlaying && selectedDevice) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= animationSteps.length - 1) {
            setIsAutoPlaying(false); // Stop at the end
            return prev; // Keep at the last step, don't reset
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedDevice, animationSteps.length]);

  // Update active elements for animation
  useEffect(() => {
    if (!selectedDevice) return;

    // Reset all before setting new actives
    setActiveElements({ device: null, router: false, server: false });

    switch (activeStep) {
      case 0:
      case 1:
        setActiveElements((prev) => ({ ...prev, device: selectedDevice.id }));
        break;
      case 2:
      case 3:
      case 4:
        setActiveElements((prev) => ({
          ...prev,
          router: true,
        }));
        break;
      case 5:
      case 6:
        setActiveElements((prev) => ({
          ...prev,
          server: true,
        }));
        break;
      case 7:
      case 8:
        setActiveElements((prev) => ({ ...prev, router: true }));
        break;
      case 9:
        setActiveElements((prev) => ({
          ...prev,
          device: selectedDevice.id,
        }));
        break;
      default:
        setActiveElements({ device: null, router: false, server: false });
    }
  }, [activeStep, selectedDevice]);

  // --- Event Handlers ---
  const handleDeviceClick = (device) => {
    // Don't allow changing devices during animation
    if (isAutoPlaying) return;

    setSelectedDevice(device);
    setActiveStep(0);
    setActiveElements({ device: device.id, router: false, server: false });

    // Set packet info
    const entry = translationTable.find((e) => e.privateIP === device.ip);
    if (entry) {
      setPacketInfo({
        source: `${device.ip}:${entry.privatePort}`,
        dest: `${externalServer.ip}:80`,
        translated: `${router.externalIP}:${entry.publicPort}`,
      });
    }
  };

  const resetAnimation = () => {
    setActiveStep(0);
    setIsAutoPlaying(false);
    setSelectedDevice(null);
    setActiveElements({ device: null, router: false, server: false });
    setPacketInfo(null);
  };

  // --- Reusable Components ---
  const DeviceComponent = ({ device }) => (
    <div
      onClick={() => handleDeviceClick(device)}
      className={`
        flex items-center p-3 rounded-md cursor-pointer transition-all duration-300
        ${
          selectedDevice && selectedDevice.id === device.id
            ? "bg-blue-50 border-2 border-blue-400 transform scale-105"
            : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
        }
        ${activeElements.device === device.id ? "animate-glow" : ""}
        ${
          isAutoPlaying && selectedDevice && selectedDevice.id !== device.id
            ? "opacity-50 cursor-not-allowed"
            : ""
        }
      `}
    >
      <div className="text-2xl mr-3">{device.icon}</div>
      <div>
        <div className="font-medium text-sm">{device.name}</div>
        <div className="text-xs text-gray-600">{device.ip}</div>
      </div>
    </div>
  );

  const NetworkComponent = ({ type, icon, title, details, isActive }) => (
    <div
      className={`
        bg-${type}-50 border border-${type}-100 rounded-lg p-4 relative
        transition-all duration-300
        ${isActive ? "shadow-md animate-active-element" : ""}
      `}
    >
      <h3 className={`text-sm font-medium text-${type}-800 mb-2`}>{title}</h3>
      <div className="text-2xl mb-2 text-center">{icon}</div>
      <div className="text-xs text-center text-gray-600">{details}</div>
    </div>
  );

  const PacketInfoTooltip = () =>
    packetInfo && (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-md text-xs shadow-lg z-50 transition-all duration-300">
        <div className="font-medium mb-1">Current Packet</div>
        <div>Source: {packetInfo.source}</div>
        <div>Destination: {packetInfo.dest}</div>
        {activeStep >= 3 && (
          <div className="mt-1 pt-1 border-t border-gray-600">
            <div className="font-medium mb-1">After NAT</div>
            <div>Source: {packetInfo.translated}</div>
            <div>Destination: {packetInfo.dest}</div>
          </div>
        )}
      </div>
    );

  // --- Main Component Structure ---
  return (
    <div className="font-mono container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      {/* --- Header --- */}
      <div className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl p-6 sm:p-8 text-white mb-8">
        <h1 className="text-xl font-extrabold mb-2 text-center leading-tight">
          Understanding Network Address Translation (NAT)
        </h1>
        <p className="opacity-90 text-xs sm:text-base text-center">
          This interactive guide will help you understand how Network Address
          Translation works.
        </p>
      </div>

      {/* --- Controls and Device Selection --- */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 sm:px-6">
          <h2 className="text-lg md:text-center sm: text-center font-semibold text-gray-800">
            Interactive Animation Controls
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Device Selection */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                <span className="font-semibold">1. Choose Your Device</span>
                <p className="text-gray-500 text-xs mt-1">
                Select a device by clicking on it, then click "Auto Play" or use the arrows to start the visualization. Scroll down to view the visualization.              </p>
              </h3>
              <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-3">
                {internalDevices.map((device) => (
                  <DeviceComponent key={device.id} device={device} />
                ))}
              </div>
            </div>

            {/* Animation Controls */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                <span className="font-semibold">2. Control the Animation</span>
                <p className="text-gray-500 text-xs mt-1">
                  Step through or autoplay the NAT process.
                </p>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  disabled={!selectedDevice || activeStep === 0}
                  className="p-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 transition-colors"
                  title="Previous Step"
                >
                  <ArrowLeft size={20} />
                </button>

                {isAutoPlaying ? (
                  <button
                    onClick={() => setIsAutoPlaying(false)}
                    disabled={!selectedDevice}
                    className="flex-1 flex items-center justify-center px-3 py-2 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 focus:ring-2 focus:ring-amber-500 transition-colors disabled:opacity-50"
                    title="Pause Animation"
                  >
                    <PauseCircle size={18} className="mr-1" />
                    <span className="text-sm sm:text-base">Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAutoPlaying(true)}
                    disabled={!selectedDevice}
                    className="flex-1 flex items-center justify-center px-3 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                    title="Start Animation"
                  >
                  <span className="text-xs">Auto play</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    setActiveStep((prev) =>
                      Math.min(animationSteps.length - 1, prev + 1)
                    )
                  }
                  disabled={
                    !selectedDevice || activeStep === animationSteps.length - 1
                  }
                  className="p-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 transition-colors"
                  title="Next Step"
                >
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={resetAnimation}
                  className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 transition-colors"
                  title="Reset Animation"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                <span className="font-semibold">3. Explore NAT Table</span>
                <p className="text-gray-500 text-xs mt-1">
                  View or hide the NAT translation table.
                </p>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setShowTranslationTable(!showTranslationTable)}
                  className="px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 focus:ring-2 focus:ring-purple-500 transition-colors text-sm flex items-center justify-center"
                  title="View NAT Translation Table"
                >
                  <Database size={16} className="mr-1" />
                  {showTranslationTable ? "Hide NAT Table" : "Show NAT Table"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Network Visualization --- */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 sm:px-6">
          <h2 className="text-lg md:text-center sm: text-center font-semibold text-gray-800">
            NAT Process Visualization
          </h2>
        </div>

        <div className="p-6 text-center bg-gradient-to-b from-blue-50 to-white relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <NetworkComponent
              type="blue"
              icon={selectedDevice ? selectedDevice.icon : ""}
              title={selectedDevice ? "Your Device" : ""}
              details={
                selectedDevice
                  ? `${selectedDevice.name} (${selectedDevice.ip})`
                  : ""
              }
              isActive={!!selectedDevice}
            />

            <NetworkComponent
              type="green"
              icon={router.icon}
              title="NAT Router"
              details={`${router.internalIP} ➔ ${router.externalIP}`}
              isActive={activeElements.router}
            />

            <NetworkComponent
              type="purple"
              icon={externalServer.icon}
              title="Web Server (Internet)"
              details={`${externalServer.name} (${externalServer.ip})`}
              isActive={activeElements.server}
            />
          </div>

          {/* --- Animation Progress and Step Information --- */}
          {selectedDevice && (
            <div className="space-y-4">
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Start</span>
                  <span>
                    Step {activeStep + 1} of {animationSteps.length}
                  </span>
                  <span>End</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (activeStep / (animationSteps.length - 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <h3 className="text-sm font-medium text-amber-800 mb-3">
                  {animationSteps[activeStep].title}
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {animationSteps[activeStep].description}
                </p>
                <div className="text-xs text-gray-600 border-t pt-3 border-amber-200">
                  <span className="font-semibold">Details:</span>{" "}
                  {animationSteps[activeStep].details}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- NAT Table --- */}
      {showTranslationTable && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-purple-50 px-4 py-3 border-b border-purple-100 sm:px-6">
            <h2 className="font-medium text-purple-800">
              NAT Translation Table (Router's Perspective)
            </h2>
          </div>
          <div className="overflow-x-auto p-3 sm:p-4">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Private IP:Port
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Public IP:Port
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Destination Server
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Protocol
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Lifetime
                  </th>
                </tr>
              </thead>
              <tbody>
                {translationTable.map((entry, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 ${
                      selectedDevice && entry.privateIP === selectedDevice.ip
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    <td className="p-3">{`${entry.privateIP}:${entry.privatePort}`}</td>
                    <td className="p-3">{`${entry.publicIP}:${entry.publicPort}`}</td>
                    <td className="p-3">{entry.destination}</td>
                    <td className="p-3">{entry.protocol}</td>
                    <td className="p-3">{entry.status}</td>
                    <td className="p-3">{entry.lifeTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100 sm:px-4">
            <span className="italic">Note:</span> This table simulates the NAT
            translation records within a router.
          </div>
        </div>
      )}

      {/* Floating Packet Info Tooltip */}
      <PacketInfoTooltip />

      {/* --- CSS Animations --- */}
      <style jsx>{`
        @keyframes glow {
          0% {
            box-shadow: 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
          }
          100% {
            box-shadow: 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes active-element {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0.05);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0.05);
          }
        }

        .animate-glow {
          animation: glow 2s infinite;
        }

        .animate-active-element {
          animation: active-element 2s infinite;
        }

        .transition-colors {
          transition-property: background-color, border-color, color, fill,
            stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
};

export default NATVisualization;
