import React, { useState, useEffect } from 'react';
import { PromptTemplate, PromptOption } from '../../../types/ai';
import { PROMPT_TEMPLATES } from '../../../services/ai/promptTemplates';
import DashboardLayout from '../../layout/DashboardLayout';

interface PromptFormData {
  name: string;
  description: string;
  template: string;
  category?: string;
  options: PromptOption[];
}

const PromptLibrary: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PromptFormData>({
    name: '',
    description: '',
    template: '',
    category: '',
    options: [],
  });

  useEffect(() => {
    // Load prompts from localStorage and combine with system prompts
    const loadPrompts = () => {
      const storedPrompts = JSON.parse(localStorage.getItem('customPromptTemplates') || '[]');
      const systemPrompts = Object.entries(PROMPT_TEMPLATES).map(([id, prompt]) => ({
        ...prompt,
        id,
        isSystemTemplate: true,
      }));
      setPrompts([...systemPrompts, ...storedPrompts]);
    };

    loadPrompts();
  }, []);

  const handleSavePrompt = () => {
    const newPrompt: PromptTemplate = {
      id: editingPrompt?.id || `prompt-${Date.now()}`,
      ...formData,
      customizable: true,
      isSystemTemplate: false,
      createdAt: editingPrompt?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    setPrompts(prev => {
      const updated = editingPrompt
        ? prev.map(t => (t.id === editingPrompt.id ? newPrompt : t))
        : [...prev, newPrompt];

      // Save custom prompts to localStorage
      const customPrompts = updated.filter(t => !t.isSystemTemplate);
      localStorage.setItem('customPromptTemplates', JSON.stringify(customPrompts));

      return updated;
    });

    setIsFormOpen(false);
    setEditingPrompt(null);
    setFormData({ name: '', description: '', template: '', category: '', options: [] });
  };

  const handleDeletePrompt = (prompt: PromptTemplate) => {
    if (prompt.isSystemTemplate) return;

    setPrompts(prev => {
      const updated = prev.filter(t => t.id !== prompt.id);
      const customPrompts = updated.filter(t => !t.isSystemTemplate);
      localStorage.setItem('customPromptTemplates', JSON.stringify(customPrompts));
      return updated;
    });
  };

  const handleEditPrompt = (prompt: PromptTemplate) => {
    if (prompt.isSystemTemplate) return;
    
    setEditingPrompt(prompt);
    setFormData({
      name: prompt.name,
      description: prompt.description,
      template: prompt.template,
      category: prompt.category || '',
      options: prompt.options || [],
    });
    setIsFormOpen(true);
  };

  const togglePromptExpansion = (promptId: string) => {
    setExpandedPromptId(expandedPromptId === promptId ? null : promptId);
  };

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { label: '', value: '', description: '' }],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, field: keyof PromptOption, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      ),
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Prompt Library</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your AI summarization prompts
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
            >
              Create Prompt
            </button>
          </div>
        </div>

        {/* Prompt List */}
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {prompts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No prompts available. Create your first prompt!</p>
            </div>
          ) : (
            prompts.map((prompt) => (
              <div key={prompt.id} className="divide-y divide-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <button
                        onClick={() => togglePromptExpansion(prompt.id)}
                        className="flex items-center w-full text-left"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            {prompt.name}
                            {prompt.isSystemTemplate && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                System
                              </span>
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">{prompt.description}</p>
                        </div>
                        <svg
                          className={`h-5 w-5 text-gray-500 transform transition-transform ${
                            expandedPromptId === prompt.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex space-x-3 ml-4">
                      {!prompt.isSystemTemplate && (
                        <>
                          <button
                            onClick={() => handleEditPrompt(prompt)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePrompt(prompt)}
                            className="text-sm text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedPromptId === prompt.id && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                      {prompt.category && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Category</h4>
                          <p className="mt-1 text-sm text-gray-600">{prompt.category}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Prompt Template</h4>
                        <pre className="mt-1 p-4 bg-white rounded-md text-sm text-gray-600 whitespace-pre-wrap border border-gray-200">
                          {prompt.template}
                        </pre>
                      </div>

                      {(prompt.defaultOptions || prompt.options) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Available Options</h4>
                          <div className="mt-2 space-y-2">
                            {prompt.defaultOptions?.map((option, index) => (
                              <div key={index} className="p-3 bg-white rounded-md border border-gray-200">
                                <div className="font-medium text-sm">{option.label}</div>
                                {option.description && (
                                  <div className="mt-1 text-sm text-gray-500">{option.description}</div>
                                )}
                              </div>
                            ))}
                            {prompt.options?.map((option, index) => (
                              <div key={index} className="p-3 bg-white rounded-md border border-gray-200">
                                <div className="font-medium text-sm">{option.label}</div>
                                {option.description && (
                                  <div className="mt-1 text-sm text-gray-500">{option.description}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Prompt Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">
                {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prompt Template</label>
                  <textarea
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    rows={10}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* Options List */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-sm text-black hover:text-gray-700"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.options.map((option, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Option {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Label"
                            value={option.label}
                            onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={option.value}
                            onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                          <input
                            type="text"
                            placeholder="Description (optional)"
                            value={option.description || ''}
                            onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingPrompt(null);
                      setFormData({ name: '', description: '', template: '', category: '', options: [] });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePrompt}
                    className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-md"
                  >
                    {editingPrompt ? 'Save Changes' : 'Create Prompt'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

PromptLibrary.displayName = 'PromptLibrary';
export default PromptLibrary; 