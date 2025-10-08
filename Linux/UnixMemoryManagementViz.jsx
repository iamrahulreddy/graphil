import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useCallback,
} from "react";
import {
  Cpu,
  HardDrive,
  Layers,
  MemoryStick,
  Book,
  Play,
  RotateCcw,
  StopCircle,
  ArrowRight,
  ArrowDown,
  Check,
  X,
  AlertTriangle,
  Info,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Settings,
  Clock,
  BarChart2,
  TrendingUp,
  Server,
  FileText,
  Terminal,
  Brain,
  Lightbulb,
  Database,
  Shield,
  Code,
  ArrowLeft,
  Zap,
  Home,
  Layout,
  Hash,
  Repeat,
  Upload,
  Download,
} from "lucide-react";

// --- Constants ---
const MEMORY_CONSTANTS = {
  TOTAL_VIRTUAL_PAGES: 32,
  TOTAL_RAM_PAGES: 8,
  SWAP_SPACE_PAGES: 12,
  PAGE_SIZE_KB: 4,
  ANIMATION_STEP_DELAY: 1200,
  TLB_SIZE: 4,
};

// --- Concepts (unchanged, factually correct) ---
const CONCEPTS = {
  overview: {
    title: "Memory Management Fundamentals",
    content:
      "Virtual memory creates an illusion: each process believes it has a vast, private address space (typically gigabytes), while the OS manages a much smaller pool of physical RAM. This abstraction enables process isolation, simplified programming, and efficient memory utilization across the system.",
    icon: Brain,
    keyPoints: [
      "Virtual address spaces are much larger than physical RAM",
      "Each process has isolated memory - one process cannot access another's memory",
      "The Memory Management Unit (MMU) translates virtual to physical addresses",
      "Programs use virtual addresses; the hardware handles physical memory automatically",
    ],
  },
  virtual: {
    title: "Virtual Memory: The Illusion of Abundance",
    content:
      "Imagine a library catalog with millions of entries, but only hundreds of books on the physical shelves. When you request a book (virtual address), the librarian (MMU) either retrieves it from the shelf (RAM) or fetches it from remote storage (disk). You never need to know the actual shelf location or whether the book is currently in the building.",
    icon: MemoryStick,
    keyPoints: [
      "Virtual addresses form a contiguous space (0 to max address)",
      "Physical memory can be fragmented - virtual memory hides this complexity",
      "The same virtual address in different processes maps to different physical locations",
      "Enables memory protection: attempts to access invalid addresses cause segmentation faults",
    ],
  },
  paging: {
    title: "Paging: Memory in Fixed Blocks",
    content:
      "Instead of allocating arbitrary-sized memory chunks, Unix divides both virtual and physical memory into fixed-size pages (typically 4KB). This eliminates external fragmentation and simplifies memory management. The page table maps each virtual page to its corresponding physical frame.",
    icon: HardDrive,
    keyPoints: [
      "Standard page size is 4KB (though larger pages like 2MB/1GB exist)",
      "Virtual pages map to physical frames through page tables",
      "Each process has its own page table (maintained by the OS)",
      "Page faults occur when accessing pages not currently in physical memory",
    ],
  },
  segments: {
    title: "Memory Segments: Logical Organization",
    content:
      "A process's virtual address space is divided into logical segments: Text (executable code, shared and read-only), Data (initialized globals/statics), BSS (uninitialized data, zero-filled on first access), Heap (dynamic allocations growing upward), and Stack (function calls/local variables growing downward). This organization provides structure and enables different protection policies.",
    icon: Layers,
    keyPoints: [
      "Text segment: Executable instructions, marked read-only and executable",
      "Data/BSS: Global and static variables (BSS is zero-initialized on demand)",
      "Heap: Grows upward via malloc/new, managed by memory allocator",
      "Stack: Grows downward, contains function frames and local variables",
    ],
  },
  tlb: {
    title: "TLB: The Translation Cache",
    content:
      "The Translation Lookaside Buffer is a hardware cache inside the CPU that stores recent virtual-to-physical translations. Since page table lookups would otherwise require memory access (slow), the TLB provides single-cycle translation for recently used pages. High TLB hit rates are crucial for performance. On older systems, context switches flush the TLB; modern CPUs use ASIDs/PCIDs to avoid full flushes.",
    icon: Server,
    keyPoints: [
      "Small, fast cache (typically 64–512 entries) inside the CPU",
      "TLB hits complete in one CPU cycle (nanoseconds)",
      "TLB misses require a page table walk (tens of nanoseconds)",
      "Modern CPUs retain TLB entries across context switches using ASIDs/PCIDs",
    ],
  },
  swap: {
    title: "Swap Space: Overflow to Disk",
    content:
      "When physical RAM is exhausted, the OS can move less-recently-used pages to disk (swap space). This allows the system to run more processes than fit in RAM, though at significant performance cost. Accessing swapped pages causes major page faults, requiring slow disk I/O. Excessive swapping causes 'thrashing' where the system spends more time swapping than executing. Swap size depends on use case: hibernation requires swap ≥ RAM; otherwise, 2–4 GB is often sufficient on modern systems.",
    icon: ArrowDown,
    keyPoints: [
      "RAM access: ~100 nanoseconds; Disk access: ~10 milliseconds (100,000× slower)",
      "Pages are selected for eviction using LRU approximations (e.g., clock algorithm)",
      "Swap is not always needed—systems with ample RAM may rarely use it",
      "Swap size: ≥ RAM only if hibernation is used; otherwise, fixed small size suffices",
    ],
  },
};

