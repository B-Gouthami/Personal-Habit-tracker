import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Target, TrendingUp, Zap, Brain, Heart, AlertCircle, Plus, Trash2 } from 'lucide-react';

const App = () => {
  const [habits, setHabits] = useState({
    good: [
      { id: 1, name: "Drink 8 glasses of water", category: "health", streak: 3, completed: false },
      { id: 2, name: "Work in 25-min focused blocks", category: "productivity", streak: 1, completed: false },
      { id: 3, name: "Read for 20 minutes", category: "learning", streak: 5, completed: true }
    ],
    bad: [
      { id: 4, name: "Endless social media scrolling", category: "productivity", daysFree: 2 },
      { id: 5, name: "Late night snacking", category: "health", daysFree: 0 },
      { id: 6, name: "Procrastinating on important tasks", category: "productivity", daysFree: 1 }
    ]
  });

  const [newHabit, setNewHabit] = useState({ name: '', category: 'health', type: 'good' });
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = {
    health: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    productivity: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    learning: { icon: Brain, color: 'text-green-500', bg: 'bg-green-50' }
  };

  const toggleGoodHabit = (id) => {
    setHabits(prev => ({
      ...prev,
      good: prev.good.map(habit => 
        habit.id === id 
          ? { 
              ...habit, 
              completed: !habit.completed,
              streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
            }
          : habit
      )
    }));
  };

  const updateBadHabitDays = (id, change) => {
    setHabits(prev => ({
      ...prev,
      bad: prev.bad.map(habit => 
        habit.id === id 
          ? { ...habit, daysFree: Math.max(0, habit.daysFree + change) }
          : habit
      )
    }));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      category: newHabit.category,
      ...(newHabit.type === 'good' ? { streak: 0, completed: false } : { daysFree: 0 })
    };

    setHabits(prev => ({
      ...prev,
      [newHabit.type]: [...prev[newHabit.type], habit]
    }));

    setNewHabit({ name: '', category: 'health', type: 'good' });
    setShowAddForm(false);
  };

  const removeHabit = (id, type) => {
    setHabits(prev => ({
      ...prev,
      [type]: prev[type].filter(habit => habit.id !== id)
    }));
  };

  const getTotalStreak = () => habits.good.reduce((sum, habit) => sum + habit.streak, 0);
  const getTotalDaysFree = () => habits.bad.reduce((sum, habit) => sum + habit.daysFree, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Habit Improvement System</h1>
        <p className="text-gray-600">Build consistency with good habits & break free from bad ones</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-700">{getTotalStreak()}</div>
          <div className="text-sm text-green-600">Total Good Streak Days</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-700">{habits.good.filter(h => h.completed).length}/{habits.good.length}</div>
          <div className="text-sm text-blue-600">Today's Good Habits</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-700">{getTotalDaysFree()}</div>
          <div className="text-sm text-purple-600">Total Days Free from Bad Habits</div>
        </div>
      </div>

      {/* Good Habits */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Habits to Build
        </h2>
        <div className="space-y-3">
          {habits.good.map(habit => {
            const CategoryIcon = categories[habit.category].icon;
            return (
              <div key={habit.id} className={`p-4 rounded-lg border-2 transition-all ${
                habit.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleGoodHabit(habit.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        habit.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {habit.completed && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <CategoryIcon className={`w-5 h-5 ${categories[habit.category].color}`} />
                    <div>
                      <div className={`font-medium ${habit.completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                        {habit.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        🔥 {habit.streak} day streak
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeHabit(habit.id, 'good')}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bad Habits */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <XCircle className="w-6 h-6 text-red-500 mr-2" />
          Habits to Break
        </h2>
        <div className="space-y-3">
          {habits.bad.map(habit => {
            const CategoryIcon = categories[habit.category].icon;
            return (
              <div key={habit.id} className="p-4 rounded-lg border-2 border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CategoryIcon className={`w-5 h-5 ${categories[habit.category].color}`} />
                    <div>
                      <div className="font-medium text-gray-800">{habit.name}</div>
                      <div className="text-sm text-gray-500">
                        ✨ {habit.daysFree} days free
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateBadHabitDays(habit.id, -1)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      Slipped
                    </button>
                    <button
                      onClick={() => updateBadHabitDays(habit.id, 1)}
                      className="px-3 py-1 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200 transition-colors"
                    >
                      +1 Day
                    </button>
                    <button
                      onClick={() => removeHabit(habit.id, 'bad')}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Habit */}
      <div className="border-t pt-6">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Habit</span>
          </button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter habit name..."
                value={newHabit.name}
                onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                <select
                  value={newHabit.type}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="good">Good Habit</option>
                  <option value="bad">Bad Habit</option>
                </select>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="health">Health</option>
                  <option value="productivity">Productivity</option>
                  <option value="learning">Learning</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={addHabit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Habit
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Success Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Start small - it's better to do 5 minutes consistently than 30 minutes sporadically</li>
              <li>• Track honestly - slipping up is part of the process, not failure</li>
              <li>• Focus on one habit at a time until it feels automatic</li>
              <li>• Celebrate small wins - every streak day counts!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
