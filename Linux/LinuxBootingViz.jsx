import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Server, ArrowRight, Info, Activity, Shield, Clock, Zap, AlertCircle, Check, HelpCircle, Play, Pause, RefreshCcw, Terminal } from 'lucide-react';

const stagesData = [
  {
    name: 'BIOS/UEFI',
    description: 'Initial hardware checks and boot preparation.',
    detailedDescription: 'The Basic Input/Output System (BIOS) or Unified Extensible Firmware Interface (UEFI) performs a Power-On Self-Test (POST) to ensure hardware is functioning correctly. It then identifies and initializes essential hardware components like the CPU, memory, and storage devices. Finally, it locates and loads the bootloader from the designated boot device.',
    icon: <Server className="w-5 h-5" />,
    tasks: [
      'Power-On Self-Test (POST): Checks hardware integrity.',
      'CPU Initialization: Starts the central processing unit.',
      'Memory Check: Verifies RAM functionality.',
      'Device Enumeration: Identifies connected hardware.',
      'Boot Device Selection: Chooses the drive to boot from.'
    ],
    commonIssues: [
      'Incorrect boot order in BIOS settings.',
      'Hardware failure detected during POST (e.g., RAM issues).',
      'Outdated or corrupted BIOS/UEFI firmware.',
      'Loose or faulty hardware connections.'
    ],
    advancedDetails: 'Delving deeper, the firmware interacts directly with the hardware at a very low level. Understanding the specific error codes during POST can be crucial for diagnosing hardware problems. Modern UEFI also offers secure boot features and more advanced boot management capabilities.',
    troubleshooting: [
      'Consult your motherboard manual for POST beep codes or on-screen error messages.',
      'Ensure all hardware components are properly seated and connected.',
      'Try booting with minimal hardware to isolate potential issues.',
      'Consider updating your BIOS/UEFI firmware from the manufacturer\'s website (proceed with caution).'
    ],
    timeRange: '5-30 seconds',
    color: 'bg-indigo-500'
  },
  {
    name: 'GRUB',
    description: 'Loads the operating system kernel.',
    detailedDescription: 'The Grand Unified Bootloader (GRUB) is a crucial intermediary. It loads the kernel image and the initial ramdisk (initramfs) into memory. GRUB presents a boot menu, allowing users to select different operating systems or kernel versions. It also passes boot parameters to the kernel, configuring its initial behavior.',
    icon: <ArrowRight className="w-5 h-5" />,
    tasks: [
      'Load GRUB Configuration: Reads settings from `/boot/grub/grub.cfg`.',
      'Display Boot Menu: Presents options to the user (if configured).',
      'Load Kernel Image: Loads the selected kernel file into RAM.',
      'Load Initramfs: Loads a temporary root filesystem.',
      'Pass Boot Parameters: Sends instructions to the kernel.'
    ],
    commonIssues: [
      'Missing or corrupted GRUB configuration file (`grub.cfg`).',
      'Incorrect kernel parameters leading to boot failures.',
      'Issues with the specified root partition UUID in the GRUB configuration.',
      'Problems after manually editing the GRUB configuration without proper understanding.'
    ],
    advancedDetails: 'GRUB’s configuration file can be highly customized to manage complex multi-boot environments. Understanding the syntax and available modules within GRUB is essential for advanced troubleshooting and configuration. Secure boot settings in UEFI can also impact GRUB’s ability to load.',
    troubleshooting: [
      'Boot from a live environment to repair or regenerate the GRUB configuration.',
      'Use the GRUB rescue prompt to manually load the kernel and initramfs.',
      'Review the `/boot/grub/grub.cfg` file for errors (be cautious when editing).',
      'Ensure the kernel and initramfs files specified in the configuration exist and are not corrupted.'
    ],
    timeRange: '2-10 seconds',
    color: 'bg-teal-500'
  },
  {
    name: 'Kernel',
    description: 'Core operating system initialization.',
    detailedDescription: 'The Linux kernel takes over, initializing core operating system functionalities. This involves setting up memory management, scheduling processes, and initializing essential hardware drivers. The kernel mounts the root filesystem specified by the boot parameters, making the main operating system files accessible.',
    icon: <Zap className="w-5 h-5" />,
    tasks: [
      'Decompress Kernel: Extracts the compressed kernel image.',
      'Initialize CPU: Sets up the processor for operation.',
      'Setup Memory Management: Organizes system memory.',
      'Load Drivers: Enables communication with hardware.',
      'Mount Root Filesystem: Makes the main OS partition accessible.'
    ],
    commonIssues: [
      'Missing or incompatible kernel modules (drivers).',
      'Kernel panics due to critical errors during initialization.',
      'Filesystem errors preventing the root filesystem from mounting.',
      'Incorrect or missing drivers for essential hardware components.'
    ],
    advancedDetails: 'The kernel interacts with hardware through modules. Understanding how to compile and load custom kernel modules can be crucial for supporting specific hardware. The Device Tree (DTB) also plays a significant role in describing hardware to the kernel on modern systems.',
    troubleshooting: [
      'Boot with a previous kernel version to bypass potential issues with the current one.',
      'Use kernel parameters like `nomodeset` to troubleshoot graphics driver problems.',
      'Examine the kernel logs (dmesg) for detailed error messages.',
      'Ensure necessary kernel modules are present in the initramfs image.'
    ],
    timeRange: '5-20 seconds',
    color: 'bg-yellow-600'
  },
  {
    name: 'Init System',
    description: 'Starts system services and user environment.',
    detailedDescription: 'The init system (like systemd or SysVinit) is the first process spawned by the kernel. It manages the startup of system services, network configuration, and user session management. It reads configuration files to determine which services to start and in what order, establishing the basic operating environment.',
    icon: <Activity className="w-5 h-5" />,
    tasks: [
      'Start Init Process: Launches systemd or another init system.',
      'Parse Unit Files: Reads service configurations.',
      'Resolve Dependencies: Ensures services start in the correct order.',
      'Start Core Services: Launches essential system processes.',
      'Setup User Environment: Prepares for user logins.'
    ],
    commonIssues: [
      'Service dependency conflicts preventing services from starting.',
      'Errors in service unit files causing failures.',
      'Services timing out during startup.',
      'Incorrectly configured network settings preventing network services from starting.'
    ],
    advancedDetails: 'Systemd uses a sophisticated dependency management system and provides extensive logging capabilities. Understanding systemd units, targets, and journals is crucial for system administration and troubleshooting. Older init systems like SysVinit use shell scripts for service management.',
    troubleshooting: [
      'Use `systemctl status <service>` to check the status of individual services (for systemd).',
      'Examine the system logs using `journalctl` (for systemd) or logs in `/var/log`.',
      'Check service unit files for syntax errors or incorrect configurations.',
      'Manually start services using `systemctl start <service>` to isolate issues.'
    ],
    timeRange: '10-30 seconds',
    color: 'bg-purple-600'
  },
  {
    name: 'User Space',
    description: 'Final stage, user login and desktop environment.',
    detailedDescription: 'The system reaches the final stage, transitioning to user space. This involves starting the display manager (for graphical logins), launching user services, and presenting the login prompt. Once a user logs in, their desktop environment (GNOME, KDE, etc.) is started, completing the boot process.',
    icon: <Shield className="w-5 h-5" />,
    tasks: [
      'Start Networking: Initializes network connections.',
      'Launch Display Manager: Starts the graphical login screen.',
      'Start User Services: Launches user-specific background processes.',
      'Enable Login Prompt: Allows users to log in.',
      'Complete Boot Process: System is ready for user interaction.'
    ],
    commonIssues: [
      'Display manager failing to start, resulting in a command-line login only.',
      'Network configuration problems preventing network access.',
      'Permission issues preventing user services from starting.',
      'Problems with the user’s desktop environment configuration.'
    ],
    advancedDetails: 'The display manager handles authentication and session management. Understanding Xorg or Wayland (display servers) and desktop environment configurations is key for troubleshooting issues in this stage. Login managers like GDM, SDDM, and LightDM have their own configurations.',
    troubleshooting: [
      'Check the logs of the display manager (e.g., in `/var/log`).',
      'Examine the user’s `.xsession-errors` file for issues with the desktop environment.',
      'Verify network configuration using tools like `ip addr` and `ping`.',
      'Try logging in as a different user to isolate user-specific configuration problems.'
    ],
    timeRange: '15-45 seconds',
    color: 'bg-red-600'
  }
];

