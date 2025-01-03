import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Cloud,
  Database,
  Server,
  HardDrive,
  Clock,
  DollarSign,
  Zap,
  Globe,
  Lock,
  Boxes,
  FileText,
  Share2,
  Search,
  CheckCircle,
  XCircle,
  ArrowRight,
  Cpu,
  Info,
  KeyRound,
  SlidersHorizontal,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RangeSlider = ({ min, max, step = 1, unit = '', value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const { name, value: inputValue } = e.target;
    setSliderValue((prev) => ({ ...prev, [name]: parseFloat(inputValue) }));
  };

  const handleSliderChange = (e) => {
    const { name, value: inputValue } = e.target;
    setSliderValue((prev) => ({ ...prev, [name]: parseFloat(inputValue) }));
    onChange({ ...sliderValue, [name]: parseFloat(inputValue) });
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">
        {min} {unit}
      </span>
      <motion.input
        type="range"
        name="min"
        min={min}
        max={max}
        step={step}
        value={sliderValue.min}
        onChange={handleSliderChange}
        className="flex-1"
      />
      <motion.input
        type="range"
        name="max"
        min={min}
        max={max}
        step={step}
        value={sliderValue.max}
        onChange={handleSliderChange}
        className="flex-1"
      />
      <span className="text-sm text-gray-600">
        {max} {unit}
      </span>
    </div>
  );
};

