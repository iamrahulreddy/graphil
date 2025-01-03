import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  FaFileCode,
  FaCogs,
  FaMemory,
  FaMicrochip,
  FaNetworkWired,
  FaArrowDown,
  FaPause,
  FaPlay,
  FaRedo,
  FaTachometerAlt,
  FaCodeBranch,
} from "react-icons/fa";

// Define color schemes for different steps
const colorSchemes = {
  LEXING: {
    bg: "bg-pink-600",
    text: "text-pink-600",
    border: "border-pink-600",
  },
  PARSING: {
    bg: "bg-red-600",
    text: "text-red-600",
    border: "border-red-600",
  },
  AST_GENERATION: {
    bg: "bg-orange-600",
    text: "text-orange-600",
    border: "border-orange-600",
  },
  COMPILATION: {
    bg: "bg-yellow-600",
    text: "text-yellow-600",
    border: "border-yellow-600",
  },
  BYTECODE_GENERATION: {
    bg: "bg-lime-600",
    text: "text-lime-600",
    border: "border-lime-600",
  },
  INTERPRETATION_SETUP: {
    bg: "bg-green-600",
    text: "text-green-600",
    border: "border-green-600",
  },
  INTERPRETATION: {
    bg: "bg-teal-600",
    text: "text-teal-600",
    border: "border-teal-600",
  },
  STACK_FRAME_MANAGEMENT: {
    bg: "bg-sky-600",
    text: "text-sky-600",
    border: "border-sky-600",
  },
  NAME_RESOLUTION: {
    bg: "bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-600",
  },
  ATTRIBUTE_ACCESS: {
    bg: "bg-indigo-600",
    text: "text-indigo-600",
    border: "border-indigo-600",
  },
  OPERATOR_EVALUATION: {
    bg: "bg-violet-600",
    text: "text-violet-600",
    border: "border-violet-600",
  },
  CONTROL_FLOW: {
    bg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-600",
  },
  EXCEPTION_HANDLING: {
    bg: "bg-fuchsia-600",
    text: "text-fuchsia-600",
    border: "border-fuchsia-600",
  },
  GARBAGE_COLLECTION: {
    bg: "bg-pink-600",
    text: "text-pink-600",
    border: "border-pink-600",
  },
  JIT_COMPILATION: {
    bg: "bg-rose-600",
    text: "text-rose-600",
    border: "border-rose-600",
  },
  SYSTEM_CALLS: {
    bg: "bg-green-800",
    text: "text-green-600",
    border: "border-green-800",
  },
  MODULE_IMPORT: {
    bg: "bg-yellow-700",
    text: "text-yellow-700",
    border: "border-yellow-700",
  },
};

