'use client';
import React, { useState, useEffect } from 'react';
import { FiEye, FiPlus, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import PropertyDetailModal from '@/components/common/PropertyDetailModal';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  type: string;
  bathrooms: number;
  bedrooms: number;
  capacity: string;
  price: string;
  status: 'Pending' | 'Occupied' | 'Active';
  listingDate: string;
}

const PropertyRequestList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  const openModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleReject = () => {
    console.log('Reject clicked');
  };

  const handleApprove = () => {
    console.log('Approve clicked');
  };

  // Utility function to format date as YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Mock data - in a real app this would come from an API
  useEffect(() => {
    const mockData: Property[] = [
      { id: '1', name: 'Urban Apartment', type: 'Apartment', bathrooms: 4, bedrooms: 3, capacity: '8 Guests', price: '$85/night', status: 'Pending', listingDate: '2025-06-30' },
      { id: '2', name: 'Cory Lakeview Cabin', type: 'Cabin', bathrooms: 2, bedrooms: 2, capacity: '4 Guests', price: '$70/night', status: 'Occupied', listingDate: '2025-07-10' },
      { id: '3', name: 'Luxury Beach Villa', type: 'Villa', bathrooms: 5, bedrooms: 4, capacity: '8 Guests', price: '$200/night', status: 'Occupied', listingDate: '2025-07-05' },
      { id: '4', name: 'Rustic Mountain Home', type: 'Duplex House', bathrooms: 2, bedrooms: 1, capacity: '6 Guests', price: '$120/night', status: 'Active', listingDate: '2025-07-01' },
      { id: '5', name: 'Downtown Loft', type: 'Loft', bathrooms: 1, bedrooms: 1, capacity: '2 Guests', price: '$95/night', status: 'Pending', listingDate: '2025-07-15' },
      { id: '6', name: 'Seaside Bungalow', type: 'Bungalow', bathrooms: 2, bedrooms: 2, capacity: '4 Guests', price: '$150/night', status: 'Active', listingDate: '2025-07-08' },
      { id: '7', name: 'Modern Studio', type: 'Studio', bathrooms: 1, bedrooms: 1, capacity: '2 Guests', price: '$65/night', status: 'Occupied', listingDate: '2025-07-12' },
      { id: '8', name: 'Historic Townhouse', type: 'Townhouse', bathrooms: 3, bedrooms: 2, capacity: '6 Guests', price: '$180/night', status: 'Active', listingDate: '2025-07-03' },
      { id: '9', name: 'Garden Cottage', type: 'Cottage', bathrooms: 1, bedrooms: 1, capacity: '2 Guests', price: '$85/night', status: 'Pending', listingDate: '2025-07-18' },
      { id: '10', name: 'Executive Penthouse', type: 'Penthouse', bathrooms: 4, bedrooms: 3, capacity: '6 Guests', price: '$350/night', status: 'Occupied', listingDate: '2025-07-07' },
      { id: '11', name: 'Ski Chalet', type: 'Chalet', bathrooms: 3, bedrooms: 3, capacity: '8 Guests', price: '$280/night', status: 'Active', listingDate: '2025-07-22' },
      { id: '12', name: 'Lakeside Retreat', type: 'Retreat', bathrooms: 2, bedrooms: 2, capacity: '4 Guests', price: '$125/night', status: 'Pending', listingDate: '2025-07-14' },
      { id: '13', name: 'City Center Apartment', type: 'Apartment', bathrooms: 2, bedrooms: 2, capacity: '4 Guests', price: '$110/night', status: 'Occupied', listingDate: '2025-07-09' },
      { id: '14', name: 'Country Farmhouse', type: 'Farmhouse', bathrooms: 3, bedrooms: 4, capacity: '10 Guests', price: '$240/night', status: 'Active', listingDate: '2025-07-17' },
      { id: '15', name: 'Beachfront Condo', type: 'Condo', bathrooms: 2, bedrooms: 2, capacity: '6 Guests', price: '$190/night', status: 'Pending', listingDate: '2025-07-25' },
    ];
    
    setProperties(mockData);
    setFilteredProperties(mockData);
  }, []);
  
  // Filter properties based on status and search term
  useEffect(() => {
    let result = [...properties];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(property => property.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(property => 
        property.name.toLowerCase().includes(term) || 
        property.type.toLowerCase().includes(term) ||
        property.price.toLowerCase().includes(term)
      );
    }
    
    setFilteredProperties(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, searchTerm, properties]);
  
  // Calculate paginated properties
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };
  

  
  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-[#EBA83A] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-1 rounded-md ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FiChevronLeft size={20} />
        </button>
        
        {pages}
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-1 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FiChevronRight size={20} />
        </button>
        
        <span className="text-sm text-gray-600 ml-2">
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredProperties.length)} of {filteredProperties.length} properties
        </span>
      </div>
    );
  };
  
  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#F7B730] text-white';
      case 'Occupied':
        return 'bg-[#586DF7] text-white';
      case 'Active':
        return 'bg-[#40C557] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Requests</h1>
          </div>
          
          {/* Search Bar */}
          {/* <div className="mt-4 md:mt-0 md:ml-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#EBA83A] focus:border-[#EBA83A] sm:text-sm"
              />
            </div>
          </div> */}
          
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:gap-3 md:mt-0 w-full md:w-auto">
            <div className="flex gap-3 w-full md:w-auto">
              <label className="flex items-center cursor-pointer w-full md:w-auto">
                  <input
                  type="radio"
                  name="statusFilter"
                  checked={statusFilter === 'All'}
                  onChange={() => handleStatusFilterChange('All')}
                  className="sr-only"
                  />
                  <span className={`px-5 py-2 rounded-full text-sm font-medium ${
                  statusFilter === 'All' 
                      ? 'bg-[#40C557] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  All Properties
                  </span>
              </label>
              
              <label className="flex items-center cursor-pointer w-full md:w-auto">
                  <input
                  type="radio"
                  name="statusFilter"
                  checked={statusFilter === 'Pending'}
                  onChange={() => handleStatusFilterChange('Pending')}
                  className="sr-only"
                  />
                  <span className={`px-5 py-2 rounded-full text-sm font-medium ${
                  statusFilter === 'Pending' 
                      ? 'bg-[#F7B730] text-white ' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  Pending Request
                  </span>
              </label>
            </div>
            <Link href="/superadmin/properties/create"
              className="flex items-center justify-center px-6 py-3 bg-[#586DF7] text-white rounded-full hover:bg-[#d99a34] transition-colors shadow-sm w-full md:w-auto mt-3 md:mt-0"
            >
              <FiPlus className="mr-2 border rounded-full font-bol" />
              Create Property
            </Link>
          </div>
        </div>

        {/* Property Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr className=''>
                  <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Property Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Bathroom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Bed room
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Listing Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProperties.length > 0 ? (
                  paginatedProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-700">{property.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{property.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {property.bathrooms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {property.bedrooms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {property.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-5 py-2 inline-flex text-md leading-5 font-semibold rounded-full  ${getStatusBadge(property.status)}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(property.listingDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(property)}
                          className="text-gray-600 hover:text-[#EBA83A] transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No properties found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredProperties.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              {renderPagination()}
            </div>
          )}
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
      <PropertyDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
        editUrl={`/superadmin/properties/edit/${selectedProperty?.id}`}
        editLabel="Edit Property"
        editActive={selectedProperty?.status !== 'Pending'}
        onEditClick={() => { /* custom logic */ }}
        footerActions={[
          { label: 'Reject', active: true, color: '#FF4545', onClick: handleReject },
          { label: 'Approve', active: selectedProperty?.status === 'Pending', color: '#40C557', onClick: handleApprove }
        ]}
      />
    </div>
  );
};

export default PropertyRequestList;