// --- Enhanced Reducer with Realistic Swap-In ---
const initialState = {
  virtualPages: Array(MEMORY_CONSTANTS.TOTAL_VIRTUAL_PAGES).fill({
    status: "unallocated",
  }),
  physicalFrames: Array(MEMORY_CONSTANTS.TOTAL_RAM_PAGES).fill({
    status: "free",
    virtualPage: null,
    lastAccessed: 0,
  }),
  swapSlots: Array(MEMORY_CONSTANTS.SWAP_SPACE_PAGES).fill({
    status: "free",
    virtualPage: null,
  }),
  pageTable: {},
  tlb: [],
  pageFaults: 0,
  tlbHits: 0,
  tlbMisses: 0,
  swapOuts: 0,
  swapIns: 0,
  memoryPressure: "optimal",
  logs: [
    `System initialized with ${MEMORY_CONSTANTS.TOTAL_RAM_PAGES} physical frames and ${MEMORY_CONSTANTS.TOTAL_VIRTUAL_PAGES} virtual pages`,
  ],
  lastActionId: 0,
  highlight: { vp: null, pf: null, ss: null, pt: null, tlb: null },
};

function findLRUVictim(frames) {
  let victim = 0;
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].lastAccessed < frames[victim].lastAccessed) {
      victim = i;
    }
  }
  return victim;
}

function memoryReducer(state, action) {
  let newState = JSON.parse(JSON.stringify(state));
  const addLog = (msg) =>
    newState.logs.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
  newState.highlight = { vp: null, pf: null, ss: null, pt: null, tlb: null };
  newState.lastActionId = Date.now();
  switch (action.type) {
    case "ALLOCATE": {
      const firstFreeVP = newState.virtualPages.findIndex(
        (p) => p.status === "unallocated"
      );
      if (firstFreeVP === -1) {
        addLog("❌ Virtual address space exhausted (all 32 pages allocated)");
        return newState;
      }
      addLog(`📋 Allocating Virtual Page ${firstFreeVP}`);
      newState.virtualPages[firstFreeVP] = { status: "allocated" };
      newState.highlight.vp = firstFreeVP;
      let freeFrameIndex = newState.physicalFrames.findIndex(
        (f) => f.status === "free"
      );
      if (freeFrameIndex !== -1) {
        addLog(
          `✓ Found free Physical Frame ${freeFrameIndex}, mapping VP ${firstFreeVP} → PF ${freeFrameIndex}`
        );
        newState.physicalFrames[freeFrameIndex] = {
          status: "used",
          virtualPage: firstFreeVP,
          lastAccessed: Date.now(),
        };
        newState.pageTable[firstFreeVP] = {
          frame: freeFrameIndex,
          present: true,
          dirty: false,
        };
        newState.highlight.pf = freeFrameIndex;
        newState.highlight.pt = firstFreeVP;
      } else {
        addLog("⚠️ Page Fault: No free physical frames available");
        newState.pageFaults++;
        const victimFrameIndex = findLRUVictim(newState.physicalFrames);
        const victimVP = newState.physicalFrames[victimFrameIndex].virtualPage;
        addLog(
          `🎯 Victim selected: VP ${victimVP} in PF ${victimFrameIndex} (LRU)`
        );
        const freeSwapIndex = newState.swapSlots.findIndex(
          (s) => s.status === "free"
        );
        if (freeSwapIndex === -1) {
          addLog("❌ Critical: Swap space exhausted, cannot allocate");
          newState.virtualPages[firstFreeVP] = { status: "unallocated" };
          return newState;
        }
        addLog(`💾 Swapping out: VP ${victimVP} → Swap Slot ${freeSwapIndex}`);
        newState.swapOuts++;
        newState.swapSlots[freeSwapIndex] = {
          status: "used",
          virtualPage: victimVP,
        };
        newState.pageTable[victimVP] = {
          frame: freeSwapIndex,
          present: false,
          dirty: false,
        };
        // Load new page into victim's frame
        addLog(`✓ Loading VP ${firstFreeVP} into PF ${victimFrameIndex}`);
        newState.physicalFrames[victimFrameIndex] = {
          status: "used",
          virtualPage: firstFreeVP,
          lastAccessed: Date.now(),
        };
        newState.pageTable[firstFreeVP] = {
          frame: victimFrameIndex,
          present: true,
          dirty: false,
        };
        newState.highlight.pf = victimFrameIndex;
        newState.highlight.ss = freeSwapIndex;
        newState.highlight.pt = firstFreeVP;
        newState.tlb = newState.tlb.filter((e) => e.vp !== victimVP);
      }
      break;
    }
    case "ACCESS": {
      const { vp } = action.payload;
      if (!newState.pageTable[vp]) {
        addLog(`❌ Segmentation Fault: VP ${vp} not allocated`);
        return newState;
      }
      addLog(`🔍 CPU requests access to Virtual Page ${vp}`);
      newState.highlight.vp = vp;
      const tlbEntry = newState.tlb.find((e) => e.vp === vp);
      if (tlbEntry) {
        addLog(`⚡ TLB Hit! VP ${vp} → PF ${tlbEntry.pf} (~1ns)`);
        newState.tlbHits++;
        newState.highlight.tlb = vp;
        newState.highlight.pf = tlbEntry.pf;
        newState.physicalFrames[tlbEntry.pf].lastAccessed = Date.now();
      } else {
        addLog(`⏱️ TLB Miss for VP ${vp}, checking page table`);
        newState.tlbMisses++;
        newState.highlight.pt = vp;
        const ptEntry = newState.pageTable[vp];
        if (!ptEntry.present) {
          addLog(`💥 Major Page Fault! VP ${vp} is swapped out (~10ms I/O)`);
          newState.pageFaults++;
          newState.swapIns++;
          // Find frame: free or evict
          let targetFrame = newState.physicalFrames.findIndex(
            (f) => f.status === "free"
          );
          let evictedVP = null;
          if (targetFrame === -1) {
            addLog(
              `MemoryWarning RAM full. Evicting another page to load VP ${vp}`
            );
            targetFrame = findLRUVictim(newState.physicalFrames);
            evictedVP = newState.physicalFrames[targetFrame].virtualPage;
            // Swap out evicted page
            const freeSwap = newState.swapSlots.findIndex(
              (s) => s.status === "free"
            );
            if (freeSwap === -1) {
              addLog("❌ Swap space full. Cannot swap in.");
              return newState;
            }
            newState.swapOuts++;
            newState.swapSlots[freeSwap] = {
              status: "used",
              virtualPage: evictedVP,
            };
            newState.pageTable[evictedVP] = {
              frame: freeSwap,
              present: false,
              dirty: false,
            };
            addLog(`📤 Swapped out VP ${evictedVP} → SS ${freeSwap}`);
            newState.tlb = newState.tlb.filter((e) => e.vp !== evictedVP);
          }
          // Load requested page
          const swapSlot = ptEntry.frame;
          newState.physicalFrames[targetFrame] = {
            status: "used",
            virtualPage: vp,
            lastAccessed: Date.now(),
          };
          newState.pageTable[vp] = {
            frame: targetFrame,
            present: true,
            dirty: false,
          };
          newState.swapSlots[swapSlot] = { status: "free", virtualPage: null };
          addLog(`📥 Swapped in VP ${vp} → PF ${targetFrame}`);
          newState.highlight.pf = targetFrame;
          newState.highlight.ss = swapSlot;
        } else {
          addLog(`✓ Page Table: VP ${vp} → PF ${ptEntry.frame} (in RAM)`);
          newState.highlight.pf = ptEntry.frame;
          newState.physicalFrames[ptEntry.frame].lastAccessed = Date.now();
          // Update TLB
          let newTlb = [...newState.tlb];
          if (newTlb.length >= MEMORY_CONSTANTS.TLB_SIZE) {
            const evicted = newTlb.shift();
            addLog(`🔄 TLB full, evicting VP ${evicted.vp}`);
          }
          newTlb.push({ vp, pf: ptEntry.frame });
          newState.tlb = newTlb;
          addLog(`📝 TLB updated: VP ${vp} → PF ${ptEntry.frame}`);
        }
      }
      break;
    }
    case "FREE": {
      const allocatedPages = newState.virtualPages
        .map((p, i) => ({ ...p, i }))
        .filter((p) => p.status === "allocated");
      if (allocatedPages.length === 0) {
        addLog("ℹ️ No allocated pages to free");
        return newState;
      }
      const vpToFree = allocatedPages[allocatedPages.length - 1].i;
      addLog(`🗑️ Freeing Virtual Page ${vpToFree}`);
      newState.virtualPages[vpToFree] = { status: "unallocated" };
      const ptEntry = newState.pageTable[vpToFree];
      if (ptEntry) {
        if (ptEntry.present) {
          addLog(`✓ Releasing Physical Frame ${ptEntry.frame}`);
          newState.physicalFrames[ptEntry.frame] = {
            status: "free",
            virtualPage: null,
            lastAccessed: 0,
          };
        } else {
          addLog(`✓ Releasing Swap Slot ${ptEntry.frame}`);
          newState.swapSlots[ptEntry.frame] = {
            status: "free",
            virtualPage: null,
          };
        }
      }
      delete newState.pageTable[vpToFree];
      newState.tlb = newState.tlb.filter((e) => e.vp !== vpToFree);
      break;
    }
    case "RESET":
      return {
        ...initialState,
        logs: [`System reset at ${new Date().toLocaleTimeString()}`],
      };
    default:
      return state;
  }
  const usedFrames = newState.physicalFrames.filter(
    (f) => f.status === "used"
  ).length;
  if (usedFrames === MEMORY_CONSTANTS.TOTAL_RAM_PAGES)
    newState.memoryPressure = "critical";
  else if (usedFrames >= MEMORY_CONSTANTS.TOTAL_RAM_PAGES * 0.75)
    newState.memoryPressure = "high";
  else if (usedFrames >= MEMORY_CONSTANTS.TOTAL_RAM_PAGES * 0.5)
    newState.memoryPressure = "medium";
  else newState.memoryPressure = "optimal";
  return newState;
}

