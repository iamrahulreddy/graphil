import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Server,
  Info,
  Activity,
  Clock,
  AlertCircle,
  Check,
  HelpCircle,
  Play,
  Pause,
  RefreshCcw,
  Terminal,
  Cpu,
  Loader,
  Users,
  Monitor,
} from "lucide-react";

const stagesData = [
  {
    name: "Power On / Firmware (BIOS/UEFI)",
    description: "Initial hardware checks and boot device selection.",
    detailedDescription:
      "The system is powered on. The firmware (BIOS or UEFI) performs a Power-On Self-Test (POST) to ensure essential hardware components are functioning correctly. It initializes the CPU, memory, and other peripherals. The firmware then identifies the boot device based on the configured boot order and loads the bootloader from that device.",
    icon: <Server className="w-5 h-5" />,
    tasks: [
      "Power-On Self-Test (POST)",
      "Hardware initialization (CPU, Memory, etc.)",
      "Boot device detection",
      "Load bootloader",
    ],
    commonIssues: [
      "Incorrect boot order",
      "Hardware failure (POST errors)",
      "Corrupted firmware",
    ],
    advancedDetails:
      "The firmware interacts directly with hardware. Modern UEFI systems often include features like Secure Boot, which can impact later stages. Understanding POST error codes (beeps or on-screen) is crucial for diagnosing hardware issues.",
    troubleshooting: [
      "Check BIOS/UEFI settings for boot order",
      "Consult motherboard manual for POST codes",
      "Reseat hardware components",
      "Update firmware (with caution)",
    ],
    timeRange: "5-30 seconds",
    color: "bg-blue-500",
  },
  {
    name: "Bootloader (GRUB)",
    description: "Loads the kernel and initramfs.",
    detailedDescription:
      "The bootloader (commonly GRUB) takes control. It loads the Linux kernel and the initial RAM disk (initramfs) into memory. GRUB often presents a menu to select different operating systems or kernel versions. It also passes boot parameters to the kernel.",
    icon: <Loader className="w-5 h-5 animate-spin" />,
    tasks: [
      "Load kernel image into memory",
      "Load initramfs",
      "Present boot menu (optional)",
      "Pass boot parameters to kernel",
    ],
    commonIssues: [
      "Corrupted GRUB configuration",
      "Incorrect kernel parameters",
      "Missing kernel or initramfs",
    ],
    advancedDetails:
      "GRUB can be highly customized for complex multi-boot setups. Secure Boot can influence GRUB's ability to load the kernel. Understanding GRUB's configuration language is helpful for advanced troubleshooting.",
    troubleshooting: [
      "Boot from a live environment to repair GRUB",
      "Use GRUB rescue prompt",
      "Verify kernel and initramfs files",
    ],
    timeRange: "2-10 seconds",
    color: "bg-green-500",
  },
  {
    name: "Kernel Initialization",
    description: "Core OS setup and driver loading.",
    detailedDescription:
      "The kernel takes over and begins initializing the core operating system. It sets up memory management, process scheduling, and loads essential hardware drivers. It then mounts the root filesystem as specified by boot parameters.",
    icon: <Cpu className="w-5 h-5" />,
    tasks: [
      "Decompress kernel",
      "Initialize CPU and memory management",
      "Load drivers",
      "Mount root filesystem",
    ],
    commonIssues: [
      "Missing or incompatible drivers",
      "Kernel panic",
      "Filesystem errors",
    ],
    advancedDetails:
      "The kernel uses modules to interact with hardware. Understanding how to manage kernel modules is essential for supporting specific hardware. Device Tree (DTB) plays a role in describing hardware to the kernel on many systems.",
    troubleshooting: [
      "Boot with a previous kernel",
      "Use kernel parameters (e.g., `nomodeset`)",
      "Examine kernel logs (dmesg)",
    ],
    timeRange: "5-20 seconds",
    color: "bg-yellow-500",
  },
  {
    name: "Initial RAM Disk (initramfs)",
    description: "Prepares the root filesystem and loads necessary modules.",
    detailedDescription:
      "The initramfs is a temporary root filesystem loaded into RAM. It contains essential tools and modules needed to mount the real root filesystem. It performs tasks like loading drivers for storage devices, setting up device mapper volumes, or decrypting the root filesystem before handing over control to the init system.",
    icon: <memorychip className="w-5 h-5" />,
    tasks: [
      "Load necessary modules (storage, etc.)",
      "Setup device mapper volumes (if needed)",
      "Decrypt root filesystem (if encrypted)",
      "Mount real root filesystem",
      "Hand over to init system",
    ],
    commonIssues: [
      "Missing modules in initramfs",
      "Incorrect initramfs configuration",
      "Problems with encrypted volumes",
    ],
    advancedDetails:
      "The initramfs is often customized for specific hardware or system configurations. It can be rebuilt using tools like `dracut` or `mkinitcpio`. Understanding its contents is important for troubleshooting early boot issues.",
    troubleshooting: [
      "Rebuild initramfs",
      "Inspect initramfs contents",
      "Check boot parameters related to initramfs",
    ],
    timeRange: "2-5 seconds",
    color: "bg-purple-500",
  },
  {
    name: "Init System (systemd)",
    description: "Starts system services and manages the user environment.",
    detailedDescription:
      "The init system (typically systemd) is the first process started by the kernel. It manages system services, mounts filesystems, sets up networking, and configures the user environment. Systemd uses unit files to define and manage services and their dependencies.",
    icon: <Activity className="w-5 h-5" />,
    tasks: [
      "Start system services",
      "Mount filesystems",
      "Configure networking",
      "Manage user sessions",
    ],
    commonIssues: [
      "Service startup failures",
      "Filesystem mount errors",
      "Network configuration issues",
    ],
    advancedDetails:
      "Systemd uses a complex dependency management system. Understanding systemd units, targets, and journals is crucial for system administration. Older systems might use SysVinit, which uses shell scripts for service management.",
    troubleshooting: [
      "Use `systemctl status <service>`",
      "Examine `journalctl` logs",
      "Check unit file configurations",
    ],
    timeRange: "10-30 seconds",
    color: "bg-indigo-500",
  },
  {
    name: "Display Manager",
    description: "Provides graphical login.",
    detailedDescription:
      "The display manager (e.g., GDM, LightDM) starts the X Window System or Wayland and provides a graphical login interface. It handles user authentication and starts the user's desktop environment.",
    icon: <Monitor className="w-5 h-5" />,
    tasks: [
      "Start X server or Wayland compositor",
      "Display login screen",
      "Authenticate users",
      "Start desktop environment",
    ],
    commonIssues: [
      "Display manager fails to start",
      "Authentication problems",
      "Desktop environment issues",
    ],
    advancedDetails:
      "Understanding display servers (Xorg, Wayland) and desktop environments (GNOME, KDE, etc.) is important for troubleshooting graphical login issues. Display managers have their own configuration files.",
    troubleshooting: [
      "Check display manager logs",
      "Verify user permissions",
      "Try a different desktop environment",
    ],
    timeRange: "5-15 seconds",
    color: "bg-pink-500",
  },
  {
    name: "User Space & Desktop Environment",
    description: "User login, session management, and application launch.",
    detailedDescription:
      "After successful login, the user's desktop environment is loaded. User-specific services and applications are started. The system is now fully operational and ready for user interaction.",
    icon: <Users className="w-5 h-5" />,
    tasks: [
      "Start user session",
      "Load desktop environment",
      "Launch user applications",
    ],
    commonIssues: [
      "Desktop environment crashes",
      "Application startup problems",
      "User configuration errors",
    ],
    advancedDetails:
      "Each desktop environment has its own configuration system. Understanding how user sessions are managed is crucial for troubleshooting user-specific issues. XDG specifications play a role in standardizing desktop environments.",
    troubleshooting: [
      "Check user's `.xsession-errors` file",
      "Examine application logs",
      "Try a different user account",
    ],
    timeRange: "5-20 seconds",
    color: "bg-teal-500",
  },
];

