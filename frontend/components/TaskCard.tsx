import React, { useState } from 'react';
import { Task } from '@/lib/api';
import { Check, Edit2, Trash2, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
    task: Task;
    userId: string;
    onToggleComplete: (taskId: string) => void;
    onUpdateTask: (taskId: string, title: string, description?: string) => void;
    onDeleteTask: (taskId: string) => void;
}

export default function TaskCard({
    task,
    userId,
    onToggleComplete,
    onUpdateTask,
    onDeleteTask,
}: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description || '');

    const handleSave = () => {
        if (editedTitle.trim()) {
            onUpdateTask(task.id, editedTitle.trim(), editedDescription.trim() || undefined);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedTitle(task.title);
        setEditedDescription(task.description || '');
        setIsEditing(false);
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    return (
        <div
            className={cn(
                'glass-card rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02]',
                task.completed ? 'task-complete' : 'task-incomplete',
                'mb-4 animate-fade-in'
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => onToggleComplete(task.id)}
                            className={cn(
                                'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                                task.completed
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                            )}
                        >
                            {task.completed && (
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            )}
                        </button>

                        {isEditing ? (
                            <div className="flex-1 space-y-3">
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                    autoFocus
                                />
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                    rows={2}
                                    placeholder="Add description (optional)"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="btn-primary px-3 py-1 text-sm"
                                    >
                                        <Save className="w-4 h-4 inline mr-1" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                    >
                                        <X className="w-4 h-4 inline mr-1" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <h3
                                    onDoubleClick={handleDoubleClick}
                                    className={cn(
                                        'text-lg font-semibold mb-1 cursor-pointer hover:text-blue-600 transition-colors',
                                        task.completed && 'line-through text-gray-500 dark:text-gray-400'
                                    )}
                                >
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p
                                        className="text-gray-600 dark:text-gray-300 mb-2"
                                        onDoubleClick={handleDoubleClick}
                                    >
                                        {task.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span>Created: {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
                                    <span>•</span>
                                    <span>Updated: {format(new Date(task.updated_at), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit task"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete task"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}