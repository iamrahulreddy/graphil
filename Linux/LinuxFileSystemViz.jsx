import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Folder,
    FolderOpen,
    File,
    Layout,
} from 'lucide-react';

// --- CONSTANTS & DATA ---
const linuxFileSystemData = {
    name: 'Linux Filesystem Hierarchy',
    type: 'directory',
    children: [
        {
            name: '📁 Root Directory (/)',
            type: 'directory',
            children: [
                {
                    name: '🗂️ /bin - Essential Commands',
                    type: 'directory',
                    children: [
                        { name: '💻 bash (Bourne Again Shell)', type: 'file' },
                        { name: '📋 ls (List directory contents)', type: 'file' },
                        { name: '📝 cp (Copy files/directories)', type: 'file' },
                        { name: '🔄 mv (Move/rename files)', type: 'file' },
                        { name: '🗑️ rm (Remove files)', type: 'file' },
                        { name: '🔍 grep (Search text patterns)', type: 'file' },
                        { name: '📊 ps (Process status)', type: 'file' },
                        { name: '🔗 ln (Create links)', type: 'file' }
                    ]
                },
                {
                    name: '🛠️ /boot - Boot Configuration',
                    type: 'directory',
                    children: [
                        { name: '🎯 vmlinuz (Compressed Linux kernel)', type: 'file' },
                        { name: '🚀 initrd.img (Initial RAM disk)', type: 'file' },
                        {
                            name: '🔧 grub/ (Boot loader configuration)',
                            type: 'directory',
                            children: [
                                { name: 'grub.cfg', type: 'file' },
                                { name: 'menu.lst', type: 'file' }
                            ]
                        },
                        { name: '💾 config-* (Kernel configurations)', type: 'file' },
                        { name: '📍 System.map (Kernel symbol mapping)', type: 'file' }
                    ]
                },
                {
                    name: '🖥️ /dev - Device Files',
                    type: 'directory',
                    children: [
                        { name: '💽 /dev/sda (First SATA drive)', type: 'file' },
                        { name: '🖨️ /dev/lp0 (First printer)', type: 'file' },
                        { name: '🖱️ /dev/input (Input devices)', type: 'file' },
                        { name: '🎮 /dev/usb (USB devices)', type: 'file' },
                        { name: '🔊 /dev/snd (Sound devices)', type: 'file' }
                    ]
                },
                {
                    name: '⚙️ /etc - System Configuration',
                    type: 'directory',
                    children: [
                        { name: '🔐 passwd (User accounts)', type: 'file' },
                        {
                            name: '🌐 network/',
                            type: 'directory',
                            children: [
                                { name: 'interfaces', type: 'file' },
                                { name: 'hosts', type: 'file' }
                            ]
                        },
                        { name: '🚀 init.d/ (Service scripts)', type: 'file' },
                        { name: '🔒 ssh/ (SSH configuration)', type: 'file' },
                        { name: '📝 fstab (Filesystem table)', type: 'file' }
                    ]
                },
                {
                    name: '🏠 /home - User Directories',
                    type: 'directory',
                    children: [
                        {
                            name: '👤 /home/user1/',
                            type: 'directory',
                            children: [
                                { name: '📂 Documents/', type: 'directory' },
                                { name: '🖼️ Pictures/', type: 'directory' },
                                { name: '🎵 Music/', type: 'directory' },
                                { name: '🎬 Videos/', type: 'directory' },
                                { name: '⚙️ .config/', type: 'directory' }
                            ]
                        }
                    ]
                },
                {
                    name: '📚 /lib - System Libraries',
                    type: 'directory',
                    children: [
                        { name: '📦 modules/ (Kernel modules)', type: 'directory' },
                        {
                            name: '📚 x86_64-linux-gnu/',
                            type: 'directory',
                            children: [
                                { name: '🔧 libc.so (C library)', type: 'file' },
                                { name: '🎨 libgtk.so (GUI toolkit)', type: 'file' }
                            ]
                        },
                        { name: '🔧 systemd/ (System services)', type: 'file' }
                    ]
                },
                {
                    name: '💾 /media - External Media',
                    type: 'directory',
                    children: [
                        { name: '💿 cdrom/', type: 'directory' },
                        { name: '📀 usb/', type: 'directory' },
                        { name: '💽 external_drive/', type: 'directory' }
                    ]
                },
                {
                    name: '📂 /mnt - Mount Points',
                    type: 'directory',
                    children: [
                        { name: '💽 backup_drive/', type: 'directory' },
                        { name: '🌐 network_share/', type: 'directory' },
                        { name: '📀 temporary_mounts/', type: 'directory' }
                    ]
                },
                {
                    name: '🧩 /opt - Optional Software',
                    type: 'directory',
                    children: [
                        { name: '🎮 games/', type: 'directory' },
                        { name: '👨‍💻 development/', type: 'directory' },
                        { name: '🖥️ applications/', type: 'directory' }
                    ]
                },
                {
                    name: '🔍 /proc - Process Information',
                    type: 'directory',
                    children: [
                        { name: '💻 cpuinfo', type: 'file' },
                        { name: '🧮 meminfo', type: 'file' },
                        { name: '⏱️ uptime', type: 'file' },
                        { name: '🔄 sys/', type: 'file' },
                        { name: '🎯 interrupts', type: 'file' }
                    ]
                },
                {
                    name: '👑 /root - Root User Home',
                    type: 'directory',
                    children: [
                        { name: '🔐 .ssh/', type: 'directory' },
                        { name: '📜 .bashrc', type: 'file' },
                        { name: '📊 scripts/', type: 'directory' }
                    ]
                },
                {
                    name: '⚡ /run - Runtime Data',
                    type: 'directory',
                    children: [
                        { name: '🔄 systemd/', type: 'directory' },
                        { name: '🔌 network/', type: 'directory' },
                        { name: '🔐 lock/', type: 'directory' }
                    ]
                },
                {
                    name: '🛠️ /sbin - System Binaries',
                    type: 'directory',
                    children: [
                        { name: '🔄 reboot', type: 'file' },
                        { name: '⚡ shutdown', type: 'file' },
                        { name: '🔧 fdisk', type: 'file' },
                        { name: '🌐 ifconfig', type: 'file' },
                        { name: '💽 mkfs', type: 'file' }
                    ]
                },
                {
                    name: '🌐 /srv - Service Data',
                    type: 'directory',
                    children: [
                        { name: '🕸️ www/', type: 'directory' },
                        { name: '📨 ftp/', type: 'directory' },
                        { name: '📁 nfs/', type: 'directory' }
                    ]
                },
                {
                    name: '📊 /sys - System Hardware',
                    type: 'directory',
                    children: [
                        { name: '💻 devices/', type: 'directory' },
                        { name: '🔌 power/', type: 'directory' },
                        { name: '🎯 kernel/', type: 'directory' },
                        { name: '🚌 bus/', type: 'directory' },
                        { name: '📦 block/', type: 'directory' }
                    ]
                },
                {
                    name: '🗑️ /tmp - Temporary Files',
                    type: 'directory',
                    children: [
                        { name: '📝 session_files/', type: 'directory' },
                        { name: '🔄 cache/', type: 'directory' },
                        { name: '💾 downloads/', type: 'directory' }
                    ]
                },
                {
                    name: '🛒 /usr - User Programs',
                    type: 'directory',
                    children: [
                        {
                            name: '📂 /usr/bin',
                            type: 'directory',
                            children: [
                                { name: '🎨 gimp', type: 'file' },
                                { name: '🎵 vlc', type: 'file' },
                                { name: '📝 vim', type: 'file' },
                                { name: '🌐 firefox', type: 'file' }
                            ]
                        },
                        {
                            name: '📚 /usr/lib',
                            type: 'directory',
                            children: [
                                { name: '🔧 python/', type: 'directory' },
                                { name: '🎮 java/', type: 'directory' },
                                { name: '🖥️ nodejs/', type: 'directory' }
                            ]
                        },
                        {
                            name: '🔧 /usr/local',
                            type: 'directory',
                            children: [
                                { name: '📂 bin/', type: 'directory' },
                                { name: '📚 lib/', type: 'directory' },
                                { name: '💾 share/', type: 'directory' }
                            ]
                        }
                    ]
                },
                {
                    name: '🗄️ /var - Variable Data',
                    type: 'directory',
                    children: [
                        {
                            name: '📜 /var/log',
                            type: 'directory',
                            children: [
                                { name: '📊 syslog', type: 'file' },
                                { name: '🔒 auth.log', type: 'file' },
                                { name: '🌐 apache2/', type: 'directory' },
                                { name: '📨 mail.log', type: 'file' }
                            ]
                        },
                        {
                            name: '📨 /var/mail',
                            type: 'directory',
                            children: [
                                { name: '📧 user1', type: 'file' },
                                { name: '📧 user2', type: 'file' }
                            ]
                        },
                        {
                            name: '📦 /var/spool',
                            type: 'directory',
                            children: [
                                { name: '🖨️ cups/', type: 'directory' },
                                { name: '📨 postfix/', type: 'directory' },
                                { name: '🔄 cron/', type: 'directory' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: '🔐 Security Context',
            type: 'directory',
            children: [
                {
                    name: '🔒 File Permissions',
                    type: 'directory',
                    children: [
                        { name: '👑 root (uid=0)', type: 'file' },
                        { name: '👥 users', type: 'file' },
                        { name: '🔑 chmod/chown', type: 'file' }
                    ]
                },
                {
                    name: '🛡️ Special Permissions',
                    type: 'directory',
                    children: [
                        { name: '💪 SUID', type: 'file' },
                        { name: '👥 SGID', type: 'file' },
                        { name: '📝 Sticky Bit', type: 'file' }
                    ]
                }
            ]
        },
        {
            name: '🔗 Important Links',
            type: 'directory',
            children: [
                {
                    name: '🔄 Symbolic Links',
                    type: 'directory',
                    children: [
                        { name: '/bin ➡️ /usr/bin', type: 'file' },
                        { name: '/lib ➡️ /usr/lib', type: 'file' },
                        { name: '/sbin ➡️ /usr/sbin', type: 'file' }
                    ]
                },
                {
                    name: '💼 Common Operations',
                    type: 'directory',
                    children: [
                        { name: '📁 File Management', type: 'file' },
                        { name: '🔐 Access Control', type: 'file' },
                        { name: '🔧 System Configuration', type: 'file' },
                        { name: '📊 Monitoring', type: 'file' }
                    ]
                }
            ]
        }
    ]
};

// --- COMPONENTS ---

// Recursive component for rendering each node (directory or file)
const FileSystemNode = ({ node, depth = 0, defaultExpandLevel = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(depth < defaultExpandLevel);
  const hasChildren = node.children && node.children.length > 0;

  const toggleExpansion = () => {
      if (hasChildren) {
          setIsExpanded(!isExpanded);
      }
  };

  const paddingLeftStyle = { paddingLeft: `${depth * 20}px` };

  return (
      <div className="my-0.5">
          <div
              className={`flex items-center gap-2 p-1.5 overflow-auto rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-700/50 ${
                  hasChildren ? 'hover:translate-x-1' : ''
              }`}
              style={paddingLeftStyle}
              onClick={toggleExpansion}
          >
              <div className="flex items-center gap-1">
                  {hasChildren && (
                      <div className="w-4 h-4 flex items-center justify-center">
                          {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 overflow-auto text-gray-400" />
                          ) : (
                              <ChevronRight className="w-3.5 h-3.5 overflow-auto text-gray-400" />
                          )}
                      </div>
                  )}
                  {hasChildren ? (
                      isExpanded ? (
                          <FolderOpen className="w-4 h-4 text-yellow-400" />
                      ) : (
                          <Folder className="w-4 h-4 text-yellow-400" />
                      )
                  ) : (
                      <File className="w-4 h-4 text-blue-400 ml-4" />
                  )}
              </div>
              <span className={`font-mono text-sm tracking-tight ${
                  hasChildren ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-white transition-colors duration-200`}>
                  {node.name}
              </span>
          </div>
          <div className={`transition-all duration-200 ${
              isExpanded ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0 overflow-auto'
          }`}>
              {hasChildren && (
                  <div className="relative ml-4 overflow-auto">
                      {node.children.map((child, index) => (
                          <FileSystemNode
                              key={`${child.name}-${index}`}
                              node={child}
                              depth={depth + 1}
                              defaultExpandLevel={defaultExpandLevel}
                          />
                      ))}
                  </div>
              )}
          </div>
      </div>
  );
};

// Main component for the File Explorer
const FileExplorer = () => {
    const directories = [
        {
            name: '/bin',
            description: 'Contains essential command binaries that need to be available in single-user mode and to all users. For example, cat, ls, cp, and pwd.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600'
        },
        {
            name: '/boot',
            description: 'Contains the boot loader files, such as GRUB or LILO, and the kernel that gets used when you boot your system.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-green-400 to-green-600'
        },
        {
            name: '/dev',
            description: 'Contains device files. These include terminal devices, usb, or any device attached to the system.',
            type: 'system',
            bgColor: 'bg-gradient-to-r from-purple-400 to-purple-600'
        },
        {
            name: '/etc',
            description: 'Contains configuration files required by all programs. It also contains shell scripts to start/stop individual programs.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-red-400 to-red-600'
        },
        {
            name: '/home',
            description: 'Home directories for all users to store their personal files.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
        },
        {
            name: '/lib',
            description: 'Contains shared libraries needed by the binaries in /bin and /sbin.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-pink-400 to-pink-600'
        },
        {
            name: '/media',
            description: 'Used as a temporary mount point for removable media such as CD-ROMs and floppy disks.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-orange-400 to-orange-600'
        },
        {
            name: '/mnt',
            description: 'A generic mount point for temporarily mounting filesystems.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-teal-400 to-teal-600'
        },
        {
            name: '/opt',
            description: 'Used for the installation of add-on application software packages.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
        },
        {
            name: '/proc',
            description: 'A virtual filesystem that provides an interface to kernel data structures. It is used to obtain information about the system.',
            type: 'system',
            bgColor: 'bg-gradient-to-r from-cyan-400 to-cyan-600'
        },
        {
            name: '/root',
            description: 'The home directory for the root user.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-gray-400 to-gray-600'
        },
        {
            name: '/run',
            description: 'Used for runtime data for processes started since the last boot. It is used as a temporary filesystem (tmpfs) stored in RAM.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600'
        },
        {
            name: '/sbin',
            description: 'Contains essential system binaries, such as fsck, ifconfig, and swapon.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-green-400 to-green-600'
        },
        {
            name: '/srv',
            description: 'Contains data for services provided by the system.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-purple-400 to-purple-600'
        },
        {
            name: '/sys',
            description: 'A virtual filesystem that provides an interface to kernel data structures. It is used to obtain information about the system hardware.',
            type: 'system',
            bgColor: 'bg-gradient-to-r from-red-400 to-red-600'
        },
        {
            name: '/tmp',
            description: 'Used for temporary files created by the system and users. These files are deleted when the system is rebooted.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
        },
        {
            name: '/usr',
            description: 'Contains user applications and files. It is the largest directory in the filesystem.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-pink-400 to-pink-600'
        },
        {
            name: '/var',
            description: 'Contains variable data files. This includes spool directories and files, administrative and logging data, and transient and temporary files.',
            type: 'standard',
            bgColor: 'bg-gradient-to-r from-orange-400 to-orange-600'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen font-sans p-6">
            <div className="container mx-auto max-w-auto">
                {/* Call to Action Section */}
                <div className="mb-1 p-3 mt-12 rounded-lg bg-yellow-400/20 border border-yellow-400">
                    <h2 className="text-md font-mono font-semibold mb-4 text-yellow-400">
                        👉  Explore the Visualization Below!
                    </h2>
                    <p className="font-mono text-yellow-100 leading-relaxed">
                    Explore the interactive Linux file system visualization below. I designed it to help you understand the structure and hierarchy of a typical Linux system in a visual and engaging way."                    </p>
                    <ul className="mt-4 font-mono text-yellow-100">
                        <li>
                            <strong className="text-yellow-400">Click on folders -</strong> Expand and collapse directories to see what's inside.
                        </li>
                    </ul>
                </div>

                {/* File Tree and Additional Notes Section */}
                <div className="gap-8">
                    {/* File Tree Section */}
                    <div className="p-0.5 mt-8 rounded-lg border-dashed border-yellow-400">
                        <h3 className="text-lg font-mono mb-2 text-green-400">Interactive Linux File System (Tool) </h3>
                        <FileSystemNode
                            node={linuxFileSystemData}
                            defaultExpandLevel={1}
                        />
                    </div>
                    {/* Additional Notes Section */}
                    <div className="p-1 rounded-lg shadow-lg font-mono">
                        <h3 className="text-lg mt-6 mb-4 font-mono font-bold text-sky-400/100">Additional Notes</h3>
                        <p className="font-mono text-white">
                            The Linux filesystem is structured as a tree, beginning from the root directory (/).
                            Each directory serves a specific purpose.
                        </p>
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                            {directories.map((dir) => (
                                <div
                                    key={dir.name}
                                    className={`group p-4 rounded-xl border border-gray-200 hover:border-blue-400 transition-all duration-300 bg-white hover:shadow-lg transform hover:-translate-y-1 ${dir.bgColor}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div
                                            className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors duration-300 ${
                                                dir.type === 'system'
                                                    ? 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
                                                    : 'bg-gray-50 text-gray-700 group-hover:bg-gray-100'
                                            }`}
                                        >
                                            {dir.name}
                                        </div>
                                    </div>
                                    <p className="mt-3 text-white text-sm leading-relaxed">
                                        {dir.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 mt-4">
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-purple-900 mb-2">Permissions</h3>
                                <p className="text-purple-700 text-sm leading-relaxed">
                                    In Linux, files and directories have permissions which determine who can read, write, or execute them. Permissions are set using commands like `chmod` and `chown`.
                                </p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-purple-900 mb-2">Links</h3>
                                <p className="text-purple-700 text-sm leading-relaxed">
                                    Linux uses symbolic links (symlinks) to create shortcuts to files/directories. Symbolic links are useful for creating aliases for files and directories, making it easier to manage and access them.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileExplorer;
