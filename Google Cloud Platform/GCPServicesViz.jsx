import React, { useState, useEffect } from 'react';
import { Search, X, ExternalLink, Star, AlertTriangle, ChevronDown } from 'lucide-react';

const services = [
    {
        id: 1,
        name: 'Compute Engine',
        category: 'Compute',
        icon: '🖥️',
        description: 'Virtual machines in Google\'s data center',
        fullDescription: 'Google Compute Engine lets you create and run virtual machines on Google’s infrastructure.',
        features: ['Customizable machine types', 'Global infrastructure', 'Live migration'],
        pricing: 'Pay-per-use model',
        link: 'https://cloud.google.com/compute',
        relatedServices: [4],
      status: 'GA'
    },
    {
        id: 2,
        name: 'Cloud Storage',
        category: 'Storage',
        icon: '💾',
        description: 'Object storage for companies of all sizes',
        fullDescription: 'Google Cloud Storage is a scalable, fully managed object storage service.',
        features: ['Scalable and durable', 'Multiple storage classes', 'Integration with other GCP services'],
        pricing: 'Based on storage, retrieval, and operations',
        link: 'https://cloud.google.com/storage',
        relatedServices: [],
      status: 'GA'
    },
    {
        id: 3,
        name: 'BigQuery',
        category: 'Analytics',
        icon: '📊',
        description: 'Serverless data warehouse',
        fullDescription: 'Google BigQuery is a serverless, highly scalable, and cost-effective data warehouse.',
        features: ['Serverless and scalable', 'Real-time analysis', 'Built-in machine learning'],
        pricing: 'Based on storage and query processing',
        link: 'https://cloud.google.com/bigquery',
        relatedServices: [8, 9],
      status: 'GA'
    },
    {
        id: 4,
        name: 'Cloud Run',
        category: 'Serverless',
        icon: '🚀',
        description: 'Managed compute platform',
        fullDescription: 'Google Cloud Run is a fully managed serverless platform for running containerized applications.',
        features: ['Fully managed serverless', 'Automatic scaling', 'Customizable containers'],
        pricing: 'Based on resource usage',
        link: 'https://cloud.google.com/run',
        relatedServices: [1, 12],
      status: 'GA'
    },
    {
        id: 5,
        name: 'Cloud SQL',
        category: 'Databases',
        icon: '🗄️',
        description: 'Managed relational database service',
        fullDescription: 'Google Cloud SQL is a fully managed relational database service for MySQL, PostgreSQL, and SQL Server.',
        features: ['Fully managed database', 'Automated backups', 'High availability'],
        pricing: 'Based on instance type, storage, and data transfer',
        link: 'https://cloud.google.com/sql',
        relatedServices: [],
      status: 'GA'
    },
    {
        id: 6,
        name: 'Firestore',
        category: 'Databases',
        icon: '🔥',
        description: 'NoSQL document database',
        fullDescription: 'Cloud Firestore is a NoSQL document database built for automatic scaling, high performance, and ease of application development.',
        features: ['NoSQL document database', 'Real-time updates', 'Automatic scaling', 'Integration with Firebase'],
        pricing: 'Based on storage, read/write operations, and network usage',
        link: 'https://cloud.google.com/firestore',
        relatedServices: [7],
      status: 'GA'
    },
    {
        id: 7,
        name: 'Firebase',
        category: 'Mobile & Web',
        icon: '🎛️',
        description: 'Platform for mobile and web app development',
        fullDescription: 'Firebase is a platform for mobile and web app development providing tools and services to build, manage, and grow apps.',
        features: ['Authentication', 'Cloud Messaging', 'Realtime Database', 'Cloud Functions'],
        pricing: 'Based on a free tier and pay-as-you-go plans',
        link: 'https://firebase.google.com/',
        relatedServices: [6, 12],
      status: 'GA'
    },
    {
        id: 8,
        name: 'Vertex AI',
        category: 'AI & ML',
        icon: '🤖',
        description: 'Unified machine learning platform',
        fullDescription: 'Vertex AI is a unified machine learning platform that allows you to build, deploy, and scale ML models.',
        features: ['AutoML', 'Custom training', 'MLOps tools', 'Pre-trained APIs'],
        pricing: 'Based on compute, storage, and data processing',
        link: 'https://cloud.google.com/vertex-ai',
        relatedServices: [3],
      status: 'GA'
    },
    {
        id: 9,
        name: 'Dataflow',
        category: 'Analytics',
        icon: '🌊',
        description: 'Data processing service for batch and stream',
        fullDescription: 'Google Cloud Dataflow is a data processing service for both batch and stream data processing.',
        features: ['Unified batch and stream processing', 'Scalable and serverless', 'Apache Beam compatible'],
        pricing: 'Based on compute resources, data processing, and storage',
        link: 'https://cloud.google.com/dataflow',
        relatedServices: [3, 10],
      status: 'GA'
    },
    {
        id: 10,
        name: 'Dataproc',
        category: 'Analytics',
        icon: '⚙️',
        description: 'Managed Hadoop and Spark service',
        fullDescription: 'Google Cloud Dataproc is a managed Hadoop and Spark service for data processing and analytics.',
        features: ['Managed Hadoop and Spark', 'Auto-scaling', 'Integration with other GCP services'],
        pricing: 'Based on compute resources and storage',
        link: 'https://cloud.google.com/dataproc',
        relatedServices: [9],
      status: 'GA'
    },
    {
        id: 11,
        name: 'Data Wrangler',
        category: 'Analytics',
        icon: '🛠️',
        description: 'Interactive data preparation tool',
        fullDescription: 'Data Wrangler is an interactive tool to explore, clean, and transform data for analytics and machine learning.',
        features: ['Interactive UI', 'Data cleaning and transformation', 'Integration with BigQuery and Dataflow'],
        pricing: 'Part of Vertex AI Workbench',
        link: 'https://cloud.google.com/vertex-ai-workbench/docs/data-wrangler-overview',
        relatedServices: [3, 8],
      status: 'GA'
    },
    {
        id: 12,
        name: 'App Engine',
        category: 'Serverless',
        icon: '🌐',
        description: 'Platform for building scalable web apps',
        fullDescription: 'Google App Engine is a platform for building scalable web applications and backends.',
        features: ['Fully managed serverless', 'Automatic scaling', 'Support for multiple programming languages'],
        pricing: 'Based on resource usage',
        link: 'https://cloud.google.com/appengine',
        relatedServices: [4, 7],
      status: 'GA'
    },
     {
        id: 13,
        name: 'GKE (Google Kubernetes Engine)',
        category: 'Compute',
        icon: '☸️',
        description: 'Managed Kubernetes service',
        fullDescription: 'Google Kubernetes Engine is a managed Kubernetes service for running containerized applications.',
        features: ['Managed Kubernetes', 'Auto-scaling', 'Integration with other GCP services'],
        pricing: 'Based on node usage and cluster management',
        link: 'https://cloud.google.com/kubernetes-engine',
        relatedServices: [],
       status: 'GA'
    },
    {
        id: 14,
        name: 'Pub/Sub',
        category: 'Networking',
        icon: '📢',
        description: 'Asynchronous messaging service',
        fullDescription: 'Cloud Pub/Sub is a fully-managed real-time messaging service that allows you to send and receive messages between independent applications and systems.',
        features: ['Asynchronous messaging', 'Scalable and reliable', 'Real-time data streaming'],
        pricing: 'Based on message volume and data transfer',
        link: 'https://cloud.google.com/pubsub',
        relatedServices: [],
       status: 'GA'
    },
    {
        id: 15,
        name: 'VPC (Virtual Private Cloud)',
        category: 'Networking',
        icon: '🌐',
        description: 'Global private network',
        fullDescription: 'Google Cloud Virtual Private Cloud (VPC) enables you to create and manage your private network on Google Cloud.',
        features: ['Global private network', 'Subnet control', 'Traffic management'],
        pricing: 'Based on network traffic and resource utilization',
        link: 'https://cloud.google.com/vpc',
        relatedServices: [16, 17],
      status: 'GA'
    },
    {
        id: 16,
        name: 'Cloud Load Balancing',
        category: 'Networking',
        icon: '⚖️',
        description: 'Global load balancing service',
        fullDescription: 'Cloud Load Balancing is a global, fully managed load balancing service for web traffic and other application traffic.',
        features: ['Global load balancing', 'Traffic management', 'SSL/TLS support'],
        pricing: 'Based on data processing and network traffic',
        link: 'https://cloud.google.com/load-balancing',
        relatedServices: [15],
      status: 'GA'
    },
    {
        id: 17,
        name: 'Cloud DNS',
        category: 'Networking',
        icon: '🏷️',
        description: 'Scalable DNS service',
        fullDescription: 'Google Cloud DNS is a scalable and reliable DNS service that allows you to manage domain names.',
        features: ['Scalable DNS', 'Global network', 'API access'],
        pricing: 'Based on queries and zone management',
        link: 'https://cloud.google.com/dns',
        relatedServices: [15],
      status: 'GA'
    },
     {
        id: 18,
        name: 'Anthos',
        category: 'Hybrid & Multi-Cloud',
        icon: '☁️',
        description: 'Management platform for hybrid and multi-cloud',
        fullDescription: 'Anthos is a hybrid and multi-cloud management platform that allows you to modernize and manage applications across cloud and on-premises environments.',
        features: ['Unified management', 'Multi-cluster management', 'Consistent app experience'],
        pricing: 'Based on usage of managed components',
        link: 'https://cloud.google.com/anthos',
        relatedServices: [13],
       status: 'GA'
    },
    {
        id: 19,
        name: 'IAM & Admin',
        category: 'Security',
        icon: '🔒',
        description: 'Identity and Access Management',
        fullDescription: 'Google Cloud IAM allows you to manage access to your resources by defining who (identity) has what access (role) to which resources.',
        features: ['Fine-grained access control', 'Policy management', 'Audit logging'],
        pricing: 'Included with Google Cloud services',
        link: 'https://cloud.google.com/iam',
        relatedServices: [],
      status: 'GA'
    },
    {
        id: 20,
        name: 'Composer',
        category: 'Orchestration',
        icon: '🎵',
        description: 'Managed workflow orchestration service',
        fullDescription: 'Cloud Composer is a fully managed workflow orchestration service built on Apache Airflow.',
        features: ['Managed Apache Airflow', 'Workflow automation', 'Integration with GCP services'],
        pricing: 'Based on workflow execution and resource usage',
        link: 'https://cloud.google.com/composer',
        relatedServices: [],
      status: 'GA'
    },
    {
        id: 21,
        name: 'Cloud Run Functions (Previously Cloud Functions)',
        category: 'Serverless',
        icon: '🔧',
        description: 'Event-driven serverless compute service',
        fullDescription: 'Google Cloud Functions is an event-driven serverless compute service that allows you to run your code in response to events.',
        features: ['Event-driven execution', 'Automatic scaling', 'Integration with other GCP services'],
        pricing: 'Based on invocations and compute time',
        link: 'https://cloud.google.com/functions',
        relatedServices: [4, 12],
      status: 'GA'
    },
    {
        id: 22,
        name: 'Bigtable',
        category: 'Databases',
        icon: '🗄️',
        description: 'Scalable NoSQL database service',
        fullDescription: 'Google Cloud Bigtable is a fully managed, scalable NoSQL database service designed for low-latency and high-throughput applications.',
        features: ['Scalable NoSQL', 'Low-latency', 'Integration with other GCP services'],
        pricing: 'Based on node usage and storage',
        link: 'https://cloud.google.com/bigtable',
        relatedServices: [],
      status: 'GA'
    },
    {
        id: 23,
        name: 'Memorystore',
        category: 'Databases',
        icon: '🗄️',
        description: 'Managed in-memory data store service',
        fullDescription: 'Google Cloud Memorystore is a fully managed in-memory data store service compatible with Redis and Memcached.',
        features: ['Managed Redis and Memcached', 'High availability', 'Scalable'],
        pricing: 'Based on instance size and usage',
        link: 'https://cloud.google.com/memorystore',
        relatedServices: [],
      status: 'GA'
    },
     {
        id: 24,
        name: 'Cloud Build',
        category: 'CI/CD',
        icon: '🏗️',
        description: 'Continuous integration and delivery platform',
        fullDescription: 'Google Cloud Build is a fully managed continuous integration and delivery platform that lets you build, test, and deploy applications quickly.',
        features: ['Automated builds', 'Integration with other GCP services', 'Custom build steps'],
        pricing: 'Based on build minutes and resource usage',
        link: 'https://cloud.google.com/cloud-build',
        relatedServices: [],
       status: 'GA'
    },
    {
      id: 25,
      name: 'Logging',
      category: 'Management Tools',
      icon: '📜',
      description: 'Real-time log management and analysis',
      fullDescription: 'Google Cloud Logging allows you to store, search, analyze, and alert on log data and events from Google Cloud and AWS.',
      features: ['Real-time log management', 'Integrated monitoring', 'Custom alerts'],
      pricing: 'Based on log ingestion and storage',
      link: 'https://cloud.google.com/logging',
      relatedServices: [],
        status: 'GA'
    },
    {
      id: 26,
      name: 'Artifact Registry',
      category: 'DevOps',
      icon: '📦',
      description: 'Managed service for storing and managing build artifacts',
      fullDescription: 'Google Cloud Artifact Registry is a managed service for storing, managing, and securing build artifacts and dependencies.',
      features: ['Managed artifact storage', 'Integration with CI/CD pipelines', 'Security and compliance'],
      pricing: 'Based on storage and data transfer',
      link: 'https://cloud.google.com/artifact-registry',
      relatedServices: [],
        status: 'GA'
    },
    {
      id: 27,
      name: 'Filestore',
      category: 'Storage',
      icon: '🗄️',
      description: 'Fully managed file storage service',
      fullDescription: 'Google Cloud Filestore offers a fully managed network file system for applications that need shared file storage.',
      features: ['Fully managed NFS', 'Scalable performance', 'High availability'],
      pricing: 'Based on capacity and performance',
      link: 'https://cloud.google.com/filestore',
      relatedServices: [],
        status: 'GA'
    },
    {
      id: 28,
      name: 'Persistent Disk',
      category: 'Storage',
      icon: '💿',
      description: 'Block storage for VMs',
      fullDescription: 'Google Cloud Persistent Disk is a durable and high-performance block storage service that integrates with Compute Engine.',
      features: ['Durable block storage', 'Performance options', 'Snapshots and backups'],
      pricing: 'Based on capacity and performance',
      link: 'https://cloud.google.com/persistent-disk',
      relatedServices: [1],
        status: 'GA'
    },
      {
        id: 29,
        name: 'Cloud Spanner',
        category: 'Databases',
        icon: '🌐',
        description: 'Globally distributed database',
        fullDescription: 'Cloud Spanner is a fully managed, scalable, globally distributed, and strongly consistent database service.',
        features: ['Global scale', 'Strong consistency', 'Automatic scaling'],
        pricing: 'Based on compute, storage, and network usage',
        link: 'https://cloud.google.com/spanner',
        relatedServices: [],
        status: 'Beta'
    },
    {
        id: 30,
        name: 'Secret Manager',
        category: 'Security',
        icon: '🔑',
        description: 'Managed service for storing API keys',
        fullDescription: 'Google Cloud Secret Manager is a secure and convenient service for storing API keys, passwords, certificates, and other sensitive data.',
        features: ['Secure storage', 'Access control', 'Version management'],
        pricing: 'Based on storage and access operations',
        link: 'https://cloud.google.com/secret-manager',
        relatedServices: [],
        status: 'GA'
    }

];

