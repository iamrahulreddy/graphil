import React, { useState, useEffect, useRef } from 'react';
import {
  List,
  LayoutList,
  Map,
  Hash,
  GitBranch,
  Cpu,
  Network,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const PythonDataStructuresVisualizer = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const sectionRef = useRef([]);

  const sections = [
    {
      id: 1,
      name: 'Lists',
      icon: <List className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-100',
      description:
        'Ordered, mutable sequences used to store collections of data.',
      properties: ['Ordered', 'Mutable', 'Heterogeneous', 'Indexed'],
      operations: [
        'append()',
        'insert()',
        'remove()',
        'pop()',
        'sort()',
        'reverse()',
      ],
      examples: [
        'Storing numbers: [1, 2, 3]',
        'String collection: ["apple", "banana"]',
        'Mixed types: [1, "hello", 3.14]',
        'Nested lists: [[1, 2], [3, 4]]',
      ],
      bestPractices: [
        'Use when you need an ordered sequence.',
        'Use comprehensions for operations.',
        'Use NumPy arrays for numerical operations.',
        'Be mindful of insert (O(n)).',
      ],
      code: `
# Creating a list
my_list = [1, 2, "apple", 3.14]

# Appending an element
my_list.append(5)  # my_list is now [1, 2, "apple", 3.14, 5]

# Inserting at a specific index
my_list.insert(1, "banana")  # my_list is now [1, "banana", 2, "apple", 3.14, 5]

# Removing an element by value
my_list.remove("apple")  # my_list is now [1, "banana", 2, 3.14, 5]

# Removing by index and returning the value (pop)
popped_item = my_list.pop(2)  # popped_item is 2, my_list is now [1, "banana", 3.14, 5]

# Sorting a list (in-place)
numbers = [3, 1, 4, 1, 5]
numbers.sort()  # numbers is now [1, 1, 3, 4, 5]

# Reversing a list (in-place)
numbers.reverse()  # numbers is now [5, 4, 3, 1, 1]
      `,
    },
    {
      id: 2,
      name: 'Tuples',
      icon: <LayoutList className="w-6 h-6 text-green-500" />,
      color: 'bg-green-100',
      description: 'Ordered, immutable sequences, for fixed sets of data.',
      properties: [
        'Ordered',
        'Immutable',
        'Can contain different types',
        'Indexed',
        'Parenthesis used',
      ],
      operations: ['count()', 'index()'],
      examples: [
        'Coordinates: (10, 20)',
        'Fixed data: ("John", 30)',
        'Return value: return (x, y)',
      ],
      bestPractices: [
        'Use for fixed data representation.',
        'Use as dictionary keys, must be immutable.',
        'Use for function returns, or constant values.',
        'When data is fixed',
      ],
      code: `
# Creating a tuple
my_tuple = (1, 2, "apple", 3.14)

# Accessing elements (same as lists)
print(my_tuple[0])  # Output: 1

# Count occurrences of an element
count = my_tuple.count(2)  # count is 1

# Find the index of an element
index = my_tuple.index("apple")  # index is 2

# Immutability (cannot change elements)
# my_tuple[0] = 5  # This would raise a TypeError
      `,
    },
    {
      id: 3,
      name: 'Dictionaries',
      icon: <Map className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-100',
      description:
        'Key-value pairs, unordered, and mutable, for lookup based on keys.',
      properties: [
        'Key-Value pairs',
        'Unordered',
        'Mutable',
        'Keys must be immutable',
      ],
      operations: [
        'get()',
        'items()',
        'keys()',
        'values()',
        'pop()',
        'update()',
      ],
      examples: [
        'User data: {"name": "Alice", "age": 25}',
        'Configuration: {"api_key": "xyz", "timeout": 30}',
        'Associating objects/attributes',
      ],
      bestPractices: [
        'Associate values to keys.',
        'Efficient key-based lookups (O(1)).',
        'When data is stored with Keys',
      ],
      code: `
# Creating a dictionary
my_dict = {"name": "Alice", "age": 30, "city": "New York"}

# Accessing value using a key
name = my_dict["name"]  # name is "Alice"

# Getting a value with a default if key not found
country = my_dict.get("country", "USA")  # country is "USA"

# Adding or updating a key-value pair
my_dict["job"] = "Engineer"  # my_dict is now {"name": "Alice", "age": 30, "city": "New York", "job": "Engineer"}

# Removing a key-value pair and returning the value (pop)
city = my_dict.pop("city")  # city is "New York", my_dict is now {"name": "Alice", "age": 30, "job": "Engineer"}

# Getting all keys, values, and key-value pairs
keys = my_dict.keys()  # keys is dict_keys(["name", "age", "job"])
values = my_dict.values()  # values is dict_values(["Alice", 30, "Engineer"])
items = my_dict.items()  # items is dict_items([("name", "Alice"), ("age", 30), ("job", "Engineer")])

# Updating with another dictionary
my_dict.update({"age": 31, "city": "San Francisco"})  # my_dict is now {"name": "Alice", "age": 31, "job": "Engineer", "city": "San Francisco"}
        `,
    },
    {
      id: 4,
      name: 'Sets',
      icon: <Hash className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-100',
      description:
        'Unordered, unique collections, for checking membership and duplicates removal.',
      properties: ['Unordered', 'Mutable', 'Contains unique items'],
      operations: [
        'add()',
        'remove()',
        'union()',
        'intersection()',
        'difference()',
      ],
      examples: [
        'Unique elements: {1, 2, 3}',
        'Membership test: checking if values in a set',
        'Intersection of two sets to find mutual item',
        'Removal of duplicate in dataset',
      ],
      bestPractices: [
        'Crucial for uniqueness of items',
        'Perform set algebra operations',
        'Best for removing duplicates',
      ],
      code: `
# Creating a set
my_set = {1, 2, 3, 3}  # my_set will be {1, 2, 3} (duplicates removed)

# Adding an element
my_set.add(4)  # my_set is now {1, 2, 3, 4}

# Removing an element
my_set.remove(2)  # my_set is now {1, 3, 4}

# Set operations
set1 = {1, 2, 3}
set2 = {3, 4, 5}
union_set = set1.union(set2)  # union_set is {1, 2, 3, 4, 5}
intersection_set = set1.intersection(set2)  # intersection_set is {3}
difference_set = set1.difference(set2)  # difference_set is {1, 2}
          `,
    },
    {
      id: 5,
      name: 'Linked Lists',
      icon: <GitBranch className="w-6 h-6 text-red-500" />,
      color: 'bg-red-100',
      description:
        'Nodes with value and next (or prev) pointers, dynamic insertion and deletion.',
      properties: [
        'Node contains values',
        'Has next or previous pointer',
        'Unidirectional or bi directional',
      ],
      operations: ['Traversal', 'Insertion', 'Deletion', 'Search'],
      examples: ['Managing playlist', 'Implementation of stack and queue.'],
      bestPractices: [
        'For dynamic insert and delete.',
        'Ideal for linear relationship of items',
      ],
      code: `
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node

    def insert(self, data, index):
      if index < 0:
            raise ValueError("Invalid index")

      new_node = Node(data)

      if index == 0:
          new_node.next = self.head
          self.head = new_node
          return

      current_node = self.head
      current_index = 0

      while current_node and current_index < index - 1:
          current_node = current_node.next
          current_index += 1

      if not current_node:
          raise ValueError("Index out of range")

      new_node.next = current_node.next
      current_node.next = new_node

    def delete(self, data):
      current_node = self.head

      if current_node and current_node.data == data:
         self.head = current_node.next
         return

      prev_node = None
      while current_node and current_node.data != data:
         prev_node = current_node
         current_node = current_node.next

      if not current_node:
         return  # Data not found

      prev_node.next = current_node.next

    def search(self, data):
      current_node = self.head

      while current_node:
        if current_node.data == data:
            return True  # Data found
        current_node = current_node.next

        return False  # Data not found

    def traverse(self):
      current_node = self.head
      while current_node:
        print(current_node.data)
         current_node = current_node.next

# Example
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.insert(5, 0) #insert 5 at index 0
llist.traverse() # print values of node 5 -> 1 -> 2 -> 3
llist.delete(2)
llist.traverse() # print values of node 5 -> 1 -> 3

          `,
    },
    {
      id: 6,
      name: 'Heaps',
      icon: <Cpu className="w-6 h-6 text-pink-500" />,
      color: 'bg-pink-100',
      description:
        'Tree with max or min properties, mainly for priority queue and sorting.',
      properties: ['Tree based structure', 'Max or Min property maintained'],
      operations: ['heapify()', 'push()', 'pop()'],
      examples: ['Implementation of priority queue', 'Heap sort'],
      bestPractices: [
        'Retrieve and modify priority of data',
        'Min and Max queue',
      ],
      code: `
import heapq

# Create a min-heap (list used as the underlying structure)
my_heap = [3, 1, 4, 1, 5, 9, 2]
heapq.heapify(my_heap)  # Transform list into a heap, in-place

# Push an element onto the heap
heapq.heappush(my_heap, 0)  # my_heap is now [0, 1, 2, 1, 5, 9, 4]

# Pop the smallest element
smallest = heapq.heappop(my_heap)  # smallest is 0, my_heap is now [1, 1, 2, 4, 5, 9]

# Peek at the smallest element without popping
smallest = my_heap[0]  # smallest is 1

# Using a heap for sorting
sorted_list = []
while my_heap:
    sorted_list.append(heapq.heappop(my_heap))  # sorted_list is now [1, 1, 2, 4, 5, 9]
      `,
    },
    {
      id: 7,
      name: 'Working with JSON',
      icon: <Network className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-100',
      description:
        'Python provides the `json` module to work with data in the JSON format. You can serialize (convert) Python objects to JSON strings and parse (convert) JSON strings into Python objects.',
      properties: [
        'json.loads()',
        'json.dumps()',
        'Serialization',
        'Deserialization',
      ],
      operations: ['Encoding', 'Decoding'],
      examples: [
        'Converting Python dict to JSON string',
        'Parsing JSON string to Python dict',
        'Reading JSON data from a file',
        'Writing JSON data to a file',
      ],
      bestPractices: [
        'Use for data interchange with web services or applications that use JSON.',
        'Use json.dumps() with indentation for readability when writing to files.',
        'Handle potential exceptions (e.g., JSONDecodeError) during parsing.',
      ],
      code: `
import json

# Serialization (Python to JSON)
data = {"name": "John Doe", "age": 30, "city": "New York"}
json_string = json.dumps(data, indent=2)  # Convert to JSON string with indentation for readability
print(json_string)
# Output:
# {
#   "name": "John Doe",
#   "age": 30,
#   "city": "New York"
# }

# Deserialization (JSON to Python)
json_data = '{ "name": "Alice", "age": 25, "city": "London" }'
python_obj = json.loads(json_data)  # Convert to Python dictionary
print(python_obj["name"])  # Output: Alice

# Working with JSON files
# Write to a file
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# Read from a file
with open("data.json", "r") as f:
    loaded_data = json.load(f)
    print(loaded_data)
        `,
    },
  ];

  useEffect(() => {
    sections.forEach((section) => {
      const img = new Image();
      img.src = `/${section.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    });
  }, []);

  const handleSectionClick = (index) => {
    setIsAnimating(true);
    setCurrentSection(index);
    // Scroll to section with offset
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
          <div className="flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-500" />
            <h1 className="text-lg font-bold">
              Python Data Structures
            </h1>
          </div>
          <div className="p-4 mt-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700 text-xs text-base leading-relaxed">
              <strong className="text-blue-600">Python Data Structures </strong>
              are fundamental for organizing and managing data. This
              visualizer will introduce common data structures essential for
              programming in python like lists, tuples, dictionaries, sets,
              linked lists, and heaps.
            </p>
          </div>
        </div>
        <div className="p-6">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
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
                    ? `${section.color.replace('100', '500')} text-white shadow-lg`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                      : currentSection === 6
                      ? 'Properties'
                      : 'Properties'}
                  </h4>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {(sections[currentSection].properties).map(
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
                    )}
                  </motion.div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">
                    Key{' '}
                    {currentSection === 0
                      ? 'Operations'
                      : currentSection === 1
                      ? 'Operations'
                      : currentSection === 2
                      ? 'Operations'
                      : currentSection === 3
                      ? 'Operations'
                      : currentSection === 4
                      ? 'Operations'
                      : currentSection === 5
                      ? 'Operations'
                      : currentSection === 6
                      ? 'Operations'
                      : 'Operations'}
                  </h4>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {(sections[currentSection].operations).map(
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
                    )}
                  </motion.div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">Examples</h4>
                  <ul className="space-y-2">
                    {sections[currentSection].examples.map((example, index) => (
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
                        <span>{example}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">Best Practices</h4>
                  <ul className="space-y-2">
                    {sections[currentSection].bestPractices.map(
                      (practice, index) => (
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
                          <span>{practice}</span>
                        </motion.li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-md">Code Sample</h4>
                    <CopyToClipboard text={sections[currentSection].code} onCopy={handleCopy}>
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        {copyFeedback === 'Copied!' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </CopyToClipboard>
                  </div>
                  <SyntaxHighlighter language="python" style={docco} customStyle={{ fontSize: '10px' }}>
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

export default PythonDataStructuresVisualizer;