// StepVisualizer Component: Renders each step in the Python program execution
const StepVisualizer = React.forwardRef(
  ({ step, isActive, isLast, onClick }, ref) => {
    const colors = colorSchemes[step.title.replace(">", "").trim()];

    return (
      <div className="relative" onClick={onClick} ref={ref}>
        <div
          className={`
          transition-all duration-300 ease-in-out
          p-6 rounded-lg border-2 cursor-pointer
          ${
            isActive
              ? `scale-[1.02] shadow-lg shadow-${colors.border}/20`
              : "opacity-70"
          }
          bg-gray-800 ${colors.border}
        `}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className={`
              ${colors.bg} p-4 rounded-lg
              text-white transform transition-transform duration-300
              ${isActive ? "scale-110 animate-pulse" : ""}
            `}
            >
              {step.icon}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                {step.title}
              </h3>
              <p className="text-sm text-white mb-3">{step.description}</p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <code className="text-sm text-white">{step.technical}</code>
                {/* Examples of relevant Python tools/libraries added */}
                {step.tools && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      Explore these tools:
                    </p>
                    <ul className="text-xs text-blue-400 list-disc list-inside">
                      {step.tools.map((tool, index) => (
                        <li key={index}>
                          <code>{tool}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-4 text-white text-sm">
                {/* Enhanced Definition with Analogy and Examples */}
                <p>
                  <strong>{step.definition.title}:</strong>{" "}
                  {step.definition.explanation}
                </p>
                {step.definition.analogy && (
                  <p className="mt-2 text-gray-400">
                    <span>Analogy:</span> {step.definition.analogy}
                  </p>
                )}
                {step.definition.examples && (
                  <ul className="mt-2 list-disc list-inside text-gray-300">
                    {step.definition.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isLast && (
          <div className="flex justify-center my-4">
            <FaArrowDown
              className={`
              w-6 h-6 text-gray-600 transition-all
              ${isActive ? "animate-bounce text-green-500" : ""}
            `}
            />
          </div>
        )}
      </div>
    );
  }
);

// PythonExecutionVisualizer Component: Main component for visualizing Python program execution
const PythonExecutionVisualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(3000); // Animation speed in ms
  const [isHovering, setIsHovering] = useState(false); // For play/pause button hover state

  // Refs for each step
  const stepRefs = useRef([]);
  const containerRef = useRef(); // Ref for the main container

  // Define steps using useMemo to prevent unnecessary re-renders
  const steps = useMemo(
    () => [
      {
        id: 1,
        title: "> LEXING",
        icon: <FaFileCode className="w-8 h-8" />,
        description:
          "$ lexing source code... Breaking the code into tokens - the basic building blocks.",
        technical: "process: lexing/tokenization",
        definition: {
          title: "Lexing (Tokenization)",
          explanation:
            "The initial phase where the source code is scanned and divided into a stream of tokens. Each token represents a basic unit of the language, such as keywords, identifiers, operators, and literals.",
          analogy:
            "Like breaking down a sentence into individual words and punctuation marks.",
          examples: [
            "In the statement 'x = 10 + y', the tokens would be: 'x', '=', '10', '+', 'y'.",
            "Keywords like 'if', 'else', 'while', 'for' are recognized as special tokens.",
          ],
        },
        tools: ["tokenize", "lexer"],
      },
      {
        id: 2,
        title: "> PARSING",
        icon: <FaFileCode className="w-8 h-8" />,
        description:
          "$ parsing tokens... Analyzing the sequence of tokens to determine the grammatical structure of the code.",
        technical: "process: parsing using a grammar",
        definition: {
          title: "Parsing",
          explanation:
            "The process of analyzing the stream of tokens to verify its syntactical correctness according to the language's grammar rules and building a parse tree that represents the hierarchical structure.",
          analogy:
            "Like diagramming a sentence to understand its grammatical structure (subject, verb, object, etc.).",
          examples: [
            "Recognizing that 'if x > 5: print(x)' is a valid conditional statement.",
            "Detecting syntax errors like missing colons or incorrect indentation.",
          ],
        },
        tools: ["ast", "parser"],
      },
      {
        id: 3,
        title: "> AST_GENERATION",
        icon: <FaCogs className="w-8 h-8" />,
        description:
          "$ generating abstract syntax tree... Creating a tree-like representation of the code's structure.",
        technical: "process: ast construction",
        definition: {
          title: "Abstract Syntax Tree (AST) Generation",
          explanation:
            "The process of transforming the parse tree into an Abstract Syntax Tree (AST). The AST is a simplified, more abstract representation of the code's structure that is easier for further processing.",
          analogy:
            "Like creating a simplified diagram of a sentence that highlights the essential relationships between its parts.",
          examples: [
            "An AST for 'x = 10 + y' might have a root node 'assign', with a left child 'x' and a right child 'add' (which itself has children '10' and 'y').",
            "The 'ast' module in Python allows you to inspect the AST of a program.",
          ],
        },
        tools: ["ast", "compiler"],
      },
      {
        id: 4,
        title: "> COMPILATION",
        icon: <FaCogs className="w-8 h-8" />,
        description:
          "$ compiling AST... Transforming the abstract syntax tree into bytecode.",
        technical: "process: compilation to bytecode",
        definition: {
          title: "Compilation to Bytecode",
          explanation:
            "The phase where the AST is converted into Python bytecode. Bytecode is a lower-level set of instructions designed to be executed by the Python Virtual Machine (PVM).",
          analogy:
            "Like translating a book into a simplified, intermediate language that can be easily processed by a machine.",
          examples: [
            "The 'compile()' function in Python can be used to manually compile source code or an AST into a code object (containing bytecode).",
            "Bytecode files often have a '.pyc' extension.",
          ],
        },
        tools: ["py_compile", "compileall"],
      },
      {
        id: 5,
        title: "> BYTECODE_GENERATION",
        icon: <FaMicrochip className="w-8 h-8" />,
        description:
          "$ generating bytecode... Creating the intermediate code that the interpreter will execute.",
        technical: "process: bytecode generation",
        definition: {
          title: "Bytecode Generation",
          explanation:
            "The specific process of creating the individual bytecode instructions from the AST. Each bytecode instruction corresponds to a specific operation that the PVM can perform.",
          analogy:
            "Like writing a detailed script for a play, with each line representing a specific action for an actor to take.",
          examples: [
            "Instructions like 'LOAD_FAST' (load a local variable onto the stack), 'BINARY_ADD' (add the top two stack items), 'STORE_FAST' (store the top stack item in a local variable).",
            "The 'dis' module can be used to disassemble bytecode and view the individual instructions.",
          ],
        },
        tools: ["dis", "opcode"],
      },
      {
        id: 6,
        title: "> INTERPRETATION_SETUP",
        icon: <FaMicrochip className="w-8 h-8" />,
        description:
          "$ setting up interpreter... Preparing the Python Virtual Machine to execute the bytecode.",
        technical: "process: interpreter initialization",
        definition: {
          title: "Interpretation Setup",
          explanation:
            "The steps taken to initialize the Python Virtual Machine (PVM) and prepare it for executing the bytecode. This includes setting up the execution environment, creating necessary data structures, etc.",
          analogy:
            "Like setting the stage for a play, making sure all the props are in place, the lighting is set, and the actors are ready.",
          examples: [
            "Allocating memory for the stack and other internal data structures.",
            "Loading necessary built-in modules and functions.",
          ],
        },
        tools: ["CPython (default interpreter)"],
      },
      {
        id: 7,
        title: "> INTERPRETATION",
        icon: <FaMicrochip className="w-8 h-8" />,
        description:
          "$ interpreting bytecode... The Python Virtual Machine is now executing the bytecode instructions.",
        technical: "process: bytecode interpretation loop",
        definition: {
          title: "Interpretation",
          explanation:
            "The core process where the PVM executes the bytecode instructions one by one. The interpreter maintains a stack and performs operations based on the instructions it reads.",
          analogy:
            "Like an actor performing a play, following the script line by line and executing the actions specified.",
          examples: [
            "The PVM fetches an instruction, decodes it, and performs the corresponding operation (e.g., arithmetic, stack manipulation, function calls).",
            "The interpreter's main loop is often called the 'eval loop' or 'interpreter loop'.",
          ],
        },
        tools: ["CPython", "PyPy"],
      },
      {
        id: 8,
        title: "> STACK_FRAME_MANAGEMENT",
        icon: <FaMemory className="w-8 h-8" />,
        description:
          "$ managing stack frames... Creating and managing stack frames for function calls.",
        technical: "process: stack frame allocation/deallocation",
        definition: {
          title: "Stack Frame Management",
          explanation:
            "When a function is called, a new stack frame is created to store its local variables, arguments, and return address. The interpreter manages the creation and removal of these stack frames as functions are called and return.",
          analogy:
            "Like opening a new document to keep track of notes for a specific task, and closing it when the task is done.",
          examples: [
            "When a function is called, a new frame is pushed onto the call stack.",
            "When a function returns, its frame is popped off the stack.",
            "Stack frames enable recursion by allowing multiple instances of a function to exist simultaneously, each with its own local data.",
          ],
        },
        tools: ["inspect", "traceback"],
      },
      {
        id: 9,
        title: "> NAME_RESOLUTION",
        icon: <FaNetworkWired className="w-8 h-8" />,
        description:
          "$ resolving names... Looking up the values associated with variables and other names.",
        technical: "process: name lookup in namespaces",
        definition: {
          title: "Name Resolution (Scoping)",
          explanation:
            "The process of finding the value associated with a name (variable, function, etc.) when it is referenced in the code. Python follows scoping rules (LEGB: Local, Enclosing, Global, Built-in) to determine where to search for a name.",
          analogy:
            "Like searching for a contact in your address book, first checking your personal contacts, then family, then work, and finally the public directory.",
          examples: [
            "When you use a variable 'x', the interpreter first checks the local scope (current function), then any enclosing function scopes, then the global scope, and finally the built-in scope.",
            "Name resolution can be affected by keywords like 'global' and 'nonlocal'.",
          ],
        },
        tools: ["locals()", "globals()"],
      },
      {
        id: 10,
        title: "> ATTRIBUTE_ACCESS",
        icon: <FaNetworkWired className="w-8 h-8" />,
        description:
          "$ accessing attributes... Retrieving attributes of objects (e.g., methods, data members).",
        technical: "process: attribute lookup",
        definition: {
          title: "Attribute Access",
          explanation:
            "When you access an attribute of an object (e.g., 'obj.attr' or 'obj.method()'), the interpreter needs to find and retrieve that attribute. This involves looking up the attribute in the object's namespace and potentially its class's namespace.",
          analogy:
            "Like retrieving a specific tool from a toolbox, or looking up a method in a user manual for an object.",
          examples: [
            "Accessing a method of a class instance (e.g., 'my_list.append(5)').",
            "Retrieving a data attribute of an object (e.g., 'my_object.data').",
            "Attribute access can involve descriptors and the '__getattribute__' method.",
          ],
        },
        tools: ["getattr()", "hasattr()", "dir()"],
      },
      {
        id: 11,
        title: "> OPERATOR_EVALUATION",
        icon: <FaPlay className="w-8 h-8" />,
        description:
          "$ evaluating operators... Performing operations like arithmetic, comparisons, and logical operations.",
        technical: "process: operator overloading/evaluation",
        definition: {
          title: "Operator Evaluation",
          explanation:
            "When Python encounters operators in expressions (e.g., '+', '-', '*', '/', '==', '>', '<', 'and', 'or'), it needs to evaluate them. This often involves calling special methods (e.g., '__add__', '__eq__', '__lt__') defined by the objects involved.",
          analogy:
            "Like following the rules of a game to determine the outcome of a move, based on the pieces involved and their interactions.",
          examples: [
            "Evaluating 'a + b' might call 'a.__add__(b)' or 'b.__radd__(a)'.",
            "Comparing objects with '>' might call the '__gt__' method.",
            "Operator overloading allows you to define how custom objects behave with standard operators.",
          ],
        },
        tools: ["operator module"],
      },
      {
        id: 12,
        title: "> CONTROL_FLOW",
        icon: <FaCodeBranch className="w-8 h-8" />,
        description:
          "$ handling control flow... Managing the flow of execution with if/else, loops, etc.",
        technical: "process: conditional branching, loop iterations",
        definition: {
          title: "Control Flow",
          explanation:
            "Control flow statements like 'if-elif-else', 'for', and 'while' determine the order in which statements are executed. The interpreter evaluates conditions and decides which code blocks to execute or how many times to iterate over a loop.",
          analogy:
            "Like following a flowchart or a choose-your-own-adventure book, where the path you take depends on the choices you make.",
          examples: [
            "Evaluating the condition in an 'if' statement to decide whether to execute the 'if' block or the 'else' block.",
            "Iterating over a sequence in a 'for' loop.",
            "Repeating a block of code in a 'while' loop until the condition becomes false.",
          ],
        },
        tools: ["dis module (to see bytecode jumps)"],
      },
      {
        id: 13,
        title: "> EXCEPTION_HANDLING",
        icon: <FaNetworkWired className="w-8 h-8" />,
        description:
          "$ handling exceptions... Dealing with errors and exceptional situations during execution.",
        technical: "process: try-except-finally blocks",
        definition: {
          title: "Exception Handling",
          explanation:
            "When an error or exceptional situation occurs during execution, Python raises an exception. 'try-except-finally' blocks are used to handle these exceptions, allowing the program to gracefully recover or terminate.",
          analogy:
            "Like having a plan B in case something goes wrong during a performance, or having safety nets in a construction project.",
          examples: [
            "Catching a 'FileNotFoundError' when trying to open a file that doesn't exist.",
            "Handling a 'TypeError' when an operation is performed on an incompatible data type.",
            "Using a 'finally' block to ensure that resources are cleaned up even if an exception occurs.",
          ],
        },
        tools: ["try-except-finally", "raise", "warnings"],
      },
      {
        id: 14,
        title: "> MODULE_IMPORT",
        icon: <FaNetworkWired className="w-8 h-8" />,
        description:
          "$ importing modules... Loading and initializing external code libraries.",
        technical: "process: module loading and initialization",
        definition: {
          title: "Module Import",
          explanation:
            "When you use the 'import' statement, Python needs to locate, load, and initialize the specified module. This involves searching the module search path, compiling the module if necessary, and executing its code to make its contents available.",
          analogy:
            "Like bringing in tools from a different workshop, setting them up, and making them ready to use in your current project.",
          examples: [
            "Importing a standard library module like 'os' or 'sys'.",
            "Importing a third-party library installed via 'pip'.",
            "Importing a module from the same project.",
            "The 'importlib' module provides more control over the import process.",
          ],
        },
        tools: ["importlib", "sys.path", "pkgutil"],
      },
      {
        id: 15,
        title: "> GARBAGE_COLLECTION",
        icon: <FaMemory className="w-8 h-8" />,
        description:
          "$ running garbage collection... Reclaiming memory occupied by objects that are no longer in use.",
        technical: "process: automatic garbage collection",
        definition: {
          title: "Garbage Collection",
          explanation:
            "Python automatically manages memory by periodically identifying and reclaiming memory occupied by objects that are no longer reachable. This process is called garbage collection and helps prevent memory leaks.",
          analogy:
            "Like cleaning up your workspace periodically, throwing away things you no longer need to make room for new items.",
          examples: [
            "CPython uses reference counting as its primary garbage collection mechanism, supplemented by a cycle detector.",
            "When an object's reference count drops to zero, it is immediately deallocated.",
            "The 'gc' module provides an interface to the garbage collector.",
          ],
        },
        tools: ["gc", "tracemalloc"],
      },
      {
        id: 16,
        title: "> JIT_COMPILATION",
        icon: <FaTachometerAlt className="w-8 h-8" />,
        description:
          "$ optimizing with JIT... Compiling frequently executed bytecode to native code for better performance.",
        technical: "process: JIT compilation (if available)",
        definition: {
          title: "JIT (Just-In-Time) Compilation",
          explanation:
            "Some Python implementations, like PyPy, use JIT compilation to improve performance. The JIT compiler analyzes the running code, identifies frequently executed sections (hot paths), and compiles them to native machine code on the fly.",
          analogy:
            "Like a translator learning to translate certain phrases more quickly after hearing them many times, or a musician practicing a difficult passage until they can play it flawlessly at a faster tempo.",
          examples: [
            "PyPy's JIT compiler can significantly speed up computationally intensive code.",
            "The JIT compiler makes optimization decisions based on runtime profiling information.",
          ],
        },
        tools: ["PyPy"],
      },
      {
        id: 17,
        title: "> SYSTEM_CALLS",
        icon: <FaNetworkWired className="w-8 h-8" />,
        description:
          "$ making system calls... Interacting with the operating system for tasks like file I/O, networking.",
        technical: "process: system calls via os module",
        definition: {
          title: "System Calls",
          explanation:
            "When a Python program needs to interact with the operating system (e.g., to read/write files, communicate over the network, manage processes), it makes system calls. These are requests to the OS kernel to perform privileged operations on behalf of the program.",
          analogy:
            "Like a director making requests to the stage crew to change the set, adjust the lighting, or interact with the outside world.",
          examples: [
            "Opening a file using 'open()' involves making system calls to the OS to access the file system.",
            "Sending data over a network socket uses system calls to interact with the network stack.",
            "Creating a new process with 'os.fork()' or 'subprocess.Popen()' relies on system calls.",
          ],
        },
        tools: ["os", "sys", "subprocess", "socket"],
      },
    ],
    [speed]
  );

  // Setup refs for each step
  useEffect(() => {
    stepRefs.current = stepRefs.current.slice(0, steps.length);
  }, [steps]);

  // Handle animation timer with useEffect
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % steps.length;
          // Scroll to the next step
          if (stepRefs.current[nextStep]) {
            stepRefs.current[nextStep].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          return nextStep;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  // Handlers for controls
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const resetVisualization = useCallback(() => {
    setCurrentStep(0);
    if (stepRefs.current[0]) {
      stepRefs.current[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    setIsPlaying(true); // Resume playing after reset
  }, []);

  const handleSpeedChange = useCallback((event) => {
    setSpeed(Number(event.target.value));
  }, []);

  const handleStepClick = useCallback((index) => {
    setCurrentStep(index);
    setIsPlaying(false);
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
  }

  const handleMouseLeave = () => {
    setIsHovering(false);
  }

  return (
    <div
      className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-mono"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gray-800 rounded-lg p-3">
            <p className="text-lg font-bold text-green-500">
              Python Execution Visualizer_
            </p>
          </div>
          <p className="mt-4 text-gray-300">
            Delve into the fascinating world of Python's internal execution
            process. This visualizer breaks down the intricate steps your code
            takes from the moment you hit 'run' to the final output.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={resetVisualization}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            <FaRedo />
          </button>
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <option value={5000}>Fast (5s)</option>
            <option value={8000}>Normal (8s)</option>
            <option value={20000}>Slow (20s)</option>
          </select>
        </div>

        {/* Floating Play/Pause Button */}
        <div
          className={`fixed right-6 bottom-6 sm:right-12 sm:bottom-12 z-10 transition-all ${
            isHovering ? "opacity-100" : "opacity-50"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={togglePlayPause}
            className={`bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transform transition-transform duration-300 ${
              isHovering ? "scale-110" : ""
            }`}
            title={isPlaying ? "Pause Animation" : "Play Animation"}
          >
            {isPlaying ? (
              <FaPause className="w-6 h-6" />
            ) : (
              <FaPlay className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <StepVisualizer
              key={step.id}
              ref={(el) => (stepRefs.current[index] = el)}
              step={step}
              isActive={index === currentStep}
              isLast={index === steps.length - 1}
              onClick={() => handleStepClick(index)}
            />
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`
                h-2 rounded-full transition-all duration-300
                ${
                  index === currentStep ? "bg-green-500 w-8" : "bg-gray-700 w-2"
                }
              `}
            />
          ))}
        </div>

        {/* Terminal-style Footer */}
<div className="mt-12 w-full px-4 md:px-8 lg:px-16">
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 text-gray-300 font-mono leading-relaxed transition-all duration-300 ease-in-out hover:shadow-xl">
    {/* Title with prompt */}
    <div className="items-center text-green-400 mb-6">
        <p className="text-lg text-center font-bold">
            Additional Notes
        </p>
    </div>

    {/* Tips Container */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tip 1: Profiling */}
      <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-yellow-300">
          <span className="mr-1">1.</span>Profile Your Code
        </h3>
        <p className="text-sm">
          Use tools like{" "}
          <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
            cProfile
          </code>{" "}
          and{" "}
          <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
            line_profiler
          </code>{" "}
          to pinpoint performance bottlenecks.
        </p>
      </div>

      {/* Tip 2: Loop Optimization */}
      <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-yellow-300">
          <span className="mr-1">2.</span>Optimize Loops
        </h3>
        <p className="text-sm">
          Minimize operations within loops, especially nested ones, to enhance
          performance significantly.
        </p>
      </div>

      {/* Tip 3: Built-in Functions */}
      <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-yellow-300">
          <span className="mr-1">3.</span>Use Built-in Functions & Libraries
        </h3>
        <p className="text-sm">
          Leverage Python's optimized built-ins (e.g.,{" "}
          <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
            map
          </code>
          ,{" "}
          <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
            filter
          </code>
          ,{" "}
          <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
            sum
          </code>
          ) and libraries like{" "}
          <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
            NumPy
          </code>
          .
        </p>
      </div>

      {/* Tip 4: Data Structures */}
      <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-yellow-300">
          <span className="mr-1">4.</span>Consider Data Structures
        </h3>
        <p className="text-sm">
          Choose data structures (lists, tuples, dictionaries, sets) wisely
          based on your specific needs.
        </p>
      </div>

      {/* Tip 5: Generators & Iterators */}
      <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-yellow-300">
          <span className="mr-1">5.</span>Generators & Iterators
        </h3>
        <p className="text-sm">
          Employ generators and iterators to process large datasets efficiently
          without excessive memory usage.
        </p>
      </div>

      {/* Tip 6: Cython & Numba */}
      <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-yellow-300">
          <span className="mr-1">6.</span>Cython or Numba
        </h3>
        <p className="text-sm">
          For heavy computations, use Cython for C compilation or Numba for
          just-in-time compilation.
        </p>
      </div>

      {/* Tip 7: Asyncio */}
      <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-yellow-300">
          <span className="mr-1">7.</span>Asynchronous Programming
        </h3>
        <p className="text-sm">
          Utilize{" "}
          <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
            asyncio
          </code>{" "}
          for concurrent I/O-bound tasks, enhancing responsiveness.
        </p>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default PythonExecutionVisualizer;
