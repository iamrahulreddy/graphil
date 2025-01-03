import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  FaServer,
  FaDatabase,
  FaGlobe,
  FaLaptop,
  FaSearch,
  FaArrowDown,
  FaPause,
  FaPlay,
  FaRedo,
  FaQuestionCircle,
  FaCheckCircle,
  FaShieldAlt,
  FaExchangeAlt,
  FaInfoCircle,
} from "react-icons/fa";

// Define color schemes for different steps
const colorSchemes = {
  LOCAL_DNS_CACHE: {
    bg: "bg-pink-600",
    text: "text-pink-600",
    border: "border-pink-600",
  },
  RECURSIVE_RESOLVER: {
    bg: "bg-cyan-600",
    text: "text-cyan-600",
    border: "border-cyan-600",
  },
  ROOT_DNS_SERVER: {
    bg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-600",
  },
  TLD_DNS_SERVER: {
    bg: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-600",
  },
  AUTHORITATIVE_DNS: {
    bg: "bg-amber-600",
    text: "text-amber-600",
    border: "border-amber-600",
  },
  DNSSEC_VALIDATION: {
    bg: "bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-600",
  },
  CNAME_RESOLUTION: {
    bg: "bg-teal-600",
    text: "text-teal-600",
    border: "border-teal-600",
  },
};

