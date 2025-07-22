// frontend/src/pages/CollaborationHub/CollaborationHub.jsx

import React, { useState, useEffect } from 'react';
import DedicatedProjectRoom from '../DedicatedProjectRoom/DedicatedProjectRoom';
import './CollaborationHub.css';
import { Sun, Moon, PlusCircle } from 'lucide-react';

function CollaborationHub() {
  // This state now holds the full project data
  const [projects, setProjects] = useState([]);
  const [focusedProject, setFocusedProject] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentUserId = 'user1'; // This would be dynamic in a real app

  useEffect(() => {
    const fetchProjects = () => {
        // Fetch from the new, correct endpoint
        fetch(`/api/hub/projects/${currentUserId}`)
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                // Automatically focus the first project if none is selected
                if (!focusedProject && data.length > 0) {
                    setFocusedProject(data[0]);
                }
            })
            .catch(err => console.error("Failed to fetch projects:", err));
    };

    fetchProjects();
    // Poll for new projects every 5 seconds
    const intervalId = setInterval(fetchProjects, 5000);
    return () => clearInterval(intervalId);
  }, [currentUserId, focusedProject]);

  const handleProjectFocus = (project) => {
    setFocusedProject(project);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`hub-container ${isDarkMode ? 'dark' : ''}`}>
      <aside className="hub-sidebar">
        <div className="sidebar-header">
          <h2>Projects</h2>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <ul className="project-list">
          {/* Display the project's beat title */}
          {projects.map((project) => (
            <li
              key={project.projectId}
              onClick={() => handleProjectFocus(project)}
              className={focusedProject && focusedProject.projectId === project.projectId ? 'active' : ''}
            >
              {project.beatTitle}
              <span className="project-artist">{project.artistName}</span>
            </li>
          ))}
        </ul>
      </aside>
      <main className="hub-main-content">
        {focusedProject ? (
          // Pass the entire project object to the project room
          <DedicatedProjectRoom project={focusedProject} isDarkMode={isDarkMode} />
        ) : (
          <div className="no-projects-message">
            <PlusCircle size={48} className="no-projects-icon" />
            <h2>Welcome to your Collaboration Hub!</h2>
            <p>Your approved projects will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CollaborationHub;