
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

async function verifyPhases() {
    try {
        console.log('1. Fetching Projects...');
        const projectsRes = await axios.get(`${API_URL}/properties/projects`);

        if (!projectsRes.data.content || projectsRes.data.content.length === 0) {
            console.log('No projects found. Creating a test project...');
            console.error('No projects available to verify phases against. Please create a project first.');
            return;
        }

        const project = projectsRes.data.content[0];
        console.log(`Using Project ID: ${project.id}`);

        console.log('2. Creating a Phase...');
        const phaseData = {
            name: "Test Phase 1",
            phaseNumber: 1,
            status: "PLANNING",
            description: "This is a test phase created by verification script."
        };

        const createRes = await axios.post(`${API_URL}/projects/${project.id}/phases`, phaseData);
        console.log('Phase Created:', createRes.data);

        console.log('3. Verifying Phase in Project Details...');
        const projectDetailsRes = await axios.get(`${API_URL}/properties/projects/${project.id}`);
        const phases = projectDetailsRes.data.data.phases;

        console.log('Phases found:', phases ? phases.length : 0);

        if (phases && phases.length > 0 && phases[0].name === phaseData.name) {
            console.log('✅ Verification SUCCESS: Phase created and linked correctly.');
        } else {
            console.error('❌ Verification FAILED: Phase not found in project details.');
        }

    } catch (error) {
        console.error('Verification Error:', error.response ? error.response.data : error.message);
    }
}

verifyPhases();
