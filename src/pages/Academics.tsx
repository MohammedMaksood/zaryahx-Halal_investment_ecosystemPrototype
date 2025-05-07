
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Map } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AcademicCard from "@/components/AcademicCard";
import LoadingAnimation from "@/components/LoadingAnimation";

const Academics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [activeType, setActiveType] = useState('all');
  const [loading, setLoading] = useState(false);
  
  // Mock data
  const academicInstitutions = [
    {
      name: "Al-Huda Islamic School",
      type: "school" as const,
      location: "New York, NY",
      distance: "2.3 miles",
      rating: 4.7
    },
    {
      name: "Masjid Manhattan",
      type: "masjid" as const,
      location: "New York, NY",
      distance: "1.8 miles",
      rating: 4.9
    },
    {
      name: "Zaytuna College",
      type: "college" as const,
      location: "Berkeley, CA",
      rating: 4.8
    },
    {
      name: "Islamic Center of Southern California",
      type: "center" as const,
      location: "Los Angeles, CA",
      distance: "3.2 miles",
      rating: 4.6
    },
    {
      name: "Qalam Institute",
      type: "center" as const,
      location: "Dallas, TX",
      rating: 4.5
    },
    {
      name: "Noor Academy",
      type: "school" as const,
      location: "Chicago, IL",
      distance: "4.1 miles",
      rating: 4.3
    },
    {
      name: "American Islamic College",
      type: "college" as const,
      location: "Chicago, IL",
      rating: 4.2
    },
    {
      name: "Islamic Association of Raleigh",
      type: "masjid" as const,
      location: "Raleigh, NC",
      distance: "2.8 miles",
      rating: 4.8
    },
    {
      name: "Quranic Literacy Institute",
      type: "center" as const,
      location: "Houston, TX",
      distance: "5.3 miles",
      rating: 4.4
    }
  ];

  const filterInstitutions = () => {
    let filtered = academicInstitutions;
    
    if (activeType !== 'all') {
      filtered = filtered.filter(institution => institution.type === activeType);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(institution => 
        institution.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (searchCity) {
      filtered = filtered.filter(institution => 
        institution.location.toLowerCase().includes(searchCity.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate search loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const institutionTypes = [
    { id: 'all', name: 'All' },
    { id: 'school', name: 'Schools' },
    { id: 'college', name: 'Colleges' },
    { id: 'masjid', name: 'Masjids' },
    { id: 'center', name: 'Islamic Centers' }
  ];

  const filteredInstitutions = filterInstitutions();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                Islamic Academic Institutions
              </h1>
              <p className="text-white/70 mb-8">
                Find nearby Islamic schools, colleges, masjids, and educational centers to nurture your spiritual and educational growth.
              </p>
              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="Search institutions..."
                    className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Input
                    placeholder="City or location..."
                    className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    className="bg-lavender hover:bg-lavender-dark md:w-auto"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Institution Type Filter */}
        <section className="py-6 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="overflow-x-auto">
                <div className="flex space-x-2 min-w-max pb-2">
                  {institutionTypes.map(type => (
                    <Button
                      key={type.id}
                      variant={activeType === type.id ? "default" : "outline"}
                      className={activeType === type.id 
                        ? "bg-lavender hover:bg-lavender-dark text-white" 
                        : "text-white/70 border-white/10 hover:bg-lavender/10 hover:text-lavender"
                      }
                      onClick={() => setActiveType(type.id)}
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="hidden md:flex items-center border-lavender text-lavender hover:bg-lavender/20"
              >
                <Map className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </div>
          </div>
        </section>

        {/* Institutions Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="py-20">
                <LoadingAnimation type="spinner" size="lg" text="Searching for institutions..." />
              </div>
            ) : filteredInstitutions.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {activeType === 'all' ? 'All Institutions' : `${institutionTypes.find(t => t.id === activeType)?.name}`}
                    {searchCity && ` in ${searchCity}`}
                  </h2>
                  <span className="text-white/60 text-sm">{filteredInstitutions.length} found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInstitutions.map((institution, index) => (
                    <AcademicCard
                      key={index}
                      name={institution.name}
                      type={institution.type}
                      location={institution.location}
                      distance={institution.distance}
                      rating={institution.rating}
                    />
                  ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto items-center border-lavender text-lavender hover:bg-lavender/20"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">No institutions found</h2>
                <p className="text-white/60 mb-6">Try different search terms or location</p>
                <Button 
                  variant="outline" 
                  className="border-lavender text-lavender hover:bg-lavender/20"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchCity('');
                    setActiveType('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-lavender/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gradient">Why Islamic Education Matters</h2>
                <div className="space-y-4 text-white/80">
                  <p>
                    Islamic education provides a comprehensive framework for intellectual and spiritual growth, integrating faith with practical knowledge.
                  </p>
                  <p>
                    By attending Islamic institutions, students can develop a strong moral compass guided by the principles of the Quran and Sunnah, while excelling in academic subjects.
                  </p>
                  <p>
                    These institutions foster a sense of community and belonging, helping Muslims maintain their identity while contributing positively to society.
                  </p>
                </div>
                <div className="mt-8">
                  <Button className="bg-lavender hover:bg-lavender-dark">
                    Submit an Institution
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="glassy-card rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-3">Finding the Right Institution</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-sm text-lavender">1</span>
                      </div>
                      <p>Research the curriculum and teaching methodology</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-sm text-lavender">2</span>
                      </div>
                      <p>Visit the campus and meet with faculty members</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-sm text-lavender">3</span>
                      </div>
                      <p>Look for accreditations and affiliations</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-sm text-lavender">4</span>
                      </div>
                      <p>Consider the community and extracurricular activities</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-sm text-lavender">5</span>
                      </div>
                      <p>Speak with current students and alumni</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Academics;
