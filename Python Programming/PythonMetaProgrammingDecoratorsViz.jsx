import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  wand,
  Code2,
  ArrowRight,
  Check,
  Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PythonMetaProgrammingDecoratorsVisualizer = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const sectionRef = useRef([]);

  const sections = [
    {
      id: 1,
      name: 'Introduction to Meta-Programming',
      icon: <Code className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-100',
      description:
        'Meta-programming is a programming technique in which programs have the ability to treat other programs as their data. It involves writing code that can generate, modify, or manipulate other code. This can be achieved through techniques like reflection, introspection, and code generation.',
      properties: [
        'Reflection: Inspecting and modifying the structure and behavior of a program at runtime.',
        'Introspection: Examining the type or properties of an object at runtime.',
        'Code Generation: Creating new code at runtime or compile-time.',
      ],
      useCases: [
        'Dynamic code generation',
        'Automatic code optimization',
        'Aspect-oriented programming',
      ],
      limitations: [
        'Complexity: Meta-programming can make code harder to understand and maintain.',
        'Performance: Dynamic code generation can introduce runtime overhead.',
      ],
      code: `
# Example of introspection
class MyClass:
    def my_method(self):
        pass

# Inspecting the class and its methods
print(dir(MyClass))
print(MyClass.my_method.__name__)
      `,
      diagramDescription:
        'This diagram shows the process of introspection, where the program inspects its own structure and behavior at runtime.',
      modules: [
        {
          name: 'inspect',
          description:
            'Provides functions to get information about live objects, such as modules, classes, methods, and functions.',
        },
        {
          name: 'types',
          description:
            'Defines names for some object types that are used by the interpreter.',
        },
      ],
      concepts: [
        {
          name: 'Reflection',
          description:
            'The ability of a program to inspect and modify its own structure and behavior at runtime.',
        },
        {
          name: 'Introspection',
          description:
            'The ability of a program to examine the type or properties of an object at runtime.',
        },
        {
          name: 'Code Generation',
          description:
            'The process of creating new code at runtime or compile-time.',
        },
      ],
    },
    {
      id: 2,
      name: 'Decorators',
      icon: <wand className="w-6 h-6 text-green-500" />,
      color: 'bg-green-100',
      description:
        'Decorators are a powerful and expressive tool in Python that allow you to modify the behavior of a function or class. They are a form of meta-programming that enables you to wrap a function or class method call, adding behavior before and after the execution of the original function or method.',
      properties: [
        'Function Decorators: Modify the behavior of functions.',
        'Class Decorators: Modify the behavior of classes.',
        'Method Decorators: Modify the behavior of class methods.',
      ],
      useCases: [
        'Logging',
        'Authentication',
        'Caching',
      ],
      limitations: [
        'Complexity: Decorators can make code harder to understand and debug.',
        'Performance: Adding too many decorators can introduce overhead.',
      ],
      code: `
# Example of a simple function decorator
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
      `,
      diagramDescription:
        'This diagram shows the flow of a function call with a decorator, highlighting the additional behavior added before and after the original function execution.',
      modules: [
        {
          name: 'functools',
          description:
            'Provides higher-order functions that act on or return other functions.',
        },
        {
          name: 'decorator',
          description:
            'A third-party library that simplifies the creation of decorators.',
        },
      ],
      concepts: [
        {
          name: 'Function Decorator',
          description:
            'A decorator that modifies the behavior of a function.',
        },
        {
          name: 'Class Decorator',
          description:
            'A decorator that modifies the behavior of a class.',
        },
        {
          name: 'Method Decorator',
          description:
            'A decorator that modifies the behavior of a class method.',
        },
        {
          name: 'Wrapper Function',
          description:
            'A function that wraps the original function, adding behavior before and after its execution.',
        },
      ],
    },
    {
      id: 3,
      name: 'Advanced Decorators',
      icon: <Code2 className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-100',
      description:
        'Advanced decorators extend the basic functionality of decorators by adding more complex behaviors, such as argument passing, class methods, and stacking multiple decorators.',
      properties: [
        'Argument Passing: Decorators that accept arguments.',
        'Class Methods: Decorators for class methods.',
        'Stacking: Applying multiple decorators to a single function or method.',
      ],
      useCases: [
        'Complex logging',
        'Authorization',
        'Rate limiting',
      ],
      limitations: [
        'Complexity: Advanced decorators can be even harder to understand and debug.',
        'Performance: Stacking multiple decorators can introduce significant overhead.',
      ],
      code: `
# Example of a decorator with arguments
def repeat(num_times):
    def decorator_repeat(func):
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                func(*args, **kwargs)
        return wrapper
    return decorator_repeat

@repeat(num_times=3)
def say_hello(name):
    print(f"Hello, {name}!")

say_hello("Alice")
      `,
      diagramDescription:
        'This diagram shows the flow of a function call with an advanced decorator, highlighting the additional behavior added before and after the original function execution, including argument passing and stacking.',
      modules: [
        {
          name: 'functools',
          description:
            'Provides higher-order functions that act on or return other functions.',
        },
        {
          name: 'decorator',
          description:
            'A third-party library that simplifies the creation of decorators.',
        },
      ],
      concepts: [
        {
          name: 'Argument Passing',
          description:
            'A decorator that accepts arguments, allowing for more flexible behavior.',
        },
        {
          name: 'Class Methods',
          description:
            'A decorator that modifies the behavior of class methods.',
        },
        {
          name: 'Stacking',
          description:
            'Applying multiple decorators to a single function or method, allowing for complex behavior composition.',
        },
      ],
    },
    {
      id: 4,
      name: 'Meta-Programming vs Decorators',
      icon: <ArrowRight className="w-6 h-6 text-red-500" />,
      color: 'bg-red-100',
      description:
        'Meta-programming and decorators are both techniques for modifying the behavior of code, but they serve different purposes and have different use cases. Meta-programming involves generating, modifying, or manipulating code, while decorators are a specific form of meta-programming that modify the behavior of functions or classes.',
      properties: [
        'Meta-programming: Generating, modifying, or manipulating code.',
        'Decorators: Modifying the behavior of functions or classes.',
        'Meta-programming != Decorators',
      ],
      useCases: [
        'Meta-programming: Dynamic code generation, automatic code optimization.',
        'Decorators: Logging, authentication, caching.',
      ],
      limitations: [
        'Overhead: Both meta-programming and decorators introduce some overhead in terms of managing tasks and communication.',
        'Complexity: Implementing and debugging meta-programming and decorators can be more complex.',
      ],
      code: `
# Meta-programming example: Generating a class dynamically
def create_class(name):
    return type(name, (object,), {})

MyClass = create_class('MyClass')
instance = MyClass()
print(instance)

# Decorator example: Modifying the behavior of a function
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
      `,
      diagramDescription:
        'This diagram compares the concepts of meta-programming and decorators, highlighting their differences and use cases.',
      modules: [
        {
          name: 'inspect',
          description: 'Provides functions to get information about live objects.',
        },
        {
          name: 'types',
          description: 'Defines names for some object types that are used by the interpreter.',
        },
        {
          name: 'functools',
          description: 'Provides higher-order functions that act on or return other functions.',
        },
        {
          name: 'decorator',
          description: 'A third-party library that simplifies the creation of decorators.',
        },
      ],
      concepts: [
        {
          name: 'Meta-programming',
          description: 'Generating, modifying, or manipulating code.',
        },
        {
          name: 'Decorators',
          description: 'Modifying the behavior of functions or classes.',
        },
        {
          name: 'Reflection',
          description: 'Inspecting and modifying the structure and behavior of a program at runtime.',
        },
        {
          name: 'Introspection',
          description: 'Examining the type or properties of an object at runtime.',
        },
        {
          name: 'Code Generation',
          description: 'Creating new code at runtime or compile-time.',
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
              <Code className="w-6 h-6 text-blue-500" />
              <h1 className="text-lg font-bold">
                Python Meta-Programming and Decorators
              </h1>
            </div>
          </div>
          <div className="p-4 mt-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700 text-xs text-base leading-relaxed">
              <strong className="text-blue-600">
                Python Meta-Programming and Decorators
              </strong>{' '}
              are advanced techniques for modifying the behavior of code. This visualizer explores various approaches to meta-programming and decorators in Python, including introspection, code generation, and advanced decorator patterns. It also highlights their practical use cases, limitations, and detailed examples.
            </p>
          </div>
        </div>
        <div className="p-6">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
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
                      : 'Use Cases'}
                  </h4>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {sections[currentSection].useCases.map((item, index) => (
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
                      : 'Limitations'}
                  </h4>
                  <ul className="space-y-2">
                    {sections[currentSection].limitations.map(
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

export default PythonMetaProgrammingDecoratorsVisualizer;
