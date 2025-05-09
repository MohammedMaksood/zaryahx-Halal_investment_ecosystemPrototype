
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Map, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingAnimation from "@/components/LoadingAnimation";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Academics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [activeType, setActiveType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<(typeof academicInstitutions[0]) | null>(null);
  
  // Mock data with added images and details
  const academicInstitutions = [
    {
      id: 1,
      name: "Al-Huda Islamic School",
      type: "school" as const,
      location: "New York, NY",
      distance: "2.3 miles",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXNsYW1pYyUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Al-Huda Islamic School provides a comprehensive education based on Islamic principles. The curriculum includes Quran, Arabic language, Islamic studies alongside standard academic subjects like mathematics, science, and language arts.",
      founded: "1995",
      students: 350,
      teachers: 28,
      facilities: ["Library", "Computer Lab", "Prayer Room", "Sports Field"],
      website: "www.alhudaschool.edu"
    },
    {
      id: 2,
      name: "Masjid Manhattan",
      type: "masjid" as const,
      location: "New York, NY",
      distance: "1.8 miles",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9zcXVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=80",
      description: "Masjid Manhattan serves the Muslim community in downtown New York. It offers daily prayers, Friday sermons, and weekend Islamic schools for children. The mosque also hosts community events and provides assistance to those in need.",
      founded: "1970",
      capacity: "500 worshippers",
      services: ["Daily Prayers", "Friday Prayers", "Weekend School", "Community Events", "Funeral Services"],
      imams: ["Sheikh Abdullah Rahman", "Sheikh Mohammed Hassan"],
      website: "www.masjidmanhattan.org"
    },
    {
      id: 3,
      name: "Zaytuna College",
      type: "college" as const,
      location: "Berkeley, CA",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sbGVnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Zaytuna College is America's first accredited Muslim liberal arts college. It offers undergraduate degrees combining Islamic and Western scholarship, preparing students for careers in various fields while maintaining Islamic values.",
      founded: "2009",
      degrees: ["Bachelor of Arts in Islamic Law and Theology", "Master of Arts in Islamic Texts"],
      faculty: 15,
      students: 95,
      accreditation: "WASC Senior College and University Commission",
      website: "www.zaytuna.edu"
    },
    {
      id: 4,
      name: "Islamic Center of Southern California",
      type: "center" as const,
      location: "Los Angeles, CA",
      distance: "3.2 miles",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aXNsYW1pYyUyMGNlbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "The Islamic Center of Southern California is one of the largest mosques in the region. It offers a wide range of religious, educational, and social services to the Muslim community in Los Angeles.",
      founded: "1952",
      facilities: ["Main Prayer Hall", "Community Center", "Educational Classrooms", "Library", "Conference Room"],
      services: ["Daily Prayers", "Friday Prayer", "Youth Programs", "Family Counseling", "Matrimonial Services"],
      website: "www.islamiccenter.org"
    },
    {
      id: 5,
      name: "Qalam Institute",
      type: "center" as const,
      location: "Dallas, TX",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1585036156261-1e2ac055414e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGlzbGFtaWMlMjBjZW50ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=80",
      description: "Qalam Institute is dedicated to the study and teaching of Islamic sciences. It offers various courses and seminars on Quran, Hadith, Arabic, and Islamic law. Their programs cater to students of all levels.",
      founded: "2011",
      programs: ["Quran Memorization", "Arabic Language", "Islamic Jurisprudence", "Hadith Studies", "Islamic History"],
      website: "www.qalaminstitute.org"
    },
    {
      id: 6,
      name: "Noor Academy",
      type: "school" as const,
      location: "Chicago, IL",
      distance: "4.1 miles",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXNsYW1pYyUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Noor Academy provides Islamic education alongside the standard curriculum. Students learn Quran, Arabic, and Islamic studies while receiving a strong foundation in math, science, and other academic subjects.",
      founded: "2003",
      grades: "PreK-12",
      students: 280,
      services: ["After-School Programs", "Summer Camp", "Parent Workshops"],
      website: "www.nooracademy.org"
    },
    {
      id: 7,
      name: "American Islamic College",
      type: "college" as const,
      location: "Chicago, IL",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXNsYW1pYyUyMGNvbGxlZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=80",
      description: "American Islamic College offers undergraduate and graduate degrees in Islamic Studies and Arabic language. The college promotes understanding of Islam in the American context through education and research.",
      founded: "1981",
      degrees: ["Bachelor of Arts in Islamic Studies", "Master of Arts in Islamic Studies"],
      faculty: 12,
      students: 85,
      website: "www.aicusa.edu"
    },
    {
      id: 8,
      name: "Islamic Association of Raleigh",
      type: "masjid" as const,
      location: "Raleigh, NC",
      distance: "2.8 miles",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1564214761401-e14efe64f9e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9zcXVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=80",
      description: "The Islamic Association of Raleigh serves the Muslim community in Raleigh and surrounding areas. The mosque provides religious services, educational programs, and social activities for Muslims of all ages.",
      founded: "1985",
      capacity: "1,200 worshippers",
      facilities: ["Main Prayer Hall", "Educational Wing", "Community Hall", "Library", "Playground"],
      services: ["Daily Prayers", "Weekend School", "Youth Activities", "Interfaith Events"],
      website: "www.raleighmasjid.org"
    },
    {
      id: 9,
      name: "Quranic Literacy Institute",
      type: "center" as const,
      location: "Houston, TX",
      distance: "5.3 miles",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1591281700819-900258b1423e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHF1cmFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=80",
      description: "Quranic Literacy Institute focuses on teaching the Quran and Islamic studies. They offer courses for all age groups and levels of proficiency, from beginners to advanced students of the Quran.",
      founded: "2008",
      programs: ["Quran Reading", "Tajweed", "Memorization", "Tafsir (Interpretation)", "Arabic for Quran Understanding"],
      instructors: 8,
      students: "over 200",
      website: "www.quraniclit.org"
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

  const viewInstitutionDetails = (institution: typeof academicInstitutions[0]) => {
    setSelectedInstitution(institution);
  };

  const institutionTypes = [
    { id: 'all', name: 'All' },
    { id: 'school', name: 'Schools' },
    { id: 'college', name: 'Colleges' },
    { id: 'masjid', name: 'Masjids' },
    { id: 'center', name: 'Islamic Centers' }
  ];

  const filteredInstitutions = filterInstitutions();

  const renderInstitutionDialog = () => {
    if (!selectedInstitution) return null;
    
    return (
      <Dialog open={!!selectedInstitution} onOpenChange={() => setSelectedInstitution(null)}>
        <DialogContent className="sm:max-w-3xl bg-background/95 backdrop-blur-md border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedInstitution.name}</DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedInstitution.location} {selectedInstitution.distance ? `· ${selectedInstitution.distance}` : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={selectedInstitution.image} 
                alt={selectedInstitution.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-white/60 mb-1">Description</h4>
                <p>{selectedInstitution.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-white/60 mb-1">Founded</h4>
                <p>{selectedInstitution.founded}</p>
              </div>
              
              {selectedInstitution.type === "school" && (
                <>
                  <div>
                    <h4 className="text-sm text-white/60 mb-1">Students</h4>
                    <p>{selectedInstitution.students}</p>
                  </div>
                  {selectedInstitution.teachers && (
                    <div>
                      <h4 className="text-sm text-white/60 mb-1">Teachers</h4>
                      <p>{selectedInstitution.teachers}</p>
                    </div>
                  )}
                </>
              )}
              
              {selectedInstitution.type === "college" && (
                <div>
                  <h4 className="text-sm text-white/60 mb-1">Degrees Offered</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedInstitution.degrees?.map((degree, i) => (
                      <li key={i}>{degree}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedInstitution.type === "masjid" && (
                <div>
                  <h4 className="text-sm text-white/60 mb-1">Capacity</h4>
                  <p>{selectedInstitution.capacity}</p>
                </div>
              )}
              
              {selectedInstitution.facilities && (
                <div>
                  <h4 className="text-sm text-white/60 mb-1">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInstitution.facilities.map((facility, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-lavender/20 text-sm">{facility}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedInstitution.services && (
                <div>
                  <h4 className="text-sm text-white/60 mb-1">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInstitution.services.map((service, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-lavender/20 text-sm">{service}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <div className="flex items-center text-white/70">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{selectedInstitution.rating} / 5.0</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-lavender text-lavender hover:bg-lavender/20"
              >
                <Map className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button className="bg-lavender hover:bg-lavender-dark">
                Visit Website
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

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
                  {filteredInstitutions.map((institution) => (
                    <div key={institution.id} className="glassy-card rounded-xl overflow-hidden" onClick={() => viewInstitutionDetails(institution)}>
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={institution.image} 
                          alt={institution.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                            {institutionTypes.find(t => t.id === institution.type)?.name.slice(0, -1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{institution.name}</h3>
                          <div className="flex items-center text-white/70 text-sm">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span>{institution.rating}</span>
                          </div>
                        </div>
                        <div className="text-white/60 text-sm mb-3">
                          {institution.location}
                          {institution.distance && <span className="ml-2">• {institution.distance}</span>}
                        </div>
                        <p className="text-white/80 text-sm line-clamp-2 mb-3">{institution.description}</p>
                        <Button
                          className="w-full bg-lavender hover:bg-lavender-dark mt-2"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
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
      {renderInstitutionDialog()}
    </div>
  );
};

export default Academics;