const GCPStorageViz = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [activeItem, setActiveItem] = useState('cloud-storage');
  const [hoveredItem, setHoveredItem] = useState(null);
  const detailRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    services: {
      maxSize: { min: 0, max: 100, unit: 'TB' },
      latency: { options: ['Milliseconds', 'Sub-millisecond', 'Microseconds'], selected: [] },
      scalability: { options: ['Exabytes+', 'Automatic scaling', 'Dynamic resizing', 'Instance-bound'], selected: [] },
    },
    classes: {
      durability: { min: 99.9, max: 99.999999999, step: 0.000000001, unit: '%' },
      availability: { min: 99, max: 99.99, step: 0.01, unit: '%' },
      minDuration: { options: ['No minimum', '30 days', '90 days', '365 days'], selected: [] },
    },
  });

  const [filteredData, setFilteredData] = useState({});

  const storageServices = {
    'cloud-storage': {
      name: 'Cloud Storage',
      icon: <Cloud className="w-8 h-8 text-blue-500" />,
      description:
        'Object storage service for unstructured data like images, videos, and backups.',
      features: [
        {
          name: 'Global edge network',
          icon: <Globe className="w-4 h-4 text-blue-500" />,
          description:
            'Data is cached at edge locations for faster access worldwide.',
        },
        {
          name: 'Strong consistency',
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          description:
            'Immediate consistency for read-after-write and read-after-update operations.',
        },
        {
          name: 'Object lifecycle management',
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          description:
            'Automate data lifecycle policies (e.g., move to colder storage).',
        },
        {
          name: 'Integrated with BigQuery',
          icon: <Search className="w-4 h-4 text-purple-500" />,
          description:
            'Directly query Cloud Storage data using BigQuery without data movement.',
        },
        {
          name: 'IAM & encryption controls',
          icon: <Lock className="w-4 h-4 text-gray-600" />,
          description:
            'Granular access control and data encryption at rest and in transit.',
        },
      ],
      specs: {
        maxSize: 'No object size limit',
        latency: 'Milliseconds',
        scalability: 'Exabytes+',
        pricing: 'Pay per use',
      },
      useCases: [
        'Static website hosting',
        'Data lakes',
        'Content delivery',
        'Backup and archive',
      ],
    },
    'filestore': {
      name: 'Filestore',
      icon: <FileText className="w-8 h-8 text-green-500" />,
      description:
        'Fully managed file storage service with a Network File System (NFS) interface.',
      features: [
        {
          name: 'High performance',
          icon: <Zap className="w-4 h-4 text-yellow-500" />,
          description: 'Optimized for high throughput and low latency.',
        },
        {
          name: 'Shared file system',
          icon: <Share2 className="w-4 h-4 text-blue-500" />,
          description:
            'Multiple virtual machines (VMs) can access the same file system.',
        },
        {
          name: 'Native integration with GKE',
          icon: <Boxes className="w-4 h-4 text-purple-500" />,
          description:
            'Seamlessly integrate with Google Kubernetes Engine (GKE) for containerized applications.',
        },
        {
          name: 'Automatic backup',
          icon: <Database className="w-4 h-4 text-green-500" />,
          description: 'Automated backups for data protection.',
        },
        {
          name: 'Snapshot support',
          icon: <HardDrive className="w-4 h-4 text-gray-500" />,
          description: 'Create point-in-time snapshots of your file system.',
        },
      ],
      specs: {
        maxSize: 'Up to 100TB per instance',
        latency: 'Sub-millisecond',
        scalability: 'Automatic scaling',
        pricing: 'Per GB provisioned',
      },
      useCases: [
        'Media rendering',
        'Electronic Design Automation',
        'Web serving',
        'Application migrations',
      ],
    },
    'persistent-disk': {
      name: 'Persistent Disk',
      icon: <HardDrive className="w-8 h-8 text-purple-500" />,
      description:
        'Durable and high-performance block storage for virtual machine (VM) instances.',
      features: [
        {
          name: 'Snapshots & backups',
          icon: <HardDrive className="w-4 h-4 text-gray-500" />,
          description:
            'Create snapshots and backups for data protection and recovery.',
        },
        {
          name: 'Multi-reader support',
          icon: <Share2 className="w-4 h-4 text-blue-500" />,
          description:
            'Multiple VMs can read from the same Persistent Disk (read-only).',
        },
        {
          name: 'Regional persistence',
          icon: <Globe className="w-4 h-4 text-blue-500" />,
          description:
            'Data is replicated across multiple zones within a region for high availability.',
        },
        {
          name: 'Performance scaling',
          icon: <Zap className="w-4 h-4 text-yellow-500" />,
          description:
            'Adjust disk performance (IOPS and throughput) based on your needs.',
        },
        {
          name: 'Encryption at rest',
          icon: <Lock className="w-4 h-4 text-gray-600" />,
          description: 'Data is automatically encrypted at rest.',
        },
      ],
      specs: {
        maxSize: 'Up to 64TB per disk',
        latency: 'Consistent performance',
        scalability: 'Dynamic resizing',
        pricing: 'Per GB provisioned',
      },
      useCases: [
        'Database storage',
        'VM root disks',
        'Data warehousing',
        'Enterprise applications',
      ],
    },
    'local-ssd': {
      name: 'Local SSD',
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      description:
        'High-performance, transient, local block storage physically attached to the virtual machine.',
      features: [
        {
          name: 'Ultra-low latency',
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          description: 'Extremely low latency due to direct physical attachment.',
        },
        {
          name: 'High IOPS',
          icon: <Cpu className="w-4 h-4 text-red-500" />,
          description: 'Delivers very high Input/Output Operations Per Second.',
        },
        {
          name: 'Ephemeral storage',
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          description: 'Data is not persistent; it is lost when the VM is stopped.',
        },
        {
          name: 'Per-instance scaling',
          icon: <ArrowRight className="w-4 h-4 text-blue-500" />,
          description: 'Local SSD capacity scales with the VM instance size.',
        },
        {
          name: 'Hardware encryption',
          icon: <KeyRound className="w-4 h-4 text-gray-600" />,
          description: 'Data is encrypted at the hardware level.',
        },
      ],
      specs: {
        maxSize: 'Up to 9TB per instance',
        latency: 'Microseconds',
        scalability: 'Instance-bound',
        pricing: 'Per GB per hour',
      },
      useCases: [
        'High-performance databases',
        'Real-time analytics',
        'Gaming servers',
        'Cache layers',
      ],
    },
    'cloud-sql': {
      name: 'Cloud SQL',
      icon: <Database className="w-8 h-8 text-blue-500" />,
      description:
        'Fully managed relational database service for MySQL, PostgreSQL, and SQL Server.',
      features: [
        {
          name: 'High availability',
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          description: 'Automatic failover and replication for high availability.',
        },
        {
          name: 'Automated backups',
          icon: <Database className="w-4 h-4 text-green-500" />,
          description: 'Automated backups and point-in-time recovery.',
        },
        {
          name: 'Scalability',
          icon: <SlidersHorizontal className="w-4 h-4 text-blue-500" />,
          description: 'Easily scale up or down based on your needs.',
        },
        {
          name: 'Integrated with GCP',
          icon: <Boxes className="w-4 h-4 text-purple-500" />,
          description: 'Seamless integration with other Google Cloud services.',
        },
        {
          name: 'Security',
          icon: <Lock className="w-4 h-4 text-gray-600" />,
          description: 'Data encryption at rest and in transit.',
        },
      ],
      specs: {
        maxSize: 'Up to 30TB per instance',
        latency: 'Milliseconds',
        scalability: 'Automatic scaling',
        pricing: 'Per GB provisioned',
      },
      useCases: [
        'Web applications',
        'E-commerce platforms',
        'Enterprise applications',
        'Data warehousing',
      ],
    },
    'cloud-spanner': {
      name: 'Cloud Spanner',
      icon: <Database className="w-8 h-8 text-purple-500" />,
      description:
        'Globally distributed, horizontally scalable, and strongly consistent database service.',
      features: [
        {
          name: 'Global distribution',
          icon: <Globe className="w-4 h-4 text-blue-500" />,
          description: 'Data is replicated across multiple regions for global availability.',
        },
        {
          name: 'Strong consistency',
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          description: 'Strong consistency for read-after-write and read-after-update operations.',
        },
        {
          name: 'Horizontal scalability',
          icon: <SlidersHorizontal className="w-4 h-4 text-blue-500" />,
          description: 'Easily scale horizontally to handle large datasets.',
        },
        {
          name: 'Integrated with GCP',
          icon: <Boxes className="w-4 h-4 text-purple-500" />,
          description: 'Seamless integration with other Google Cloud services.',
        },
        {
          name: 'Security',
          icon: <Lock className="w-4 h-4 text-gray-600" />,
          description: 'Data encryption at rest and in transit.',
        },
      ],
      specs: {
        maxSize: 'No limit',
        latency: 'Milliseconds',
        scalability: 'Horizontal scaling',
        pricing: 'Per node per hour',
      },
      useCases: [
        'Global applications',
        'Financial services',
        'Retail',
        'Gaming',
      ],
    },
    'bigquery': {
      name: 'BigQuery',
      icon: <Search className="w-8 h-8 text-blue-500" />,
      description:
        'Serverless, highly scalable, and cost-effective multi-cloud data warehouse designed for business agility.',
      features: [
        {
          name: 'Serverless',
          icon: <Cloud className="w-4 h-4 text-blue-500" />,
          description: 'No need to manage infrastructure.',
        },
        {
          name: 'High performance',
          icon: <Zap className="w-4 h-4 text-yellow-500" />,
          description: 'Optimized for high throughput and low latency.',
        },
        {
          name: 'Scalability',
          icon: <SlidersHorizontal className="w-4 h-4 text-blue-500" />,
          description: 'Easily scale to handle large datasets.',
        },
        {
          name: 'Integrated with GCP',
          icon: <Boxes className="w-4 h-4 text-purple-500" />,
          description: 'Seamless integration with other Google Cloud services.',
        },
        {
          name: 'Security',
          icon: <Lock className="w-4 h-4 text-gray-600" />,
          description: 'Data encryption at rest and in transit.',
        },
      ],
      specs: {
        maxSize: 'No limit',
        latency: 'Milliseconds',
        scalability: 'Automatic scaling',
        pricing: 'Per query',
      },
      useCases: [
        'Data analytics',
        'Machine learning',
        'Business intelligence',
        'Data warehousing',
      ],
    },
  };

  const storageClasses = {
    standard: {
      name: 'Standard Storage',
      icon: <Cloud className="w-8 h-8 text-blue-500" />,
      description:
        'Best for "hot" data that is frequently accessed. Offers highest availability.',
      features: [
        {
          name: 'No retrieval costs',
          icon: <DollarSign className="w-4 h-4 text-green-500" />,
          description: 'You only pay for storage; no charges for data retrieval.',
        },
        {
          name: 'Low-latency access',
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          description: 'Data is quickly accessible with minimal delay.',
        },
        {
          name: 'Global availability',
          icon: <Globe className="w-4 h-4 text-blue-500" />,
          description: 'Data is accessible from anywhere in the world.',
        },
        {
          name: 'Automatic redundancy',
          icon: <Boxes className="w-4 h-4 text-purple-500" />,
          description: 'Data is automatically replicated to ensure durability.',
        },
      ],
      specs: {
        durability: '99.999999999%',
        availability: '99.99%',
        minDuration: 'No minimum',
        pricing: '$0.020 per GB/month',
      },
      useCases: [
        'Website content',
        'Streaming media',
        'Mobile applications',
        'Gaming assets',
      ],
    },
    nearline: {
      name: 'Nearline Storage',
      icon: <Database className="w-8 h-8 text-green-500" />,
      description:
        'Ideal for data accessed less frequently, about once per month, such as backups and long-tail multimedia content.',
      features: [
        {
          name: 'Low-cost storage option',
          icon: <DollarSign className="w-4 h-4 text-green-500" />,
          description: 'Significantly lower storage cost compared to Standard.',
        },
        {
          name: 'Data retrieval costs apply',
          icon: <DollarSign className="w-4 h-4 text-red-500" />,
          description: 'You are charged for retrieving data.',
        },
        {
          name: 'Higher latency than Standard',
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          description: 'Slightly longer delay when accessing data.',
        },
        {
          name: 'Ideal for backups',
          icon: <Database className="w-4 h-4 text-green-500" />,
          description:
            'Cost-effective solution for storing backups that are accessed infrequently.',
        },
      ],
      specs: {
        durability: '99.999999999%',
        availability: '99.9%',
        minDuration: '30 days',
        pricing: '$0.010 per GB/month',
      },
      useCases: [
        'Monthly backups',
        'Data archives',
        'Disaster recovery',
        'Long-tail content',
      ],
    },
    coldline: {
      name: 'Coldline Storage',
      icon: <Server className="w-8 h-8 text-purple-500" />,
      description:
        'Suitable for data accessed infrequently, about once per quarter, like archived data and disaster recovery.',
      features: [
        {
          name: 'Very low-cost storage',
          icon: <DollarSign className="w-4 h-4 text-green-500" />,
          description: 'Lower storage cost compared to Nearline.',
        },
        {
          name: 'Higher retrieval costs',
          icon: <DollarSign className="w-4 h-4 text-red-500" />,
          description: 'Retrieving data is more expensive than Nearline.',
        },
        {
          name: 'Quarterly access pattern',
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          description: 'Optimized for data accessed about once every three months.',
        },
        {
          name: 'Good for archived data',
          icon: <HardDrive className="w-4 h-4 text-gray-500" />,
          description:
            'Cost-effective for storing data that needs to be retained but is rarely accessed.',
        },
      ],
      specs: {
        durability: '99.999999999%',
        availability: '99.9%',
        minDuration: '90 days',
        pricing: '$0.004 per GB/month',
      },
      useCases: [
        'Quarterly backups',
        'Long-term archives',
        'Historical data',
        'Compliance archives',
      ],
    },
    archive: {
      name: 'Archive Storage',
      icon: <HardDrive className="w-8 h-8 text-gray-500" />,
      description:
        'Designed for data accessed once a year or less, ideal for long-term data retention and compliance.',
      features: [
        {
          name: 'Lowest-cost storage option',
          icon: <DollarSign className="w-4 h-4 text-green-500" />,
          description: 'The most affordable storage class for rarely accessed data.',
        },
        {
          name: 'Highest retrieval costs',
          icon: <DollarSign className="w-4 h-4 text-red-500" />,
          description: 'Retrieving data is the most expensive among all classes.',
        },
        {
          name: 'Annual access pattern',
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          description: 'Optimized for data accessed once a year or less.',
        },
        {
          name: 'Best for cold archives',
          icon: <HardDrive className="w-4 h-4 text-gray-500" />,
          description:
            'Ideal for storing data that must be preserved for extended periods but is rarely needed.',
        },
      ],
      specs: {
        durability: '99.999999999%',
        availability: '99.9%',
        minDuration: '365 days',
        pricing: '$0.0012 per GB/month',
      },
      useCases: [
        'Long-term retention',
        'Regulatory compliance',
        'Historical records',
        'Digital preservation',
      ],
    }
  };

  const applyFilters = useCallback(() => {
    const dataToFilter = activeTab === 'services' ? storageServices : storageClasses;

    const filtered = Object.entries(dataToFilter).filter(([key, item]) => {
      const itemSpecs = item.specs;

      // Check each filter category
      for (const filterCategory in filters[activeTab]) {
        const filter = filters[activeTab][filterCategory];

        if (filter.min !== undefined && filter.max !== undefined) {
          // Handle range filters (e.g., maxSize, durability, availability)

          // Convert maxSize to TB for comparison if necessary
          let itemValue = itemSpecs[filterCategory];
          if (filterCategory === 'maxSize' && typeof itemValue === 'string' && itemValue.includes('TB')) {
            itemValue = parseFloat(itemValue);
          } else if (filterCategory === 'maxSize' && typeof itemValue === 'string' && itemValue.includes('GB')) {
            itemValue = parseFloat(itemValue) / 1000;
          } else if (filterCategory === 'maxSize' && itemValue === 'No object size limit'){
            itemValue = Infinity;
          } else if (typeof itemValue === 'string'){
            itemValue = parseFloat(itemValue);
          }

          if (itemValue < filter.min || itemValue > filter.max) {
            return false;
          }
        } else if (filter.options) {
          // Handle select/multiselect filters (e.g., latency, scalability, minDuration)
          if (filter.selected.length > 0 && !filter.selected.includes(itemSpecs[filterCategory])) {
            return false;
          }
        }
      }

      return true; // Include the item if it passes all filter checks
    });

    setFilteredData(Object.fromEntries(filtered));
  }, [activeTab, filters, storageClasses, storageServices]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, activeTab]);

  const handleFilterChange = (category, filterValues) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [activeTab]: {
        ...prevFilters[activeTab],
        [category]: filterValues,
      },
    }));
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const InfoCard = ({ label, value }) => (
    <motion.div
      className="bg-white rounded-lg p-4 shadow-sm"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 500 }}
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-medium mt-1">{value}</div>
    </motion.div>
  );

  const FeatureItem = ({ feature }) => (
    <motion.div
      className="flex items-center py-2 border-b last:border-b-0"
      whileHover={{ x: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full mr-3">
        {feature.icon}
      </div>
      <div>
        <div className="font-medium">{feature.name}</div>
        <div className="text-sm text-gray-600">{feature.description}</div>
      </div>
    </motion.div>
  );

  const UseCaseItem = ({ useCase }) => (
    <motion.div
      className="flex items-center py-2 border-b last:border-b-0"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
      <span>{useCase}</span>
    </motion.div>
  );

  const data = activeTab === 'services' ? storageServices : storageClasses;
  const displayData = filteredData && Object.keys(filteredData).length > 0 ? filteredData : data;
  const activeData = data[activeItem];

  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeItem]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <div className="flex flex-wrap justify-center space-x-4 mb-8">
        <motion.button
          onClick={() => {
            setActiveTab('services');
            setActiveItem('cloud-storage');
          }}
          className={`px-6 py-3 rounded-lg text-lg font-medium transition-all ${
            activeTab === 'services'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Storage Services
        </motion.button>
        <motion.button
          onClick={() => {
            setActiveTab('classes');
            setActiveItem('standard');
          }}
          className={`px-6 py-3 rounded-lg text-lg font-medium transition-all ${
            activeTab === 'classes'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Storage Classes
        </motion.button>

        <motion.button
          onClick={toggleFilter}
          className="relative px-6 py-3 rounded-lg text-lg font-medium bg-gray-100 hover:bg-gray-200 ml-4"
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-5 h-5 mr-2 inline" />
          Filters
          <ChevronDown
            className={`w-4 h-4 ml-2 inline transition-transform ${
              isFilterOpen ? 'rotate-180' : ''
            }`}
          />
        </motion.button>
      </div>
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="bg-gray-100 p-4 rounded-lg mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Max Size Filter (Services only) */}
              {activeTab === 'services' && (
                <div>
                  <h4 className="font-medium mb-2">Max Size</h4>
                  <RangeSlider
                    min={0}
                    max={100}
                    unit="TB"
                    value={filters.services.maxSize}
                    onChange={(value) => handleFilterChange('maxSize', value)}
                  />
                </div>
              )}

              {/* Latency Filter (Services only) */}
              {activeTab === 'services' && (
                <div>
                  <h4 className="font-medium mb-2">Latency</h4>
                  {filters.services.latency.options.map((option) => (
                    <motion.button
                      key={option}
                      className={`px-4 py-2 rounded-lg text-sm mr-2 mb-2 transition-all ${
                        filters.services.latency.selected.includes(option)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleFilterChange('latency', {
                          ...filters.services.latency,
                          selected: filters.services.latency.selected.includes(option)
                            ? filters.services.latency.selected.filter((item) => item !== option)
                            : [...filters.services.latency.selected, option],
                        })
                      }
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Scalability Filter (Services only) */}
              {activeTab === 'services' && (
                <div>
                  <h4 className="font-medium mb-2">Scalability</h4>
                  {filters.services.scalability.options.map((option) => (
                    <motion.button
                      key={option}
                      className={`px-4 py-2 rounded-lg text-sm mr-2 mb-2 transition-all ${
                        filters.services.scalability.selected.includes(option)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleFilterChange('scalability', {
                          ...filters.services.scalability,
                          selected: filters.services.scalability.selected.includes(option)
                            ? filters.services.scalability.selected.filter((item) => item !== option)
                            : [...filters.services.scalability.selected, option],
                        })
                      }
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Durability Filter (Classes only) */}
              {activeTab === 'classes' && (
                <div>
                  <h4 className="font-medium mb-2">Durability</h4>
                  <RangeSlider
                    min={99.9}
                    max={99.999999999}
                    step={0.000000001}
                    unit="%"
                    value={filters.classes.durability}
                    onChange={(value) => handleFilterChange('durability', value)}
                  />
                </div>
              )}

              {/* Availability Filter (Classes only) */}
              {activeTab === 'classes' && (
                <div>
                  <h4 className="font-medium mb-2">Availability</h4>
                  <RangeSlider
                    min={99}
                    max={99.99}
                    step={0.01}
                    unit="%"
                    value={filters.classes.availability}
                    onChange={(value) => handleFilterChange('availability', value)}
                  />
                </div>
              )}

              {/* Minimum Duration Filter (Classes only) */}
              {activeTab === 'classes' && (
                <div>
                  <h4 className="font-medium mb-2">Minimum Duration</h4>
                  {filters.classes.minDuration.options.map((option) => (
                    <motion.button
                      key={option}
                      className={`px-4 py-2 rounded-lg text-sm mr-2 mb-2 transition-all ${
                        filters.classes.minDuration.selected.includes(option)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleFilterChange('minDuration', {
                          ...filters.classes.minDuration,
                          selected: filters.classes.minDuration.selected.includes(option)
                            ? filters.classes.minDuration.selected.filter((item) => item !== option)
                            : [...filters.classes.minDuration.selected, option],
                        })
                      }
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}
              <motion.button
                onClick={applyFilters}
                className="col-span-full w-full py-3 rounded-lg text-lg font-medium bg-blue-600 text-white transition-all"
                whileTap={{ scale: 0.95 }}>
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {Object.entries(displayData).map(([key, item]) => (
          <motion.button
            key={key}
            onClick={() => setActiveItem(key)}
            onMouseEnter={() => setHoveredItem(key)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`relative p-6 rounded-xl transition-all duration-300 ${
              activeItem === key
                ? 'bg-blue-100 border-2 border-blue-600 shadow-lg'
                : 'bg-gray-50 border-2 border-transparent hover:bg-blue-50 hover:border-blue-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AnimatePresence>
              {hoveredItem === key && (
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-xl opacity-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <div className="flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold text-center">{item.name}</h3>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        <motion.div
          ref={detailRef}
          className="bg-gray-50 rounded-xl p-8 overflow-hidden"
          key={activeItem}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                {activeData.icon}
                <span className="ml-3">{activeData.name}</span>
              </h2>
              <p className="text-gray-700 mb-8">{activeData.description}</p>

              <div className="grid grid-cols-2 gap-6">
                {Object.entries(activeData.specs).map(([key, value]) => (
                  <InfoCard
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Key Features</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {activeData.features.map((feature) => (
                  <FeatureItem key={feature.name} feature={feature} />
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-6">Use Cases</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {activeData.useCases.map((useCase) => (
                    <UseCaseItem key={useCase} useCase={useCase} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GCPStorageViz;
