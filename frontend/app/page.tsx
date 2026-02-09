'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, LogIn, LogOut, Loader2 } from 'lucide-react';
import { apiClient, Task } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import AddTaskForm from '@/components/AddTaskForm';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('user123');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInput, setUserInput] = useState('user123');

    useEffect(() => {
        // Check for existing token
        const token = apiClient.getToken();
        if (token) {
            setIsLoggedIn(true);
            fetchTasks();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiClient.getTasks(userId);
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleLogin = async () => {
        try {
            await apiClient.fetchDemoToken(userInput);
            setIsLoggedIn(true);
            setUserId(userInput);
            await fetchTasks();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = () => {
        apiClient.clearToken();
        setIsLoggedIn(false);
        setTasks([]);
        toast.info('Logged out successfully');
    };

    const handleAddTask = async (title: string, description?: string) => {
        try {
            const newTask = await apiClient.createTask(userId, { title, description });
            setTasks([newTask, ...tasks]);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const handleToggleComplete = async (taskId: string) => {
        try {
            const updatedTask = await apiClient.toggleComplete(userId, taskId);
            setTasks(tasks.map(task =>
                task.id === taskId ? updatedTask : task
            ));
        } catch (error) {
            console.error('Failed to toggle complete:', error);
        }
    };

    const handleUpdateTask = async (taskId: string, title: string, description?: string) => {
        try {
            const updatedTask = await apiClient.updateTask(userId, taskId, { title, description });
            setTasks(tasks.map(task =>
                task.id === taskId ? updatedTask : task
            ));
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await apiClient.deleteTask(userId, taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="glass-card rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold gradient-text mb-2">
                                Todo App
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                A modern task management application
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {completedCount} of {totalCount} tasks completed
                                    </span>
                                </div>
                                {totalCount > 0 && (
                                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Auth Section */}
                        <div className="glass-card rounded-xl p-4">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Logged in as</div>
                                        <div className="font-semibold text-lg">{userId}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-danger flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Enter user ID for demo login
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            placeholder="Enter user ID"
                                            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 flex-1"
                                        />
                                        <button
                                            onClick={handleLogin}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {isLoggedIn ? (
                        <>
                            <AddTaskForm onAddTask={handleAddTask} />

                            {loading ? (
                                <div className="glass-card rounded-xl p-12 text-center">
                                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-300">Loading tasks...</p>
                                </div>
                            ) : tasks.length > 0 ? (
                                <div className="space-y-4">
                                    {tasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            userId={userId}
                                            onToggleComplete={handleToggleComplete}
                                            onUpdateTask={handleUpdateTask}
                                            onDeleteTask={handleDeleteTask}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card rounded-xl p-12 text-center">
                                    <div className="text-5xl mb-4">📝</div>
                                    <h3 className="text-2xl font-semibold mb-2">No tasks yet</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Add your first task using the form above!
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="glass-card rounded-xl p-12 text-center">
                            <div className="text-6xl mb-6">🔒</div>
                            <h2 className="text-3xl font-bold mb-4">Welcome to Todo App</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
                                Please login with a user ID to start managing your tasks.
                                This demo uses JWT authentication for secure task management.
                            </p>
                            <div className="inline-flex flex-col gap-3">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Try: user123, user456, or enter any username
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
                    <p>Hackathon Phase 2 • Full-Stack Todo Application</p>
                    <p className="text-sm mt-2">
                        Built with Next.js 14, FastAPI, SQLModel, and Neon PostgreSQL
                    </p>
                </footer>
            </div>
        </div>
    );
}