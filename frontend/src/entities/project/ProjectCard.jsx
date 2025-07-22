// src/entities/project/ProjectCard.jsx
import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, isFocused, onSelect }) => {
  if (!project) return null;

  const getStatusClass = (status) => `status-${status.toLowerCase().replace(' ', '-')}`;
  const classNames = `project-card ${isFocused ? 'focused' : ''}`;

  return (
    <div className={classNames} onClick={onSelect}>
      <div className="card-header">
        <h5>{project.title}</h5>
        <div className={`card-status-pulse ${getStatusClass(project.status)}`} title={project.status}></div>
      </div>
      <div className="card-body">
        <p>With: {project.collaborators.join(', ')}</p>
      </div>
    </div>
  );
};

export default ProjectCard;