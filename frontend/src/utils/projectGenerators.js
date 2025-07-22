// src/utils/projectGenerators.js

/**
 * Generates mock collaboration project details for a given beat.
 * This simulates the backend providing project-specific data after a purchase.
 *
 * @param {Object} beat - The beat object purchased by the user.
 * @returns {Object} A comprehensive project object with collaboration details.
 */
export const generateMockProjectDetails = (beat) => {
    // Generate a consistent ID for the collaboration project based on the beat ID
    const projectId = `collab_${beat.id}`;

    // Randomly assign a status to make projects dynamic
    const statuses = ['In Progress', 'Under Review', 'Completed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Simulate collaborators (including a generic "Producer" role)
    const mockProducers = ['SynthWaveProducer', 'GlitchArchitect', 'RhythmEngineer', 'MelodyDesigner'];
    const assignedProducer = mockProducers[Math.floor(Math.random() * mockProducers.length)];
    const collaborators = ['You (Buyer)', assignedProducer];

    // Generate mock tasks based on status
    const tasksData = {
        'In Progress': {
            todo: [`Record final vocals for "${beat.title}" (Your Task)`, 'Provide mix feedback (Your Task)'],
            inProgress: [`Producer: Develop synth pads for "${beat.title}"`, `Producer: Mix drums for "${beat.title}"`],
            done: [`Producer: Initial beat structure for "${beat.title}"`, `Producer: Melody concept for "${beat.title}"`],
        },
        'Under Review': {
            todo: [],
            inProgress: [`Review final master for "${beat.title}" (Your Task)`],
            done: [`Producer: Beat production for "${beat.title}"`, `Producer: Mixdown for "${beat.title}"`],
        },
        'Completed': {
            todo: [],
            inProgress: [],
            done: [`Producer: Beat production for "${beat.title}"`, `Producer: Mixing for "${beat.title}"`, `Producer: Mastering for "${beat.title}"`, `Producer: Final delivery for "${beat.title}"`],
        }
    };
    const tasks = tasksData[randomStatus];

    // Generate mock activity based on status
    const activitiesData = {
        'In Progress': [
            { user: assignedProducer, action: `Started working on "${beat.title}"`, time: '2 hours ago', role: 'producer' },
            { user: 'You', action: `Checked project status`, time: '1 hour ago', role: 'buyer' },
            { user: assignedProducer, action: `Updated task: "Mix drums for ${beat.title}"`, time: '30 mins ago', role: 'producer' },
        ],
        'Under Review': [
            { user: assignedProducer, action: `Sent new mix for review of "${beat.title}"`, time: '1 day ago', role: 'producer' },
            { user: 'You', action: `Reviewed initial mix of "${beat.title}"`, time: '2 days ago', role: 'buyer' },
        ],
        'Completed': [
            { user: assignedProducer, action: `Marked project "${beat.title}" as complete`, time: '5 days ago', role: 'producer' },
            { user: 'You', action: `Downloaded final files for "${beat.title}"`, time: '4 days ago', role: 'buyer' },
        ]
    };
    const activity = activitiesData[randomStatus];

    // Generate mock chat history
    const chatHistory = [
        { sender: assignedProducer, message: `Hey! Thanks for buying "${beat.title}". Let me know if you have any initial thoughts or a vocal idea.`, type: 'producer', time: 'Yesterday' },
        { sender: 'You (Buyer)', message: 'Hi! Love the beat. I was thinking of adding some chill vocals. I\'ll try to record a demo this week.', type: 'buyer', time: 'Yesterday' },
        { sender: assignedProducer, message: 'Sounds good! I\'ll be working on refining the synths. Let me know if you need anything.', type: 'producer', time: 'Today' },
    ];

    return {
        id: projectId,
        title: beat.title,
        status: randomStatus,
        collaborators: collaborators,
        lastUpdated: new Date().toISOString(),
        tasks: tasks,
        activity: activity,
        chatHistory: chatHistory,
        // Include relevant original beat details
        beatDetails: {
            id: beat.id,
            title: beat.title,
            artwork: beat.artwork,
            audioSrc: beat.audioSrc,
            bpm: beat.bpm,
            key: beat.key,
            price: beat.price
        }
    };
};