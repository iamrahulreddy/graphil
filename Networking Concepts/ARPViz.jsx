import React, { useReducer, useEffect, useMemo, useCallback } from "react";
import {
  Laptop,
  Server,
  Network,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

const DEVICE_TYPES = {
  LAPTOP: "laptop",
  SERVER: "server",
};

const MAC_ADDRESS_LENGTH = 17;

const generateMacAddress = () => {
  let macAddress = "";
  for (let i = 0; i < MAC_ADDRESS_LENGTH; i++) {
    if (i % 3 === 2) {
      macAddress += ":";
      continue;
    }
    macAddress += "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
  }
  return macAddress;
};

const DeviceIcon = React.memo(({ type, status }) => {
  const Icon = type === DEVICE_TYPES.SERVER ? Server : Laptop;
  return (
    <Icon
      className={`w-8 h-8 md:w-12 md:h-12 mx-auto transition-colors ${status}`}
    />
  );
});

const NetworkDeviceWithTooltip = React.memo(
  ({ name, ip, mac, type, status }) => {
    const [isTooltipVisible, setTooltipVisible] = React.useState(false);

    const handleMouseEnter = useCallback(() => setTooltipVisible(true), []);
    const handleMouseLeave = useCallback(() => setTooltipVisible(false), []);

    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NetworkDevice
          name={name}
          ip={ip}
          mac={mac}
          type={type}
          status={status}
        />
        <Tooltip device={{ name, ip, mac }} isVisible={isTooltipVisible} />
      </div>
    );
  }
);

const NetworkDevice = React.memo(({ name, ip, mac, type, status }) => (
  <div className="p-2 md:p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group">
    <DeviceIcon type={type} status={status} />
    <div className="mt-2 text-center transition-opacity duration-200 group-hover:opacity-50">
      <div className="text-xs md:text-base font-semibold">{name}</div>
      <div className="text-xxs md:text-xs text-gray-600">IP: {ip}</div>
      <div className="text-xxs md:text-xs text-gray-500">MAC: {mac}</div>
    </div>
  </div>
));

const Tooltip = React.memo(({ device, isVisible }) => (
  <div
    className={`absolute top-1/2 left-full transform -translate-y-1/2 ml-4 p-2 bg-black text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10 transition-opacity duration-200 ${
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <div>{device.name}</div>
    <div>IP: {device.ip}</div>
    <div>MAC: {device.mac}</div>
  </div>
));

const DeviceGrid = React.memo(({ devices, getDeviceStatus }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
    <div className="md:space-y-8">
      {devices.slice(0, 2).map((device) => (
        <NetworkDeviceWithTooltip
          key={device.name}
          {...device}
          status={getDeviceStatus(device)}
        />
      ))}
    </div>

    <div className="flex items-center justify-center">
      <div className="relative">
        <Network
          className={`w-16 h-16 md:w-20 md:h-20 ${
            getDeviceStatus({ name: "network" }) !== "text-gray-400"
              ? "text-blue-500"
              : "text-gray-400"
          }`}
        />
        {getDeviceStatus({ name: "broadcast" }) ===
          "text-yellow-500 animate-pulse" && (
          <div className="hidden md:block absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs p-1 rounded z-10">
            Broadcasting ARP Request
          </div>
        )}
      </div>
    </div>

    <div className="md:space-y-8">
      {devices.slice(2).map((device) => (
        <NetworkDeviceWithTooltip
          key={device.name}
          {...device}
          status={getDeviceStatus(device)}
        />
      ))}
    </div>
  </div>
));

const Timeline = React.memo(({ currentStep, totalSteps }) => (
  <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
          index <= currentStep ? "bg-blue-500" : "bg-gray-200"
        }`}
      />
    ))}
  </div>
));

const StepControls = React.memo(({ state, dispatch }) => {
  const { currentStep, steps, isPlaying } = state;

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">
            {steps[currentStep].title}
          </h2>
          <div className="text-xs md:text-sm text-gray-500 mt-1">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: "TOGGLE_PLAY" })}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            {isPlaying ? (
              <PauseCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            ) : (
              <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            )}
          </button>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>
      </div>
      <Timeline currentStep={currentStep} totalSteps={steps.length} />
    </div>
  );
});

