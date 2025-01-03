import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Zap,
  GitPullRequest,
  ArrowRight,
  Clock,
  Check,
  Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PythonConcurrencyParallelismVisualizer = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const sectionRef = useRef([]);

  const sections = [
    {
      id: 1,
      name: 'Threading',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-100',
      description:
        'Threading is a model of concurrency where multiple threads exist within a single process. Threads share the same memory space, allowing easy communication and data sharing. However, this shared memory can lead to race conditions if not synchronized properly.',
      properties: [
        'Runs in a single process',
        'Shared memory space',
        'Lightweight',
        'Susceptible to race conditions',
        'Global Interpreter Lock (GIL)',
      ],
      useCases: [
        'I/O-bound tasks (tasks waiting for external resources like network requests or file I/O)',
        'Concurrent execution within a single process',
        'Responsive UIs',
      ],
      limitations: [
        'GIL limits true parallelism for CPU-bound tasks',
        'Shared memory requires careful synchronization to avoid race conditions',
      ],
      code: `
import threading
import time

def task(name):
    print(f"Thread {name}: starting")
    time.sleep(2)  # Simulate I/O-bound work
    print(f"Thread {name}: finishing")

# Create and start threads
thread1 = threading.Thread(target=task, args=("One",))
thread2 = threading.Thread(target=task, args=("Two",))

thread1.start()
thread2.start()

print("Main    : before joining thread")
thread1.join() # Wait for the thread to finish - blocks the main thread until thread1 finishes
thread2.join() # Wait for the thread to finish - blocks the main thread until thread2 finishes
print("Main    : all done")
      `,
      diagramDescription:
        'This diagram shows the performance of threads over time, highlighting the concurrent nature of threading. Due to the GIL, only one thread can execute Python bytecode at a time, making it appear as if tasks are interleaved rather than truly parallel.',
      modules: [
        {
          name: 'threading',
          description:
            'Provides support for creating and managing threads. Key components include Thread (to create threads), Lock and RLock (for synchronization), Semaphore (to control access to a resource), Event (for thread communication), and Condition (for more complex synchronization).',
        },
        {
          name: 'concurrent.futures.ThreadPoolExecutor',
          description:
            'A higher-level interface for running tasks concurrently using a pool of threads. It simplifies thread management and provides a way to submit tasks and retrieve results.',
        },
        {
          name: 'queue.Queue',
          description:
            'A thread-safe queue implementation that allows multiple threads to communicate and exchange data safely.',
        },
      ],
      concepts: [
        {
          name: 'Thread',
          description:
            'A lightweight unit of execution within a process, sharing the same memory space with other threads in the process.',
        },
        {
          name: 'ThreadPoolExecutor',
          description:
            'A high-level interface for managing a pool of threads and executing tasks concurrently.',
        },
        {
          name: 'Lock',
          description:
            'A synchronization primitive that allows only one thread to acquire it at a time, used to protect shared resources from race conditions.',
        },
        {
          name: 'RLock',
          description:
            'A reentrant lock that can be acquired multiple times by the same thread, useful for recursive functions that need to access shared resources.',
        },
        {
          name: 'Semaphore',
          description:
            'A synchronization primitive that maintains an internal counter, allowing a specified number of threads to access a resource concurrently.',
        },
        {
          name: 'Event',
          description:
            'A synchronization primitive used for communication between threads, where one thread can wait for an event to be set by another thread.',
        },
        {
          name: 'Condition',
          description:
            'A more advanced synchronization primitive that combines a lock and an event, allowing threads to wait for a specific condition to become true.',
        },
        {
          name: 'Barrier',
          description:
            'A synchronization primitive that allows a group of threads to wait until all of them have reached a certain point in their execution before proceeding.',
        },
      ],
    },
    {
      id: 2,
      name: 'Multiprocessing',
      icon: <GitPullRequest className="w-6 h-6 text-green-500" />,
      color: 'bg-green-100',
      description:
        'Multiprocessing enables parallelism by running multiple processes, each with its own independent memory space and Python interpreter. This bypasses the GIL, allowing true parallel execution, especially for CPU-bound tasks.',
      properties: [
        'Runs in multiple processes',
        'Independent memory spaces',
        'Heavier than threads',
        'Avoids GIL limitations',
        'Inter-process communication (IPC)',
      ],
      useCases: [
        'CPU-bound tasks (tasks that require heavy computation)',
        'True parallelism on multi-core systems',
        'Independent tasks',
      ],
      limitations: [
        'Higher memory overhead due to separate memory spaces for each process',
        'IPC can be more complex than shared memory in threading',
      ],
      code: `
import multiprocessing
import time

def task(name):
    print(f"Process {name}: starting")
    time.sleep(2)  # Simulate CPU-bound work
    print(f"Process {name}: finishing")

if __name__ == "__main__":
    # Create and start processes
    process1 = multiprocessing.Process(target=task, args=("One",))
    process2 = multiprocessing.Process(target=task, args=("Two",))

    process1.start()
    process2.start()

    print("Main    : before joining process")
    process1.join()  # Wait for the process to finish
    process2.join()
    print("Main    : all done")
      `,
      diagramDescription:
        'This diagram shows the performance of processes over time, highlighting the parallel nature of multiprocessing. Each process can run on a separate CPU core, allowing tasks to execute truly in parallel.',
      modules: [
        {
          name: 'multiprocessing',
          description:
            'Enables creating and managing processes. It includes Process (to create processes), Pool (for managing a pool of worker processes), Queue and Pipe (for inter-process communication), Manager (for shared objects), and SharedMemory (for direct shared memory access).',
        },
        {
          name: 'concurrent.futures.ProcessPoolExecutor',
          description:
            'Similar to ThreadPoolExecutor but uses a pool of processes for true parallelism, especially for CPU-bound tasks.',
        },
        {
          name: 'multiprocessing.Pool',
          description:
            'A lower-level way to manage a pool of worker processes, providing more control over process management and task distribution.',
        },
      ],
      concepts: [
        {
          name: 'Process',
          description:
            'An independent unit of execution with its own memory space and Python interpreter, used for achieving true parallelism.',
        },
        {
          name: 'ProcessPoolExecutor',
          description:
            'A high-level interface for managing a pool of processes and executing tasks in parallel.',
        },
        {
          name: 'Queue',
          description: 'A thread- and process-safe queue for inter-process communication.',
        },
        {
          name: 'Pipe',
          description: 'A two-way communication channel between processes.',
        },
        {
          name: 'Manager',
          description:
            'A mechanism for creating shared objects that can be accessed and modified by multiple processes.',
        },
        {
          name: 'SharedMemory',
          description:
            'A way to create a block of memory that can be directly accessed and shared by multiple processes.',
        },
        {
          name: 'Value',
          description: 'A shared memory object for storing a single value of a specific type.',
        },
        {
          name: 'Array',
          description: 'A shared memory object for storing an array of values of a specific type.',
        },
      ],
    },
    {
      id: 3,
      name: 'Asyncio',
      icon: <ArrowRight className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-100',
      description:
        'Asyncio is a single-threaded concurrency model in Python that uses an event loop to run asynchronous tasks (coroutines) concurrently. It efficiently manages I/O-bound tasks using non-blocking I/O operations.',
      properties: [
        'Single-threaded',
        'Uses an event loop',
        'Asynchronous tasks (coroutines)',
        'Non-blocking I/O',
        'Cooperative multitasking',
      ],
      useCases: [
        'High-concurrency I/O-bound tasks',
        'Network programming',
        'Web servers',
      ],
      limitations: [
        'Requires asynchronous code using async/await',
        'Not suitable for CPU-bound tasks',
      ],
      code: `
import asyncio

async def task(name):
    print(f"Task {name}: starting")
    await asyncio.sleep(2)  # Simulate asynchronous I/O-bound work
    print(f"Task {name}: finishing")

async def main():
    # Create and run tasks concurrently
    await asyncio.gather(
        task("One"),
        task("Two")
    )

if __name__ == "__main__":
    asyncio.run(main())
      `,
      diagramDescription:
        'This diagram shows the performance of asynchronous tasks over time, highlighting the concurrent nature of asyncio. The event loop switches between tasks when they are waiting for I/O, giving the illusion of parallelism.',
      modules: [
        {
          name: 'asyncio',
          description:
            'The core library for asynchronous programming in Python. It provides the event loop (asyncio.run, asyncio.get_event_loop), coroutines (async def), tasks (asyncio.create_task), and futures (asyncio.Future).',
        },
        {
          name: 'aiohttp',
          description:
            'An asynchronous HTTP client/server framework built on top of asyncio. It\'s used for making asynchronous HTTP requests and building asynchronous web servers.',
        },
        {
          name: 'aiomysql',
          description:
            'An asynchronous library for interacting with MySQL databases, allowing non-blocking database operations.',
        },
        {
          name: 'aioredis',
          description:
            'An asynchronous client for Redis, enabling non-blocking communication with Redis servers.',
        },
      ],
      concepts: [
        {
          name: 'Event Loop',
          description:
            'The core of asyncio, responsible for scheduling and running asynchronous tasks (coroutines).',
        },
        {
          name: 'Coroutine',
          description:
            'A function defined with async def that can be paused and resumed, allowing other tasks to run in the meantime.',
        },
        {
          name: 'Future',
          description: 'Represents the result of an asynchronous operation that may not be complete yet.',
        },
        {
          name: 'Task',
          description:
            'A wrapper around a coroutine that allows it to be scheduled and managed by the event loop.',
        },
        {
          name: 'async/await',
          description:
            'Keywords used to define and manage coroutines, allowing asynchronous code to be written in a more synchronous style.',
        },
        {
          name: 'Gather',
          description:
            'A function that allows running multiple coroutines concurrently and waiting for all of them to complete.',
        },
        {
          name: 'Semaphore',
          description:
            'Similar to the threading version, used to limit the number of coroutines that can access a resource concurrently.',
        },
        {
          name: 'Lock',
          description: 'Similar to the threading version, used to protect shared resources in asynchronous code.',
        },
      ],
    },
    {
      id: 4,
      name: 'Concurrency vs Parallelism',
      icon: <Cpu className="w-6 h-6 text-red-500" />,
      color: 'bg-red-100',
      description:
        'Concurrency is about managing multiple tasks at once, while parallelism is about executing multiple tasks simultaneously. Concurrency deals with tasks making progress over time (interleaved), while parallelism involves tasks running at the exact same time (e.g., on multiple CPU cores).',
      properties: [
        'Concurrency: multiple tasks make progress (interleaved)',
        'Parallelism: multiple tasks execute simultaneously',
        'Concurrency != Parallelism',
        'Threading: concurrent but not parallel (due to GIL)',
        'Multiprocessing: concurrent and parallel',
      ],
      useCases: [
        'Concurrency: I/O-bound tasks, responsiveness',
        'Parallelism: CPU-bound tasks, speedup',
      ],
      limitations: [
        'Overhead: Both concurrency and parallelism introduce some overhead in terms of managing tasks and communication',
        'Complexity: Implementing and debugging concurrent and parallel programs can be more complex',
      ],
      code: `
# Concurrency (Threading - I/O-bound)
# Multiple tasks are managed, but only one runs at a time (due to GIL).
# Suitable for tasks waiting for I/O (e.g., network requests, file reads).

# Parallelism (Multiprocessing - CPU-bound)
# Multiple tasks are executed simultaneously on different CPU cores.
# Suitable for tasks that require heavy CPU computation.
      `,
      diagramDescription:
        'This diagram compares the performance of concurrent and parallel tasks over time. Concurrent tasks are interleaved, while parallel tasks run at the same time.',
      modules: [
        {
          name: 'threading',
          description: 'Provides support for creating and managing threads.',
        },
        {
          name: 'multiprocessing',
          description: 'Enables creating and managing processes for true parallelism.',
        },
        {
          name: 'asyncio',
          description: 'Provides a framework for single-threaded concurrency using an event loop.',
        },
        {
          name: 'concurrent.futures',
          description:
            'Provides a high-level interface for both threading and multiprocessing using ThreadPoolExecutor and ProcessPoolExecutor.',
        },
      ],
      concepts: [
        {
          name: 'Concurrency',
          description: 'Managing multiple tasks at once, making progress on them over time.',
        },
        {
          name: 'Parallelism',
          description: 'Executing multiple tasks simultaneously, typically using multiple CPU cores.',
        },
        {
          name: 'GIL',
          description:
            'Global Interpreter Lock, a mutex in CPython that allows only one thread to hold control of the Python interpreter.',
        },
        {
          name: 'Event Loop',
          description: 'The core of asyncio that manages and runs asynchronous tasks.',
        },
        {
          name: 'Process',
          description: 'An independent unit of execution with its own memory space.',
        },
        {
          name: 'Thread',
          description: 'A lightweight unit of execution within a process, sharing memory with other threads.',
        },
        {
          name: 'Coroutine',
          description: 'An asynchronous task in asyncio that can be paused and resumed.',
        },
      ],
    },
    {
      id: 5,
      name: 'Global Interpreter Lock (GIL)',
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-100',
      description:
        'The Global Interpreter Lock (GIL) is a mutex in the CPython interpreter that allows only one thread to hold control of the Python interpreter at any given time. This simplifies CPython\'s implementation but limits the parallelism of multithreaded Python programs for CPU-bound tasks.',
      properties: [
        'Limits parallelism in threading for CPU-bound tasks',
        'Simplifies CPython implementation',
        'Impacts CPU-bound multithreaded programs',
      ],
      workarounds: [
        'Multiprocessing: Using multiple processes to bypass the GIL',
        'Alternative Python implementations (e.g., Jython, IronPython)',
        'Using C extensions that release the GIL',
      ],
      implications: [
        'Threading is not truly parallel for CPU-bound tasks in CPython',
        'Choose multiprocessing for CPU-bound parallelism',
      ],
      code: `
# The GIL prevents multiple threads from executing Python bytecodes at once.
# This means that threading in CPython is suitable for I/O-bound tasks but not
# for CPU-bound tasks, where multiprocessing should be used instead.

# Example:
# In a multithreaded CPU-bound program, you won't see performance gains
# proportional to the number of threads due to the GIL.
      `,
      diagramDescription:
        'This diagram shows the impact of the GIL on the performance of threads over time. It demonstrates that only one thread can execute Python bytecode at a time, limiting the potential for true parallelism in CPU-bound tasks.',
      modules: [
        {
          name: 'threading',
          description: 'Provides support for creating and managing threads.',
        },
        {
          name: 'multiprocessing',
          description: 'Enables creating and managing processes to bypass the GIL.',
        },
        {
          name: 'concurrent.futures',
          description:
            'Provides a high-level interface for both threading and multiprocessing.',
        },
      ],
      concepts: [
        {
          name: 'GIL',
          description:
            'Global Interpreter Lock, a mutex in CPython that allows only one thread to hold control of the Python interpreter at any given time.',
        },
        {
          name: 'Thread',
          description: 'A lightweight unit of execution within a process.',
        },
        {
          name: 'Process',
          description: 'An independent unit of execution with its own memory space, used to bypass the GIL.',
        },
        {
          name: 'Concurrency',
          description: 'Managing multiple tasks at once.',
        },
        {
          name: 'Parallelism',
          description: 'Executing multiple tasks simultaneously.',
        },
      ],
    },
  ];

  useEffect(() => {
    sections.forEach((section) => {
      const img = new Image();
      img.src = `/${section.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    });
  }, []);

  const handleSectionClick = (index) => {
    setCurrentSection(index);
    const element = sectionRef.current[index];
    if (element) {
      const offset = 100;
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleCopy = () => {
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(null), 1000);
  };

  return (
    <div className="min-h-screen font-mono bg-gray-50 p-4">
      <div className="max-w-auto mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-blue-500" />
              <h1 className="text-lg font-bold">
                Python Concurrency and Parallelism
              </h1>
            </div>
          </div>
          <div className="p-4 mt-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700 text-xs text-base leading-relaxed">
              <strong className="text-blue-600">
                Python Concurrency and Parallelism
              </strong>{' '}
              are fundamental concepts for building efficient and responsive
              programs. This visualizer explores various approaches to achieving
              concurrency and parallelism in Python, including threading,
              multiprocessing, and asyncio. It also highlights their practical
              use cases, limitations, and the impact of the Global Interpreter
              Lock (GIL) on performance.
            </p>
          </div>
        </div>
        <div className="p-6">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => handleSectionClick(index)}
                className={`p-4 rounded-lg transition-all flex flex-col items-center space-y-1 ${
                  currentSection === index
                    ? `${section.color.replace(
                        '100',
                        '500'
                      )} text-white shadow-lg`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View ${section.name}`}
              >
                {React.cloneElement(section.icon, { className: 'w-4 h-4' })}
                <span className="text-sm font-medium text-center">
                  {section.name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                ref={(el) => (sectionRef.current[currentSection] = el)}
                className="space-y-4"
              >
                <div
                  className={`rounded-lg p-4 ${
                    sections[currentSection].color
                  }`}
                >
                  <h3 className="font-semibold text-md mb-2">
                    {sections[currentSection].name}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {sections[currentSection].description}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">
                    Key{' '}
                    {currentSection === 0
                      ? 'Properties'
                      : currentSection === 1
                      ? 'Properties'
                      : currentSection === 2
                      ? 'Properties'
                      : currentSection === 3
                      ? 'Properties'
                      : currentSection === 4
                      ? 'Properties'
                      : currentSection === 5
                      ? 'Properties'
                      : 'Properties'}
                  </h4>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {sections[currentSection].properties.map((item, index) => (
                      <motion.span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">
                    {currentSection === 0
                      ? 'Use Cases'
                      : currentSection === 1
                      ? 'Use Cases'
                      : currentSection === 2
                      ? 'Use Cases'
                      : currentSection === 3
                      ? 'Use Cases'
                      : currentSection === 4
                      ? 'Workarounds'
                      : 'Use Cases'}
                  </h4>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {sections[currentSection].useCases ? (
                      sections[currentSection].useCases.map((item, index) => (
                        <motion.span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          {item}
                        </motion.span>
                      ))
                    ) : (
                      sections[currentSection].workarounds.map(
                        (item, index) => (
                          <motion.span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                          >
                            {item}
                          </motion.span>
                        )
                      )
                    )}
                  </motion.div>
                </div>
              </div>
              <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">Concepts</h4>
                  <ul className="space-y-2">
                    {sections[currentSection].concepts.map(
                      (concept, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-2 text-xs"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1 ${sections[
                              currentSection
                            ].color.replace('100', '500')}`}
                          />
                          <div className="flex-1">
                            <span className="font-medium">{concept.name}:</span>{' '}
                            {concept.description}
                          </div>
                        </motion.div>
                      )
                    )}
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">Modules</h4>
                  <ul className="space-y-2">
                    {sections[currentSection].modules.map((module, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-2 text-xs"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1 ${sections[
                            currentSection
                          ].color.replace('100', '500')}`}
                        />
                        <div className="flex-1">
                          <span className="font-medium">{module.name}:</span>{' '}
                          {module.description}
                        </div>
                      </motion.div>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">
                    {currentSection === 0
                      ? 'Limitations'
                      : currentSection === 1
                      ? 'Limitations'
                      : currentSection === 2
                      ? 'Limitations'
                      : currentSection === 3
                      ? 'Limitations'
                      : currentSection === 4
                      ? 'Implications'
                      : 'Limitations'}
                  </h4>
                  <ul className="space-y-2">
                    {sections[currentSection].limitations ? (
                      sections[currentSection].limitations.map(
                        (limitation, index) => (
                          <motion.li
                            key={index}
                            className="flex items-center space-x-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${sections[
                                currentSection
                              ].color.replace('100', '500')}`}
                            />
                            <span>{limitation}</span>
                          </motion.li>
                        )
                      )
                    ) : (
                      sections[currentSection].implications.map(
                        (implication, index) => (
                          <motion.li
                            key={index}
                            className="flex items-center space-x-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${sections[
                                currentSection
                              ].color.replace('100', '500')}`}
                            />
                            <span>{implication}</span>
                          </motion.li>
                        )
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-md">Code Sample</h4>
                  <CopyToClipboard
                    text={sections[currentSection].code}
                    onCopy={handleCopy}
                  >
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
                      {copyFeedback === 'Copied!' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </CopyToClipboard>
                </div>
                <SyntaxHighlighter
                  language="python"
                  style={docco}
                  customStyle={{ fontSize: '10px' }}
                >
                  {sections[currentSection].code}
                </SyntaxHighlighter>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PythonConcurrencyParallelismVisualizer;