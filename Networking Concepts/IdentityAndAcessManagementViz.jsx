import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Key,
  ShieldCheck,
  Fingerprint,
  ShieldAlert,
  Terminal,
  FileKey2,
  UserCog,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IAMVisualizer = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef([]);

  const sections = [
    {
      id: 1,
      name: 'Authentication',
      icon: <Key className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-500',
      description:
        'Authentication is the process of verifying the identity of a user, device, or system. It ensures that the entity attempting to access a resource is who they claim to be.',
      methods: [
        'Password-based Authentication',
        'Multi-factor Authentication (MFA)',
        'Biometric Authentication',
        'Token-based Authentication',
        'Single Sign-On (SSO)',
        'Certificate-based Authentication',
      ],
      examples: [
        'Entering a username and password to log in to a website.',
        'Receiving a one-time code via SMS to verify a login attempt.',
        'Using a fingerprint or facial recognition to unlock a device.',
        'Using an OAuth token to access a third-party API.',
        'Logging in once to access multiple applications (SSO).',
        'Using a digital certificate to authenticate a device or user.',
      ],
      bestPractices: [
        'Use strong, unique passwords and enforce password complexity requirements.',
        'Implement multi-factor authentication for sensitive accounts.',
        'Regularly rotate passwords and API keys.',
        'Use secure authentication protocols (e.g., OAuth 2.0, SAML).',
        'Monitor login attempts and detect suspicious activity.',
        'Store passwords securely using hashing and salting.',
      ],
    },
    {
      id: 2,
      name: 'Authorization',
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      color: 'bg-green-500',
      description:
        'Authorization is the process of granting or denying access to specific resources based on the authenticated identity. It determines what actions a user is allowed to perform.',
      models: [
        'Role-Based Access Control (RBAC)',
        'Attribute-Based Access Control (ABAC)',
        'Discretionary Access Control (DAC)',
        'Mandatory Access Control (MAC)',
        'Policy-Based Access Control (PBAC)',
      ],
      examples: [
        'A user with the "editor" role being able to modify documents.',
        'Access to a resource being granted based on the user\'s department and location.',
        'A file owner granting read or write permissions to specific users.',
        'Access to classified information being restricted to users with a specific clearance level.',
        'Access being granted based on predefined policies and rules.',
      ],
      bestPractices: [
        'Follow the principle of least privilege (PoLP).',
        'Regularly review and update access permissions.',
        'Use a centralized authorization system.',
        'Audit access logs to detect unauthorized access attempts.',
        'Implement strong separation of duties.',
        'Define clear access control policies and procedures.',
      ],
    },
    {
      id: 3,
      name: 'Identity Management',
      icon: <User className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-500',
      description:
        'Identity Management (IdM) involves the creation, management, and deletion of user identities and their associated attributes. It provides a centralized way to manage user accounts and their lifecycle.',
      processes: [
        'User Provisioning',
        'User Deprovisioning',
        'Identity Synchronization',
        'Identity Governance',
        'Identity Federation',
      ],
      examples: [
        'Creating a new user account when an employee joins the company.',
        'Disabling or deleting user accounts when employees leave the organization.',
        'Synchronizing user identities between different systems.',
        'Implementing policies and processes for managing user identities.',
        'Enabling users to access resources across different organizations.',
      ],
      bestPractices: [
        'Automate user provisioning and deprovisioning processes.',
        'Use a centralized identity store.',
        'Implement identity lifecycle management policies.',
        'Regularly audit user accounts and their access rights.',
        'Use strong password policies and enforce password changes.',
        'Integrate identity management with other security systems.',
      ],
    },
    {
      id: 4,
      name: 'Access Management',
      icon: <Fingerprint className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-500',
      description:
        'Access Management controls access to resources and services by enforcing authorization policies and managing user sessions. It ensures that only authorized users can access specific resources.',
      components: [
        'Access Control Lists (ACLs)',
        'Security Groups',
        'Firewall Rules',
        'VPNs',
        'IAM Roles and Policies',
      ],
      examples: [
        'Defining ACLs to control access to files and folders.',
        'Creating security groups to manage access to cloud resources.',
        'Configuring firewall rules to restrict network traffic.',
        'Using VPNs to provide secure remote access.',
        'Defining IAM roles and policies to manage access to cloud services.',
      ],
      bestPractices: [
        'Regularly review and update access control policies.',
        'Use least privilege principles when granting access.',
        'Monitor access logs for suspicious activity.',
        'Implement multi-factor authentication for sensitive resources.',
        'Use secure protocols for remote access (e.g., VPN, SSH).',
        'Automate access management tasks where possible.',
      ],
    },
    {
      id: 5,
      name: 'Auditing and Monitoring',
      icon: <ShieldAlert className="w-6 h-6 text-red-600" />,
      color: 'bg-red-500',
      description:
        'Auditing and monitoring involves tracking and logging security-related events and user activities. It provides visibility into access patterns, helps detect security incidents, and ensures compliance with regulations.',
      tools: [
        'Security Information and Event Management (SIEM)',
        'Intrusion Detection Systems (IDS)',
        'Intrusion Prevention Systems (IPS)',
        'Log Management Systems',
        'CloudTrail',
        'Azure Monitor',
      ],
      examples: [
        'Collecting and analyzing logs from various systems to detect security incidents.',
        'Monitoring network traffic for malicious activity.',
        'Detecting and blocking intrusion attempts.',
        'Managing and analyzing system logs for auditing purposes.',
        'Tracking user activity and API calls in cloud environments.',
        'Monitoring resource usage and performance in cloud platforms.',
      ],
      bestPractices: [
        'Implement centralized logging and monitoring.',
        'Regularly review audit logs and security alerts.',
        'Define clear incident response procedures.',
        'Use automated tools for threat detection and analysis.',
        'Ensure compliance with relevant regulations (e.g., GDPR, HIPAA).',
        'Conduct regular security audits and assessments.',
      ],
    },
    {
      id: 6,
      name: 'Privileged Access Management',
      icon: <Terminal className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-500',
      description:
        'Privileged Access Management (PAM) focuses on securing and managing accounts with elevated privileges, such as administrator accounts. It helps prevent unauthorized access and misuse of privileged accounts.',
      practices: [
        'Just-in-Time (JIT) Access',
        'Just Enough Administration (JEA)',
        'Privileged Session Management',
        'Password Vaulting',
        'Privileged Account Discovery',
        'Privileged Behavior Analytics',
      ],
      examples: [
        'Granting temporary access to an administrator account only when needed.',
        'Restricting administrator privileges to specific tasks and commands.',
        'Monitoring and recording privileged sessions.',
        'Storing privileged account credentials securely in a vault.',
        'Discovering privileged accounts across the network.',
        'Analyzing privileged user behavior to detect anomalies.',
      ],
      bestPractices: [
        'Enforce strong password policies for privileged accounts.',
        'Use multi-factor authentication for privileged access.',
        'Regularly rotate privileged account credentials.',
        'Monitor and audit privileged account activity.',
        'Implement least privilege principles for privileged users.',
        'Automate privileged access management tasks.',
      ],
    },
    {
      id: 7,
      name: 'Governance and Compliance',
      icon: <FileKey2 className="w-6 h-6 text-pink-600" />,
      color: 'bg-pink-500',
      description:
        'IAM governance and compliance ensures that identity and access management practices align with organizational policies, industry standards, and regulatory requirements. It helps maintain security and reduce risk.',
      frameworks: [
        'ISO 27001',
        'NIST Cybersecurity Framework',
        'GDPR',
        'HIPAA',
        'SOX',
        'PCI DSS',
      ],
      examples: [
        'Implementing security controls to comply with ISO 27001 standards.',
        'Following NIST guidelines for cybersecurity risk management.',
        'Ensuring data protection and privacy in accordance with GDPR.',
        'Protecting patient health information as required by HIPAA.',
        'Maintaining financial reporting controls to comply with SOX.',
        'Securing payment card data according to PCI DSS standards.',
      ],
      bestPractices: [
        'Define clear IAM policies and procedures.',
        'Regularly assess IAM risks and vulnerabilities.',
        'Conduct regular security audits and compliance checks.',
        'Provide security awareness training to employees.',
        'Document IAM processes and controls.',
        'Stay up-to-date with relevant regulations and standards.',
      ],
    },
  ];

  useEffect(() => {
    // Preload images for smoother transitions (optional)
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
      const offset = 100; // Adjust this value for desired offset
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-mono bg-gray-50 p-4">
      <div className="max-w-auto mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <UserCog className="w-6 h-6 text-blue-500" />
            <h1 className="text-lg font-bold">
              Identity and Access Management (IAM)
            </h1>
          </div>
          {/* IAM Introduction */}
          <div className="p-4 mt-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700 text-xs text-base leading-relaxed">
              <strong className="text-blue-600">
                Identity and Access Management (IAM)
              </strong>{' '}
              is a critical framework of policies and technologies that ensures
              the right individuals have the appropriate access to technology
              resources. It plays a vital role in securing sensitive data and
              systems by controlling user identities, their access rights, and
              activities. This interactive visualizer will guide you through the
              core concepts of IAM, including Authentication, Authorization,
              Identity Management, Access Management, Auditing, Privileged
              Access Management, and Governance & Compliance.
            </p>
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          {/* Section Buttons */}
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
                    ? `${section.color} text-white shadow-lg`
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

          {/* Section Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Description */}
              <div ref={(el) => (sectionRef.current[currentSection] = el)} className="space-y-4">
                <div
                  className={`rounded-lg p-4 ${sections[
                    currentSection
                  ].color.replace('500', '100')}`}
                >
                  <h3 className="font-semibold text-md mb-2">
                    {sections[currentSection].name}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {sections[currentSection].description}
                  </p>
                </div>

                {/* Key Methods/Models */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-md">
                    Key{' '}
                    {currentSection === 0
                      ? 'Methods'
                      : currentSection === 1
                      ? 'Models'
                      : currentSection === 2
                      ? 'Processes'
                      : currentSection === 3
                      ? 'Components'
                      : currentSection === 4
                      ? 'Tools'
                      : currentSection === 5
                      ? 'Practices'
                      : 'Frameworks'}
                  </h4>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {(sections[currentSection].methods ||
                      sections[currentSection].models ||
                      sections[currentSection].processes ||
                      sections[currentSection].components ||
                      sections[currentSection].tools ||
                      sections[currentSection].practices ||
                      sections[currentSection].frameworks)
                      .map((item, index) => (
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

              {/* Examples & Best Practices */}
              <div className="space-y-4">
                {/* Examples */}
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
                          className={`w-2 h-2 rounded-full ${sections[currentSection].color}`}
                        />
                        <span>{example}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Best Practices */}
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
                            className={`w-2 h-2 rounded-full ${sections[currentSection].color}`}
                          />
                          <span>{practice}</span>
                        </motion.li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Visual Representation (Image/Animation) */}
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-full max-w-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IAMVisualizer;