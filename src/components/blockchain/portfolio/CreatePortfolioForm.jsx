import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from "lucide-react";
// Import removed: CreatePortfolioParams from CommunityPortfolioService
/**
 * @typedef {Object} CreatePortfolioParams
 * @property {string} name - Portfolio name
 * @property {string} description - Portfolio description
 * @property {string} impactCategory - Impact category
 * @property {number} targetAmount - Target funding amount
 * @property {number} minInvestment - Minimum investment amount
 * @property {number} maxInvestors - Maximum number of investors
 */



const impactCategories = [
  "Education",
  "Healthcare",
  "Environment",
  "Poverty Alleviation",
  "Water & Sanitation",
  "Sustainable Agriculture",
  "Renewable Energy",
  "Microfinance",
  "Housing",
  "Small Business Development"
];

const CreatePortfolioForm = ({ onSubmit, isLoading }) => {
  /**
   * @type {import('../../../types/ethereum').CreatePortfolioParams}
   */
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    impactCategory: '',
    targetAmount: '1',
    minContribution: '0.01'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, impactCategory: value }));
  };
  
  /**
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const isFormValid = 
    formData.name.trim() !== '' && 
    formData.description.trim() !== '' && 
    formData.location.trim() !== '' && 
    formData.impactCategory !== '' && 
    parseFloat(formData.targetAmount) > 0 && 
    parseFloat(formData.minContribution) > 0;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Portfolio Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Clean Water Initiative"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the purpose and goals of this community portfolio..."
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Jakarta, Indonesia"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="impactCategory">Impact Category</Label>
        <Select 
          value={formData.impactCategory} 
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select an impact category" />
          </SelectTrigger>
          <SelectContent>
            {impactCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetAmount">Target Amount (ETH)</Label>
          <Input
            id="targetAmount"
            name="targetAmount"
            type="number"
            step="0.1"
            min="0.1"
            value={formData.targetAmount}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="minContribution">Minimum Contribution (ETH)</Label>
          <Input
            id="minContribution"
            name="minContribution"
            type="number"
            step="0.001"
            min="0.001"
            value={formData.minContribution}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isLoading || !isFormValid}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Portfolio'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreatePortfolioForm;