// --- Main Component ---
const UnixMemoryLearningTool = () => {
  const [state, dispatch] = useReducer(memoryReducer, initialState);
  const {
    virtualPages,
    physicalFrames,
    swapSlots,
    pageTable,
    tlb,
    pageFaults,
    tlbHits,
    tlbMisses,
    swapOuts,
    swapIns,
    memoryPressure,
    logs,
    highlight,
  } = state;
  const [activeTab, setActiveTab] = useState("simulator");
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const animationRef = useRef(null);

  const startAnimation = useCallback(
    (steps = 5) => {
      if (animationPlaying) return;
      setAnimationPlaying(true);
      setCurrentAnimationStep(0);
      const speedFactor = 1 / animationSpeed;
      const interval = setInterval(() => {
        setCurrentAnimationStep((prev) => {
          if (prev >= steps) {
            clearInterval(interval);
            setAnimationPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, MEMORY_CONSTANTS.ANIMATION_STEP_DELAY * speedFactor);
      animationRef.current = interval;
    },
    [animationPlaying, animationSpeed]
  );

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setAnimationPlaying(false);
    setCurrentAnimationStep(0);
  }, []);

  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  const allocateMemory = () => dispatch({ type: "ALLOCATE" });
  const freeLastMemory = () => dispatch({ type: "FREE" });
  const accessMemory = (vp) => dispatch({ type: "ACCESS", payload: { vp } });
  const resetSimulation = () => dispatch({ type: "RESET" });

  const totalAccesses = tlbHits + tlbMisses;
  const hitRate =
    totalAccesses > 0 ? ((tlbHits / totalAccesses) * 100).toFixed(1) : 100;

  const MemoryBlock = ({
    id,
    status,
    content,
    isHighlighted,
    size = "normal",
  }) => (
    <div
      className={`border-1 rounded-lg p-1 text-center transition-all duration-300 ${
        isHighlighted
          ? "ring-4 ring-yellow-400 scale-105 shadow-lg z-10 bg-yellow-50"
          : ""
      } ${
        status === "used" && content.startsWith("VP")
          ? "bg-blue-100 border-blue-500"
          : status === "used"
          ? "bg-orange-100 border-orange-400"
          : status === "allocated"
          ? "bg-green-100 border-green-400"
          : "bg-gray-100 border-gray-300"
      } ${size === "small" ? "text-xs" : "text-sm"}`}
    >
      <div className="font-bold text-gray-700">{id}</div>
      {content && <div className="text-gray-600 text-xs mt-1">{content}</div>}
    </div>
  );

  const ProcessMemoryLayout = ({ step }) => (
    <div className="space-y-3 max-w-md mx-auto font-mono">
      <div
        className={`border-2 p-4 rounded-lg transition-all duration-500 ${
          step >= 1
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">Stack</div>
          <div className="text-sm text-gray-600">↓ Grows Down</div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Function calls, local variables
        </div>
      </div>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
        <div className="text-gray-400 text-sm">Unmapped Space</div>
        <div className="text-xs text-gray-400 mt-1">(Available for growth)</div>
      </div>
      <div
        className={`border-2 p-4 rounded-lg transition-all duration-500 ${
          step >= 2
            ? "border-green-500 bg-green-50 shadow-md"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">Heap</div>
          <div className="text-sm text-gray-600">↑ Grows Up</div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          malloc(), new (dynamic allocation)
        </div>
      </div>
      <div
        className={`border-2 p-3 rounded-lg transition-all duration-500 ${
          step >= 3
            ? "border-yellow-500 bg-yellow-50 shadow-md"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="font-bold text-lg">BSS Segment</div>
        <div className="text-xs text-gray-500 mt-1">
          Uninitialized data (zero-filled on demand)
        </div>
      </div>
      <div
        className={`border-2 p-3 rounded-lg transition-all duration-500 ${
          step >= 3
            ? "border-orange-500 bg-orange-50 shadow-md"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="font-bold text-lg">Data Segment</div>
        <div className="text-xs text-gray-500 mt-1">
          Initialized global/static variables
        </div>
      </div>
      <div
        className={`border-2 p-3 rounded-lg transition-all duration-500 ${
          step >= 4
            ? "border-purple-500 bg-purple-50 shadow-md"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="font-bold text-lg">Text Segment</div>
        <div className="text-xs text-gray-500 mt-1">
          Executable code (read-only)
        </div>
      </div>
    </div>
  );

  const PagingDiagram = ({ step }) => (
    <div className="space-y-3 p-1 font-mono rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col mt-2 items-center gap-3">
        <Cpu size={40} className="text-blue-600" />
        <div className="text-center">
          <div className="font-bold text-lg mb-2">
            CPU Issues Virtual Address
          </div>
          <div className="font-mono text-lg p-3 rounded-lg bg-white border-2 border-gray-300 shadow-sm">
            <span
              className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
                step >= 1 ? "bg-blue-200 font-bold" : ""
              }`}
            >
              VP 5
            </span>
            <span
              className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
                step >= 3 ? "bg-green-200 font-bold" : ""
              }`}
            >
              Off 0x678
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            <span className={step >= 1 ? "font-bold" : ""}>Virtual Page #</span>{" "}
            +
            <span className={step >= 3 ? "font-bold" : ""}>
              {" "}
              Offset (≤0xFFF)
            </span>
          </div>
        </div>
      </div>
      <div
        className={`transition-opacity duration-300 ${
          step >= 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <ArrowDown className="mx-auto text-blue-500" size={32} />
      </div>
      <div className="grid grid-cols-2 gap-6 items-start">
        <div className="space-y-2">
          <h5 className="font-bold text-center text-sm">Page Table</h5>
          <div
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              step >= 2
                ? "border-yellow-500 bg-yellow-50 shadow-lg"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="text-xs text-gray-500 text-center">...</div>
            <div
              className={`flex justify-between items-center p-2 my-1 rounded transition-all duration-300 ${
                step >= 2 ? "bg-yellow-200 font-bold" : "bg-gray-100"
              }`}
            >
              <span className="text-xs">VP 5</span>
              <ArrowRight size={16} />
              <span className="text-xs">PF 3</span>
            </div>
            <div className="text-xs text-gray-500 text-center">...</div>
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="font-bold text-center text-sm">
            Physical Memory (RAM)
          </h5>
          <div className="p-3 rounded-lg bg-white border-2 border-gray-300">
            <div className="font-mono text-center text-lg">
              <span
                className={`block px-2 py-1 text-xs rounded transition-all duration-300 ${
                  step >= 2 ? "bg-blue-200 font-bold" : "bg-gray-100"
                }`}
              >
                {step >= 2 ? "PF 3" : "????"}
              </span>
              <span
                className={`block px-2 py-1 rounded mt-1 transition-all duration-300 ${
                  step >= 3 ? "bg-green-200 font-bold" : "bg-gray-100"
                }`}
              >
                {step >= 3 ? "0x678" : "????"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`text-center text-xs text-green-600 transition-opacity duration-300 ${
          step >= 4 ? "opacity-100" : "opacity-0"
        }`}
      >
        ✓ Translation Complete! Data accessed at physical address PF3:0x678
      </div>
    </div>
  );

  const TLBDiagram = ({ step }) => {
    const isMiss = step >= 1 && step <= 3;
    const isHit = step >= 4;
    return (
      <div className="space-y-1 p-3 rounded-lg font-mono bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center gap-2">
            <Cpu size={48} className="text-purple-600" />
            <div className="font-bold">CPU</div>
          </div>
          <div
            className={`transition-all duration-300 ${
              step >= 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <ArrowRight
              size={32}
              className={
                isMiss
                  ? "text-red-500"
                  : isHit
                  ? "text-green-500"
                  : "text-gray-400"
              }
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`border-4 rounded-lg p-4 transition-all duration-300 ${
                isMiss
                  ? "border-red-500 bg-red-50"
                  : isHit
                  ? "border-green-500 bg-green-50"
                  : "border-gray-400 bg-white"
              }`}
            >
              <Server size={32} />
            </div>
            <div className="font-semibold">TLB Cache</div>
            <div className="text-xs text-gray-600">(~1ns access)</div>
          </div>
        </div>
        {step >= 1 && (
          <div
            className={`text-center font-bold text-sm transition-all duration-300 ${
              isMiss ? "text-red-600" : isHit ? "text-green-600" : ""
            }`}
          >
            {isMiss
              ? "❌ TLB MISS - Not in cache!"
              : isHit
              ? "✓ TLB HIT - Fast translation!"
              : ""}
          </div>
        )}
        <div
          className={`flex flex-col items-center transition-opacity duration-500 ${
            step >= 2 && step <= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <ArrowDown size={32} className="text-red-500" />
          <div className="text-sm text-red-600 font-semibold mt-2">
            Must consult Page Table...
          </div>
        </div>
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`border-4 rounded-lg p-4 transition-all duration-300 ${
                step >= 3
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <FileText size={32} />
            </div>
            <div className="font-bold">Page Table</div>
            <div className="text-xs text-gray-600">(~20–50ns access)</div>
          </div>
          <div
            className={`transition-opacity duration-300 ${
              step >= 3 ? "opacity-100" : "opacity-0"
            }`}
          >
            <ArrowLeft size={32} className="text-orange-500" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Database size={40} className="text-indigo-600" />
            <div className="font-semibold">Physical RAM</div>
          </div>
        </div>
      </div>
    );
  };

  const SwapDiagram = ({ step }) => (
    <div className="relative p-6 h-80 font-mono flex justify-between items-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
      <div className="w-1/3 space-y-3">
        <h5 className="font-semibold text-center text-sm">Physical RAM</h5>
        <div className="text-xs text-center text-gray-600">(Fast: ~100ns)</div>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-blue-200 border-2 border-blue-500 rounded-lg text-center font-semibold">
            VP 5
          </div>
          <div
            className={`p-3 rounded-lg text-center font-semibold border-2 transition-all duration-500 ${
              step >= 1 && step < 3
                ? "bg-orange-300 border-orange-600 scale-105 shadow-lg"
                : step >= 3
                ? "bg-blue-200 border-blue-500"
                : "bg-blue-200 border-blue-500"
            }`}
          >
            {step >= 3 ? "VP 12 (NEW)" : "VP 2"}
            {step >= 1 && step < 3 && (
              <div className="text-xs text-red-700 mt-1">← Victim (LRU)</div>
            )}
          </div>
          <div className="p-3 bg-blue-200 border-2 border-blue-500 rounded-lg text-center font-semibold">
            VP 8
          </div>
        </div>
      </div>
      <div
        className={`absolute transition-all duration-1000 ${
          step === 0
            ? "left-1/3 opacity-0"
            : step === 1
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 scale-110"
            : step >= 2
            ? "left-2/3 opacity-0"
            : ""
        }`}
      >
        {step >= 1 && step <= 2 && (
          <div className="p-3 bg-orange-300 border-2 border-orange-600 rounded-lg shadow-2xl font-semibold">
            VP 2
            <div className="text-xs text-center mt-1">Moving to disk...</div>
          </div>
        )}
      </div>
      <div
        className={`absolute transition-all duration-1000 ${
          step <= 2
            ? "right-1/3 opacity-0"
            : step === 3
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 scale-110"
            : step >= 4
            ? "left-1/3 opacity-0"
            : ""
        }`}
      >
        {step >= 3 && step <= 4 && (
          <div className="p-3 bg-green-300 border-2 border-green-600 rounded-lg shadow-2xl font-semibold">
            VP 12
            <div className="text-xs text-center mt-1">Loading into RAM...</div>
          </div>
        )}
      </div>
      <div className="w-1/3 space-y-3">
        <h5 className="font-bold text-center text-sm">Swap Space (Disk)</h5>
        <div className="text-xs text-center text-gray-600">(Slow: ~10ms)</div>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-center text-gray-400">
            Empty
          </div>
          <div
            className={`p-3 rounded-lg text-center font-semibold border-2 transition-all duration-500 ${
              step >= 2
                ? "bg-orange-200 border-orange-500"
                : "bg-gray-100 border-gray-300 text-gray-400"
            }`}
          >
            {step >= 2 ? "VP 2" : "Empty"}
          </div>
          <div className="p-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-center text-gray-400">
            Empty
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300 ${
          step === 5 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-green-100 border-2 border-green-500 rounded-lg p-3 shadow-lg">
          <div className="font-bold text-green-700">✓ Swap Complete!</div>
          <div className="text-xs text-gray-600 mt-1">
            VP 12 now in RAM, VP 2 preserved on disk
          </div>
        </div>
      </div>
      {step === 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-100 border-2 border-yellow-500 rounded-lg p-2 text-xs font-semibold text-yellow-800">
          Page Fault: Evicting least recently used page
        </div>
      )}
    </div>
  );

  // Reusable Animation Controls Component
  const AnimationControls = ({ steps, color = "blue" }) => (
    <div className="mb-6 border-2 rounded-lg p-4 bg-cyan-50">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Settings size={18} className="text-gray-700" />
        Animation Controls
      </h4>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-medium">Speed:</span>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-bold text-gray-700">
          {animationSpeed.toFixed(1)}x
        </span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => startAnimation(steps)}
          disabled={animationPlaying}
          className={`flex-1 flex items-center justify-center gap-2 bg-${color}-600 text-white px-4 py-2 rounded-lg hover:bg-${color}-700 disabled:bg-gray-400 transition-colors font-semibold`}
        >
          <Play size={18} />
          {animationPlaying ? "Playing..." : "Start"}
        </button>
        <button
          onClick={stopAnimation}
          disabled={!animationPlaying}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors font-semibold"
        >
          <StopCircle size={18} />
          Stop
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-mono">
      <div className="container mx-auto px-1 py-1 max-w-7xl">
        <div className="bg-white overflow-hidden rounded-xl">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <MemoryStick size={36} />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">
                    Memory Management in Unix Systems
                  </h1>
                  <p className="text-blue-100 mt-2 text-sm">
                    Interactive visualization of virtual memory, paging, and the
                    TLB
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Improved Navigation Tabs */}
          <div className="flex border-b bg-gray-200 text-xs overflow-x-auto">
            {[
              { id: "simulator", label: "Simulator", icon: Play },
              { id: "overview", label: "Core Concepts", icon: Book },
              { id: "layout", label: "Process Layout", icon: Layout },
              { id: "paging", label: "Address Translation", icon: Hash },
              { id: "tlb", label: "TLB Cache", icon: Server },
              { id: "swap", label: "Swapping", icon: Repeat },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === id
                    ? "bg-white text-blue-600 border-b-4 border-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
          <div className="p-6 min-h-[65vh]">
            {activeTab === "simulator" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300">
                      <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                        <Layers size={18} />
                        Allocated Virtual Pages
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {Object.keys(pageTable).length === 0 ? (
                          <div className="text-center text-gray-400 py-4">
                            Click "Allocate" to create virtual pages
                          </div>
                        ) : (
                          Object.keys(pageTable)
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .map((vpStr) => {
                              const vp = parseInt(vpStr);
                              const entry = pageTable[vp];
                              return (
                                <button
                                  key={vp}
                                  onClick={() => accessMemory(vp)}
                                  className={`w-full flex items-center justify-between bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-3 cursor-pointer transition-all ${
                                    highlight.vp === vp
                                      ? "ring-4 ring-yellow-400 bg-yellow-50"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        entry.present
                                          ? "bg-green-500"
                                          : "bg-orange-500"
                                      }`}
                                    />
                                    <div className="text-left">
                                      <div className="font-mono font-bold text-gray-800">
                                        Virtual Page {vp}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {entry.present
                                          ? "In RAM"
                                          : "Swapped Out"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                                    <Zap size={14} />
                                    Access
                                  </div>
                                </button>
                              );
                            })
                        )}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-300">
                      <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                        <FileText size={18} />
                        Page Table
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {Object.keys(pageTable).length === 0 ? (
                          <div className="text-center text-gray-400 py-8">
                            No pages allocated yet
                          </div>
                        ) : (
                          Object.entries(pageTable)
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .map(([vp, entry]) => (
                              <div
                                key={vp}
                                className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                                  highlight.pt === parseInt(vp)
                                    ? "bg-yellow-200 ring-2 ring-yellow-400 shadow-md"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                <span className="font-bold text-gray-700">
                                  VP {vp}
                                </span>
                                <ArrowRight
                                  size={16}
                                  className="text-gray-400"
                                />
                                <span className="font-semibold">
                                  {entry.present
                                    ? `PF ${entry.frame}`
                                    : `SS ${entry.frame}`}
                                </span>
                                <span
                                  className={`font-bold px-2 py-1 rounded text-xs ${
                                    entry.present
                                      ? "bg-green-200 text-green-800"
                                      : "bg-orange-200 text-orange-800"
                                  }`}
                                >
                                  {entry.present ? "RAM" : "SWAP"}
                                </span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300">
                      <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                        <HardDrive size={18} />
                        Physical RAM ({MEMORY_CONSTANTS.TOTAL_RAM_PAGES} frames)
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {physicalFrames.map((frame, index) => (
                          <MemoryBlock
                            key={index}
                            id={`PF${index}`}
                            status={frame.status}
                            content={
                              frame.virtualPage !== null
                                ? `VP${frame.virtualPage}`
                                : "Free"
                            }
                            isHighlighted={highlight.pf === index}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-300">
                      <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                        <Database size={18} />
                        Swap Space ({MEMORY_CONSTANTS.SWAP_SPACE_PAGES} slots)
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {swapSlots.map((slot, index) => (
                          <MemoryBlock
                            key={index}
                            id={`SS${index}`}
                            status={slot.status}
                            content={
                              slot.virtualPage !== null
                                ? `VP${slot.virtualPage}`
                                : "Free"
                            }
                            isHighlighted={highlight.ss === index}
                            size="small"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border-2 border-indigo-300">
                      <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                        <Server size={18} />
                        TLB Cache ({MEMORY_CONSTANTS.TLB_SIZE} entries)
                      </h4>
                      <div className="space-y-2">
                        {tlb.length === 0 ? (
                          <div className="text-center text-gray-400 py-4">
                            TLB empty
                          </div>
                        ) : (
                          tlb.map(({ vp, pf }, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                                highlight.tlb === vp
                                  ? "bg-yellow-200 ring-2 ring-yellow-400 shadow-md"
                                  : "bg-white border border-gray-200"
                              }`}
                            >
                              <span className="font-bold text-gray-700">
                                VP {vp}
                              </span>
                              <ArrowRight size={16} className="text-gray-400" />
                              <span className="font-semibold text-gray-700">
                                PF {pf}
                              </span>
                              <Zap size={14} className="text-yellow-500" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Settings size={20} className="text-blue-600" />
                      Memory Controls
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={allocateMemory}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
                      >
                        <Plus size={20} />
                        Allocate Virtual Page
                      </button>
                      <button
                        onClick={freeLastMemory}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
                      >
                        <Minus size={20} />
                        Free Last Page
                      </button>
                      <button
                        onClick={resetSimulation}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
                      >
                        <RotateCcw size={20} />
                        Reset System
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <BarChart2 size={20} className="text-indigo-600" />
                      System Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            TLB Hit Rate
                          </span>
                          <span className="text-2xl font-bold text-green-600">
                            {hitRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${hitRate}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tlbHits} hits / {totalAccesses} accesses
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Page Faults
                          </span>
                          <span className="text-xl font-bold text-orange-600">
                            {pageFaults}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Swap Operations
                          </span>
                          <span className="text-xl font-bold text-red-600">
                            {swapOuts + swapIns}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {swapOuts} out / {swapIns} in
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Memory Pressure
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              memoryPressure === "optimal"
                                ? "bg-green-100 text-green-700"
                                : memoryPressure === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : memoryPressure === "high"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {memoryPressure.toUpperCase()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              memoryPressure === "optimal"
                                ? "bg-green-500"
                                : memoryPressure === "medium"
                                ? "bg-yellow-500"
                                : memoryPressure === "high"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${
                                (physicalFrames.filter(
                                  (f) => f.status === "used"
                                ).length /
                                  MEMORY_CONSTANTS.TOTAL_RAM_PAGES) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 border-2 border-gray-700">
                    <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
                      <Terminal size={18} />
                      System Event Log
                    </h3>
                    <div className="h-48 overflow-y-auto space-y-1 font-mono text-xs pr-2">
                      {logs.map((log, i) => (
                        <div
                          key={`${state.lastActionId}-${i}`}
                          className="text-green-400 p-2 rounded hover:bg-gray-800 transition-colors"
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "overview" && (
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4 text-gray-800">
                    Understanding Memory Management
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Unix-like operating systems use sophisticated memory
                    management to create the illusion of abundant, private
                    memory for each process. This section explains the core
                    concepts using real-world analogies. Use the simulator to
                    see these concepts in action.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                    <strong>Note:</strong> This is a simplified educational
                    model. Real OS implementations involve multi-level page
                    tables, complex replacement policies, and hardware-specific
                    features like ASIDs and huge pages.
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {Object.values(CONCEPTS).map((concept) => (
                    <div
                      key={concept.title}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:scale-105"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <concept.icon size={20} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {concept.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                        {concept.content}
                      </p>
                      <div className="space-y-2">
                        {concept.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check
                              size={16}
                              className="text-green-500 mt-1 flex-shrink-0"
                            />
                            <span className="text-xs text-gray-700">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "layout" && (
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 className="text-lg font-bold mb-1 text-gray-800">
                      Process Memory Layout
                    </h2>
                    <p className="text-gray-600 text-xs mb-3 leading-relaxed">
                      Each Unix process has a standardized virtual address space
                      layout. The stack grows downward from high addresses (used
                      for function calls), while the heap grows upward from low
                      addresses (used for dynamic allocation). Between them lies
                      unmapped space that allows both to grow as needed.
                    </p>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-lg text-blue-900 mb-2">
                        Key Points:
                      </h4>
                      <ul className="space-y-2 text-xs text-gray-700">
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-blue-600 mt-0.5 flex-shrink-0"
                          />
                          <span>
                            Text segment is read-only and often shared between
                            processes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-blue-600 mt-0.5 flex-shrink-0"
                          />
                          <span>
                            Stack overflow occurs when stack grows into unmapped
                            space
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-blue-600 mt-0.5 flex-shrink-0"
                          />
                          <span>
                            Memory mapping (mmap) typically occurs in the gap
                            between heap and stack
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
                    {/* ✅ Animation Controls moved here */}
                    <AnimationControls steps={4} color="blue" />
                    <ProcessMemoryLayout step={currentAnimationStep} />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "paging" && (
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 className="text-lg font-bold mb-1 text-gray-800">
                      Address Translation Through Paging
                    </h2>
                    <p className="text-gray-600 text-xs mb-6 leading-relaxed">
                      When a program accesses memory using a virtual address,
                      the MMU (Memory Management Unit) must translate it to a
                      physical address. The virtual address is split into two
                      parts: the <strong>page number</strong> (used as an index
                      into the page table) and the <strong>offset</strong>{" "}
                      within that page (limited to 12 bits for 4KB pages).
                    </p>
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-lg text-indigo-900 mb-2">
                        Translation Process:
                      </h4>
                      <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside">
                        <li>
                          CPU generates virtual address (e.g., 0x12345678)
                        </li>
                        <li>
                          Extract page number (0x12345) and offset (0x678)
                        </li>
                        <li>Look up page number in page table</li>
                        <li>
                          Page table returns physical frame number (e.g.,
                          0x00F5)
                        </li>
                        <li>
                          Combine frame number + offset = physical address
                          (0x00F50678)
                        </li>
                        <li>Access physical memory at that location</li>
                      </ol>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
                        <Info size={16} />
                        Why Paging?
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-yellow-600 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs">
                            Eliminates external fragmentation (no gaps between
                            allocations)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-yellow-600 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs">
                            Enables efficient memory sharing between processes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-yellow-600 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs">
                            Allows non-contiguous physical memory for contiguous
                            virtual memory
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                    {/* ✅ Animation Controls moved here */}
                    <AnimationControls steps={4} color="blue" />
                    <PagingDiagram step={currentAnimationStep} />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "tlb" && (
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 className="text-lg font-bold mb-1 text-gray-800">
                      Translation Lookaside Buffer (TLB)
                    </h2>
                    <p className="text-gray-600 text-xs mb-6 leading-relaxed">
                      Page table lookups require a memory access, which is slow
                      compared to CPU speed. The TLB is a small, extremely fast
                      cache inside the CPU that stores recent
                      virtual-to-physical address translations. On a TLB hit,
                      translation happens in a single CPU cycle (~1 nanosecond).
                      On a miss, the CPU must walk the page table (~20–50
                      nanoseconds).
                    </p>
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-sm text-green-900 mb-2">
                        TLB Hit (Fast Path):
                      </h4>
                      <ol className="space-y-1 text-xs text-gray-700 list-decimal list-inside">
                        <li>CPU generates virtual address</li>
                        <li>Check TLB cache for translation</li>
                        <li>✓ Found! Use cached physical frame number</li>
                        <li>Access memory immediately (~1 CPU cycle)</li>
                      </ol>
                    </div>
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-sm text-red-900 mb-2">
                        TLB Miss (Slow Path):
                      </h4>
                      <ol className="space-y-1 text-xs text-gray-700 list-decimal list-inside">
                        <li>CPU generates virtual address</li>
                        <li>Check TLB cache for translation</li>
                        <li>✗ Not found! Must consult page table</li>
                        <li>
                          Perform page table walk (memory access required)
                        </li>
                        <li>Update TLB with new translation</li>
                        <li>Access memory (~20–50× slower than TLB hit)</li>
                      </ol>
                    </div>
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-sm text-purple-900 mb-2 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Performance Impact
                      </h4>
                      <p className="text-xs text-gray-700 mb-2">
                        TLB hit rates are typically 95–99% for well-behaved
                        programs. This means most memory accesses avoid the
                        expensive page table walk.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <AlertTriangle
                            size={16}
                            className="text-purple-600 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs">
                            Modern CPUs use ASIDs/PCIDs to retain TLB entries
                            across context switches
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle
                            size={16}
                            className="text-purple-600 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs">
                            Programs with poor locality cause "TLB thrashing"
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                    {/* ✅ Animation Controls moved here */}
                    <AnimationControls steps={5} color="purple" />
                    <TLBDiagram step={currentAnimationStep} />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "swap" && (
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 className="text-lg font-bold mb-1 text-gray-800">
                      Swapping: When RAM Runs Out
                    </h2>
                    <p className="text-gray-600 mb-6 text-xs leading-relaxed">
                      When physical RAM is full and the system needs to allocate
                      a new page, the OS must evict a victim page to disk (swap
                      space). The OS typically chooses the least recently used
                      (LRU) page as the victim. Later accesses to swapped pages
                      cause <strong>major page faults</strong>, requiring slow
                      disk I/O to restore them.
                    </p>
                    <div className="bg-orange-50 text-sm border-2 border-orange-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-sm text-orange-900 mb-2">
                        Swap-Out Process (Page Eviction):
                      </h4>
                      <ol className="space-y-1 text-xs text-gray-700 list-decimal list-inside">
                        <li>RAM is full, new page allocation requested</li>
                        <li>OS selects victim page using LRU approximation</li>
                        <li>Write victim page to swap space on disk</li>
                        <li>Mark page table entry as "not present"</li>
                        <li>Load new page into freed physical frame</li>
                        <li>Update page table and TLB</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-sm text-blue-900 mb-2">
                        Swap-In Process (Major Page Fault):
                      </h4>
                      <ol className="space-y-1 text-xs text-gray-700 list-decimal list-inside">
                        <li>Program accesses swapped-out page</li>
                        <li>Page table lookup shows "not present"</li>
                        <li>✗ Major page fault triggered!</li>
                        <li>OS reads page from disk back into RAM</li>
                        <li>Update page table to show page is present</li>
                        <li>Resume program execution</li>
                      </ol>
                    </div>
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-sm text-red-900 mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Performance Warning
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-700">
                        <li className="flex items-start gap-2">
                          <X
                            size={16}
                            className="text-red-600 mt-0.5 flex-shrink-0"
                          />
                          <span>RAM access: ~100 nanoseconds</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X
                            size={16}
                            className="text-red-600 mt-0.5 flex-shrink-0"
                          />
                          <span>
                            Disk access: ~10 milliseconds (100,000× slower!)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X
                            size={16}
                            className="text-red-600 mt-0.5 flex-shrink-0"
                          />
                          <span>
                            Excessive swapping causes "thrashing" – system
                            becomes unresponsive
                          </span>
                        </li>
                      </ul>
                      <p className="text-xs text-gray-700 mt-3 font-semibold">
                        Swap should be a safety net, not regular operation. If
                        your system swaps frequently, add more RAM!
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                    {/* ✅ Animation Controls moved here */}
                    <AnimationControls steps={5} color="orange" />
                    <SwapDiagram step={currentAnimationStep} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <footer className="mt-8 text-center text-gray-600 text-xs bg-white rounded-lg p-4 shadow">
          <p className="font-semibold mb-2">
            Educational Tool – Unix Memory Management Concepts
          </p>
          <p>
            This simulator demonstrates virtual memory, paging, TLB caching, and
            swapping mechanisms. Actual OS implementations are more complex,
            with multi-level page tables, scalable page replacement algorithms
            (e.g., clock), and hardware-specific optimizations like ASIDs.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UnixMemoryLearningTool;