const InfoPanel = React.memo(({ state }) => {
  const { steps, currentStep, arpCache } = state;
  const currentStepData = steps[currentStep];

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        <h3 className="text-base md:text-lg font-semibold">
          {currentStepData.title}
        </h3>
      </div>
      <div className="prose prose-xs md:prose-sm">
        <p className="text-gray-600">{currentStepData.description}</p>
        {currentStepData.technicalDetails && (
          <ul className="list-disc list-inside mt-2 space-y-2">
            {currentStepData.technicalDetails.map((detail, index) => (
              <li key={index} className="text-gray-700">
                {detail}
              </li>
            ))}
          </ul>
        )}
        {Object.keys(arpCache).length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-green-800">
              ARP Cache Update
            </div>
            {Object.entries(arpCache).map(([ip, mac]) => (
              <div key={ip} className="text-xs text-green-600">
                {ip} → {mac}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const initialState = {
  currentStep: 0,
  isPlaying: false,
  arpCache: {},
  steps: [
    {
      title: "Network Initialization",
      description:
        "All network devices are powered on and have been assigned IP addresses within the same subnet. At this stage, the ARP cache on each device is empty.",
      technicalDetails: [
        "Each device has a unique IP address for identification on the network.",
        "The subnet mask (e.g., 255.255.255.0) defines which part of the IP address identifies the network and which part identifies the host.",
        "The ARP cache is a table used by the operating system to store mappings between IP addresses and MAC addresses.",
        "Without these mappings, devices cannot communicate at the data link layer.",
      ],
    },
    {
      title: "ARP Request Initiated",
      description:
        "Client 1 wants to send data to the File Server (IP: 192.168.1.100) but does not have the File Server's MAC address in its ARP cache. Client 1 initiates an ARP request.",
      technicalDetails: [
        "Client 1 constructs an ARP request packet. This packet includes the sender's MAC address, sender's IP address, the target IP address (File Server's IP), and a placeholder for the target MAC address (set to 00:00:00:00:00:00).",
        "The ARP request is an Ethernet frame with the destination MAC address set to the broadcast address (FF:FF:FF:FF:FF:FF).",
        "The EtherType field in the Ethernet frame is set to 0x0806 to indicate an ARP packet.",
      ],
    },
    {
      title: "ARP Request Broadcasted",
      description:
        "Client 1 broadcasts the ARP request to all devices on the local network segment.",
      technicalDetails: [
        "The ARP request frame is sent out on the network interface. Because the destination MAC address is the broadcast address, the frame is sent to every device connected to the same local network segment (collision domain).",
        "Switches on the network will flood the frame out on all ports except the one it was received on.",
        "Devices receive the frame and check the EtherType. If it's 0x0806, they pass the packet up to the ARP handling process.",
      ],
    },
    {
      title: "ARP Request Processing",
      description:
        "All devices on the network receive the ARP request. Each device examines the target IP address to determine if it matches its own IP address.",
      technicalDetails: [
        "Devices compare the target IP in the ARP request to their own IP address.",
        "If the IP addresses don't match, the device silently discards the ARP request.",
        "If the target IP address matches (as is the case with the File Server), the device proceeds to the next step.",
      ],
    },
    {
      title: "ARP Reply Sent",
      description:
        "The File Server recognizes that the ARP request is for its IP address. It prepares an ARP reply message.",
      technicalDetails: [
        "The File Server prepares an ARP reply. It takes its own MAC address and the sender's MAC and IP address from the ARP request.",
        "The ARP reply packet has the following structure: sender MAC (File Server's), sender IP (File Server's), target MAC (Client 1's), and target IP (Client 1's).",
        "The EtherType is again 0x0806 for ARP.",
        "The destination MAC address for the frame is set to the MAC address of Client 1 (unicast).",
      ],
    },
    {
      title: "ARP Reply Received",
      description: "Client 1 receives the ARP reply from the File Server.",
      technicalDetails: [
        "Client 1 receives the Ethernet frame and checks the EtherType. It identifies it as an ARP reply.",
        "Client 1 extracts the File Server's MAC address from the ARP reply packet.",
      ],
    },
    {
      title: "ARP Cache Updated",
      description:
        "Client 1 updates its ARP cache with the File Server's MAC address, creating a mapping between the File Server's IP address and its MAC address.",
      technicalDetails: [
        "Client 1 adds a new entry in its ARP cache: IP address 192.168.1.100 maps to the File Server's MAC address.",
        "This mapping will be used for future communications with the File Server.",
        "ARP cache entries typically have a timeout period (e.g., a few minutes) after which they expire and need to be rediscovered.",
      ],
    },
    {
      title: "Communication Established",
      description:
        "Client 1 can now send data to the File Server using the newly acquired MAC address.",
      technicalDetails: [
        "When Client 1 wants to send an IP packet to the File Server, it will encapsulate the IP packet in an Ethernet frame.",
        "The destination MAC address in the Ethernet frame will be set to the File Server's MAC address (obtained from the ARP cache).",
        "The frame is sent out on the network interface, and this time it is a unicast transmission directly to the File Server.",
      ],
    },
  ],
  devices: [
    {
      type: DEVICE_TYPES.LAPTOP,
      name: "Client 1",
      ip: "192.168.1.10",
      mac: generateMacAddress(),
    },
    {
      type: DEVICE_TYPES.LAPTOP,
      name: "Client 2",
      ip: "192.168.1.20",
      mac: generateMacAddress(),
    },
    {
      type: DEVICE_TYPES.SERVER,
      name: "File Server",
      ip: "192.168.1.100",
      mac: generateMacAddress(),
    },
    {
      type: DEVICE_TYPES.SERVER,
      name: "Web Server",
      ip: "192.168.1.200",
      mac: generateMacAddress(),
    },
    {
      type: DEVICE_TYPES.SERVER,
      name: "Mail Server",
      ip: "192.168.1.300",
      mac: generateMacAddress(),
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "NEXT_STEP": {
      const isLastStep = state.currentStep === state.steps.length - 1;
      const nextStep = isLastStep ? state.currentStep : state.currentStep + 1;
      let updatedArpCache = state.arpCache;

      // Update ARP cache after receiving reply
      if (nextStep === 6) {
        const fileServer = state.devices.find(
          (device) => device.name === "File Server"
        );
        updatedArpCache = {
          ...state.arpCache,
          [fileServer.ip]: fileServer.mac,
        };
      }

      return {
        ...state,
        currentStep: nextStep,
        isPlaying: !isLastStep,
        arpCache: updatedArpCache,
      };
    }
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "RESET":
      return { ...initialState, devices: state.devices };
    default:
      return state;
  }
}

const getDeviceStatus = (state) => (device) => {
  const { currentStep } = state;

  const statusMap = {
    1: {
      "Client 1": "text-yellow-500",
    },
    2: {
      "Client 1": "text-yellow-500 animate-pulse",
      broadcast: "text-yellow-500 animate-pulse",
    },
    3: {
      "Client 1": "text-blue-500",
    },
    4: Object.fromEntries(
      state.devices
        .filter((d) => d.name !== "Client 1")
        .map((d) => [d.name, "text-blue-500"])
    ),
    5: { "File Server": "text-green-500 animate-pulse" },
    6: {
      "Client 1": "text-green-500 animate-pulse",
    },
    7: {
      "Client 1": "text-green-500",
      "File Server": "text-green-500",
    },
    8: {
      "Client 1": "text-blue-500",
      "File Server": "text-blue-500",
    },
  };

  return statusMap[currentStep]?.[device.name] || "text-gray-400";
};

const ARPVisualization = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getStatus = useMemo(() => getDeviceStatus(state), [state]);

  useEffect(() => {
    let timer = null;
    if (state.isPlaying) {
      timer = setTimeout(() => {
        dispatch({ type: "NEXT_STEP" });
      }, 3000); // Reduced timeout for faster animation
    }
    return () => clearTimeout(timer);
  }, [state.isPlaying, state.currentStep]);

  return (
    <div className="min-h-screen bg-gray-100 font-mono">
      {/* Introduction Message */}
      <div className="bg-blue-500 text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-3xl font-bold mb-2">
            Understanding ARP: An Interactive Visualization
          </h1>
          <p className="text-sm md:text-base">
            Explore how the Address Resolution Protocol (ARP) works within a
            simulated network. Follow each step as devices discover each other's
            MAC addresses, enabling communication.
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <StepControls state={state} dispatch={dispatch} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="col-span-1 md:col-span-2 bg-white rounded-lg p-4 md:p-6">
              <DeviceGrid devices={state.devices} getDeviceStatus={getStatus} />
            </div>
            <div className="col-span-1">
              <InfoPanel state={state} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARPVisualization;