// StepVisualizer Component: Renders each step in the DNS resolution process
const StepVisualizer = React.forwardRef(({ step, isActive, isLast, onClick }, ref) => {
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
            <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
              <code className="text-sm text-white">{step.technical}</code>
              <div className={`mt-2 text-xs ${colors.text}`}>
                Latency: {step.latency}
              </div>
              {/* Linux command examples added */}
              {step.commands && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Try these commands:
                  </p>
                  <ul className="text-xs text-green-400 list-disc list-inside">
                    {step.commands.map((cmd, index) => (
                      <li key={index}>
                        <code>{cmd}</code>
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
                  <span>Analogy:</span>{" "}
                  {step.definition.analogy}
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
});

// DNSVisualizer Component: Main component for visualizing DNS resolution process
const DNSVisualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(3000); // Animation speed in ms
  const [isHovering, setIsHovering] = useState(false); // For play/pause button hover state

  // Refs for each step
  const stepRefs = useRef([]);

  // Define steps using useMemo to prevent unnecessary re-renders
  const steps = useMemo(
    () => [
      {
        id: 1,
        title: "> LOCAL_DNS_CACHE",
        icon: <FaLaptop className="w-8 h-8" />,
        description:
          "$ checking local DNS cache... Did you know your browser and OS keep a DNS cache too? Smart, right?",
        technical: "process: checking /etc/hosts && local_cache_lookup()",
        latency: "~ 1ms",
        definition: {
          title: "Local DNS Cache",
          explanation:
            "Your computer or device maintains a temporary record of recently accessed domain name to IP address mappings. This is the first place a DNS query is checked to speed up browsing.",
          analogy:
            "It's like your browser's little black book of websites! It remembers where you've been so you can get there faster next time.",
          examples: [
            "If you visit 'example.com' frequently, your computer stores its IP address locally. Next time, it won't need to go through the whole DNS process again.",
            "Browser caches (like in Chrome or Firefox) and OS caches (managed by the operating system) both contribute to faster lookups.",
          ],
        },
        commands: [
          "ipconfig /displaydns (Windows)",
          "dscacheutil -cachedump -entries Host (macOS)",
          "sudo systemd-resolve --statistics (Linux - systemd)",
        ],
      },
      {
        id: 2,
        title: "> RECURSIVE_RESOLVER",
        icon: <FaServer className="w-8 h-8" />,
        description:
          "$ querying recursive resolver... Think of this as the detective of the DNS world, it's gonna dig deep.",
        technical: "process: query_recursive_resolver()",
        latency: "~ 5ms",
        definition: {
          title: "Recursive Resolver",
          explanation:
            "A DNS server that performs the complete resolution process on behalf of the client. It queries other DNS servers as needed to resolve the domain name.",
          analogy:
            "It's like a dedicated librarian who knows how to navigate the entire library system. You ask them for a book, and they'll find it for you, even if it's in a different section or another branch.",
          examples: [
            "Google Public DNS (8.8.8.8 and 8.8.4.4) is a popular recursive resolver.",
            "Cloudflare DNS (1.1.1.1) is another widely used recursive resolver known for its speed and privacy focus.",
            "Your Internet Service Provider (ISP) also typically provides a recursive resolver for you to use."
          ],
        },
        commands: ["dig google.com @8.8.8.8", "nslookup google.com 1.1.1.1"],
      },
      {
        id: 3,
        title: "> ROOT_DNS_SERVER",
        icon: <FaGlobe className="w-8 h-8" />,
        description:
          "$ querying root DNS server... We're going to the top of the food chain now. It's like asking for directions from the wisest elder.",
        technical: "process: query_root_dns_server()",
        latency: "~ 30ms",
        definition: {
          title: "Root DNS Server",
          explanation:
            "The top-level DNS servers in the hierarchical DNS system. They don't know the specific IP address for a domain, but they direct queries to the appropriate Top-Level Domain (TLD) DNS servers.",
          analogy:
            "They are like the directory at the entrance of a huge library. They won't tell you exactly where a book is, but they'll point you to the right section (e.g., 'Fiction,' 'Science').",
          examples: [
            "There are 13 sets of root servers (named a.root-servers.net to m.root-servers.net), strategically located around the world for redundancy and faster access.",
            "They are operated by different organizations, such as ICANN, Verisign, and NASA.",
          ],
        },
        commands: ["dig . ns", "dig +trace google.com"],
      },
      {
        id: 4,
        title: "> TLD_DNS_SERVER",
        icon: <FaDatabase className="w-8 h-8" />,
        description:
          "$ querying TLD DNS server... Getting closer! It's like narrowing down your search in a library by genre.",
        technical: "process: query_tld_dns_server()",
        latency: "~ 50ms",
        definition: {
          title: "Top-Level Domain (TLD) DNS Server",
          explanation:
            "DNS servers responsible for top-level domains like .com, .org, .net, .edu, and country code TLDs like .uk, .ca, .jp. They direct queries to the Authoritative DNS servers for specific domains.",
          analogy:
            "Think of them as the librarians who manage specific sections of the library. The '.com' librarian knows all about the '.com' books, and the '.org' librarian handles the '.org' section.",
          examples: [
            "Verisign operates the TLD servers for '.com' and '.net'.",
            "Public Interest Registry (PIR) manages the '.org' TLD.",
            "Every country has its own organization responsible for its country code TLD (ccTLD).",
          ],
        },
        commands: ["dig com ns", "dig +trace google.com"],
      },
      {
        id: 5,
        title: "> AUTHORITATIVE_DNS",
        icon: <FaSearch className="w-8 h-8" />,
        description:
          "$ querying authoritative DNS server... We've found the source! It's like finally getting the author's signature on your book.",
        technical: "process: query_authoritative_dns()",
        latency: "~ 70ms",
        definition: {
          title: "Authoritative DNS Server",
          explanation:
            "The final DNS server that holds the actual DNS records (like A, AAAA, CNAME, MX, etc.) for a domain name. It provides the definitive answer to the DNS query, including the IP address of the requested domain.",
          analogy:
            "This is the author of the book you're looking for. They have the original manuscript and can tell you exactly where a copy of the book is located (the IP address).",
          examples: [
            "If you own 'example.com,' your hosting provider or DNS service (like Amazon Route 53, Cloudflare, Google Cloud DNS) manages your authoritative DNS servers.",
            "These servers are where you configure your DNS records to point your domain to your website, email server, and other services.",
          ],
        },
        commands: ["dig google.com ns", "nslookup -type=ns google.com"],
      },
      {
        id: 6,
        title: "> DNSSEC_VALIDATION",
        icon: <FaShieldAlt className="w-8 h-8" />,
        description:
          "$ validating DNSSEC... Ensuring the integrity and authenticity of the DNS response. It's like checking the book's seal of authenticity.",
        technical: "process: validate_dnssec()",
        latency: "~ 20ms",
        definition: {
          title: "DNSSEC Validation",
          explanation:
            "DNS Security Extensions (DNSSEC) add a layer of security to the DNS by enabling DNS responses to be validated. This ensures that the information received is authentic and has not been tampered with.",
          analogy:
            "It's like having a seal of authenticity on a book. You can be sure that the book hasn't been tampered with and is the genuine article.",
          examples: [
            "DNSSEC uses digital signatures to verify the authenticity of DNS records.",
            "It helps prevent DNS spoofing and cache poisoning attacks.",
            "Many modern DNS resolvers support DNSSEC validation.",
          ],
        },
        commands: ["dig +dnssec google.com", "dig +sigchase google.com"],
      },
      {
        id: 7,
        title: "> CNAME_RESOLUTION",
        icon: <FaExchangeAlt className="w-8 h-8" />,
        description:
          "$ resolving CNAME... Following the alias to the canonical name. It's like following a reference to another book.",
        technical: "process: resolve_cname()",
        latency: "~ 10ms",
        definition: {
          title: "CNAME Resolution",
          explanation:
            "A CNAME (Canonical Name) record is used to alias one domain name to another. When a CNAME record is encountered, the DNS resolver must perform an additional lookup to resolve the canonical name.",
          analogy:
            "It's like following a reference in a book that points you to another book. You need to look up the referenced book to get the information you need.",
          examples: [
            "If 'www.example.com' is a CNAME for 'example.com,' the resolver will need to look up 'example.com' to get the IP address.",
            "CNAME records are often used for load balancing and redirecting traffic to different servers.",
          ],
        },
        commands: ["dig www.google.com CNAME", "nslookup -type=CNAME www.google.com"],
      },
    ],
    []
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
        setCurrentTime(new Date().toUTCString());
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
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gray-800 rounded-lg p-3">
            <p className="text-lg font-bold text-green-500">
              DNS Resolution Simulation
            </p>
          </div>
          <p className="mt-4 text-gray-300">
            Ever wondered how your browser magically finds websites? Let's
            explore the journey of a DNS query!
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
            <option value={15000}>Slow (15s)</option>
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
        <div className="mt-12 text-center font-mono text-gray-300 bg-gray-800 rounded-lg p-4">
          <code>
            --- DNS Resolution Process {isPlaying ? "Running" : "Paused"} ---
            <br />
            Status:{" "}
            {currentStep === steps.length - 1 ? (
              <>
                <FaCheckCircle className="inline-block text-green-500" /> SUCCESS
              </>
            ) : (
              <>
                <FaQuestionCircle className="inline-block text-yellow-500" /> IN_PROGRESS
              </>
            )}
            <br />
            {/* Call to action added */}
            Feeling like a DNS guru yet? Use the commands above to play with DNS
            resolution on your own machine!
            <br />
            {/* Humor added :) */}
            (Just for fun) If your DNS resolution is slow, don't blame the
            internet, it might just be your cache having a lazy day!
          </code>
        </div>
      </div>

      <div className="mt-12 w-full px-4 md:px-8 lg:px-16">
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 text-gray-300 font-mono leading-relaxed transition-all duration-300 ease-in-out hover:shadow-xl">
    {/* Title with prompt */}
    <div className="items-center text-green-400 mb-6">
        <p className="text-lg text-center font-bold">
            Additional Notes
        </p>
    </div>

    {/* Tips Container */}
      {/* DNS Resolution Tips Container */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Tip 1: Caching */}
  <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-yellow-300">
      <span className="mr-1">1.</span>Implement Caching
    </h3>
    <p className="text-sm">
      Cache DNS responses locally to reduce latency and server load for frequently accessed domains. Consider using libraries like{" "}
      <code className="text-green-400 px-1 py-0.5 rounded bg-gray-700">
        dns.resolve
      </code> with caching enabled (if available).
    </p>
  </div>

  {/* Tip 2: Resolver Choice */}
  <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-yellow-300">
      <span className="mr-1">2.</span>Choose a Fast Resolver
    </h3>
    <p className="text-sm">
      Select a reliable and fast DNS resolver. Popular options include Google Public DNS (8.8.8.8, 8.8.4.4), Cloudflare (1.1.1.1), and OpenDNS. Experiment to find the best one for your location.
    </p>
  </div>

  {/* Tip 3: Asynchronous Resolution */}
  <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-yellow-300">
      <span className="mr-1">3.</span>Use Asynchronous Resolution
    </h3>
    <p className="text-sm">
      Utilize asynchronous DNS resolution libraries or APIs (e.g., Node.js's `dns.resolve` with Promises or callbacks, `aiodns` in Python) to avoid blocking the main thread during resolution.
    </p>
  </div>

  {/* Tip 4: Connection Pooling */}
  <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-yellow-300">
      <span className="mr-1">4.</span>Consider Connection Pooling
    </h3>
    <p className="text-sm">
      If your application performs a high volume of DNS lookups, use connection pooling to reuse connections to DNS servers, reducing overhead.
    </p>
  </div>

  {/* Tip 5: EDNS Client Subnet (ECS) */}
  <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-yellow-300">
      <span className="mr-1">5.</span>Leverage EDNS Client Subnet
    </h3>
    <p className="text-sm">
      If supported by your resolver, use EDNS Client Subnet (ECS) to provide a portion of the client's IP address to the authoritative name server, potentially improving CDN performance.
    </p>
  </div>

  {/* Tip 6: DNS Prefetching */}
  <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-yellow-300">
      <span className="mr-1">6.</span>Use DNS Prefetching (Browser)
    </h3>
    <p className="text-sm">
      In web browsers, use DNS prefetching to resolve domains proactively that the user is likely to visit, reducing latency.
    </p>
  </div>

  {/* Tip 7: Host File */}
  <div className="tip-card p-4 rounded-lg border border-gray-700 bg-gray-900 transition duration-200 hover:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-yellow-300">
      <span className="mr-1">7.</span>Optimize Host File (Specific Cases)
    </h3>
    <p className="text-sm">
    For frequently accessed internal services or during development, you can add entries to the local host file (e.g., `/etc/hosts` on Linux/macOS) to bypass DNS resolution altogether, ensuring very fast lookups. Use this cautiously in production.
    </p>
  </div>
</div>
    </div>
  </div>
</div>
  );
};

export default DNSVisualizer;
