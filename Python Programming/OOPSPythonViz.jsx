import React, { useState, useEffect, useRef } from 'react';
import {
    Code,
    GitBranch,
    Shapes,
    Lock,
    Layers,
    Puzzle,
    Users,
    Copy,
    Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const PythonOOPVisualizer = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(null);
    const sectionRef = useRef([]);
    const imgRef = useRef(null);
    const [imageLoading, setImageLoading] = useState(true);


    const sections = [
        {
            id: 1,
            name: 'Classes and Objects',
            icon: <Code className="w-6 h-6 text-blue-500" />,
            color: 'bg-blue-100',
            description:
                'In Python, a class is a blueprint for creating objects, which are instances of the class. Classes define the properties (attributes) and behaviors (methods) that objects of that class will have. Objects are specific realizations of these blueprints, allowing you to manipulate data based on the defined structure. It is fundamental for modeling real-world entities in a program.',
            properties: ['Attributes', 'Methods', 'Constructor', 'Instance'],
            operations: ['Instantiation', 'Method Call', 'Attribute Access'],
            examples: [
                'Creating a class: class Dog',
                'Creating an object: my_dog = Dog()',
                'Accessing attributes: my_dog.name',
                'Calling methods: my_dog.bark()',
            ],
            bestPractices: [
                'Use classes to model real-world entities.',
                'Use __init__ for initialization.',
                'Use self to access instance attributes and methods.',
            ],
            code: [
                {
                   title: "Defining a simple class:",
                   content:`
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        print(f"{self.name} woof!")
`,
                },
                {
                   title: "Creating an Object (instance):",
                   content:`
# Creating an object
my_dog = Dog("Buddy", 3)
`,
                },
                {
                    title: "Accessing Attributes and Calling methods:",
                    content:`
# Accessing attributes
print(my_dog.name)

# Calling methods
my_dog.bark()
`,
                 },

            ],
        },
        {
            id: 2,
            name: 'Inheritance',
            icon: <GitBranch className="w-6 h-6 text-green-500" />,
            color: 'bg-green-100',
            description:
                'Inheritance enables a class (the subclass or derived class) to inherit the properties and methods from another class (the superclass or base class). This promotes code reusability, prevents duplication and sets up a hierarchy, making it easier to manage related classes with some common functionality or attributes.',
            properties: ['Base Class', 'Derived Class', 'Method Overriding'],
            operations: ['Inheriting', 'Overriding Methods', 'Accessing Base Class'],
            examples: [
                'Base class: Animal',
                'Derived class: Dog',
                'Overriding methods: def bark(self)',
            ],
            bestPractices: [
                'Use inheritance for code reusability.',
                'Override methods to provide specific implementations.',
                'Use super() to call base class methods.',
            ],
            code: [
              {
                  title: "Creating Base Class:",
                  content: `
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        pass
`,
                },
                {
                 title: "Inheriting from Base Class and Overriding method:",
                  content: `
class Dog(Animal):
    def speak(self):
        return f"{self.name} woof!"
`,
              },
              {
                  title: "Instantiating and Using Objects",
                  content: `
# Creating an object
my_dog = Dog("Buddy")

# Calling overridden method
print(my_dog.speak())
`,
              },

            ],
        },
        {
            id: 3,
            name: 'Polymorphism',
            icon: <Shapes className="w-6 h-6 text-yellow-500" />,
            color: 'bg-yellow-100',
            description:
                'Polymorphism (meaning "many forms") is the ability of different classes to respond to the same method call in their own way. This allows you to work with objects of different classes in a uniform manner, often through inheritance or interface implementations. It enhances the code by giving different actions to the same method depending on which object has called it.',
            properties: ['Method Overriding', 'Method Overloading'],
            operations: ['Overriding', 'Overloading'],
            examples: [
                'Overriding: def speak(self)',
                'Overloading: def add(self, a, b, c=0)',
            ],
            bestPractices: [
                'Use polymorphism for flexibility.',
                'Override methods to provide specific implementations.',
                'Use default arguments for method overloading.',
            ],
            code: [
                {
                    title: "Base Class and derived classes with Overrided Methods:",
                    content:`
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"
`,
                },
                {
                    title: "Using Polymorphism",
                    content: `
# Polymorphism in action
def make_animal_speak(animal):
    print(animal.speak())

# Creating objects
my_dog = Dog()
my_cat = Cat()
`,
                },
                {
                   title: "Calling Polymorphic method",
                   content: `
# Calling polymorphic method
make_animal_speak(my_dog)
make_animal_speak(my_cat)
`,
               },

            ],
        },
        {
            id: 4,
            name: 'Encapsulation',
            icon: <Lock className="w-6 h-6 text-orange-500" />,
            color: 'bg-orange-100',
            description:
                'Encapsulation is the bundling of data (attributes) and methods that operate on that data within a single unit (a class), hiding the internal details from the outside world. It protects the integrity of data by restricting direct access and provides controlled access through public methods (getters and setters). Encapsulation leads to better organized code, improves maintainability and security of class structures.',
            properties: ['Private Attributes', 'Public Methods', 'Getters and Setters'],
            operations: ['Accessing Private Attributes', 'Using Getters and Setters'],
            examples: [
                'Private attribute: __name',
                'Getter: def get_name(self)',
                'Setter: def set_name(self, name)',
            ],
            bestPractices: [
                'Use encapsulation to protect data.',
                'Use getters and setters for controlled access.',
                'Use private attributes for internal data.',
            ],
              code: [
                {
                  title: "Implementing Encapsulation using private variables, setters, and getters.",
                  content:`
class Person:
    def __init__(self, name):
        # Private attribute
        self.__name = name  

    def get_name(self):
        return self.__name

    def set_name(self, name):
        self.__name = name
`
                },
                {
                    title: "Instantiating an object",
                    content:`
# Creating an object
person = Person("Alice")
`,
                  },
                {
                    title: "Accessing data using getters and setters",
                  content:`
# Accessing private attribute using getter
print(person.get_name())

# Setting private attribute using setter
person.set_name("Bob")
print(person.get_name())
`,
              }

            ],
        },
        {
            id: 5,
            name: 'Abstraction',
            icon: <Layers className="w-6 h-6 text-red-500" />,
            color: 'bg-red-100',
            description:
                'Abstraction focuses on showing essential information while hiding unnecessary complex implementation details. Abstract classes and methods provide a high-level blueprint, emphasizing what an object should do rather than how it achieves it. Abstraction enhances modularity, making the code simpler and easier to understand, leading to better design patterns and reduced overall code complexity.',
            properties: ['Abstract Base Classes', 'Abstract Methods'],
            operations: ['Defining Abstract Methods', 'Inheriting from ABC'],
            examples: [
                'Abstract base class: Shape',
                'Abstract method: def area(self)',
            ],
            bestPractices: [
                'Use abstraction to hide complexity.',
                'Define abstract methods in base classes.',
                'Use the abc module for abstract base classes.',
            ],
             code: [
                {
                    title: "Defining Abstract base class",
                    content:`
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
`
                 },
                 {
                    title: "Inheriting and Implementing the abstract method",
                   content: `
class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14 * self.radius * self.radius
`
                 },
                 {
                     title: "Using the Abstract Implementation",
                     content: `
# Creating an object
circle = Circle(5)

# Calling abstract method
print(circle.area())
`
                 }
             ],
        },
        {
            id: 6,
            name: 'Composition',
            icon: <Puzzle className="w-6 h-6 text-pink-500" />,
            color: 'bg-pink-100',
            description:
                'Composition is a design principle in which classes "have-a" relationship with each other (through a containing relationship) . It promotes code reuse by incorporating functionality through object aggregation, making programs more flexible and less tightly coupled compared to inheritance. It allows for dynamic behavior by choosing which concrete implementation to apply and prevents problems associated with deep hierarchies as it favors object assembly for achieving required functionality.',
            properties: ['Has-a Relationship', 'Component Classes'],
            operations: ['Composing Objects', 'Using Component Methods'],
            examples: [
                'Composing: class Engine',
                'Using: class Car',
            ],
            bestPractices: [
                'Use composition for flexibility.',
                'Compose objects to build complex structures.',
                'Prefer composition over inheritance for has-a relationships.',
            ],
             code: [
                {
                   title: "Composing a class (Engine):",
                  content:`
class Engine:
    def start(self):
        return "Engine started"
`
                },
                 {
                    title: "Using the composed class (Car):",
                   content: `
class Car:
    def __init__(self):
        self.engine = Engine()

    def start(self):
        return self.engine.start()
`
                },
                {
                   title: "Instantiating Car class",
                  content: `
# Creating an object
my_car = Car()

# Using composed method
print(my_car.start())
`
                },
            ],
        },
        {
            id: 7,
            name: 'Aggregation',
            icon: <Users className="w-6 h-6 text-purple-500" />,
            color: 'bg-purple-100',
            description:
                'Aggregation is a specialized form of association that represents a "whole-part" relationship between classes. However, unlike composition, it shows a weaker coupling. Both the whole class (e.g Department) and the part class (e.g. Employee) can have their own lifetime and are not directly dependent on each other and can exist independently. Aggregation allows to form more robust and modular systems, and facilitates flexible relationships that do not introduce tight coupling.',
            properties: ['Whole-Part Relationship', 'Independent Lifecycle'],
            operations: ['Aggregating Objects', 'Using Aggregated Methods'],
            examples: [
                'Aggregating: class Department',
                'Using: class Employee',
            ],
            bestPractices: [
                'Use aggregation for whole-part relationships.',
                'Aggregate objects with independent lifecycles.',
                'Prefer aggregation for loose coupling.',
            ],
            code: [
                {
                   title: "Creating Aggregated Class (Department)",
                  content:`
class Department:
    def __init__(self, name):
        self.name = name
        self.employees = []

    def add_employee(self, employee):
        self.employees.append(employee)
`
                },
                {
                  title: "Class which will be used to aggragate (Employee)",
                  content: `
class Employee:
    def __init__(self, name):
        self.name = name
`
                },
                {
                  title: "Aggregating the Employee objects",
                    content: `
# Creating objects
department = Department("Engineering")
employee = Employee("Alice")

# Aggregating objects
department.add_employee(employee)

# Using aggregated method
print(department.employees[0].name)
`
                }
            ],
        },
    ];

    useEffect(() => {
        const handleImageLoad = () => {
            setImageLoading(false);
            if (imgRef.current) {
                imgRef.current.alt = `Illustration of ${sections[currentSection].name}`;
            }
        }
        const handleImageError = () => {
            setImageLoading(false);
            if (imgRef.current) {
                imgRef.current.alt = `Error loading image for ${sections[currentSection].name} `;
            }
        }


        const img = new Image();
        img.src = `/${sections[currentSection].name.toLowerCase().replace(/\s+/g, '-')}.png`;
        setImageLoading(true);
        img.onload = handleImageLoad;
        img.onerror = handleImageError;


    }, [currentSection, sections]);


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
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                        <Code className="w-6 h-6 text-blue-500" />
                        <h1 className="text-lg font-bold">
                            Python Object-Oriented Programming
                        </h1>
                    </div>
                    <div className="p-4 mt-4 bg-gray-100 rounded-lg">
                        <p className="text-gray-700 text-xs text-base leading-relaxed">
                            <strong className="text-blue-600">Python OOP </strong>
                            is fundamental for organizing and managing data. This
                            visualizer will introduce common OOP concepts essential for
                            programming in Python like classes, inheritance, polymorphism,
                            encapsulation, abstraction, composition, and aggregation.
                        </p>
                    </div>
                </div>
                <div className="p-6">
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
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
                                        {sections[currentSection].properties.map(
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
                                        {sections[currentSection].operations.map(
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
                           <div className="bg-gray-50 rounded-lg p-4 relative">
                                   <h4 className="font-bold mb-2 text-md">Code Samples</h4>
                                 <div className="space-y-4">
                                { sections[currentSection].code.map((code,index)=>
                                    (
                                      <div key={index}>
                                        <h4 className="font-bold text-sm text-gray-600">{code.title}</h4>
                                      <CopyToClipboard text={code.content} onCopy={handleCopy}>
                                              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                                                  {copyFeedback === 'Copied!' ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/> }
                                              </button>
                                      </CopyToClipboard>
                                      <SyntaxHighlighter language="python" style={docco} customStyle={{ fontSize: '10px' }}>
                                          {code.content}
                                      </SyntaxHighlighter>
                                      </div>
                                    ))
                                   }
                                 </div>

                           </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PythonOOPVisualizer;