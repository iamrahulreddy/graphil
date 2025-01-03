import React, { useState, useEffect, useRef } from 'react';
import { Server, ArrowRight, Info, Activity, Shield, Clock, Zap, AlertCircle, Check, HelpCircle, Play, Pause } from 'lucide-react';

const LinuxBootingVisualizer = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(3000);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  const stages = [
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

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentStage((prevStage) => (prevStage + 1) % stages.length);
      }, simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, simulationSpeed, stages.length]);

  useEffect(() => {
    if (isAutoPlay) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev + 1) > 100 ? 0 : prev + 1);
      }, simulationSpeed / 100);
      return () => clearInterval(progressInterval);
    } else {
      setProgress(0);
    }
  }, [isAutoPlay, simulationSpeed]);

  const handleStageClick = (index) => {
    setCurrentStage(index);
    setIsAutoPlay(false);
    setProgress(0);
  };

  return (
    <div className="bg-gray-50 font-mono min-h-screen py-4 sm:py-6 md:py-10 px-2 sm:px-4">
      <div className="mx-auto max-w-7xl bg-white rounded-xl shadow-lg">
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

       <div className="p-6">
          <p className="text-black text-xs text-base leading-relaxed">
            The <span className="text-blue-500 font-bold">Linux</span> boot process involves several key stages: 
            <span className="text-purple-500 font-bold"> BIOS/UEFI</span>, 
            <span className="text-blue-500 font-bold"> GRUB</span>, 
            <span className="text-green-500 font-bold"> Kernel</span>, 
            <span className="text-yellow-500 font-bold"> Init System</span>, and 
            <span className="text-orange-700 font-bold"> User Space</span>. 
            Each of these stages has distinct responsibilities in the boot sequence, helping the system initialize and eventually reach a usable state. 
            The <span className="text-purple-500 font-bold">BIOS/UEFI</span> (Basic Input/Output System / Unified Extensible Firmware Interface) is responsible for performing hardware initialization and starting the boot process. It checks the hardware and loads the bootloader.
            The <span className="text-blue-500 font-bold">GRUB</span> (Grand Unified Bootloader) is the bootloader responsible for loading the operating system. It allows you to select the kernel to boot and passes control to it.
            The <span className="text-green-500 font-bold">Kernel</span> is the core of the operating system. It initializes the hardware, mounts the root filesystem, and starts necessary system processes.
            The <span className="text-yellow-500 font-bold">Init System</span> (such as <span className="text-orange-700 font-bold">Systemd</span>) is responsible for managing system services and processes after the kernel has been loaded. It ensures that all necessary background services and daemons are started.
            Finally, the <span className="text-orange-700 font-bold">User Space</span> is where user applications run. It includes the user interfaces, applications, and utilities that allow you to interact with the system.
          </p>
        </div>
 

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4 overflow-x-auto mb-2 sm:mb-4">
            {stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => handleStageClick(index)}
                className={`relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors focus:outline-none flex-shrink-0
                  ${currentStage === index
                    ? `${stage.color} text-white shadow-md`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {React.cloneElement(stage.icon, { className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" })}
                <span className="whitespace-nowrap">{stage.name}</span>
                {currentStage === index && <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-3 h-3 bg-white rotate-45 shadow-sm border-b border-r border-gray-200"></div>}
              </button>
            ))}
          </div>

          <div className="relative bg-gray-200 rounded-full h-2 mb-6 sm:mb-8 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                backgroundColor: stages[currentStage].color.split('-')[0] !== 'bg'? stages[currentStage].color: stages[currentStage].color.replace('bg','').replace('-500','-600'),
                transition: isAutoPlay ? 'width 0.1s linear' : 'none',
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Basic Information */}
            <div className="space-y-4 sm:space-y-6">
              <div className={`bg-${stages[currentStage].color.split('-')[0]}-50 border border-${stages[currentStage].color.split('-')[0]}-200 rounded-lg p-4 sm:p-5`}>
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 flex items-center space-x-2">
                  {React.cloneElement(stages[currentStage].icon, { className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" })}
                  <span>{stages[currentStage].name}</span>
                </h3>
                <p className="text-gray-700 text-sm mt-2">{stages[currentStage].description}</p>
              </div>

              <div className="bg-cyan-100 rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-sm sm:text-md text-gray-700 flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Key Tasks</span>
                  </h4>
                </div>
                <ul className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                  {stages[currentStage].tasks.map((task, index) => (
                    <li key={index} className="text-gray-600 text-xs sm:text-sm flex items-center space-x-2">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-4 sm:space-y-6">
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
            </div>

            {/* Troubleshooting */}
            <div className="space-y-4 sm:space-y-6 md:col-span-2 lg:col-span-1">
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
    </div>
  );
};

export default LinuxBootingVisualizer;
