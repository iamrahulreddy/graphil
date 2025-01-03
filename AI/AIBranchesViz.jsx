import React, { useState } from 'react';
import {
  BrainCircuit,
  Search,
  Database,
  Code,
  Users,
  Boxes,
  Cpu,
  Book,
  ArrowRightCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIComponentVisualizer = () => {
  const [activeBranch, setActiveBranch] = useState(null);
  const [showCallToAction, setShowCallToAction] = useState(true);

  const branches = [    {
      id: 'ml',
      name: 'Machine Learning',
      icon: <BrainCircuit className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-100',
      description:
        'Machine Learning (ML) is a subset of AI that focuses on enabling systems to learn from data without being explicitly programmed. It involves building algorithms that can identify patterns, make predictions, and improve their performance over time based on the data they are exposed to.',
      subBranches: [
        {
          id: 'supervised',
          name: 'Supervised Learning',
          description:
            'In supervised learning, the model is trained on a labeled dataset, where the input data is paired with the corresponding desired output. The goal is for the model to learn a mapping function that can predict the output for new, unseen inputs.',
          examples: ['Classification', 'Regression'],
        },
        {
          id: 'unsupervised',
          name: 'Unsupervised Learning',
          description:
            'Unsupervised learning deals with unlabeled data. The model tries to find patterns, structures, and relationships in the data without any prior knowledge of the output. Common tasks include clustering and dimensionality reduction.',
          examples: ['Clustering', 'Dimensionality Reduction'],
        },
        {
          id: 'reinforcement',
          name: 'Reinforcement Learning',
          description:
            'Reinforcement learning involves an agent learning to interact with an environment by taking actions and receiving rewards or penalties. The agent learns an optimal policy to maximize cumulative rewards over time.',
          examples: ['Game Playing', 'Robotics Control'],
        },
      ],
    },
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      icon: <Book className="w-5 h-5 text-green-500" />,
      color: 'bg-green-100',
      description:
        'Natural Language Processing (NLP) is a branch of AI that deals with the interaction between computers and human language. It enables computers to understand, interpret, and generate human language in a way that is both meaningful and useful.',
      subBranches: [
        {
          id: 'text',
          name: 'Text Processing',
          description:
            'Focuses on analyzing and manipulating text data. This includes tasks like tokenization, stemming, lemmatization, part-of-speech tagging, and parsing.',
          examples: ['Sentiment Analysis', 'Text Classification'],
        },
        {
          id: 'speech',
          name: 'Speech Recognition',
          description:
            'Involves converting spoken language into text. This is a challenging task due to variations in accents, pronunciation, and background noise.',
          examples: ['Voice Assistants', 'Speech-to-Text'],
        },
        {
          id: 'generation',
          name: 'Language Generation',
          description:
            'Deals with generating human-like text. This can involve tasks like machine translation, text summarization, and chatbot development.',
          examples: ['Machine Translation', 'Chatbots'],
        },
      ],
    },
    {
      id: 'cv',
      name: 'Computer Vision',
      icon: <Search className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-100',
      description:
        'Computer Vision is a field of AI that enables computers to "see" and interpret the visual world. It involves processing and analyzing images and videos to extract meaningful information and make decisions or take actions based on that information.',
      subBranches: [
        {
          id: 'recognition',
          name: 'Image Recognition',
          description:
            'Involves identifying and classifying objects within images. This is a fundamental task in computer vision and has applications in various domains.',
          examples: ['Object Detection', 'Image Classification'],
        },
        {
          id: 'detection',
          name: 'Object Detection',
          description:
            'Focuses on identifying and locating objects of interest within an image or video. It involves drawing bounding boxes around objects and classifying them.',
          examples: ['Face Detection', 'Autonomous Driving'],
        },
        {
          id: 'segmentation',
          name: 'Image Segmentation',
          description:
            'Deals with partitioning an image into multiple segments or regions, where each segment represents a different object or part of an object.',
          examples: ['Medical Imaging', 'Scene Understanding'],
        },
      ],
    },
    {
      id: 'robotics',
      name: 'Robotics',
      icon: <Cpu className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-100',
      description:
        'Robotics is a field that deals with the design, construction, operation, and application of robots. It combines various disciplines, including AI, to create robots that can perform tasks autonomously or semi-autonomously.',
      subBranches: [
        {
          id: 'perception',
          name: 'Perception',
          description:
            'Enables robots to perceive their environment using sensors. This includes processing data from cameras, lidar, and other sensors to understand the surroundings.',
          examples: ['Object Recognition', 'Navigation'],
        },
        {
          id: 'control',
          name: 'Control',
          description:
            'Involves controlling the movements and actions of robots. This can range from simple motion planning to complex control algorithms for dynamic tasks.',
          examples: ['Motion Planning', 'Manipulation'],
        },
        {
          id: 'interaction',
          name: 'Human-Robot Interaction',
          description:
            'Focuses on how robots interact with humans. This includes designing intuitive interfaces, understanding human intentions, and enabling natural communication.',
          examples: ['Social Robots', 'Collaborative Robots'],
        },
      ],
    },
    {
      id: 'expert',
      name: 'Expert Systems',
      icon: <Code className="w-5 h-5 text-red-500" />,
      color: 'bg-red-100',
      description:
        'Expert Systems are computer programs designed to mimic the decision-making ability of a human expert in a specific domain. They use a knowledge base and inference rules to solve complex problems and provide expert-level advice.',
      subBranches: [
        {
          id: 'knowledge',
          name: 'Knowledge-Based',
          description:
            'These systems rely on a knowledge base that contains facts, rules, and heuristics about a specific domain. They use inference engines to reason over the knowledge base and draw conclusions.',
          examples: ['Medical Diagnosis', 'Financial Advice'],
        },
        {
          id: 'rule',
          name: 'Rule-Based',
          description:
            'A common type of expert system that uses a set of if-then rules to represent knowledge. The inference engine matches the rules against the current state of the system to make decisions.',
          examples: ['Fault Diagnosis', 'Process Control'],
        },
        {
          id: 'case',
          name: 'Case-Based Reasoning',
          description:
            'These systems solve new problems by finding similar cases in a case base and adapting their solutions. They learn from experience by storing and retrieving past cases.',
          examples: ['Customer Support', 'Legal Reasoning'],
        },
      ],
    },
    {
      id: 'ds',
      name: 'Data Science',
      icon: <Database className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-100',
      description:
        'Data Science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data. It combines techniques from various fields, including statistics, machine learning, and data mining.',
      subBranches: [
        {
          id: 'analysis',
          name: 'Data Analysis',
          description:
            'Involves inspecting, cleaning, transforming, and modeling data to discover useful information, draw conclusions, and support decision-making.',
          examples: ['Exploratory Data Analysis', 'Statistical Modeling'],
        },
        {
          id: 'visualization',
          name: 'Data Visualization',
          description:
            'Focuses on representing data graphically to help people understand the significance of the data by placing it in a visual context.',
          examples: ['Charts', 'Dashboards', 'Infographics'],
        },
        {
          id: 'mining',
          name: 'Data Mining',
          description:
            'Deals with discovering patterns, anomalies, and relationships in large datasets to predict outcomes and generate new information.',
          examples: ['Association Rule Mining', 'Anomaly Detection'],
        },
      ],
    },
    {
      id: 'multi',
      name: 'Multi-Agent Systems',
      icon: <Users className="w-5 h-5 text-teal-500" />,
      color: 'bg-teal-100',
      description:
        'Multi-Agent Systems (MAS) involve multiple interacting agents that work together to achieve a common goal or individual goals. These agents can be cooperative, competitive, or a mix of both. MAS are used to model complex systems and solve problems that are difficult or impossible to solve with a single agent.',
      subBranches: [
        {
          id: 'cooperative',
          name: 'Cooperative Agents',
          description:
            'Agents work together to achieve a shared goal. They coordinate their actions and share information to optimize the overall performance of the system.',
          examples: ['Distributed Sensor Networks', 'Traffic Control'],
        },
        {
          id: 'competitive',
          name: 'Competitive Agents',
          description:
            'Agents have individual goals that may conflict with each other. They compete for resources or to achieve their objectives, often leading to complex interactions and strategies.',
          examples: ['Auctions', 'Game Theory'],
        },
        {
          id: 'coordination',
          name: 'Agent Coordination',
          description:
            'Focuses on how agents coordinate their actions and decisions to achieve their goals, whether cooperative or competitive. This involves communication, negotiation, and planning.',
          examples: ['Robotics Teams', 'Supply Chain Management'],
        },
      ],
    },
    {
      id: 'planning',
      name: 'Planning and Scheduling',
      icon: <Boxes className="w-5 h-5 text-orange-500" />,
      color: 'bg-orange-100',
      description:
        'Planning and Scheduling is a branch of AI that deals with finding a sequence of actions to achieve a goal and optimizing the allocation of resources over time. It involves reasoning about actions, their effects, and the constraints of the environment.',
      subBranches: [
        {
          id: 'automated',
          name: 'Automated Planning',
          description:
            'Focuses on creating algorithms that can automatically generate a plan to achieve a given goal. This involves searching through a space of possible actions and states.',
          examples: ['Route Planning', 'Task Planning'],
        },
        {
          id: 'scheduling',
          name: 'Scheduling',
          description:
            'Deals with assigning resources to tasks over time, subject to constraints. The goal is to optimize some objective function, such as minimizing the completion time or maximizing resource utilization.',
          examples: ['Project Scheduling', 'Manufacturing Scheduling'],
        },
        {
          id: 'temporal',
          name: 'Temporal Reasoning',
          description:
            'Involves reasoning about time and temporal relationships between events and actions. This is crucial for planning and scheduling in dynamic environments.',
          examples: ['Timeline-Based Planning', 'Event Scheduling'],
        },
      ],
    },
  ];

  const toggleBranch = (branchId) => {
    setActiveBranch(activeBranch === branchId ? null : branchId);
    setShowCallToAction(false);
  };

  return (
    <div className="min-h-screen font-mono bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Branches of AI
        </h1>

        {/* Call to Action */}
        <AnimatePresence>
          {showCallToAction && (
            <motion.div
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <ArrowRightCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Click on a branch to explore its subtopics and learn more!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flowchart-like UI (Grid with conditional expansion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {branches.map((branch) => (
            <div key={branch.id}>
              <motion.button
                className={`w-full p-4 rounded-lg flex items-center justify-start space-x-3 ${
                  activeBranch === branch.id ? branch.color : 'bg-gray-200'
                } hover:bg-gray-300 transition-colors duration-200`}
                onClick={() => toggleBranch(branch.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {branch.icon}
                <span className="text-lg font-semibold text-gray-700">
                  {branch.name}
                </span>
              </motion.button>

              {/* Sub-branch Section */}
              <AnimatePresence>
                {activeBranch === branch.id && (
                  <motion.div
                    className="mt-4 space-y-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-gray-600 p-4">
                      {branch.description}
                    </p>
                    {branch.subBranches.map((subBranch) => (
                      <div
                        key={subBranch.id}
                        className="bg-white rounded-lg shadow p-4"
                      >
                        <h3 className="font-medium text-gray-800">
                          {subBranch.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {subBranch.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {subBranch.examples.map((example) => (
                            <span
                              key={example}
                              className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIComponentVisualizer;