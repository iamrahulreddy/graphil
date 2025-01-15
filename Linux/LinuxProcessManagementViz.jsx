import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Cpu, MemoryStick, Clock, Activity } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProcessManagementVisualization = () => {
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [nextPid, setNextPid] = useState(9); // Starting PID for new processes
    const [stateFilter, setStateFilter] = useState('all');

    // Fetch process data from a mock API or a real endpoint
    useEffect(() => {
        const fetchProcessData = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock process data - in real app, this would come from a system call or API
            const mockProcesses = [
                { pid: 1, name: 'systemd', state: 'S', priority: 20, nice: 0, cpu_usage: 0.2, memory_usage: 4.5, threads: 1, start_time: '2024-01-01 00:00:00', parent_pid: 0, children: [2, 3, 4], user: 'root', voluntary_switches: 1205, nonvoluntary_switches: 244, virtual_memory: 128000, resident_memory: 6400, group_id: 1, session_id: 1 },
                { pid: 2, name: 'kthreadd', state: 'S', priority: -20, nice: -20, cpu_usage: 0.0, memory_usage: 0.1, threads: 2, start_time: '2024-01-01 00:00:01', parent_pid: 0, children: [], user: 'root', voluntary_switches: 100, nonvoluntary_switches: 10, virtual_memory: 12000, resident_memory: 1000, group_id: 1, session_id: 1 },
                { pid: 3, name: 'rcu_sched', state: 'S', priority: -20, nice: -20, cpu_usage: 0.01, memory_usage: 0.01, threads: 1, start_time: '2024-01-01 00:00:02', parent_pid: 0, children: [], user: 'root', voluntary_switches: 105, nonvoluntary_switches: 12, virtual_memory: 12000, resident_memory: 1000, group_id: 1, session_id: 1 },
                { pid: 4, name: 'migration/0', state: 'S', priority: -20, nice: -20, cpu_usage: 0.0, memory_usage: 0.01, threads: 1, start_time: '2024-01-01 00:00:03', parent_pid: 0, children: [], user: 'root', voluntary_switches: 80, nonvoluntary_switches: 9, virtual_memory: 12000, resident_memory: 1000, group_id: 1, session_id: 1 },
                { pid: 5, name: 'chrome', state: 'R', priority: 20, nice: 0, cpu_usage: 15.2, memory_usage: 15.5, threads: 15, start_time: '2024-01-02 10:00:00', parent_pid: 1, children: [], user: 'john', voluntary_switches: 5000, nonvoluntary_switches: 2000, virtual_memory: 500000, resident_memory: 150000, group_id: 100, session_id: 100 },
                { pid: 6, name: 'node', state: 'S', priority: 20, nice: 0, cpu_usage: 2.1, memory_usage: 12.5, threads: 5, start_time: '2024-01-02 12:00:00', parent_pid: 1, children: [], user: 'john', voluntary_switches: 2000, nonvoluntary_switches: 500, virtual_memory: 300000, resident_memory: 80000, group_id: 100, session_id: 100 },
                { pid: 7, name: 'nvim', state: 'S', priority: 20, nice: 0, cpu_usage: 0.5, memory_usage: 1.5, threads: 2, start_time: '2024-01-03 10:00:00', parent_pid: 1, children: [], user: 'john', voluntary_switches: 100, nonvoluntary_switches: 10, virtual_memory: 50000, resident_memory: 10000, group_id: 100, session_id: 100 },
                { pid: 8, name: 'python3', state: 'D', priority: 20, nice: 0, cpu_usage: 3.1, memory_usage: 1.7, threads: 1, start_time: '2024-01-03 11:00:00', parent_pid: 1, children: [], user: 'john', voluntary_switches: 500, nonvoluntary_switches: 100, virtual_memory: 100000, resident_memory: 12000, group_id: 101, session_id: 101 },
            ];
            setProcesses(mockProcesses);
        };

        fetchProcessData();
        // In a real application, you would include error handling here using .catch()
    }, []);

    const processStates = {
        'R': 'Running',
        'S': 'Sleeping',
        'D': 'Uninterruptible Sleep',
        'Z': 'Zombie',
        'T': 'Stopped',
        'I': 'Idle'
    };

    const getProcessStateColor = (state) => {
        const colors = {
            'R': '#22c55e',
            'S': '#3b82f6',
            'D': '#f59e0b',
            'Z': '#ef4444',
            'T': '#6b7280',
            'I': '#8b5cf6'
        };
        return colors[state] || '#6b7280';
    };

    const schedulerData = [
        { name: 'CFS', usage: 75 },
        { name: 'RT', usage: 15 },
        { name: 'Deadline', usage: 10 }
    ];

    const filteredProcesses = useMemo(() => {
        if (stateFilter === 'all') {
            return processes;
        }
        return processes.filter(p => p.state === stateFilter);
    }, [processes, stateFilter]);

    const totalMemoryUsage = useMemo(() => {
        return processes.reduce((sum, process) => sum + process.memory_usage, 0);
    }, [processes]);

    const totalCpuUsage = useMemo(() => {
        return processes.reduce((sum, process) => sum + process.cpu_usage, 0);
    }, [processes]);

    const handleProcessCreation = () => {
        const now = new Date();
        const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const newProcess = {
            pid: nextPid,
            name: `new_process_${nextPid}`,
            state: 'R',
            priority: 20,
            nice: 0,
            cpu_usage: 0.1,
            memory_usage: 1.0,
            threads: 1,
            start_time: formattedTime,
            parent_pid: 1,
            children: [],
            user: 'john',
            voluntary_switches: 0,
            nonvoluntary_switches: 0,
            virtual_memory: 10000,
            resident_memory: 1000,
            group_id: 102,
            session_id: 102,
        };
        setProcesses(prevProcesses => [...prevProcesses, newProcess]);
        setNextPid(prevNextPid => prevNextPid + 1);
        toast.success(`Process ${newProcess.name} (PID: ${newProcess.pid}) created successfully!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleProcessTermination = (pid) => {
        const terminatedProcess = processes.find(p => p.pid === pid);
        setProcesses(prevProcesses => prevProcesses.filter(p => p.pid !== pid));
        setSelectedProcess(null);
        if (terminatedProcess) {
            toast.error(`Process ${terminatedProcess.name} (PID: ${pid}) terminated.`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleProcessStateChange = (pid, newState) => {
        const process = processes.find(p => p.pid === pid);
        setProcesses(prevProcesses =>
            prevProcesses.map(process =>
                process.pid === pid ? { ...process, state: newState } : process
            )
        );
        if (process) {
            toast.info(`Process ${process.name} (PID: ${pid}) state changed to ${processStates[newState]}.`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleStateFilter = (state) => {
        setStateFilter(state);
    };

    const handleSendSignal = (pid, signal) => {
        const process = processes.find(p => p.pid === pid);
        let message = `Signal ${signal} sent to process ${pid}`;
        let type = 'info';
        if (signal === 'SIGSTOP') {
            handleProcessStateChange(pid, 'T');
            message = `Process ${process?.name} (PID: ${pid}) stopped. (SIGSTOP)`;
        } else if (signal === 'SIGCONT') {
            handleProcessStateChange(pid, 'R');
            message = `Process ${process?.name} (PID: ${pid}) continued. (SIGCONT)`;
        } else if (signal === 'SIGTERM') {
            handleProcessTermination(pid);
            message = `Process ${process?.name} (PID: ${pid}) termination initiated. (SIGTERM)`;
            type = 'warning';
        }
        toast[type](message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const sortedGlossary = useMemo(() => {
        return [
            { term: 'PID (Process ID)', definition: 'A unique identifier assigned to each running process by the operating system.' },
            { term: 'Parent PID', definition: 'The process ID of the parent process that created this process.' },
            { term: 'Process State', definition: 'The current condition of a process, such as running, sleeping, or stopped.' },
            { term: 'Priority', definition: 'A numerical value indicating the importance of a process. Lower numbers often mean higher priority.' },
            { term: 'CPU Usage (%)', definition: 'The percentage of CPU time that a process is currently using.' },
            { term: 'Memory Usage (%)', definition: 'The percentage of system memory that a process is currently using.' },
            { term: 'Threads', definition: 'The number of independent execution units within a process.' },
            { term: 'Start Time', definition: 'The time at which the process started execution.' },
            { term: 'User', definition: 'The user that owns the process.' },
            { term: 'Nice Value', definition: 'A value that influences the scheduling priority of a process; higher nice values lower a process\'s priority.' },
            { term: 'Virtual Memory', definition: 'The total amount of virtual address space used by a process. It includes both RAM and disk space for swapping.' },
            { term: 'Resident Memory', definition: 'The amount of physical RAM that a process is currently using.' },
            { term: 'Voluntary Context Switches', definition: 'The number of times a process voluntarily gives up the CPU (e.g., waiting for I/O).' },
            { term: 'Non-voluntary Context Switches', definition: 'The number of times a process was forcibly switched out by the OS scheduler (e.g., its time slice ended).' },
            { term: 'CFS (Completely Fair Scheduler)', definition: 'The default process scheduler in Linux that aims to provide fair CPU time allocation among processes.' },
            { term: 'RT (Real-Time Scheduler)', definition: 'A scheduler designed for time-critical applications that require deterministic execution times.' },
            { term: 'Deadline Scheduler', definition: 'A scheduler that schedules tasks based on deadlines to ensure that time-sensitive operations complete on time.' },
            { term: 'Group ID', definition: 'Each process belongs to a group, often used to manage related processes together.' },
            { term: 'Session ID', definition: 'A group of processes that are typically related and share the same terminal' },
            { term: 'IPC (Inter-Process Communication)', definition: 'Mechanisms that allow processes to communicate and synchronize with each other.' },
        ].sort((a, b) => a.term.localeCompare(b.term));
    }, []);

    return (
        <div className="w-full font-mono max-w-6xl mx-auto p-2 sm:p-4 md:p-6 bg-white">
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <div className="mb-4 md:mb-8">
                <h1 className="text-xl md:text-xl font-bold mb-4">Linux Process Management</h1>
                <p className="text-md text-gray-700 mb-4">
                This interactive simulation provides a simplified view of how an operating system like Linux manages processes. (While it attempts to mimic real-world behavior, it's important to remember that actual system complexities are far greater.)
                </p>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-lg md:text-xl font-semibold mb-2">How to Get the Most Out of This Simulation</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Navigate the Dashboard:</strong> Use the buttons and filters to interact with the simulation. Click on process rows to view detailed information.</li>
                        <li><strong>Create Processes:</strong> Click the "Simulate Process Creation" button to add new processes and observe their behavior.</li>
                        <li><strong>Filter Processes:</strong> Use the process state filters to view processes in different states.</li>
                        <li><strong>Control Processes:</strong> Use the control buttons to stop, continue, or terminate processes. Send signals to processes to see how they respond.</li>
                        <li><strong>Learn Terminology:</strong> Use the at the end glossary to understand key terms and concepts related to process management.</li>
                    </ul>
                </div>
                <div className="flex items-center mb-4">
                    <button onClick={handleProcessCreation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Simulate Process Creation">
                        Simulate Process Creation
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                    <div className="p-2 md:p-4 rounded-lg bg-blue-50 shadow-md">
                        <div className="flex items-center mb-2">
                            <Cpu className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                            <h3 className="font-semibold text-sm md:text-base">CPU Scheduler</h3>
                        </div>
                        <p className="text-xs md:text-sm">CFS (Completely Fair Scheduler)</p>
                        <p className="text-xs text-gray-500">Responsible for allocating CPU time to processes</p>
                    </div>
                    <div className="p-2 md:p-4 rounded-lg bg-green-50 shadow-md">
                        <div className="flex items-center mb-2">
                            <MemoryStick className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                            <h3 className="font-semibold text-sm md:text-base">Memory Management</h3>
                        </div>
                        <p className="text-xs md:text-sm">Virtual Memory System</p>
                        <p className="text-xs text-gray-500">Manages how memory is used by processes</p>
                    </div>
                    <div className="p-2 md:p-4 rounded-lg bg-purple-50 shadow-md">
                        <div className="flex items-center mb-2">
                            <Clock className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                            <h3 className="font-semibold text-sm md:text-base">Time Slice</h3>
                        </div>
                        <p className="text-xs md:text-sm">Dynamic: 1-10ms</p>
                        <p className="text-xs text-gray-500">The duration a process runs before another gets the CPU</p>
                    </div>
                    <div className="p-2 md:p-4 rounded-lg bg-yellow-50 shadow-md">
                        <div className="flex items-center mb-2">
                            <Activity className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                            <h3 className="font-semibold text-sm md:text-base">Process States</h3>
                        </div>
                        <p className="text-xs md:text-sm">{Object.keys(processStates).length} States</p>
                        <p className="text-xs text-gray-500">Different modes of operation a process can be in</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
                <div className="border rounded-lg p-2 md:p-4 shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Scheduler Distribution</h2>
                    <p className="text-sm text-gray-700 mb-2">
                        This chart shows the distribution of different scheduling algorithms on the system. The Completely Fair Scheduler (CFS) is the standard Linux scheduler. Real-time (RT) and Deadline schedulers are used for time-sensitive processes.
                    </p>
                    <div className="w-full overflow-x-auto">
                        <BarChart width={400} height={200} data={schedulerData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="usage" fill="#3b82f6" />
                        </BarChart>
                    </div>
                </div>

                <div className="border rounded-lg p-2 md:p-4 shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Filter Process States</h2>
                    <p className="text-sm text-gray-700 mb-2">
                        These color-coded indicators represent the different states a process can be in. Each color corresponds to a specific state (e.g., running, sleeping, stopped). Click on a state to filter the process list.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                        {Object.entries(processStates).map(([key, value]) => (
                            <div
                                key={key}
                                className={`flex items-center p-2 rounded cursor-pointer ${stateFilter === key ? 'ring-2 ring-offset-1 ring-gray-300' : ''}`}
                                style={{ backgroundColor: `${getProcessStateColor(key)}20` }}
                                onClick={() => handleStateFilter(key)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && handleStateFilter(key)}
                            >
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: getProcessStateColor(key) }}
                                />
                                <span className="text-xs md:text-sm">
                                    {key} - {value}
                                </span>
                            </div>
                        ))}
                        <div
                            key='all'
                            className={`flex items-center p-2 rounded cursor-pointer ${stateFilter === 'all' ? 'ring-2 ring-offset-1 ring-gray-300' : ''}`}
                            style={{ backgroundColor: `#ffffff20` }}
                            onClick={() => handleStateFilter('all')}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleStateFilter('all')}
                        >
                            <span className="text-xs md:text-sm">
                                All
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* System-wide resource usage summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
                <div className="border rounded-lg p-2 md:p-4 shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">System Resource Usage</h2>
                    <p className="text-sm md:text-base">
                        <span className="font-medium">Total CPU Usage:</span> {totalCpuUsage.toFixed(2)}%
                    </p>
                    <p className="text-sm md:text-base">
                        <span className="font-medium">Total Memory Usage:</span> {totalMemoryUsage.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                        This section shows the total CPU and memory usage across all running processes. High values indicate that your system is under load.
                    </p>
                </div>
            </div>

            <div className="border rounded-lg p-2 md:p-4 shadow-md">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Process List</h2>
                <p className="text-sm text-gray-700 mb-2">
                    This table displays a list of all currently running processes. Each row represents a single process, and by clicking on a row, you can view more detailed information about that specific process.
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm">PID</th>
                                <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm">Name</th>
                                <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm">State</th>
                                <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm">Priority</th>
                                <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm">CPU %</th>
                                <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm">Memory %</th>
                                <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm">Threads</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProcesses.map(({ pid, name, state, priority, cpu_usage, memory_usage, threads }) => (
                                <tr
                                    key={pid}
                                    className={`hover:bg-gray-50 cursor-pointer ${selectedProcess?.pid === pid ? 'bg-blue-100' : ''}`}
                                    onClick={() => setSelectedProcess({ pid, name, state, priority, cpu_usage, memory_usage, threads, ...processes.find(p => p.pid === pid) })}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && setSelectedProcess({ pid, name, state, priority, cpu_usage, memory_usage, threads, ...processes.find(p => p.pid === pid) })}
                                >
                                    <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{pid}</td>
                                    <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{name}</td>
                                    <td className="px-2 md:px-4 py-2 text-xs md:text-sm">
                                        <span
                                            className="px-2 py-1 rounded text-xs"
                                            style={{
                                                backgroundColor: `${getProcessStateColor(state)}20`,
                                                color: getProcessStateColor(state)
                                            }}
                                        >
                                            {processStates[state]}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{priority}</td>
                                    <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{cpu_usage}%</td>
                                    <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{memory_usage}%</td>
                                    <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{threads}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedProcess && (
                <div className="mt-4 md:mt-6 border rounded-lg p-2 md:p-4 shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Process Details</h2>
                    <p className="text-sm text-gray-700 mb-2">
                        This section displays detailed information about the selected process, including its basic attributes and resource consumption. You can also manage the process with the provided actions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Identification</h3>
                            <div className="space-y-2">
                                <p className="text-xs md:text-sm"><span className="font-medium">PID:</span> {selectedProcess.pid}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Parent PID:</span> {selectedProcess.parent_pid}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">User:</span> {selectedProcess.user}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Group ID:</span> {selectedProcess.group_id}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Session ID:</span> {selectedProcess.session_id}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Start Time:</span> {selectedProcess.start_time}</p>
                            </div>

                            <h3 className="font-semibold mb-2 mt-4 text-sm md:text-base">Process Control</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleProcessStateChange(selectedProcess.pid, 'T')}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    aria-label="Stop Process"
                                >
                                    Stop Process
                                </button>
                                <button
                                    onClick={() => handleProcessStateChange(selectedProcess.pid, 'R')}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                                    aria-label="Continue Process"
                                >
                                    Continue Process
                                </button>
                                <button
                                    onClick={() => handleProcessTermination(selectedProcess.pid)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-300"
                                    aria-label="Terminate Process">Terminate
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Resource Usage</h3>
                            <div className="space-y-2">
                                <p className="text-xs md:text-sm"><span className="font-medium">CPU Usage:</span> {selectedProcess.cpu_usage}%</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Memory Usage:</span> {selectedProcess.memory_usage}%</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Virtual Memory:</span> {(selectedProcess.virtual_memory / 1024).toFixed(2)} MB</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Resident Memory:</span> {(selectedProcess.resident_memory / 1024).toFixed(2)} MB</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Threads:</span> {selectedProcess.threads}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Nice Value:</span> {selectedProcess.nice}</p>
                            </div>

                            <h3 className="font-semibold mb-2 mt-4 text-sm md:text-base">Context Switches & Children</h3>
                            <div className="space-y-2">
                                <p className="text-xs md:text-sm"><span className="font-medium">Voluntary Context Switches:</span> {selectedProcess.voluntary_switches}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Non-voluntary Context Switches:</span> {selectedProcess.nonvoluntary_switches}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">Child Processes:</span> {selectedProcess.children.join(', ') || 'None'}</p>
                                <p className="text-xs md:text-sm"><span className="font-medium">IPC Mechanisms:</span> (e.g., Pipes,Shared Memory, Signals)</p>
                            </div>

                            <h3 className="font-semibold mb-2 mt-4 text-sm md:text-base">Signals</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleSendSignal(selectedProcess.pid, 'SIGSTOP')}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                    aria-label="Send SIGSTOP Signal"
                                >
                                    Send SIGSTOP
                                </button>
                                <button
                                    onClick={() => handleSendSignal(selectedProcess.pid, 'SIGCONT')}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-300"
                                    aria-label="Send SIGCONT Signal"
                                >
                                    Send SIGCONT
                                </button>
                                <button
                                    onClick={() => handleSendSignal(selectedProcess.pid, 'SIGTERM')}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-300"
                                    aria-label="Send SIGTERM Signal"
                                >
                                    Send SIGTERM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 border rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Glossary</h2>
                <ul className="list-disc list-inside space-y-2">
                    {sortedGlossary.map(item => (
                        <li key={item.term}>
                            <span className="font-bold">{item.term}:</span> {item.definition}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProcessManagementVisualization;
