import React, { useState, useEffect, useCallback } from 'react';
import {
  Terminal,
  Search,
  Folder,
  Network,
  Users,
  Shield,
  Monitor,
  Copy,
  X,
  Star,
  Filter,
  Layers,
  Cpu,
} from 'lucide-react';

const CommandExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [recentCommands, setRecentCommands] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedRecent = localStorage.getItem('recentCommands');
    const savedFavorites = localStorage.getItem('favoriteCommands');
    if (savedRecent) setRecentCommands(JSON.parse(savedRecent));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    localStorage.setItem('recentCommands', JSON.stringify(recentCommands));
  }, [recentCommands]);

  useEffect(() => {
    localStorage.setItem('favoriteCommands', JSON.stringify(favorites));
  }, [favorites]);

  const categories = [
    {
      id: 'files',
      icon: <Folder />,
      label: 'File Management',
      color: 'bg-blue-500',
      commands: [
        { name: 'ls', desc: 'List directory contents', flags: ['-l', '-a', '-h', '-R'], examples: ['ls -la /home', 'ls -R /var/log', 'ls -lh /usr/bin'] },
        { name: 'cd', desc: 'Change the current directory', flags: ['..', '-', '~'], examples: ['cd /var/www', 'cd ..', 'cd ~'] },
        { name: 'mkdir', desc: 'Create a new directory', flags: ['-p', '-v'], examples: ['mkdir new_folder', 'mkdir -p /tmp/nested/folder'] },
        { name: 'rm', desc: 'Remove files or directories', flags: ['-r', '-f', '-i'], examples: ['rm file.txt', 'rm -rf unwanted_folder'] },
        { name: 'touch', desc: 'Create an empty file or update timestamp', flags: [], examples: ['touch new_file.txt', 'touch existing_file.txt'] },
        { name: 'cp', desc: 'Copy files and directories', flags: ['-r', '-v', '-n'], examples: ['cp file1.txt file2.txt', 'cp -r folder1 folder2'] },
        { name: 'mv', desc: 'Move or rename files and directories', flags: ['-v', '-i'], examples: ['mv old_name.txt new_name.txt', 'mv file.txt /destination'] },
        { name: 'cat', desc: 'Display file contents', flags: ['-n', '-b'], examples: ['cat file.txt', 'cat -n logfile.log'] },
        { name: 'head', desc: 'Display the first few lines of a file', flags: ['-n'], examples: ['head file.txt', 'head -n 20 large_file.log'] },
        { name: 'tail', desc: 'Display the last few lines of a file', flags: ['-n', '-f'], examples: ['tail file.txt', 'tail -f error.log'] },
        { name: 'find', desc: 'Search for files and directories', flags: ['-name', '-type', '-exec'], examples: ["find / -name 'important.txt'", "find . -type d", "find . -name '*.log' -exec gzip {} \\;"] },
        { name: 'grep', desc: 'Search for patterns in files', flags: ['-i', '-v', '-n', '-r'], examples: ["grep 'error' logfile.log", "grep -i 'warning' messages.txt", "grep -r 'functionName' ./src"] },
        { name: 'chmod', desc: 'Change file permissions', flags: [], examples: ['chmod 755 script.sh', 'chmod +x script.sh'] },
        { name: 'chown', desc: 'Change file owner and group', flags: [], examples: ['chown user:group file.txt', 'chown root file.txt'] },
        { name: 'du', desc: 'Estimate file space usage', flags: ['-h', '-s'], examples: ['du -sh folder', 'du -h /var/log'] },
        { name: 'df', desc: 'Display free disk space', flags: ['-h'], examples: ['df -h'] },
      ],
    },
    {
      id: 'network',
      icon: <Network />,
      label: 'Networking',
      color: 'bg-green-500',
      commands: [
        { name: 'ping', desc: 'Send ICMP echo requests to network hosts', flags: ['-c', '-i'], examples: ['ping google.com', 'ping -c 10 192.168.1.1'] },
        { name: 'ip', desc: 'Show / manipulate routing, devices, policy routing and tunnels', flags: ['addr', 'link', 'route'], examples: ['ip addr show', 'ip link show', 'ip route show'] },
        { name: 'ifconfig', desc: 'Configure a network interface', flags: [], examples: ['ifconfig eth0', 'ifconfig wlan0 up'] },
        { name: 'netstat', desc: 'Display network connections, routing tables, interface statistics', flags: ['-tulnp'], examples: ['netstat -tulnp'] },
        { name: 'ss', desc: 'Socket statistics', flags: ['-t', '-u', '-l', '-p'], examples: ['ss -tulnp'] },
        { name: 'curl', desc: 'Transfer data from or to a server', flags: ['-O', '-X', '-H'], examples: ['curl google.com', 'curl -O http://example.com/file.zip'] },
        { name: 'wget', desc: 'Download files from the web', flags: ['-b', '-c'], examples: ['wget http://example.com/file.iso', 'wget -c http://example.com/largefile.zip'] },
        { name: 'ssh', desc: 'Secure Shell client', flags: ['-p', '-X'], examples: ['ssh user@host', 'ssh -p 2222 user@host'] },
        { name: 'scp', desc: 'Secure copy (remote file copy program)', flags: ['-r', '-P'], examples: ['scp file.txt user@host:/tmp', 'scp -r user@host:/var/www /local/backup'] },
        { name: 'traceroute', desc: 'Trace route to a network host', flags: [], examples: ['traceroute google.com'] },
        { name: 'nslookup', desc: 'Query Internet name servers interactively', flags: [], examples: ['nslookup google.com'] },
        { name: 'dig', desc: 'DNS lookup utility', flags: ['+trace', '+short'], examples: ['dig google.com', 'dig +trace google.com'] },
      ],
    },
    {
      id: 'system',
      icon: <Monitor />,
      label: 'System Information',
      color: 'bg-yellow-500',
      commands: [
        { name: 'uname', desc: 'Print system information', flags: ['-a', '-s', '-r'], examples: ['uname -a', 'uname -s'] },
        { name: 'uptime', desc: 'Show how long the system has been running', flags: [], examples: ['uptime'] },
        { name: 'whoami', desc: 'Print current logged in user name', flags: [], examples: ['whoami'] },
        { name: 'id', desc: 'Print user and group IDs', flags: [], examples: ['id'] },
        { name: 'hostname', desc: 'Show or set the system\'s host name', flags: [], examples: ['hostname', 'hostname new_hostname'] },
        { name: 'date', desc: 'Display or set the system date and time', flags: [], examples: ['date', 'date +%Y-%m-%d'] },
        { name: 'cal', desc: 'Display a calendar', flags: [], examples: ['cal', 'cal 2024'] },
        { name: 'w', desc: 'Show who is logged on and what they are doing', flags: [], examples: ['w'] },
        { name: 'last', desc: 'Show listing of last logged in users', flags: [], examples: ['last'] },
        { name: 'history', desc: 'Display command history', flags: [], examples: ['history'] },
        { name: 'df', desc: 'Report file system disk space usage', flags: ['-h'], examples: ['df -h'] },
        { name: 'du', desc: 'Estimate file space usage', flags: ['-sh'], examples: ['du -sh'] },
        { name: 'free', desc: 'Display free and used memory', flags: ['-h', '-m'], examples: ['free -h', 'free -m'] },
        { name: 'top', desc: 'Display dynamic real-time view of running processes', flags: [], examples: ['top'] },
        { name: 'htop', desc: 'Interactive process viewer', flags: [], examples: ['htop'] },
        { name: 'ps', desc: 'Display information about running processes', flags: ['-aux', '-ef'], examples: ['ps aux | grep firefox', 'ps -ef'] },
        { name: 'kill', desc: 'Terminate a process', flags: [], examples: ['kill PID'] },
        { name: 'killall', desc: 'Kill processes by name', flags: [], examples: ['killall firefox'] },
      ],
    },
    {
      id: 'users',
      icon: <Users />,
      label: 'User Management',
      color: 'bg-purple-500',
      commands: [
        { name: 'useradd', desc: 'Create a new user', flags: ['-m', '-g'], examples: ['useradd newuser', 'useradd -m -g users anotheruser'] },
        { name: 'userdel', desc: 'Delete a user', flags: ['-r'], examples: ['userdel olduser', 'userdel -r olduser'] },
        { name: 'usermod', desc: 'Modify a user account', flags: ['-aG', '-l'], examples: ['usermod -aG sudo user', 'usermod -l newusername oldusername'] },
        { name: 'passwd', desc: 'Change a user\'s password', flags: [], examples: ['passwd', 'passwd username'] },
        { name: 'groupadd', desc: 'Create a new group', flags: [], examples: ['groupadd developers'] },
        { name: 'groupdel', desc: 'Delete a group', flags: [], examples: ['groupdel oldgroup'] },
        { name: 'groups', desc: 'Print all the groups a user is a part of', flags: [], examples: ['groups username'] },
        { name: 'sudo', desc: 'Execute a command as the superuser', flags: [], examples: ['sudo apt update'] },
        { name: 'su', desc: 'Change user ID or become superuser', flags: ['-', '-l'], examples: ['su', 'su - username'] },
      ],
    },
    {
      id: 'processes',
      icon: <Terminal />,
      label: 'Process Management',
      color: 'bg-orange-500',
      commands: [
        { name: 'ps', desc: 'Display information about running processes', flags: ['aux', 'ef', 'grep'], examples: ['ps aux', 'ps ef | grep firefox'] },
        { name: 'top', desc: 'Display real-time view of running processes', flags: [], examples: ['top'] },
        { name: 'htop', desc: 'Interactive process viewer', flags: [], examples: ['htop'] },
        { name: 'kill', desc: 'Send a signal to a process', flags: ['-9'], examples: ['kill PID', 'kill -9 PID'] },
        { name: 'killall', desc: 'Kill processes by name', flags: [], examples: ['killall processname'] },
        { name: 'bg', desc: 'Move a stopped job to the background', flags: [], examples: ['bg'] },
        { name: 'fg', desc: 'Move a background job to the foreground', flags: [], examples: ['fg'] },
        { name: 'jobs', desc: 'List active jobs', flags: [], examples: ['jobs'] },
        { name: 'nice', desc: 'Run a command with an altered priority', flags: ['-n'], examples: ['nice -n 10 ./myprogram'] },
        { name: 'renice', desc: 'Alter the priority of running processes', flags: [], examples: ['renice 10 PID'] },
        { name: 'nohup', desc: 'Run a command immune to hangups, with output to a non-tty', flags: [], examples: ['nohup ./longrunningprocess &'] },
      ],
    },
    {
      id: 'security',
      icon: <Shield />,
      label: 'Security',
      color: 'bg-red-500',
      commands: [
        { name: 'sudo', desc: 'Execute a command as another user or the superuser', flags: [], examples: ['sudo apt update'] },
        { name: 'passwd', desc: 'Change a user\'s password', flags: [], examples: ['passwd username'] },
        { name: 'chmod', desc: 'Change file permissions', flags: [], examples: ['chmod 755 script.sh'] },
        { name: 'chown', desc: 'Change file owner and group', flags: [], examples: ['chown user:group file.txt'] },
        { name: 'ufw', desc: 'Frontend for iptables, the Netfilter firewall', flags: ['enable', 'disable', 'allow', 'deny'], examples: ['sudo ufw enable', 'sudo ufw allow 22'] },
        { name: 'iptables', desc: 'Administration tool for IPv4 packet filtering and NAT', flags: ['-A', '-D', '-L'], examples: ['sudo iptables -L'] },
        { name: 'ssh', desc: 'OpenSSH client (remote login program)', flags: ['-p', '-i'], examples: ['ssh user@host'] },
        { name: 'scp', desc: 'Secure copy (remote file copy program)', flags: ['-r', '-P'], examples: ['scp file.txt user@host:/tmp'] },
        { name: 'fail2ban', desc: 'Daemon to ban hosts that cause multiple authentication errors', flags: [], examples: ['sudo systemctl status fail2ban'] },
        { name: 'gpg', desc: 'GNU Privacy Guard for data encryption and signing', flags: ['-c', '-d', '--verify'], examples: ['gpg -c file.txt'] },
        { name: 'openssl', desc: 'Toolkit for Transport Layer Security (TLS) and Secure Sockets Layer (SSL) protocols', flags: ['genrsa', 'req', 'x09'], examples: ['openssl version'] },
      ],
    },
    {
      id: 'namespaces',
      icon: <Layers />,
      label: 'Linux Namespaces',
      color: 'bg-teal-500',
      commands: [
        { name: 'unshare', desc: 'Run a program in a new namespace', flags: ['--mount', '--uts', '--ipc', '--net', '--pid', '--fork', '--user'], examples: ['sudo unshare --mount --uts --ipc --net --pid --fork /bin/bash'] },
        { name: 'nsenter', desc: 'Enter an existing namespace', flags: ['--target', '--mount', '--uts', '--ipc', '--net', '--pid', '--user'], examples: ['sudo nsenter --target 1234 --mount --uts --ipc --net --pid'] },
        { name: 'lsns', desc: 'List namespaces', flags: ['-t', '-p'], examples: ['lsns', 'lsns -t net', 'lsns -p 1234'] },
        { name: 'ip netns', desc: 'Manage network namespaces', flags: ['add', 'delete', 'list', 'exec'], examples: ['sudo ip netns add mynamespace', 'sudo ip netns exec mynamespace ip a'] },
        // PID namespace specific
        { name: 'getpid', desc: 'Get process ID from inside namespace', flags: [], examples: ['getpid'] },
        // Network namespace specific
        { name: 'ip addr', desc: 'Show network interfaces inside namespace', flags: [], examples: ['ip addr'] },
      ],
    },
    {
      id: 'cgroups',
      icon: <Cpu />,
      label: 'Control Groups (cgroups)',
      color: 'bg-indigo-500',
      commands: [
        { name: 'cgcreate', desc: 'Create a new cgroup', flags: ['-g'], examples: ['sudo cgcreate -g cpu,memory:mycgroup'] },
        { name: 'cgclassify', desc: 'Move a process to a cgroup', flags: ['-g'], examples: ['sudo cgclassify -g cpu,memory:mycgroup 1234'] },
        { name: 'cgexec', desc: 'Run a command in a specific cgroup', flags: ['-g'], examples: ['sudo cgexec -g cpu,memory:mycgroup /bin/bash'] },
        { name: 'lscgroup', desc: 'List cgroups', flags: [], examples: ['lscgroup', 'lscgroup | grep mycgroup'] },
        { name: 'cgget', desc: 'Get cgroup parameters', flags: ['-r'], examples: ['cgget -r cpu.shares mycgroup', 'cgget -r memory.limit_in_bytes mycgroup'] },
        { name: 'cgset', desc: 'Set cgroup parameters', flags: ['-r'], examples: ['sudo cgset -r cpu.shares=512 mycgroup', 'sudo cgset -r memory.limit_in_bytes=1G mycgroup'] },
        { name: 'cgdelete', desc: 'Delete a cgroup', flags: ['-r'], examples: ['sudo cgdelete -r cpu,memory:mycgroup'] },
        // cgroup specific - CPU
        { name: 'cpu.shares', desc: 'CPU time allocation', flags: [], examples: ['cat /sys/fs/cgroup/cpu/mycgroup/cpu.shares'] },
        { name: 'cpu.cfs_period_us', desc: 'CFS scheduler period', flags: [], examples: ['cat /sys/fs/cgroup/cpu/mycgroup/cpu.cfs_period_us'] },
        { name: 'cpu.cfs_quota_us', desc: 'CFS scheduler quota', flags: [], examples: ['cat /sys/fs/cgroup/cpu/mycgroup/cpu.cfs_quota_us'] },
        // cgroup specific - Memory
        { name: 'memory.limit_in_bytes', desc: 'Memory limit', flags: [], examples: ['cat /sys/fs/cgroup/memory/mycgroup/memory.limit_in_bytes'] },
        { name: 'memory.usage_in_bytes', desc: 'Current memory usage', flags: [], examples: ['cat /sys/fs/cgroup/memory/mycgroup/memory.usage_in_bytes'] },
      ],
    },
  ];

  const handleCommandSelect = useCallback((command) => {
    setSelectedCommand(command);
    setIsDialogOpen(true);
    setRecentCommands((prev) => {
      const filtered = prev.filter((cmd) => cmd.name !== command.name);
      return [command, ...filtered].slice(0, 5);
    });
  }, []);

  const toggleFavorite = useCallback((command) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((cmd) => cmd.name === command.name);
      if (isFavorite) {
        setToastMessage({ type: 'success', message: `${command.name} removed from favorites.`, duration: 3000 });
        return prev.filter((cmd) => cmd.name !== command.name);
      } else {
        setToastMessage({ type: 'success', message: `${command.name} added to favorites.`, duration: 3000 });
        return [...prev, command];
      }
    });
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    setToastMessage({ type: 'success', message: `Command "${text}" copied to clipboard.`, duration: 3000 });
  }, []);

  // Filter logic
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      commands: category.commands.filter(
        (cmd) => {
          const matchesSearchTerm = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    cmd.desc.toLowerCase().includes(searchTerm.toLowerCase());
          
          if (selectedCategory === 'favorites') {
            return matchesSearchTerm && favorites.some((favCmd) => favCmd.name === cmd.name);
          } else if (selectedCategory) {
            return matchesSearchTerm && category.id === selectedCategory;
          }
          return matchesSearchTerm;
        }
      ),
    }))
    .filter((category) => category.commands.length > 0 || selectedCategory === category.id);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setShowFilters(false);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), toastMessage.duration);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const CommandCard = ({ command }) => {
    const isFavorite = favorites.some((cmd) => cmd.name === command.name);

    return (
      <div
        className="bg-white font-mono rounded-md shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
        onClick={() => handleCommandSelect(command)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{command.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{command.desc}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(command);
              }}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={isFavorite ? 'text-yellow-500' : 'text-gray-400'} size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(command.name);
              }}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Copy command"
            >
              <Copy className="text-gray-400" size={18} />
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {command.flags.slice(0, 3).map((flag) => (
            <span
              key={flag}
              className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800"
            >
              {flag}
            </span>
          ))}
          {command.flags.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              +{command.flags.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-mono bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Terminal className="text-blue-500 mr-3" size={32} />
            <h1 className="text-lg sm:text-lg font-bold text-gray-800">Linux Command Explorer</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-md transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <Filter size={18} />
              Filters
            </button>
            {/* Recent Commands */}
            {recentCommands.length > 0 && (
              <>
                <span className="text-sm text-gray-500">Recent:</span>
                {recentCommands.slice(0, 3).map((cmd) => (
                  <button
                    key={cmd.name}
                    onClick={() => handleCommandSelect(cmd)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {cmd.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-white rounded-md shadow-md p-4">
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => setSelectedCategory('favorites')}
                    className={`${selectedCategory === 'favorites' ? 'bg-yellow-200' : 'bg-gray-200'} hover:bg-yellow-300 text-gray-800 text-sm py-1 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300`}
                >
                    <Star size={16} className="inline-block mr-1" />
                    Favorites
                </button>
                <button
                    onClick={() => clearFilters()}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Clear Filters
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${
                    selectedCategory === category.id ? 'bg-blue-200' : 'bg-gray-200'
                  } hover:bg-blue-300 text-gray-800 text-sm py-1 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            placeholder="Search commands... (e.g., 'file', 'network', 'process')"
            className="w-full pl-10 border border-gray-300 rounded-md py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className={`${category.color} text-white p-4 rounded-md`}>
                  <div className="flex items-center">
                    {category.icon}
                    <h2 className="ml-3 font-semibold text-lg">{category.label}</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {category.commands.map((command) => (
                    <CommandCard key={command.name} command={command} />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {isDialogOpen && selectedCommand && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:w-full sm:max-w-md">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Terminal className="text-blue-500" size={20} />
                  {selectedCommand.name}
                </h3>
                <button onClick={() => setIsDialogOpen(false)} className="hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-700 mb-4">{selectedCommand.desc}</p>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Common Flags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCommand.flags.map((flag) => (
                    <button
                      key={flag}
                      className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => copyToClipboard(`${selectedCommand.name} ${flag}`)}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>
              {selectedCommand.examples && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Example Usage</h4>
                  <div className="space-y-2">
                    {selectedCommand.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-2 rounded flex justify-between items-center"
                      >
                        <code className="text-sm">{example}</code>
                        <button
                          onClick={() => copyToClipboard(example)}
                          className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          aria-label="Copy example"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {toastMessage && (
          <div
            className={`fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center gap-2`}
            role="alert"
          >
            <strong className="font-bold">{toastMessage.type === 'success' ? 'Success' : 'Error'}!</strong>
            <span className="block sm:inline">{toastMessage.message}</span>
            <button onClick={() => setToastMessage(null)} className="ml-auto hover:opacity-70 focus:outline-none">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandExplorer;