/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import TechnicalTable from './components/TechnicalTable';
import FastenerSimulator from './components/FastenerSimulator';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';
import ThemeSelector from './components/ThemeSelector';
import AdminDashboard from './components/AdminDashboard';
import { SiteData, getSiteData, saveSiteData } from './lib/siteData';

export default function App() {
  const [siteData, setSiteData] = useState<SiteData>(getSiteData());
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync state if localStorage changes or upon setup
  useEffect(() => {
    setSiteData(getSiteData());
  }, []);

  const handleDataChange = (newData: SiteData) => {
    setSiteData(newData);
  };

  const handleAddInquiry = (inquiry: {
    name: string;
    phone: string;
    company: string;
    productType: string;
    desc: string;
  }) => {
    const newInq = {
      id: `inq-${Date.now()}`,
      name: inquiry.name,
      phone: inquiry.phone,
      company: inquiry.company,
      productType: inquiry.productType,
      desc: inquiry.desc,
      date: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'PENDING' as const
    };

    const updatedData = {
      ...siteData,
      inquiries: [newInq, ...siteData.inquiries]
    };

    setSiteData(updatedData);
    saveSiteData(updatedData);
  };

  return (
    <div dir="rtl" className="bg-gray-950 font-sans min-h-screen text-gray-200">
      <Header onOpenAdmin={() => setIsAdminOpen(true)} />
      <Hero heroData={siteData.hero} statsData={siteData.stats} />
      <ProductCatalog productsData={siteData.products} />
      <TechnicalTable standardsData={siteData.standards} />
      
      {/* Dynamic Simulation Tool for Heavy Duty Engineering */}
      <FastenerSimulator />
      
      <InquiryForm onAddInquiry={handleAddInquiry} />
      <Footer />

      {/* Floating Theme Selection Panel for Visual Customization */}
      <ThemeSelector />

      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onDataChange={handleDataChange} 
      />
    </div>
  );
}