const StageButton = ({ stage, index, currentStage, onClick }) => (
  <button
    onClick={() => onClick(index)}
    className={`relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors focus:outline-none flex-shrink-0
      ${
        currentStage === index
          ? `${stage.color} text-white shadow-lg hover:brightness-110`
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
  >
    {React.cloneElement(stage.icon, {
      className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0",
    })}
    <span className="whitespace-nowrap">{stage.name}</span>
    {/* Indicator */}
    {currentStage === index && (
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent ${stage.color}`}
      ></div>
    )}
  </button>
);

const StageDetails = ({ stage }) => (
  <div className="space-y-4 sm:space-y-6">
    <div
      className={`${stage.color.replace("bg", "bg-opacity-10")} border border-${
        stage.color.split("-")[0]
      }-200 rounded-lg p-4 sm:p-5`}
    >
      <h3 className="font-semibold text-base sm:text-lg text-gray-800 flex items-center space-x-2">
        {React.cloneElement(stage.icon, {
          className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0",
        })}
        <span>{stage.name}</span>
      </h3>
      <p className="text-gray-700 text-sm mt-2">{stage.description}</p>
    </div>

    <div className="bg-cyan-100 rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
        <h4 className="font-semibold text-sm sm:text-md text-gray-700 flex items-center space-x-2">
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>Key Tasks</span>
        </h4>
      </div>
      <ul className="p-4 sm:p-5 space-y-2 sm:space-y-3">
        {stage.tasks.map((task, index) => (
          <li
            key={index}
            className="text-gray-600 text-xs sm:text-sm flex items-center space-x-2"
          >
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500 flex-shrink-0"></div>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const LinuxBootingVisualizer = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(3000);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [lines, setLines] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(50);

  const stages = useMemo(() => stagesData, []);

  const bootSequence = [
    // Power On / Firmware Phase
    [
      "[    0.000000] Initializing BIOS/UEFI...",
      "[    0.001000] Performing Power-On Self Test (POST)...",
      "[    0.005000] Checking hardware components...",
      "[    0.010000] Initializing CPU and memory...",
      "[    0.015000] Detecting boot device...",
      "[    0.020000] Boot device found: /dev/sda1",
      "[    0.025000] Loading bootloader...",
    ],
    // Bootloader Phase
    [
      "GRUB version 2.06",
      "Loading Linux kernel 6.1.0-14-amd64...",
      "Loading initial RAM disk...",
      "[    0.132513] Initializing cgroup subsys cpuset",
      "[    0.133024] Initializing cgroup subsys cpu",
    ],
    // Kernel Initialization Phase
    [
      "[    1.000000] Linux version 6.1.0-14-amd64",
      "[    1.015564] Initializing system time...",
      "[    1.016960] Detecting CPU information...",
      "[    1.019870] Loading drivers...",
      "[    1.167730] Initializing storage devices...",
      "[    1.168223] Mounting root filesystem...",
    ],
    // Initramfs Phase
    [
      "[    1.500000] Loading initramfs...",
      "[    1.510000] Checking root filesystem...",
      "[    1.520000] Loading storage drivers...",
      "[    1.530000] Mounting /dev/sda1...",
      "[    1.540000] Switching to real root...",
    ],
    // Init System Phase
    [
      "[    2.324502] systemd[1]: Starting systemd...",
      "[    2.325890] systemd[1]: Detecting architecture...",
      "[    2.327512] systemd[1]: Setting hostname...",
      "[    2.329001] systemd[1]: Starting essential services...",
      "[    2.330512] systemd[1]: Mounting filesystems...",
      "[    2.332001] systemd[1]: Configuring networking...",
    ],
    // Display Manager Phase
    [
      "[    3.500000] Starting display manager...",
      "[    3.510000] Initializing X server...",
      "[    3.520000] Loading GDM...",
      "[    3.530000] Displaying login screen...",
    ],
    // User Space & Desktop Environment Phase
    [
      "[    4.152390] systemd[1]: Reached target Graphical Interface.",
      "Welcome to Linux!",
      "localhost login: ",
    ],
  ];

  // Synchronize terminal phases with stage changes
  useEffect(() => {
    if (currentStage !== currentPhase) {
      setCurrentPhase(currentStage);
      setLines([]); // Reset lines when the phase changes
    }
  }, [currentStage, currentPhase]);

  useEffect(() => {
    if (!isRunning) return;

    const currentSequence = bootSequence[currentPhase];
    if (!currentSequence) return;

    let lineIndex = lines.length;

    // Check if we've already displayed all lines for the current phase
    if (lineIndex >= currentSequence.length) {
      return; // Don't set up a new interval if all lines are displayed
    }

    const interval = setInterval(() => {
      if (lineIndex < currentSequence.length) {
        setLines((prev) => [...prev, currentSequence[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentPhase, isRunning, lines.length, speed, bootSequence]);

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentStage((prevStage) => (prevStage + 1) % stages.length);
        setProgress(
          (prevProgress) => (prevProgress + 100 / stages.length) % 100
        );
      }, simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, simulationSpeed, stages.length]);

  useEffect(() => {
    if (isAutoPlay) {
      const newParticles = Array.from({ length: 5 }).map(() => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 2 + 1,
        color: stages[currentStage].color.replace("bg-", ""),
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => {
        setParticles([]);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentStage, isAutoPlay, stages]);

  const handleStageClick = useCallback(
    (index) => {
      setCurrentStage(index);
      setIsAutoPlay(false);
      setProgress((index / stages.length) * 100);
    },
    [stages.length]
  );

  const reset = () => {
    setCurrentStage(0);
    setCurrentPhase(0);
    setLines([]);
    setIsRunning(true);
    setProgress(0);
  };

  return (
    <div className="bg-gray-50 font-mono min-h-screen py-4 sm:py-6 md:py-10 px-2 sm:px-4">
      <div className="mx-auto max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header & Navigation */}
        <div className="px-3 sm:px-6 py-3 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl text-gray-800 flex items-center space-x-2">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 font-bold text-blue-500 flex-shrink-0" />
              <span>Linux Boot Process</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Step-by-step visualization from power-on to login.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Typical Duration: {stages[currentStage].timeRange}</span>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium focus:outline-none transition-colors flex-1 sm:flex-none flex items-center justify-center
                  ${
                    isAutoPlay
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
              >
                {isAutoPlay ? (
                  <Pause className="w-4 h-4 mr-1" />
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                {isAutoPlay ? "Pause" : "Play"}
              </button>
              <select
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md border border-gray-300 text-xs sm:text-sm focus:outline-none"
              >
                <option value={1000}>Fast</option>
                <option value={3000}>Normal</option>
                <option value={5000}>Slow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stage Navigation */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4 overflow-x-auto mb-2 sm:mb-4">
            {stages.map((stage, index) => (
              <StageButton
                key={index}
                stage={stage}
                index={index}
                currentStage={currentStage}
                onClick={handleStageClick}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="relative bg-gray-200 rounded-full h-2 mb-6 sm:mb-8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                backgroundColor:
                  stages[currentStage].color.split("-")[0] !== "bg"
                    ? stages[currentStage].color
                    : stages[currentStage].color
                        .replace("bg", "")
                        .replace("-500", "-600"),
                transition: "width 0.3s linear", // Smoother transition
              }}
            />
          </div>

          {/* Terminal and Stage Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Terminal Output */}
            <div className="md:col-span-2 lg:col-span-2">
              <div className="bg-black rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-gray-800 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 text-sm">
                      Linux Boot Process
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="bg-gray-700 text-gray-300 text-xs rounded px-2 py-1 border border-gray-600"
                    >
                      <option value={25}>Fast</option>
                      <option value={50}>Normal</option>
                      <option value={100}>Slow</option>
                    </select>
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="text-gray-300 hover:text-white"
                    >
                      {isRunning ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={reset}
                      className="text-gray-300 hover:text-white"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Terminal Content */}
                <div className="p-4 h-[400px] overflow-auto">
                  <div className="space-y-1 font-mono text-sm">
                    {lines.map((line, index) => (
                      <div
                        key={index}
                        className={`text-gray-300 ${
                          line?.startsWith("[")
                            ? "text-green-400"
                            : line?.includes("error")
                            ? "text-red-400"
                            : line?.includes("Warning")
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                    <div className="text-gray-300 animate-pulse">_</div>
                  </div>
                </div>

                {/* Progress Bar for Terminal */}
                <div className="bg-gray-800 p-3">
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${(currentPhase + 1) * (100 / stages.length)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    {stages[currentPhase]?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Details */}
            <div className="md:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
              <StageDetails stage={stages[currentStage]} />

              {/* Explanation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-sm sm:text-md text-gray-700 flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>Explanation</span>
                  </h4>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-gray-700 text-xs sm:text-sm">
                    {stages[currentStage].detailedDescription}
                  </p>
                  {stages[currentStage].advancedDetails && (
                    <details className="mt-4">
                      <summary className="text-blue-500 text-xs sm:text-sm cursor-pointer">
                        More Details
                      </summary>
                      <p className="text-gray-600 text-xs mt-2">
                        {stages[currentStage].advancedDetails}
                      </p>
                    </details>
                  )}
                </div>
              </div>

              {/* Common Issues & Troubleshooting */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-5">
                <h4 className="font-semibold text-sm sm:text-md text-orange-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Common Issues</span>
                </h4>
                <ul className="mt-3 space-y-2 sm:space-y-3">
                  {stages[currentStage].commonIssues.map((issue, index) => (
                    <li
                      key={index}
                      className="text-orange-700 text-xs sm:text-sm flex items-center space-x-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></div>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {stages[currentStage].troubleshooting && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-5">
                  <h4 className="font-semibold text-sm sm:text-md text-green-700 flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Troubleshooting Tips</span>
                  </h4>
                  <ul className="mt-3 space-y-2 sm:space-y-3">
                    {stages[currentStage].troubleshooting.map((tip, index) => (
                      <li
                        key={index}
                        className="text-green-700 text-xs sm:text-sm flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LinuxBootingVisualizer;