const categories = [...new Set(services.map(service => service.category))];

const StatusBadge = ({ status }) => {
  const colors = {
    GA: 'bg-green-100 text-green-800',
    Beta: 'bg-yellow-100 text-yellow-800',
    Alpha: 'bg-red-100 text-red-800',
      Deprecated: 'bg-gray-300 text-gray-600',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.default}`}>
      {status}
    </span>
  );
};

const ServiceCard = ({ service, toggleFavorite, favorites, setSelectedService }) => (
    <div 
      className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
      onClick={() => setSelectedService(service)}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => toggleFavorite(service.id, e)}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label={favorites.includes(service.id) ? "Remove from favorites" : "Add to favorites"}
        >
          <Star 
            className={`w-5 h-5 ${favorites.includes(service.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        </button>
      </div>
      
      <div className="flex items-center mb-4">
        <span className="text-3xl sm:text-4xl mr-4">{service.icon}</span>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{service.name}</h3>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-indigo-600">{service.category}</span>
            <StatusBadge status={service.status} />
          </div>
        </div>
      </div>
      <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2 flex-wrap">
          {service.features.slice(0, 2).map((feature, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
  

  const ServiceList = ({ service, toggleFavorite, favorites, setSelectedService }) => (
    <div 
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={() => setSelectedService(service)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl">{service.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={service.status} />
          <button
            onClick={(e) => toggleFavorite(service.id, e)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Star 
              className={`w-5 h-5 ${favorites.includes(service.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
  
const GCPServices = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('grid');
  const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 700)); // Simulate loading delay
                const savedFavorites = localStorage.getItem('gcpFavorites');
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (err) {
                setError(err.message || 'Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);


  const toggleFavorite = (serviceId, event) => {
    event.stopPropagation();
    const newFavorites = favorites.includes(serviceId)
      ? favorites.filter(id => id !== serviceId)
      : [...favorites, serviceId];
    setFavorites(newFavorites);
    localStorage.setItem('gcpFavorites', JSON.stringify(newFavorites));
  };

   const filterServices = (services) => {
        return services.filter(service => {
            const categoryMatch = selectedCategory === 'All' || service.category === selectedCategory;
            const searchMatch = !searchQuery || 
              service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
            const favoriteMatch = !showFavorites || favorites.includes(service.id);
            return categoryMatch && searchMatch && favoriteMatch;
          });
    };

  const filteredServices = filterServices(services);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-mono font-semibold text-gray-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-2xl font-mono font-semibold text-red-700">Error: {error}</div>
        </div>
      );
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
        <div className="flex items-center justify-center m-4">
            <h1 className="text-2xl font-semibold mb-4 text-indigo-800"> 
                Google Cloud Platform 
            </h1>
        </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-indigo-700 focus:ring focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50"
              >
                {view === 'grid' ? 'List View' : 'Grid View'}
              </button>
              
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`p-2 rounded-lg ${showFavorites ? 'bg-yellow-100 text-yellow-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Star className="w-5 h-5" />
              </button>
            </div>
          </div>
            
          <div className="mt-4 flex items-center gap-2 flex-wrap sm:hidden">
            <div className="relative inline-block text-left w-full">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    className="inline-flex justify-between w-full px-4 py-2 text-indigo-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-200"
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                >
                    {selectedCategory}
                    <ChevronDown className="w-5 h-5 ml-2 -mr-1" />
                </button>
                {isMenuOpen && (
                <div className="absolute left-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <button
                            onClick={() => {
                              setSelectedCategory('All');
                              setIsMenuOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        >
                           All
                        </button>
                      {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setIsMenuOpen(false);
                                }}
                              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                              {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
         </div>
          </div>
            

          <div className="mt-4 hidden sm:flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2 py-2 rounded-lg ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No services found matching your criteria.</p>
          </div>
        ) : (
          <div className={view === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            : "flex flex-col gap-4"
          }>
            {filteredServices.map(service => (
              view === 'grid' 
                ? <ServiceCard key={service.id} service={service} toggleFavorite={toggleFavorite} favorites={favorites} setSelectedService={setSelectedService} />
                : <ServiceList key={service.id} service={service} toggleFavorite={toggleFavorite} favorites={favorites} setSelectedService={setSelectedService}/>
            ))}
          </div>
        )}

        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{selectedService.icon}</span>
                    <div>
                      <h2 className="text-2xl font-semibold text-indigo-800">{selectedService.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-indigo-600">{selectedService.category}</span>
                        <StatusBadge status={selectedService.status} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 text-base mb-6">{selectedService.fullDescription}</p>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedService.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                          <div className="w-5 h-5 mt-0.5 text-indigo-600">•</div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Pricing</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedService.pricing}</p>
                    </div>
                  </section>

                  {selectedService.relatedServices?.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Related Services</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedService.relatedServices.map(relatedId => {
                          const relatedService = services.find(s => s.id === relatedId);
                          if (relatedService) {
                            return (
                              <button
                                key={relatedService.id}
                                onClick={() => setSelectedService(relatedService)}
                                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-xl">{relatedService.icon}</span>
                                <span className="text-sm text-gray-700">{relatedService.name}</span>
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </section>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <button
                      onClick={(e) => toggleFavorite(selectedService.id, e)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <Star className={`w-5 h-5 ${favorites.includes(selectedService.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      <span className="text-gray-700">
                        {favorites.includes(selectedService.id) ? 'Remove from favorites' : 'Add to favorites'}
                      </span>
                    </button>

                    <a
                      href={selectedService.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GCPServices;