const StageButton = ({ stage, index, currentStage, onClick }) => (
  <button
    onClick={() => onClick(index)}
    className={`relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors focus:outline-none flex-shrink-0
      ${currentStage === index
        ? `${stage.color} text-white shadow-md`
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
  >
    {React.cloneElement(stage.icon, { className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" })}
    <span className="whitespace-nowrap">{stage.name}</span>
    {/* Triangle indicator */}
    {currentStage === index && (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-3 h-3 bg-white rotate-45 shadow-sm border-b border-r border-gray-200"></div>
    )}
  </button>
);

const StageDetails = ({ stage }) => (
  <div className="space-y-4 sm:space-y-6">
    <div className={`bg-${stage.color.split('-')[0]}-50 border border-${stage.color.split('-')[0]}-200 rounded-lg p-4 sm:p-5`}>
      <h3 className="font-semibold text-base sm:text-lg text-gray-800 flex items-center space-x-2">
        {React.cloneElement(stage.icon, { className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" })}
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
          <li key={index} className="text-gray-600 text-xs sm:text-sm flex items-center space-x-2">
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
    // BIOS Phase
    [
      '[    0.000000] BIOS-provided physical RAM map:',
      '[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable',
      '[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x00000000bffdffff] usable',
      '[    0.000000] NX (Execute Disable) protection: active',
      '[    0.000000] DMI: System manufacturer System Product Name/P8Z77-V PRO, BIOS 1234 12/12/2023',
      '[    0.000000] Hypervisor detected: KVM',
    ],
    // GRUB Phase
    [
      'Loading Linux 6.1.0-14-amd64 ...',
      'Loading initial ramdisk ...',
      'Starting version 254.5-1',
      '[    0.132513] Initializing cgroup subsys cpuset',
      '[    0.133024] Initializing cgroup subsys cpu',
      '[    0.133531] Initializing cgroup subsys cpuacct',
    ],
    // Kernel Phase
    [
      '[    1.015564] RTC time: 12:00:00, date: 2024/01/05',
      '[    1.016960] CPU0: Intel(R) Core(TM) i7-12700K CPU @ 3.60GHz stepping 02',
      '[    1.019870] Performance Events: PEBS fmt3+, 16-deep LBR, Core3 events, Intel PMU driver.',
      '[    1.167730] Initializing USB Mass Storage driver...',
      '[    1.168223] scsi host6: usb-storage 1-1:1.0',
      '[    1.168512] usbcore: registered new interface driver usb-storage',
    ],
    // Init System Phase
    [
      '[    2.324502] systemd[1]: systemd 254.5-1 running in system mode',
      '[    2.325890] systemd[1]: Detected architecture x86-64.',
      '[    2.327512] systemd[1]: Set hostname to <localhost>.',
      '[    2.329001] systemd[1]: Started Journal Service.',
      '[    2.330512] systemd[1]: Starting Load Kernel Modules...',
      '[    2.332001] systemd[1]: Starting Remount Root and Kernel File Systems...',
    ],
    // Login Phase
    [
      '[    4.152390] systemd[1]: Reached target Graphical Interface.',
      '[    4.153512] systemd[1]: Starting Update UTMP about System Runlevel Changes...',
      '[    4.155001] systemd[1]: Started Update UTMP about System Runlevel Changes.',
      'Welcome to Linux!',
      '',
      'localhost login: _'
    ]
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
        setLines(prev => [...prev, currentSequence[lineIndex]]);
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
        setProgress((prevProgress) => (prevProgress + (100 / stages.length)) % 100);
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
        color: stages[currentStage].color.replace('bg-', '')
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => {
        setParticles([]);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentStage, isAutoPlay, stages]);

  const handleStageClick = useCallback((index) => {
    setCurrentStage(index);
    setIsAutoPlay(false);
    setProgress((index / stages.length) * 100);
  }, [stages.length]);

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
              <Server className="w-5 h-5 sm:w-6 sm:h-6 font-bold text-indigo-500 flex-shrink-0" />
              <span>Linux Boot Process</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">From basic hardware checks to the login screen.</p>
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
                  ${isAutoPlay ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
              >
                {isAutoPlay ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isAutoPlay ? 'Pause' : 'Play'}
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
                backgroundColor: stages[currentStage].color.split('-')[0] !== 'bg' ? stages[currentStage].color : stages[currentStage].color.replace('bg', '').replace('-500', '-600'),
                transition: 'width 0.3s linear', // Smoother transition
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
                    <span className="text-gray-300 text-sm">Linux Boot Process</span>
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
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                        className={`text-gray-300 ${line?.startsWith('[')
                          ? 'text-green-400'
                          : line?.includes('error')
                          ? 'text-red-400'
                          : line?.includes('Warning')
                          ? 'text-yellow-400'
                          : 'text-gray-300'
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
                      style={{ width: `${(currentPhase + 1) * (100 / stages.length)}%` }}
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
                  <p className="text-gray-700 text-xs sm:text-sm">{stages[currentStage].detailedDescription}</p>
                  {stages[currentStage].advancedDetails && (
                    <details className="mt-4">
                      <summary className="text-blue-500 text-xs sm:text-sm cursor-pointer">More Details</summary>
                      <p className="text-gray-600 text-xs mt-2">{stages[currentStage].advancedDetails}</p>
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
                    <li key={index} className="text-orange-700 text-xs sm:text-sm flex items-center space-x-2">
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
                      <li key={index} className="text-green-700 text-xs sm:text-sm flex items-center space-x-2">
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

export default LinuxBootingViz;
