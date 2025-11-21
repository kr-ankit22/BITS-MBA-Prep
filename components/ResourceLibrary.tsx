
import React, { useState, useMemo } from 'react';
import { Resource } from '../types';
import Pagination from './Pagination';
import { IconLink, IconBook } from './Icons';

interface ResourceLibraryProps {
  resources: Resource[];
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ resources }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = ['All', 'Python', 'SQL', 'Data Analytics', 'Product', 'Finance'];

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 rounded-lg">
          <IconBook className="w-8 h-8 text-green-700" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Curated Learning Resources</h2>
          <p className="text-gray-500">Handpicked tutorials and courses for BITSians.</p>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">

          {/* Category Tabs */}
          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 scrollbar-hide mask-linear-fade">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${categoryFilter === cat
                    ? 'bg-bits-blue text-white border-bits-blue shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Page Size */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bits-blue outline-none bg-white text-gray-900"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={5}>Show 5</option>
              <option value={10}>Show 10</option>
              <option value={20}>Show 20</option>
            </select>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-bits-blue outline-none w-full md:w-64 bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4 w-1/5">Category</th>
                <th className="px-6 py-4 w-32 text-center">Source</th>
                <th className="px-6 py-4 w-24 text-center">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-bits-blue transition-colors text-base">{resource.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{resource.description}</p>
                    {resource.duration && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wide">
                          {resource.duration}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                       ${resource.category === 'Python' ? 'bg-yellow-100 text-yellow-800' :
                        resource.category === 'SQL' ? 'bg-blue-100 text-blue-800' :
                          resource.category === 'Product' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center text-sm text-gray-600 font-medium">
                    {resource.source}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 hover:bg-bits-blue hover:text-white text-gray-400 transition-all border border-gray-200 group-hover:border-bits-blue"
                      title="Visit Resource"
                    >
                      <IconLink className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                       ${resource.category === 'Python' ? 'bg-yellow-100 text-yellow-800' :
                  resource.category === 'SQL' ? 'bg-blue-100 text-blue-800' :
                    resource.category === 'Product' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                }`}>
                {resource.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">{resource.source}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-400 font-medium">{resource.duration}</span>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-bits-blue flex items-center gap-1 hover:underline"
              >
                Visit Link <IconLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {currentResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources found matching your criteria.</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredResources.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ResourceLibrary;
