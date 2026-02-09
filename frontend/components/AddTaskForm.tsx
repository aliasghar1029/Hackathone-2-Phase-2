import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
    onAddTask: (title: string, description?: string) => void;
}

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAddTask(title.trim(), description.trim() || undefined);
            setTitle('');
            setDescription('');
            setIsExpanded(false);
        }
    };

    return (
        <div className="glass-card rounded-xl p-6 mb-8 animate-slide-in">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onFocus={() => setIsExpanded(true)}
                                placeholder="What needs to be done?"
                                className="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-500 dark:placeholder-gray-400"
                                required
                            />
                            {!isExpanded && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Plus className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary px-6 py-4 text-lg font-medium whitespace-nowrap"
                            disabled={!title.trim()}
                        >
                            <Plus className="w-5 h-5 inline mr-2" />
                            Add Task
                        </button>
                    </div>

                    {isExpanded && (
                        <div className="animate-fade-in">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a description (optional)"
                                className="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    Collapse
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}